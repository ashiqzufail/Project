from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.items import items_bp
from routes.cctv import cctv_bp

app = Flask(__name__)
app.config.from_object(Config)

# Enable CORS
CORS(app, resources={r"/*": {"origins": "*", "allow_headers": ["Content-Type", "Authorization", "Access-Control-Allow-Credentials"], "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"]}})

# Init extensions
JWTManager(app)
db.init_app(app)

# Create tables
with app.app_context():
    db.create_all()

# Register Blueprints
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(items_bp, url_prefix='/api/items')
app.register_blueprint(cctv_bp, url_prefix='/api/cctv')

@app.route('/health')
def health():
    return {"status": "ok"}

if __name__ == '__main__':
    app.run(debug=True, port=5001)
