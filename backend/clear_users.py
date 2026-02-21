from app import app
from models import db, User

def clear_users():
    with app.app_context():
        try:
            num_deleted = db.session.query(User).delete()
            db.session.commit()
            print(f"Successfully deleted {num_deleted} users.")
        except Exception as e:
            db.session.rollback()
            print(f"Error deleting users: {e}")

if __name__ == "__main__":
    clear_users()
