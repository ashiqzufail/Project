import chromadb
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
from PIL import Image
import os
import io
import base64
import numpy as np
import threading

# Global variables for model and client
_model = None
_client = None
_lock = threading.Lock()

def get_model():
    """Lazy load the model to avoid high memory usage on startup if not needed immediately"""
    global _model
    with _lock:
        if _model is None:
            print("Loading CLIP model...")
            # using 'clip-ViT-B-32' for good balance of speed/performance
            _model = SentenceTransformer('clip-ViT-B-32')
            print("CLIP model loaded.")
    return _model

def get_client():
    """Lazy load ChromaDB client"""
    global _client
    with _lock:
        if _client is None:
            print("Initializing ChromaDB client...")
            # Persistent storage in ./chroma_db
            persist_path = os.path.join(os.getcwd(), 'chroma_db')
            _client = chromadb.PersistentClient(path=persist_path)
            print("ChromaDB client initialized.")
    return _client

def get_embedding(image_data):
    """
    Generates a vector embedding for an image.
    image_data: can be a file path (str), a PIL Image object, 
                or a base64 encoded string (with or without 'data:image...').
    """
    try:
        model = get_model()
        img = None

        if isinstance(image_data, str):
            # Check if it's a base64 string
            if image_data.startswith('data:image') or ';base64,' in image_data:
                # Remove header if present
                if ',' in image_data:
                    header, encoded = image_data.split(',', 1)
                else:
                    encoded = image_data
                
                img_bytes = base64.b64decode(encoded)
                img = Image.open(io.BytesIO(img_bytes))
            # Check if it's a file path
            elif os.path.exists(image_data):
                img = Image.open(image_data)
            else:
                # Might be raw base64 without header?
                try:
                    img_bytes = base64.b64decode(image_data)
                    img = Image.open(io.BytesIO(img_bytes))
                except:
                    print(f"Error: Could not parse image string: {image_data[:50]}...")
                    return None
        elif isinstance(image_data, Image.Image):
            img = image_data
        
        if img:
            # Generate embedding
            embedding = model.encode(img)
            return embedding.tolist()
            
    except Exception as e:
        print(f"Error generating embedding: {e}")
        return None

def get_collection(collection_name):
    client = get_client()
    # get_or_create_collection returns a collection object
    return client.get_or_create_collection(
        name=collection_name, 
        metadata={"hnsw:space": "cosine"} # Cosine similarity for CLIP
    )

def add_to_collection(collection_name, item_id, embedding, metadata):
    """
    Adds an item to the specified collection.
    item_id: str or int (will be converted to str)
    embedding: list of floats
    metadata: dict
    """
    if embedding is None:
        print("Skipping vector add: No embedding provided.")
        return False

    try:
        collection = get_collection(collection_name)
        collection.add(
            ids=[str(item_id)],
            embeddings=[embedding],
            metadatas=[metadata]
        )
        return True
    except Exception as e:
        print(f"Error adding to collection {collection_name}: {e}")
        return False

def search_collection(collection_name, query_embedding, n_results=5, threshold=0.1, where=None):
    """
    Searches for similar items in the collection.
    threshold: Minimum similarity score (0 to 1, where 1 is identical)
    where: Optional metadata filter for ChromaDB (e.g. {"category": "Electronics"})
    """
    if query_embedding is None:
        return []

    try:
        collection = get_collection(collection_name)
        
        query_args = {
            "query_embeddings": [query_embedding],
            "n_results": n_results
        }
        if where:
            query_args["where"] = where

        results = collection.query(**query_args)
        
        matches = []
        if results['ids'] and len(results['ids']) > 0:
            ids = results['ids'][0]
            distances = results['distances'][0]
            metadatas = results['metadatas'][0]
            
            for i, dist in enumerate(distances):
                # Convert cosine distance to similarity score
                # distance matches exactly what we set in metadata?
                # Actually, hnsw:space='cosine' returns cosine distance: 1 - cos(theta)
                similarity = 1 - dist
                
                # Filter by threshold (e.g. 0.6 or 0.7 for "somewhat similar")
                # The user prompt said "match above some threshold"
                # Let's assume passed threshold is similarity (high is good)
                
                if similarity >= threshold:
                    matches.append({
                        "id": ids[i],
                        "metadata": metadatas[i],
                        "score": similarity,
                        "distance": dist
                    })
                    
        return matches

    except Exception as e:
        print(f"Error searching collection {collection_name}: {e}")
        return []

def delete_from_collection(collection_name, item_id):
    try:
        collection = get_collection(collection_name)
        collection.delete(ids=[str(item_id)])
        return True
    except Exception as e:
        print(f"Error deleting from collection {collection_name}: {e}")
        return False
