from flask import Blueprint, request, jsonify
from models import db, LostItem, FoundItem, User
from datetime import datetime
from flask_jwt_extended import jwt_required, get_jwt_identity
import vector_utils
import ast

items_bp = Blueprint('items', __name__)

@items_bp.route('/lost', methods=['POST'])
@jwt_required()
def report_lost():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Basic validation
    required_fields = ['category', 'name', 'date', 'location', 'ownerName', 'email', 'phone']
    for field in required_fields:
        if not data.get(field):
            print(f"DEBUG: Missing field: {field}") # Debugging
            return jsonify({"msg": f"Missing field: {field}"}), 400

    try:
        new_item = LostItem(
            category=data['category'],
            name=data['name'],
            description=data.get('description', ''),
            color=data['color'],
            brand=data.get('brand', ''),
            serial=data.get('serial', ''),
            date_lost=datetime.strptime(data['date'], '%Y-%m-%d').date(),
            time_lost=datetime.strptime(data['time'], '%H:%M').time() if data.get('time') else None,
            location=data['location'],
            landmark=data.get('landmark', ''),
            owner_name=data['ownerName'],
            email=data['email'],
            phone=data['phone'],
            images=str(data.get('images', [])), # Store as string for now
            user_id=current_user_id
        )

        db.session.add(new_item)
        db.session.commit()

        # Vectorize image if available
        images_list = data.get('images', [])
        if images_list and len(images_list) > 0:
            print(f"Vectorizing lost item {new_item.id}...")
            # Use the first image
            first_image = images_list[0]
            embedding = vector_utils.get_embedding(first_image)
            
            if embedding:
                vector_utils.add_to_collection(
                    collection_name="lost_items",
                    item_id=new_item.id,
                    embedding=embedding,
                    metadata={
                        "category": new_item.category,
                        "color": new_item.color or "",
                        "user_id": current_user_id
                    }
                )
                print("Vector added to lost_items.")

        return jsonify({"msg": "Lost item reported successfully", "id": new_item.id}), 201
    except Exception as e:
        print(f"Error in report_lost: {e}")
        return jsonify({"msg": str(e)}), 500

@items_bp.route('/lost', methods=['GET'])
def get_lost_items():
    items = LostItem.query.order_by(LostItem.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items]), 200

@items_bp.route('/found', methods=['POST'])
@jwt_required()
def report_found():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    # Basic validation
    required_fields = ['category', 'description', 'color', 'dateFound', 'locationFound', 'finderName', 'contact']
    for field in required_fields:
        if not data.get(field):
            print(f"DEBUG: Missing field: {field} (Found Item)") # Debugging
            return jsonify({"msg": f"Missing field: {field}"}), 400

    try:
        new_item = FoundItem(
            category=data['category'],
            description=data['description'],
            color=data['color'],
            date_found=datetime.strptime(data['dateFound'], '%Y-%m-%d').date(),
            location_found=data['locationFound'],
            custody=data.get('custody', 'with_me'),
            finder_name=data['finderName'],
            contact=data['contact'],
            consent=data.get('consent', False),
            images=str(data.get('images', [])), # Store as string for now
            user_id=current_user_id
        )

        db.session.add(new_item)
        db.session.commit()

        # Vectorize image if available
        images_list = data.get('images', [])
        if images_list and len(images_list) > 0:
            print(f"Vectorizing found item {new_item.id}...")
            first_image = images_list[0]
            embedding = vector_utils.get_embedding(first_image)
            if embedding:
                vector_utils.add_to_collection(
                    collection_name="found_items",
                    item_id=new_item.id,
                    embedding=embedding,
                    metadata={
                        "category": new_item.category,
                        "color": new_item.color or "",
                        "user_id": current_user_id
                    }
                )
                print("Vector added to found_items.")

        return jsonify({"msg": "Found item reported successfully", "id": new_item.id}), 201
    except Exception as e:
        print(f"Error in report_found: {e}")
        return jsonify({"msg": str(e)}), 500

@items_bp.route('/found', methods=['GET'])
def get_found_items():
    items = FoundItem.query.order_by(FoundItem.created_at.desc()).all()
    return jsonify([item.to_dict() for item in items]), 200

@items_bp.route('/notifications', methods=['GET'])
@jwt_required()
def get_notifications():
    current_user_id = get_jwt_identity()
    
    # Get all lost items reported by current user
    my_lost_items = LostItem.query.filter_by(user_id=current_user_id).all()
    
    notifications = []
    processed_match_ids = set() # To avoid duplicates if matched by both logic and vector
    
    for lost in my_lost_items:
        # --- Logic 1: Basic Database Matching ---
        # Hard filters: Category + Date (Found must be >= Lost)
        potential_db_matches = FoundItem.query.filter(
            FoundItem.category == lost.category,
            FoundItem.date_found >= lost.date_lost
        ).all()
        
        for found in potential_db_matches:
            match_score = 0
            
            # 1. Color matching (Partial/Fuzzy)
            if found.color and lost.color:
                lost_colors = [c.strip().lower() for c in lost.color.split(',')]
                found_colors = [c.strip().lower() for c in found.color.split(',')]
                # Check for any overlap
                if any(c in found_colors for c in lost_colors) or any(c in lost_colors for c in found_colors):
                    match_score += 2
                elif lost.color.lower() in found.color.lower() or found.color.lower() in lost.color.lower():
                    match_score += 1
            
            # 2. Location matching (Keyword overlap)
            if found.location_found and lost.location:
                lost_loc = lost.location.lower()
                found_loc = found.location_found.lower()
                if lost_loc == found_loc:
                    match_score += 3
                elif lost_loc in found_loc or found_loc in lost_loc:
                    match_score += 1

            # 3. Description overlap (Simple but better than before)
            if found.description and lost.description:
                l_desc = lost.description.lower().split()
                f_desc = found.description.lower().split()
                overlap = set(l_desc) & set(f_desc)
                # Ignore common words
                stopwords = {'a', 'an', 'the', 'is', 'it', 'with', 'and', 'on', 'my'}
                overlap = {w for w in overlap if w not in stopwords}
                if len(overlap) >= 2:
                    match_score += 2
                elif len(overlap) >= 1:
                    match_score += 1
                
            # Only consider text match if threshold met
            if match_score >= 2:
                match_key = f"{lost.id}-{found.id}"
                if match_key not in processed_match_ids:
                    notifications.append({
                        "type": "match",
                        "match_method": "text",
                        "lost_item": lost.to_dict(),
                        "found_item": found.to_dict(),
                        "score": match_score
                    })
                    processed_match_ids.add(match_key)

        # --- Logic 2: Vector Similarity Matching (Image) ---
        try:
            lost_images_str = lost.images
            lost_images = []
            if lost_images_str:
                try:
                    lost_images = ast.literal_eval(lost_images_str)
                except:
                    pass
            
            if lost_images and len(lost_images) > 0:
                lost_coll = vector_utils.get_collection("lost_items")
                existing = lost_coll.get(ids=[str(lost.id)], include=['embeddings'])
                
                query_embedding = None
                if existing['embeddings'] and len(existing['embeddings']) > 0:
                    query_embedding = existing['embeddings'][0]
                else:
                    query_embedding = vector_utils.get_embedding(lost_images[0])
                
                if query_embedding is not None:
                    # Search in 'found_items' with category filter
                    # This DRASTICALLY improves accuracy
                    vector_matches = vector_utils.search_collection(
                        collection_name="found_items",
                        query_embedding=query_embedding,
                        n_results=5,
                        threshold=0.5, # Increased threshold for precision
                        where={"category": lost.category}
                    )
                    
                    for v_match in vector_matches:
                        found_id = int(v_match['id'])
                        found_item = FoundItem.query.get(found_id)
                        
                        if found_item and found_item.date_found >= lost.date_lost:
                            match_key = f"{lost.id}-{found_item.id}"
                            
                            existing_notif = next((n for n in notifications if 
                                                 n['lost_item']['id'] == lost.id and 
                                                 n['found_item']['id'] == found_item.id), None)
                            
                            if existing_notif:
                                existing_notif['match_method'] = "hybrid"
                                existing_notif['vector_score'] = v_match['score']
                                existing_notif['score'] += 5 # Massive boost for visual confirmation
                            else:
                                notifications.append({
                                    "type": "match",
                                    "match_method": "visual",
                                    "lost_item": lost.to_dict(),
                                    "found_item": found_item.to_dict(),
                                    "score": 5,
                                    "vector_score": v_match['score']
                                })
                                processed_match_ids.add(match_key)

        except Exception as e:
            print(f"Error in vector matching for lost item {lost.id}: {e}")
            continue
                
    return jsonify(notifications), 200
