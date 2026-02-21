from app import app
from models import db, User

def inspect_db():
    with app.app_context():
        print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        try:
            users = User.query.all()
            print(f"User count: {len(users)}")
            for user in users:
                print(f"User: {user.username}, Email: {user.email}")
        except Exception as e:
            print(f"Error querying database: {e}")

if __name__ == "__main__":
    inspect_db()
