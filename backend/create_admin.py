
from getpass import getpass

from werkzeug.security import generate_password_hash

from database import get_db_connection


def create_admin():
    username = input("Choose your admin username: ").strip()

    if not username:
        print("Username cannot be empty.")
        return

    password = getpass("Choose your admin password: ")
    confirm_password = getpass("Confirm your admin password: ")

    if len(password) < 12:
        print("Password must contain at least 12 characters.")
        return

    if password != confirm_password:
        print("Passwords do not match.")
        return

    password_hash = generate_password_hash(password)

    connection = get_db_connection()

    try:
        connection.execute("""
            INSERT INTO admin_users (username, password_hash)
            VALUES (?, ?)
        """, (username, password_hash))

        connection.commit()

        print("Administrator account created successfully!")

    except Exception as error:
        if "UNIQUE constraint failed" in str(error):
            print("That username already exists.")
        else:
            print("Could not create administrator account.")
            raise

    finally:
        connection.close()


if __name__ == "__main__":
    create_admin()
