import requests
import base64
import io
from PIL import Image

BASE_URL = "http://127.0.0.1:5001/api"

def get_token():
    login_data = {"email": "testuser@example.com", "password": "testpassword"}
    res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    return res.json().get('token')

def test_report_lost(token):
    print("Testing Report Lost Item...")
    
    # Create a small red square image in memory
    img = Image.new('RGB', (100, 100), color='red')
    buffered = io.BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    img_data = f"data:image/jpeg;base64,{img_str}"

    payload = {
        "category": "Electronics",
        "name": "Red Phone",
        "description": "A bright red test phone",
        "color": "red",
        "brand": "TestBrand",
        "serial": "12345",
        "date": "2026-03-05",
        "time": "12:00",
        "location": "Test Library",
        "landmark": "Near the entrance",
        "ownerName": "Test User",
        "email": "testuser@example.com",
        "phone": "9998887776",
        "images": [img_data]
    }
    
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.post(f"{BASE_URL}/items/lost", json=payload, headers=headers)
    
    if res.status_code == 201:
        print(f"Report Lost: SUCCESS - ID: {res.json().get('id')}")
        return res.json().get('id')
    else:
        print(f"Report Lost: FAILED - {res.status_code} - {res.text}")
        return None

if __name__ == "__main__":
    t = get_token()
    if t:
        test_report_lost(t)
