
import os
import sqlite3
from pathlib import Path

from flask import Flask, jsonify, request
from flask_cors import CORS
from werkzeug.utils import secure_filename

from database import create_tables, get_db_connection

app = Flask(__name__)

CORS(app, origins=["http://localhost:5173"])

# Upload configuration
UPLOAD_FOLDER = Path(__file__).resolve().parent / "uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg", "webp", "pdf"}

app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

UPLOAD_FOLDER.mkdir(exist_ok=True)

create_tables()


def allowed_file(filename):
    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS
    )


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

    if data["purchase_type"] not in ["Ready-made", "Personalised"]:
        return jsonify({"error": "Invalid purchase type."}), 400

    try:
        price = float(data["price"])
        expected_price = 49 if data["purchase_type"] == "Ready-made" else 99

        if price != expected_price:
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({"error": "Invalid poster price."}), 400

    if data["purchase_type"] == "Personalised":
        for field in ["business_name", "category", "requirements"]:
            if not data.get(field, "").strip():
                return jsonify({
                    "error": f"{field} is required for personalised orders."
                }), 400

    saved_files = []

    try:
        for file in request.files.getlist("references"):
            if not file or not file.filename:
                continue

            if not allowed_file(file.filename):
                return jsonify({
                    "error": "Unsupported file type."
                }), 400

            filename = secure_filename(file.filename)

            if not filename:
                return jsonify({
                    "error": "Invalid filename."
                }), 400

            # Use a unique filename to avoid overwriting another customer's file.
            import uuid
            unique_filename = f"{uuid.uuid4().hex}_{filename}"

            file.save(UPLOAD_FOLDER / unique_filename)
            saved_files.append(unique_filename)

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

        connection.commit()
        order_id = cursor.lastrowid
        connection.close()

        return jsonify({
            "message": "Your order has been received.",
            "order_id": order_id,
            "status": "Pending"
        }), 201

    except Exception:
        # Avoid leaving uploaded files behind if saving the order fails.
        for filename in saved_files:
            path = UPLOAD_FOLDER / filename
            if path.exists():
                path.unlink()

        app.logger.exception("Could not save poster order.")

        return jsonify({
            "error": "We could not save your order. Please try again."
        }), 500


@app.errorhandler(413)
def file_too_large(error):
    return jsonify({
        "error": "Your upload is too large. The total limit is 10 MB."
    }), 413


if __name__ == "__main__":
    app.run(debug=True, port=5000)
