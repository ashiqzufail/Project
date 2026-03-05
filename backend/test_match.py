import requests
import base64
import io
from PIL import Image
import time

BASE_URL = "http://127.0.0.1:5001/api"

def get_token():
    login_data = {"email": "testuser@example.com", "password": "testpassword"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    return res.json().get('token')

def test_matching(token):
    print("Testing Report Found Item & Matching...")
    
    # Create a small red square image in memory
    img = Image.new('RGB', (100, 100), color='red')
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    img_data = f"data:image/jpeg;base64,{img_str}"

    payload = {
        "category": "Electronics",
        "description": "Found a red smartphone near the library entrance",
        "color": "red, mobile",
        "dateFound": "2026-03-05",
        "locationFound": "Main Library",
        "custody": "with_me",
        "finderName": "Finder Bob",
        "contact": "bob@example.com",
        "consent": True,
        "images": [img_data]
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(f"{BASE_URL}/items/found", json=payload, headers=headers)
    
    if res.status_code == 201:
        print(f"Report Found: SUCCESS - ID: {res.json().get('id')}")
    else:
        print(f"Report Found: FAILED - {res.status_code} - {res.text}")
        return

    print("\nWaiting for vector processing (if any async)...")
    time.sleep(2)

    print("\nChecking Notifications for Matches...")
    res = requests.get(f"{BASE_URL}/items/notifications", headers=headers)
    if res.status_code == 200:
        matches = res.json()
        print(f"Received {len(matches)} notifications.")
        for i, match in enumerate(matches):
            print(f"Match {i+1}: Type={match.get('type')}, Method={match.get('match_method')}, Score={match.get('score')}")
    else:
        print(f"Notifications: FAILED - {res.status_code} - {res.text}")

if __name__ == "__main__":
    t = get_token()
    if t:
        test_matching(t)
