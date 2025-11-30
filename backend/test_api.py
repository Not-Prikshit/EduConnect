import requests
import json

BASE_URL = "http://localhost:5000/api"

def test_student_signup():
    print("Testing Student Signup...")
    data = {
        "role": "student",
        "name": "Test User",
        "id": "testuser@bennett.edu.in",
        "year": "1st Year"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_student_login():
    print("Testing Student Login...")
    data = {
        "role": "student",
        "id": "testuser@bennett.edu.in",
        "name": "Test User"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_teacher_signup():
    print("Testing Teacher Signup...")
    data = {
        "role": "teacher",
        "name": "Test Teacher",
        "id": "testteacher@bennett.edu.in",
        "subject": "Computer Science"
    }
    response = requests.post(f"{BASE_URL}/auth/signup", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_teacher_login():
    print("Testing Teacher Login...")
    data = {
        "role": "teacher",
        "id": "adwa.re@bennett.edu.in",
        "name": "Adwa Re"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

def test_admin_login():
    print("Testing Admin Login...")
    data = {
        "role": "admin",
        "id": "Bennett_Pioneers_2025_Project",
        "name": "Admin"
    }
    response = requests.post(f"{BASE_URL}/auth/login", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    print()

if __name__ == "__main__":
    try:
        test_admin_login()
        test_teacher_login()
        test_teacher_signup()
        test_student_login()
        test_student_signup()
        print("All tests completed!")
    except Exception as e:
        print(f"Error: {e}")
