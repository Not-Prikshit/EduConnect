from flask import Flask, request, jsonify, redirect, session
from flask_cors import CORS
import os
import time
from data_manager import DataManager
from config import Config
from oauth_helper import (
    get_microsoft_auth_url, 
    exchange_code_for_token, 
    get_user_info, 
    validate_email_domain,
    determine_role_from_email
)

app = Flask(__name__)
app.config['SECRET_KEY'] = Config.SECRET_KEY
CORS(app, supports_credentials=True)
data_manager = DataManager()

ADMIN_SECRET = "Bennett_Pioneers_2025_Project"

# --- Auth Endpoints ---

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.json
    role = data.get('role')
    user_id = data.get('id')
    name = data.get('name')

    if role == 'admin':
        if user_id == ADMIN_SECRET:
            return jsonify({'success': True, 'user': {'role': 'admin', 'name': name or 'Admin', 'id': user_id}})
        return jsonify({'success': False, 'message': 'Invalid Admin Secret'}), 401

    elif role == 'teacher':
        teacher = data_manager.find_item('teachers', 'id', user_id)
        if teacher:
            return jsonify({'success': True, 'user': {'role': 'teacher', **teacher}})
        return jsonify({'success': False, 'message': 'Teacher not found'}), 404

    elif role == 'student':
        student = data_manager.find_item('students', 'id', user_id)
        if not student:
            student = data_manager.find_item('students', 'enrollmentNo', user_id)
        
        if student:
            return jsonify({'success': True, 'user': {'role': 'student', **student}})
        return jsonify({'success': False, 'message': 'Student not found'}), 404

    return jsonify({'error': 'Invalid role'}), 400

@app.route('/api/auth/signup', methods=['POST'])
def signup():
    data = request.json
    role = data.get('role')
    
    if role == 'teacher':
        if data_manager.find_item('teachers', 'id', data['id']):
            return jsonify({'success': False, 'message': 'Account already exists'}), 409
        
        new_teacher = {
            'id': data['id'],
            'name': data['name'],
            'subject': data.get('subject', 'General'),
            'cubicle': 'TBD',
            'contact': '',
            'isContactHidden': False,
            'isEmailHidden': False,
            'isCubicleHidden': False,
            'department': 'General',
            'classes': [],
            'availableSlots': []
        }
        data_manager.add_item('teachers', new_teacher)
        return jsonify({'success': True, 'user': {'role': 'teacher', **new_teacher}})

    elif role == 'student':
        if data_manager.find_item('students', 'id', data['id']):
            return jsonify({'success': False, 'message': 'Account already exists'}), 409

        new_student = {
            'id': data['id'],
            'enrollmentNo': data.get('enrollmentNo', data['id'].split('@')[0].upper()),
            'name': data['name'],
            'year': data.get('year', '1st Year'),
            'email': data['id'],
            'fatherName': '',
            'motherName': '',
            'dob': '',
            'course': '',
            'batch': '',
            'marks': {},
            'clubs': [],
            'timetable': [],
            'todo': []
        }
        data_manager.add_item('students', new_student)
        return jsonify({'success': True, 'user': {'role': 'student', **new_student}})

    return jsonify({'error': 'Invalid role'}), 400

# --- Microsoft OAuth Endpoints ---

@app.route('/api/auth/microsoft/login', methods=['GET'])
def microsoft_login():
    """
    Initiate Microsoft OAuth flow
    """
    role = request.args.get('role', 'student')  # student or teacher
    state = f"{role}|{time.time()}"  # Include role in state for callback
    session['oauth_state'] = state
    
    auth_url = get_microsoft_auth_url(state)
    return jsonify({'auth_url': auth_url})

@app.route('/api/auth/microsoft/callback', methods=['GET'])
def microsoft_callback():
    """
    Handle Microsoft OAuth callback
    """
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')
    
    if error:
        return redirect(f'/?error={error}')
    
    if not code:
        return redirect('/?error=no_code')
    
    try:
        # Exchange code for token
        token_response = exchange_code_for_token(code)
        access_token = token_response.get('access_token')
        
        # Get user info from Microsoft Graph
        user_info = get_user_info(access_token)
        email = user_info.get('mail') or user_info.get('userPrincipalName')
        display_name = user_info.get('displayName')
        
        # Validate email domain
        if not validate_email_domain(email):
            return redirect('/?error=invalid_domain&message=Only @bennett.edu.in emails are allowed')
        
        # Determine role from state or email pattern
        role = None
        if state and '|' in state:
            role = state.split('|')[0]
        else:
            role = determine_role_from_email(email)
        
        # Find or create user
        if role == 'teacher':
            teacher = data_manager.find_item('teachers', 'id', email)
            if not teacher:
                # Auto-create teacher account
                teacher = {
                    'id': email,
                    'name': display_name,
                    'subject': 'General',
                    'cubicle': 'TBD',
                    'contact': '',
                    'isContactHidden': False,
                    'isEmailHidden': False,
                    'isCubicleHidden': False,
                    'department': 'General',
                    'classes': [],
                    'availableSlots': []
                }
                data_manager.add_item('teachers', teacher)
            
            user_data = {'role': 'teacher', **teacher}
            redirect_url = '/teacher-dashboard.html'
            
        elif role == 'student':
            student = data_manager.find_item('students', 'id', email)
            if not student:
                # Auto-create student account
                enrollment_no = email.split('@')[0].upper()
                student = {
                    'id': email,
                    'enrollmentNo': enrollment_no,
                    'name': display_name,
                    'year': '1st Year',
                    'email': email,
                    'dob': '',
                    'course': '',
                    'batch': '',
                    'marks': {},
                    'clubs': [],
                    'timetable': [],
                    'todo': []
                }
                data_manager.add_item('students', student)
            
            user_data = {'role': 'student', **student}
            redirect_url = '/student-dashboard.html'
        else:
            return redirect('/?error=invalid_role')
        
        # Store user in session (for server-side) and prepare for client-side
        session['user'] = user_data
        
        # Redirect to callback handler page that will store in localStorage
        import urllib.parse
        user_json = urllib.parse.quote(jsonify(user_data).get_data(as_text=True))
        return redirect(f'/microsoft-callback.html?user={user_json}&redirect={redirect_url}')
        
    except Exception as e:
        print(f"OAuth Error: {str(e)}")
        return redirect(f'/?error=oauth_failed&message={str(e)}')

# --- Student Endpoints ---

@app.route('/api/students', methods=['GET', 'POST'])
def manage_students():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('students'))
    
    if request.method == 'POST':
        data = request.json
        if data_manager.find_item('students', 'id', data['id']):
            return jsonify({'error': 'Student already exists'}), 409
        data_manager.add_item('students', data)
        return jsonify(data), 201

@app.route('/api/students/<student_id>', methods=['PUT', 'DELETE'])
def student_detail(student_id):
    if request.method == 'PUT':
        updated = data_manager.update_item('students', student_id, request.json)
        if updated:
            return jsonify(updated)
        return jsonify({'error': 'Student not found'}), 404
    
    if request.method == 'DELETE':
        if data_manager.delete_item('students', student_id):
            return jsonify({'success': True})
        return jsonify({'error': 'Student not found'}), 404

# --- Teacher Endpoints ---

@app.route('/api/teachers', methods=['GET', 'POST'])
def manage_teachers():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('teachers'))
    
    if request.method == 'POST':
        data = request.json
        if data_manager.find_item('teachers', 'id', data['id']):
            return jsonify({'error': 'Teacher already exists'}), 409
        data_manager.add_item('teachers', data)
        return jsonify(data), 201

@app.route('/api/teachers/<teacher_id>', methods=['PUT', 'DELETE'])
def teacher_detail(teacher_id):
    if request.method == 'PUT':
        updated = data_manager.update_item('teachers', teacher_id, request.json)
        if updated:
            return jsonify(updated)
        return jsonify({'error': 'Teacher not found'}), 404
    
    if request.method == 'DELETE':
        if data_manager.delete_item('teachers', teacher_id):
            return jsonify({'success': True})
        return jsonify({'error': 'Teacher not found'}), 404

# --- Club Endpoints ---

@app.route('/api/clubs', methods=['GET', 'POST'])
def manage_clubs():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('clubs'))
    
    if request.method == 'POST':
        data = request.json
        if 'id' not in data:
            data['id'] = f"C{int(time.time())}"
        data_manager.add_item('clubs', data)
        return jsonify(data), 201

@app.route('/api/clubs/<club_id>', methods=['PUT', 'DELETE'])
def club_detail(club_id):
    if request.method == 'PUT':
        updated = data_manager.update_item('clubs', club_id, request.json)
        if updated:
            return jsonify(updated)
        return jsonify({'error': 'Club not found'}), 404
    
    if request.method == 'DELETE':
        if data_manager.delete_item('clubs', club_id):
            return jsonify({'success': True})
        return jsonify({'error': 'Club not found'}), 404

# --- Outlet Endpoints ---

@app.route('/api/outlets', methods=['GET'])
def get_outlets():
    outlets = data_manager.get_all('outlets')
    return jsonify(outlets)

@app.route('/api/outlets', methods=['POST'])
def create_outlet():
    data = request.json
    if 'id' not in data:
        data['id'] = f"outlet_{int(time.time())}"
    data_manager.add_item('outlets', data)
    return jsonify(data), 201

@app.route('/api/outlets/<outlet_id>', methods=['PUT', 'DELETE'])
def outlet_detail(outlet_id):
    if request.method == 'PUT':
        updated = data_manager.update_item('outlets', outlet_id, request.json)
        if updated:
            return jsonify(updated)
        return jsonify({'error': 'Outlet not found'}), 404
    
    if request.method == 'DELETE':
        if data_manager.delete_item('outlets', outlet_id):
            return jsonify({'success': True})
        return jsonify({'error': 'Outlet not found'}), 404

# --- Meeting Request Endpoints ---

@app.route('/api/meetings', methods=['GET', 'POST'])
def manage_meetings():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('meetings'))
    
    if request.method == 'POST':
        data = request.json
        if 'id' not in data:
            data['id'] = f"M{int(time.time())}"
        if 'status' not in data:
            data['status'] = 'pending'
        if 'createdAt' not in data:
            from datetime import datetime
            data['createdAt'] = datetime.now().isoformat()
        data_manager.add_item('meetings', data)
        return jsonify(data), 201

@app.route('/api/meetings/<meeting_id>', methods=['PUT', 'DELETE'])
def meeting_detail(meeting_id):
    if request.method == 'PUT':
        updated = data_manager.update_item('meetings', meeting_id, request.json)
        if updated:
            return jsonify(updated)
        return jsonify({'error': 'Meeting not found'}), 404
    
    if request.method == 'DELETE':
        if data_manager.delete_item('meetings', meeting_id):
            return jsonify({'success': True})
        return jsonify({'error': 'Meeting not found'}), 404

# --- Notice Endpoints ---

@app.route('/api/notices', methods=['GET', 'POST'])
def manage_notices():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('notices'))
    
    if request.method == 'POST':
        data = request.json
        if 'id' not in data:
            data['id'] = f"N{int(time.time())}"
        data_manager.add_item('notices', data)
        return jsonify(data), 201

@app.route('/api/notices/<notice_id>', methods=['DELETE'])
def delete_notice(notice_id):
    if data_manager.delete_item('notices', notice_id):
        return jsonify({'success': True})
    return jsonify({'error': 'Notice not found'}), 404

# --- Booking Endpoints (Legacy - keeping for compatibility) ---

@app.route('/api/bookings', methods=['GET', 'POST'])
def manage_bookings():
    if request.method == 'GET':
        return jsonify(data_manager.get_all('bookings'))
    
    if request.method == 'POST':
        data = request.json
        if 'id' not in data:
            data['id'] = f"B{int(time.time())}"
        data_manager.add_item('bookings', data)
        return jsonify(data), 201

@app.route('/api/bookings/<booking_id>', methods=['PUT'])
def update_booking(booking_id):
    updated = data_manager.update_item('bookings', booking_id, request.json)
    if updated:
        return jsonify(updated)
    return jsonify({'error': 'Booking not found'}), 404

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
