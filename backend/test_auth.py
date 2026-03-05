import requests
import sys

BASE_URL = "http://127.0.0.1:5001/api"

def test_auth():
    print("Testing Registration...")
    reg_data = {
        "name": "Test User",
        "email": "testuser@example.com",
        "password": "testpassword",
        "role": "user"
    }
    # First, try to register
    res = requests.post(f"{BASE_URL}/auth/register", json=reg_data)
    if res.status_code == 201:
        print("Registration: SUCCESS")
    elif res.status_code == 409:
        print("Registration: Email already exists (Continuing to login)")
    else:
        print(f"Registration: FAILED - {res.status_code} - {res.text}")
        return

    print("\nTesting Login...")
    login_data = {
        "email": "testuser@example.com",
        "password": "testpassword"
    }
    res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if res.status_code == 200:
        data = res.json()
        print("Login: SUCCESS")
        token = data.get('token')
        print(f"Token received: {token[:20]}...")
        return token
    else:
        print(f"Login: FAILED - {res.status_code} - {res.text}")
        return None

if __name__ == "__main__":
    test_auth()
