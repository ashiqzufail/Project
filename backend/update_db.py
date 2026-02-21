from app import app
from models import db

def update_db():
    with app.app_context():
        print(f"Database URI: {app.config['SQLALCHEMY_DATABASE_URI']}")
        try:
            db.create_all()
            print("Database schema updated successfully.")
            
            # Verify tables
            from sqlalchemy import inspect
            inspector = inspect(db.engine)
            tables = inspector.get_table_names()
            print(f"Tables in database: {tables}")
            
        except Exception as e:
            print(f"Error updating database: {e}")

if __name__ == "__main__":
    update_db()
