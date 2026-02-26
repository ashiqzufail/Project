from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, CCTVRequest, User, CCTVFootage
from datetime import datetime
import os
from werkzeug.utils import secure_filename
from functools import wraps

cctv_bp = Blueprint('cctv', __name__)

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'admin':
            return jsonify({"error": "Admin access required"}), 403
        return f(*args, **kwargs)
    return decorated_function

@cctv_bp.route('/request', methods=['POST'])
@jwt_required()
def create_request():
    try:
        current_user_id = get_jwt_identity()
        
        # Supporting document upload
        supporting_doc_path = None
        if 'supporting_document' in request.files:
            file = request.files['supporting_document']
            if file and file.filename != '':
                filename = secure_filename(f"doc_{current_user_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
                upload_folder = os.path.join(current_app.root_path, 'uploads', 'docs')
                if not os.path.exists(upload_folder):
                    os.makedirs(upload_folder)
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                supporting_doc_path = f"/api/cctv/view/docs/{filename}"

        # Get other fields from form data (since we have a file upload)
        data = request.form
        
        # Validate required fields
        required = ['location', 'date', 'startTime', 'endTime']
        if not all(k in data for k in required):
            return jsonify({"error": "Missing required fields"}), 400
            
        new_request = CCTVRequest(
            location=data['location'],
            date_request=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            start_time=datetime.strptime(data['startTime'], '%H:%M').time(),
            end_time=datetime.strptime(data['endTime'], '%H:%M').time(),
            description=data.get('description'),
            supporting_document=supporting_doc_path,
            user_id=current_user_id,
            status='pending'
        )
        
        db.session.add(new_request)
        db.session.commit()
        
        return jsonify({
            "message": "CCTV request submitted successfully", 
            "request": new_request.to_dict()
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

@cctv_bp.route('/admin/requests', methods=['GET'])
@jwt_required()
@admin_required
def get_all_requests():
    try:
        requests = CCTVRequest.query.order_by(CCTVRequest.created_at.desc()).all()
        return jsonify([req.to_dict() for req in requests]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cctv_bp.route('/admin/upload/<int:request_id>', methods=['POST'])
@jwt_required()
@admin_required
def upload_footage(request_id):
    try:
        if 'files' not in request.files:
            return jsonify({"error": "No files part"}), 400
        
        files = request.files.getlist('files')
        if not files or all(f.filename == '' for f in files):
            return jsonify({"error": "No selected files"}), 400
            
        cctv_request = CCTVRequest.query.get(request_id)
        if not cctv_request:
            return jsonify({"error": "Request not found"}), 404
            
        upload_folder = os.path.join(current_app.root_path, 'uploads', 'cctv')
        if not os.path.exists(upload_folder):
            os.makedirs(upload_folder)

        new_footages = []
        for file in files:
            if file and file.filename != '':
                filename = secure_filename(f"req_{request_id}_{datetime.now().strftime('%Y%m%d%H%M%S')}_{file.filename}")
                file_path = os.path.join(upload_folder, filename)
                file.save(file_path)
                
                footage = CCTVFootage(
                    request_id=request_id,
                    file_path=f"/api/cctv/view/cctv/{filename}"
                )
                db.session.add(footage)
                new_footages.append(footage)
        
        db.session.commit()
        
        return jsonify({
            "message": f"{len(new_footages)} footage(s) uploaded successfully", 
            "request": cctv_request.to_dict()
        }), 200
            
    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 500

@cctv_bp.route('/admin/update-status/<int:request_id>', methods=['PATCH'])
@jwt_required()
@admin_required
def update_request_status(request_id):
    try:
        data = request.json
        cctv_request = CCTVRequest.query.get(request_id)
        if not cctv_request:
            return jsonify({"error": "Request not found"}), 404
            
        if 'status' in data:
            cctv_request.status = data['status']
        if 'admin_notes' in data:
            cctv_request.admin_notes = data['admin_notes']
            
        db.session.commit()
        return jsonify({"message": "Request updated successfully", "request": cctv_request.to_dict()}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@cctv_bp.route('/view/<path:type_and_filename>')
def view_footage(type_and_filename):
    # Expected format: <type>/<filename> e.g., cctv/req_1_video.mp4
    from flask import send_from_directory
    parts = type_and_filename.split('/')
    if len(parts) != 2:
        return jsonify({"error": "Invalid file path"}), 400
        
    file_type, filename = parts
    if file_type not in ['cctv', 'docs']:
        return jsonify({"error": "Invalid file type"}), 400
        
    upload_folder = os.path.join(current_app.root_path, 'uploads', file_type)
    return send_from_directory(upload_folder, filename)
