from flask import Blueprint, request, jsonify
from models import db, User
from flask_jwt_extended import create_access_token
from werkzeug.security import generate_password_hash, check_password_hash

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('email') or not data.get('password'):
        return jsonify({"msg": "Missing fields"}), 400

    if User.query.filter_by(email=data['email']).first():
        return jsonify({"msg": "Email already exists"}), 409
        
    user = User(
        username=data.get('name', 'User'),
        email=data['email'],
        password_hash=generate_password_hash(data['password'], method='pbkdf2:sha256')
    )
    db.session.add(user)
    db.session.commit()
    
    token = create_access_token(identity=str(user.id))
    return jsonify(token=token, user=user.to_dict()), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data.get('email')).first()
    
    if user and check_password_hash(user.password_hash, data.get('password')):
        token = create_access_token(identity=str(user.id))
        return jsonify(token=token, user=user.to_dict()), 200
        
    return jsonify({"msg": "Invalid credentials"}), 401
