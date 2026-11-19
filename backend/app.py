
import os
import uuid
from pathlib import Path
from functools import wraps

from flask import (
    Flask,
    jsonify,
    request,
    session,
    send_from_directory
)
from flask_cors import CORS
from werkzeug.utils import secure_filename
from werkzeug.security import check_password_hash

from database import create_tables, get_db_connection


def load_dotenv(path):
    """Load KEY=VALUE pairs from a .env file without external dependencies."""
    if not Path(path).is_file():
        return

    for raw_line in Path(path).read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#"):
            continue
        if line.startswith("export "):
            line = line[7:].lstrip()
        key, separator, value = line.partition("=")
        if not separator:
            continue
        key = key.strip()
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        if key:
            os.environ.setdefault(key, value)


# --------------------------------------------------
# APPLICATION CONFIGURATION
# --------------------------------------------------

BASE_DIR = Path(__file__).resolve().parent

load_dotenv(BASE_DIR / ".env")

app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("STHABLYM_SECRET_KEY")

if not app.config["SECRET_KEY"]:
    raise RuntimeError(
        "STHABLYM_SECRET_KEY is missing from backend/.env"
    )

# Local development settings
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE="Lax",
    SESSION_COOKIE_SECURE=False,
    MAX_CONTENT_LENGTH=10 * 1024 * 1024
)

CORS(
    app,
    origins=["http://localhost:5173"],
    supports_credentials=True
)


# --------------------------------------------------
# DATABASE AND UPLOAD CONFIGURATION
# --------------------------------------------------

UPLOAD_FOLDER = BASE_DIR / "uploads"

ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "webp",
    "pdf"
}

UPLOAD_FOLDER.mkdir(exist_ok=True)

create_tables()


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


# --------------------------------------------------
# ADMINISTRATOR AUTHENTICATION
# --------------------------------------------------

def admin_required(function):

    @wraps(function)
    def decorated_function(*args, **kwargs):

        if not session.get("admin_user_id"):
            return jsonify({
                "error": "Administrator login required.",
                "authenticated": False
            }), 401

        return function(*args, **kwargs)

    return decorated_function


@app.route("/api/admin/login", methods=["POST"])
def admin_login():

    data = request.get_json(silent=True) or {}

    username = data.get("username", "").strip()
    password = data.get("password", "")

    if not username or not password:
        return jsonify({
            "error": "Username and password are required."
        }), 400

    connection = get_db_connection()

    try:
        admin = connection.execute("""
            SELECT id, username, password_hash
            FROM admin_users
            WHERE username = ?
        """, (username,)).fetchone()

    finally:
        connection.close()

    if not admin or not check_password_hash(
        admin["password_hash"], password
    ):
        return jsonify({
            "error": "Invalid username or password."
        }), 401

    # Start a fresh authenticated session
    session.clear()

    session["admin_user_id"] = admin["id"]
    session["admin_username"] = admin["username"]

    return jsonify({
        "message": "Login successful.",
        "authenticated": True,
        "username": admin["username"]
    }), 200


@app.route("/api/admin/me", methods=["GET"])
def admin_me():

    if not session.get("admin_user_id"):
        return jsonify({
            "authenticated": False
        }), 200

    return jsonify({
        "authenticated": True,
        "username": session.get("admin_username")
    }), 200


@app.route("/api/admin/logout", methods=["POST"])
@admin_required
def admin_logout():

    session.clear()

    return jsonify({
        "message": "You have been logged out.",
        "authenticated": False
    }), 200


# --------------------------------------------------
# GENERAL BACKEND ROUTES
# --------------------------------------------------

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message": "STHABLYM backend is running!",
        "status": "success"
    })


@app.route("/api/health", methods=["GET"])
def health_check():

    return jsonify({
        "application": "STHABLYM",
        "service": "Backend API",
        "status": "healthy"
    })



# --------------------------------------------------
# CUSTOMER POSTER ORDER SUBMISSION
# PUBLIC ROUTE - CUSTOMERS DO NOT NEED TO LOG IN
# --------------------------------------------------

@app.route("/api/orders", methods=["POST"])
def create_order():

    data = request.form

    required_fields = [
        "customer_name",
        "email",
        "phone",
        "design_title",
        "purchase_type",
        "price"
    ]

    for field in required_fields:

        if not data.get(field, "").strip():
            return jsonify({
                "error": f"{field} is required."
            }), 400

    if data["purchase_type"] not in [
        "Ready-made",
        "Personalised"
    ]:
        return jsonify({
            "error": "Invalid purchase type."
        }), 400

    try:
        price = float(data["price"])

        expected_price = (
            49
            if data["purchase_type"] == "Ready-made"
            else 99
        )

        if price != expected_price:
            raise ValueError

    except (ValueError, TypeError):

        return jsonify({
            "error": "Invalid poster price."
        }), 400

    if data["purchase_type"] == "Personalised":

        for field in [
            "business_name",
            "category",
            "requirements"
        ]:

            if not data.get(field, "").strip():
                return jsonify({
                    "error": f"{field} is required for personalised orders."
                }), 400

    saved_files = []
    connection = None

    try:

        # Save customer reference files
        for file in request.files.getlist("references"):

            if not file or not file.filename:
                continue

            if not allowed_file(file.filename):
                raise ValueError("Unsupported file type.")

            filename = secure_filename(file.filename)

            if not filename:
                raise ValueError("Invalid filename.")

            unique_filename = (
                f"{uuid.uuid4().hex}_{filename}"
            )

            file.save(UPLOAD_FOLDER / unique_filename)

            saved_files.append({
                "original": filename,
                "stored": unique_filename
            })

        connection = get_db_connection()

        cursor = connection.execute("""
            INSERT INTO orders (
                customer_name,
                email,
                phone,
                design_title,
                purchase_type,
                price,
                business_name,
                category,
                colours,
                requirements
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            data["customer_name"].strip(),
            data["email"].strip(),
            data["phone"].strip(),
            data["design_title"].strip(),
            data["purchase_type"],
            price,
            data.get("business_name"),
            data.get("category"),
            data.get("colours"),
            data.get("requirements")
        ))

        order_id = cursor.lastrowid

        # Link uploaded files to the order
        for file_info in saved_files:

            connection.execute("""
                INSERT INTO order_attachments (
                    order_id,
                    original_filename,
                    stored_filename
                )
                VALUES (?, ?, ?)
            """, (
                order_id,
                file_info["original"],
                file_info["stored"]
            ))

        connection.commit()

        return jsonify({
            "message": "Your order has been received.",
            "order_id": order_id,
            "status": "Pending"
        }), 201

    except ValueError as error:

        for file_info in saved_files:
            path = UPLOAD_FOLDER / file_info["stored"]

            if path.exists():
                path.unlink()

        return jsonify({
            "error": str(error)
        }), 400

    except Exception:

        if connection:
            connection.rollback()

        for file_info in saved_files:
            path = UPLOAD_FOLDER / file_info["stored"]

            if path.exists():
                path.unlink()

        app.logger.exception(
            "Could not save poster order."
        )

        return jsonify({
            "error": "We could not save your order. Please try again."
        }), 500

    finally:

        if connection:
            connection.close()


# --------------------------------------------------
# CUSTOMER ORDERS
# PROTECTED - ADMINISTRATOR LOGIN REQUIRED
# --------------------------------------------------

@app.route("/api/orders", methods=["GET"])
@admin_required
def get_orders():

    connection = get_db_connection()

    try:

        orders = connection.execute("""
            SELECT *
            FROM orders
            ORDER BY created_at DESC, id DESC
        """).fetchall()

        results = []

        for order in orders:

            attachments = connection.execute("""
                SELECT
                    id,
                    original_filename,
                    uploaded_at
                FROM order_attachments
                WHERE order_id = ?
            """, (order["id"],)).fetchall()

            order_data = dict(order)

            order_data["attachments"] = [
                dict(attachment)
                for attachment in attachments
            ]

            results.append(order_data)

        return jsonify({
            "total": len(results),
            "orders": results
        }), 200

    finally:
        connection.close()


# --------------------------------------------------
# UPDATE CUSTOMER ORDER STATUS
# PROTECTED - ADMINISTRATOR LOGIN REQUIRED
# --------------------------------------------------

@app.route("/api/orders/<int:order_id>/status", methods=["PATCH"])
@admin_required
def update_order_status(order_id):

    data = request.get_json(silent=True) or {}
    new_status = data.get("status", "").strip()

    allowed_statuses = [
        "Pending",
        "In Progress",
        "Completed",
        "Delivered",
        "Cancelled"
    ]

    if new_status not in allowed_statuses:
        return jsonify({
            "error": "Invalid order status."
        }), 400

    connection = get_db_connection()

    try:
        order = connection.execute("""
            SELECT id
            FROM orders
            WHERE id = ?
        """, (order_id,)).fetchone()

        if not order:
            return jsonify({
                "error": "Order not found."
            }), 404

        connection.execute("""
            UPDATE orders
            SET status = ?
            WHERE id = ?
        """, (new_status, order_id))

        connection.commit()

        return jsonify({
            "message": "Order status updated successfully.",
            "order_id": order_id,
            "status": new_status
        }), 200

    except Exception:
        connection.rollback()
        app.logger.exception("Could not update order status.")

        return jsonify({
            "error": "Could not update order status."
        }), 500

    finally:
        connection.close()



# --------------------------------------------------
# PROTECTED CUSTOMER ATTACHMENT DOWNLOAD
# --------------------------------------------------

@app.route(
    "/api/admin/attachments/<int:attachment_id>",
    methods=["GET"]
)
@admin_required
def download_attachment(attachment_id):

    connection = get_db_connection()

    try:

        attachment = connection.execute("""
            SELECT stored_filename, original_filename
            FROM order_attachments
            WHERE id = ?
        """, (attachment_id,)).fetchone()

    finally:
        connection.close()

    if not attachment:
        return jsonify({
            "error": "Attachment not found."
        }), 404

    file_path = UPLOAD_FOLDER / attachment["stored_filename"]

    if not file_path.is_file():
        return jsonify({
            "error": "The requested file is unavailable."
        }), 404

    return send_from_directory(
        UPLOAD_FOLDER,
        attachment["stored_filename"],
        as_attachment=True,
        download_name=attachment["original_filename"]
    )


# --------------------------------------------------
# UPLOAD SIZE ERROR
# --------------------------------------------------

@app.errorhandler(413)
def file_too_large(error):

    return jsonify({
        "error": "Your upload is too large. The total limit is 10 MB."
    }), 413


# --------------------------------------------------
# START APPLICATION
# --------------------------------------------------

if __name__ == "__main__":

    app.run(
        host="127.0.0.1",
        port=5000,
        debug=True
    )
