import requests
import json

def test_create_lost_item():
    url = "http://127.0.0.1:5000/api/items/lost"
    data = {
        "category": "Electronics",
        "name": "Test iPhone",
        "description": "Black iPhone 13",
        "color": "Black",
        "date": "2023-10-27",
        "location": "Library",
        "ownerName": "Test User",
        "email": "test@example.com",
        "phone": "1234567890"
    }
    headers = {'Content-Type': 'application/json'}
    
    try:
        response = requests.post(url, data=json.dumps(data), headers=headers)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_create_lost_item()
