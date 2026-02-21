from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CCTVRequest, User
from datetime import datetime

cctv_bp = Blueprint('cctv', __name__)

@cctv_bp.route('/request', methods=['POST'])
@jwt_required()
def create_request():
    try:
        current_user_id = get_jwt_identity()
        data = request.json
        
        # Validate required fields
        required = ['location', 'date', 'startTime', 'endTime']
        if not all(k in data for k in required):
            return jsonify({"error": "Missing required fields"}), 400
            
        new_request = CCTVRequest(
            location=data['location'],
            date_request=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            start_time=datetime.strptime(data['startTime'], '%H:%M').time(),
            end_time=datetime.strptime(data['endTime'], '%H:%M').time(),
            user_id=current_user_id
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        # Hardware Check Simulation
        location_lower = data['location'].lower()
        hardware_found = "server" in location_lower or "camera" in location_lower
        
        return jsonify({
            "message": "CCTV request submitted successfully", 
            "request": new_request.to_dict(),
            "hardware_found": hardware_found
        }), 201
        
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@cctv_bp.route('/my-requests', methods=['GET'])
@jwt_required()
def get_my_requests():
    try:
        current_user_id = get_jwt_identity()
        requests = CCTVRequest.query.filter_by(user_id=current_user_id).order_by(CCTVRequest.created_at.desc()).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
