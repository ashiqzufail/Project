import requests
import json

def test_get_lost_items():
    url = "http://127.0.0.1:5000/api/items/lost"
    try:
        response = requests.get(url)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_get_lost_items()
