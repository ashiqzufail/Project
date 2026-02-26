from app import app
from models import db, User
import sys

def promote_user(email):
    with app.app_context():
        user = User.query.filter_by(email=email).first()
        if not user:
            print(f"User with email {email} not found.")
            return
        
        user.role = 'admin'
        db.session.commit()
        print(f"User {user.username} ({email}) has been promoted to admin.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python promote_admin.py <email>")
    else:
        promote_user(sys.argv[1])
