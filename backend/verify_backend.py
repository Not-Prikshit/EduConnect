import urllib.request
import urllib.error
import json
import time

BASE_URL = "http://localhost:5000/api"
ADMIN_SECRET = "Bennett_Pioneers_2025_Project"

def make_request(endpoint, method='GET', data=None):
    url = f"{BASE_URL}{endpoint}"
    headers = {'Content-Type': 'application/json'}
    
    try:
        if data:
            data_bytes = json.dumps(data).encode('utf-8')
            req = urllib.request.Request(url, data=data_bytes, headers=headers, method=method)
        else:
            req = urllib.request.Request(url, headers=headers, method=method)
            
        with urllib.request.urlopen(req) as response:
            status = response.getcode()
            body = response.read().decode('utf-8')
            return status, json.loads(body) if body else {}
    except urllib.error.HTTPError as e:
        return e.code, json.loads(e.read().decode('utf-8'))
    except Exception as e:
        return 500, str(e)

def test_admin_login():
    print("Testing Admin Login...")
    payload = {"role": "admin", "id": ADMIN_SECRET, "name": "Test Admin"}
    status, response = make_request("/auth/login", "POST", payload)
    
    if status == 200:
        print("✅ Admin Login Success")
        return True
    else:
        print(f"❌ Admin Login Failed: {response}")
        return False

def test_create_teacher():
    print("\nTesting Create Teacher...")
    teacher_id = f"T{int(time.time())}"
    payload = {
        "id": teacher_id,
        "name": "Test Teacher",
        "subject": "Physics",
        "role": "teacher"
    }
    status, response = make_request("/auth/signup", "POST", payload)
    
    if status == 200:
        print("✅ Create Teacher Success")
        return teacher_id
    else:
        print(f"❌ Create Teacher Failed: {response}")
        return None

def test_create_student():
    print("\nTesting Create Student...")
    student_id = f"S{int(time.time())}@bennett.edu.in"
    payload = {
        "id": student_id,
        "name": "Test Student",
        "year": "1st Year",
        "role": "student"
    }
    status, response = make_request("/auth/signup", "POST", payload)
    
    if status == 200:
        print("✅ Create Student Success")
        return student_id
    else:
        print(f"❌ Create Student Failed: {response}")
        return None

def test_get_teachers():
    print("\nTesting Get Teachers...")
    status, response = make_request("/teachers", "GET")
    
    if status == 200:
        print(f"✅ Get Teachers Success (Count: {len(response)})")
    else:
        print(f"❌ Get Teachers Failed: {response}")

def test_create_club():
    print("\nTesting Create Club...")
    payload = {
        "name": "Test Club",
        "description": "A club for testing",
        "president": "Test Student",
        "members": [],
        "meeting": "Monday"
    }
    status, response = make_request("/clubs", "POST", payload)
    
    if status == 201:
        print("✅ Create Club Success")
    else:
        print(f"❌ Create Club Failed: {response}")

def run_tests():
    try:
        if not test_admin_login(): return
        
        teacher_id = test_create_teacher()
        student_id = test_create_student()
        
        test_get_teachers()
        test_create_club()
        
        print("\n✅ All Tests Completed!")
    except Exception as e:
        print(f"\n❌ Test Execution Failed: {str(e)}")
        print("Make sure the server is running on localhost:5000")

if __name__ == "__main__":
    run_tests()
