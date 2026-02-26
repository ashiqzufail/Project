from app import app
from models import db
from sqlalchemy import text

def update_schema():
    with app.app_context():
        # Add role to User
        try:
            db.session.execute(text("ALTER TABLE user ADD COLUMN role VARCHAR(20) DEFAULT 'user'"))
            db.session.commit()
            print("Successfully added 'role' column to 'user' table.")
        except Exception as e:
            print(f"User table note: {e}")

        # Update CCTVRequest
        try:
            db.session.execute(text("ALTER TABLE cctv_request ADD COLUMN description TEXT"))
            db.session.execute(text("ALTER TABLE cctv_request ADD COLUMN supporting_document VARCHAR(500)"))
            db.session.execute(text("ALTER TABLE cctv_request ADD COLUMN admin_notes TEXT"))
            db.session.execute(text("ALTER TABLE cctv_request ADD COLUMN status VARCHAR(20) DEFAULT 'pending'"))
            db.session.commit()
            print("Successfully updated 'cctv_request' table columns.")
        except Exception as e:
            print(f"CCTVRequest table note: {e}")

        # Create CCTVFootage if it doesn't exist
        try:
            db.create_all()
            print("Ensured all tables (including CCTVFootage) exist.")
        except Exception as e:
            print(f"Error ensuring tables: {e}")

if __name__ == "__main__":
    update_schema()
