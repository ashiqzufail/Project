import sys
import os
from flask import Flask, jsonify
from datetime import datetime

# Add the current directory to sys.path to import local modules
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app import app
from models import db, LostItem, FoundItem, CCTVRequest, CCTVFootage

def verify_serialization():
    with app.app_context():
        print("Testing LostItem serialization...")
        lost = LostItem()
        lost.id = 1
        lost.category = "Test"
        lost.date_lost = datetime.now().date()
        lost.created_at = datetime.now()
        
        try:
            d = lost.to_dict()
            print(f"to_dict output: {d}")
            # The real test: can jsonify handle it?
            json_data = jsonify(d).get_data(as_text=True)
            print(f"jsonify output: {json_data}")
            if "created_at" in d and isinstance(d["created_at"], str):
                print("LostItem serialization: SUCCESS")
            else:
                print("LostItem serialization: FAILED (not a string)")
        except Exception as e:
            print(f"LostItem serialization: FAILED - {e}")

        # If one works, they all should since they use the same pattern.
        # But let's check CCTVRequest specifically because of the relationship
        print("\nTesting CCTVRequest serialization (without user relationship)...")
        req = CCTVRequest()
        req.id = 1
        req.date_request = datetime.now().date()
        req.start_time = datetime.now().time()
        req.end_time = datetime.now().time()
        req.created_at = datetime.now()
        req.user = None # Test null case
        req.footages = []
        
        try:
            d = req.to_dict()
            json_data = jsonify(d).get_data(as_text=True)
            print(f"CCTVRequest JSON: {json_data}")
            print("CCTVRequest serialization: SUCCESS")
        except Exception as e:
            print(f"CCTVRequest serialization: FAILED - {e}")

if __name__ == "__main__":
    verify_serialization()
