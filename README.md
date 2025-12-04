# EduConnect - Python Flask Web Application

## Project Overview

**EduConnect** is a comprehensive educational management system built with Python Flask (backend) and HTML/CSS/JavaScript (frontend). It provides separate portals for Students, Teachers, and Administrators to manage academic activities, appointments, clubs, and campus resources.

### Key Features
- **Student Portal**: View profile, timetable, to-do lists, book teacher appointments, join clubs
- **Teacher Portal**: Manage profile, view students, handle meeting requests, set available time slots
- **Admin Portal**: Full CRUD operations for students, teachers, clubs, campus outlets, and notices
- **Microsoft OAuth**: Login integration with @bennett.edu.in accounts
- **REST API**: Complete backend API for all operations

### Technology Stack
- **Backend**: Python 3.x, Flask, Flask-CORS
- **Frontend**: HTML5, CSS3, JavaScript (Vanilla), TailwindCSS
- **Data Storage**: JSON files (file-based database)
- **Authentication**: Custom authentication + Microsoft OAuth 2.0

---

## Project Structure

```
e:\car website\
├── backend/                    # Python Flask backend server
│   ├── data/                   # JSON data files (database)
│   ├── app.py                  # Main Flask application
│   ├── config.py               # Configuration management
│   ├── data_manager.py         # Data operations handler
│   ├── oauth_helper.py         # Microsoft OAuth integration
│   ├── requirements.txt        # Python dependencies
│   ├── start_backend.bat       # Windows startup script
│   └── start_backend.ps1       # PowerShell startup script
│
├── css/                        # Stylesheets
│   └── style.css               # Main CSS file
│
├── js/                         # JavaScript files
│   ├── api.js                  # API client for backend
│   ├── auth.js                 # Authentication logic
│   ├── student.js              # Student portal logic
│   ├── teacher.js              # Teacher portal logic
│   ├── admin.js                # Admin portal logic
│   ├── data.js                 # Local data operations
│   ├── excel.js                # Excel/CSV export functionality
│   └── microsoft-ui.js         # Microsoft OAuth UI
│
├── images/                     # Image assets
│   └── login-bg.jpg            # Login page background
│
├── index.html                  # Login/landing page
├── student-dashboard.html      # Student portal
├── teacher-dashboard.html      # Teacher portal
├── admin-dashboard.html        # Admin portal
├── clubs.html                  # Clubs management page
├── nih.html                    # NIH (Notice) page
├── microsoft-callback.html     # OAuth callback handler
└── README.md                   # This file
```

---

## Python Backend Files Explained

### 1. **app.py** (Main Application File)
The core Flask application containing all API routes and business logic.

**Key Components**:
- **Authentication Endpoints** (`/api/auth/login`, `/api/auth/signup`)
  - Handles login/signup for students, teachers, and admin
  - Admin secret: `Bennett_Pioneers_2025_Project`
  
- **Microsoft OAuth Endpoints** (`/api/auth/microsoft/login`, `/api/auth/microsoft/callback`)
  - Initiates and handles Microsoft OAuth flow
  - Auto-creates accounts for @bennett.edu.in emails
  
- **CRUD Endpoints**:
  - `/api/students` - Student management
  - `/api/teachers` - Teacher management
  - `/api/clubs` - Club operations
  - `/api/outlets` - Campus outlet management
  - `/api/meetings` - Meeting request handling
  - `/api/notices` - Notice board operations
  - `/api/bookings` - Legacy booking system

**Port**: Runs on `http://localhost:5000`

### 2. **config.py** (Configuration Manager)
Manages application configuration and environment variables.

**Responsibilities**:
- Loads environment variables from `.env` file
- Stores Microsoft OAuth credentials (Client ID, Secret, Tenant ID)
- Manages Flask secret key for sessions
- Defines redirect URI for OAuth callbacks

**Key Variables**:
```python
MICROSOFT_CLIENT_ID       # OAuth app client ID
MICROSOFT_CLIENT_SECRET   # OAuth app secret
MICROSOFT_TENANT_ID       # Bennett tenant ID
REDIRECT_URI              # OAuth callback URL
SECRET_KEY                # Flask session encryption key
```

### 3. **data_manager.py** (Data Layer)
Handles all JSON file operations - reading, writing, searching, updating, and deleting data.

**Core Methods**:
- `get_all(file_key)` - Read all records from a JSON file
- `find_item(file_key, field, value)` - Search for specific record
- `add_item(file_key, item)` - Add new record
- `update_item(file_key, item_id, updates)` - Update existing record
- `delete_item(file_key, item_id)` - Delete record

**Supported Files**:
- `students.json`
- `teachers.json`
- `clubs.json`
- `outlets.json`
- `meetings.json`
- `notices.json`
- `bookings.json`

### 4. **oauth_helper.py** (Microsoft OAuth Integration)
Handles Microsoft authentication flow.

**Functions**:
- `get_microsoft_auth_url(state)` - Generates Microsoft login URL
- `exchange_code_for_token(code)` - Exchanges authorization code for access token
- `get_user_info(access_token)` - Fetches user profile from Microsoft Graph API
- `validate_email_domain(email)` - Ensures email is @bennett.edu.in
- `determine_role_from_email(email)` - Auto-detects user role from email pattern

---

## Data Files Explained

All data is stored in `backend/data/` as JSON files. Each file acts as a table in a database.

### 1. **students.json**
Stores student records with profile information, marks, clubs, timetables, and to-do lists.

**Fields**:
```json
{
  "id": "student@bennett.edu.in",
  "enrollmentNo": "E12345",
  "name": "Student Name",
  "year": "1st Year",
  "email": "student@bennett.edu.in",
  "course": "CSE",
  "batch": "2024",
  "marks": {},
  "clubs": [],
  "timetable": [],
  "todo": []
}
```

### 2. **teachers.json**
Stores teacher profiles, subjects, cubicle numbers, and available meeting slots.

**Fields**:
```json
{
  "id": "teacher@bennett.edu.in",
  "name": "Teacher Name",
  "subject": "Mathematics",
  "cubicle": "A-101",
  "contact": "9876543210",
  "department": "Engineering",
  "isContactHidden": false,
  "isEmailHidden": false,
  "isCubicleHidden": false,
  "availableSlots": ["Monday 10-11 AM", "Wednesday 2-3 PM"],
  "classes": []
}
```

### 3. **meetings.json**
Stores meeting/appointment requests between students and teachers.

**Fields**:
```json
{
  "id": "M1701234567",
  "studentId": "student@bennett.edu.in",
  "studentName": "Student Name",
  "teacherId": "teacher@bennett.edu.in",
  "teacherName": "Teacher Name",
  "date": "2024-12-05",
  "time": "10:00 AM",
  "purpose": "Doubt clarification",
  "status": "pending",
  "createdAt": "2024-12-04T10:00:00"
}
```

**Status Values**: `pending`, `approved`, `rejected`, `rescheduled`

### 4. **clubs.json**
Stores college club information.

**Fields**:
```json
{
  "id": "C123",
  "name": "Tech Club",
  "description": "Technology and coding club",
  "president": "Student Name",
  "vicePresident": "Another Student",
  "secretary": "Student 3",
  "members": [{"name": "Member 1", "role": "Member"}],
  "meeting": "Every Friday 4 PM",
  "whatsappLink": "https://chat.whatsapp.com/...",
  "image": "data:image/png;base64,..."
}
```

### 5. **outlets.json**
Stores campus food outlet/canteen information.

**Fields**:
```json
{
  "id": "outlet_123",
  "name": "Campus Cafe",
  "location": "Block A, Ground Floor",
  "timing": "8 AM - 8 PM",
  "menuImages": ["data:image/jpeg;base64,..."]
}
```

### 6. **notices.json**
Stores notice board announcements (currently empty array).

**Fields**:
```json
{
  "id": "N123",
  "title": "Holiday Notice",
  "content": "Campus closed on...",
  "date": "2024-12-10",
  "priority": "high"
}
```

### 7. **bookings.json**
Legacy booking system (kept for compatibility, partially replaced by meetings.json).

---

## How to Run the Project

### Prerequisites
- Python 3.x installed
- Web browser (Chrome, Firefox, Edge, etc.)

### Step 1: Start the Backend Server

**Method 1 - Using Batch File (Easiest)**:
1. Navigate to `e:\car website\backend`
2. Double-click `start_backend.bat`
3. Wait for "Running on http://127.0.0.1:5000" message
4. **Keep this window open!**

**Method 2 - Using PowerShell**:
1. Right-click `backend/start_backend.ps1`
2. Select "Run with PowerShell"
3. Keep the window open

**Method 3 - Manual Command Line**:
```bash
cd e:\car website\backend
pip install -r requirements.txt
python app.py
```

### Step 2: Open the Frontend
1. Navigate to `e:\car website`
2. Open `index.html` in your web browser
3. Select your role (Student/Teacher/Admin)
4. Login with credentials

### Default Credentials

**Admin Login**:
- Admin Name: Any name
- Secret ID: `Bennett_Pioneers_2025_Project`

**Student/Teacher Login**:
- Use existing credentials from JSON files
- Or signup to create new account
- Or use Microsoft login with @bennett.edu.in email

---

## API Endpoints Reference

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login for student/teacher/admin |
| POST | `/api/auth/signup` | Signup for student/teacher |
| GET | `/api/auth/microsoft/login` | Initiate Microsoft OAuth |
| GET | `/api/auth/microsoft/callback` | Handle OAuth callback |

### Students
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/students` | Get all students |
| POST | `/api/students` | Create new student |
| PUT | `/api/students/<id>` | Update student |
| DELETE | `/api/students/<id>` | Delete student |

### Teachers
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/teachers` | Get all teachers |
| POST | `/api/teachers` | Create new teacher |
| PUT | `/api/teachers/<id>` | Update teacher |
| DELETE | `/api/teachers/<id>` | Delete teacher |

### Clubs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/clubs` | Get all clubs |
| POST | `/api/clubs` | Create new club |
| PUT | `/api/clubs/<id>` | Update club |
| DELETE | `/api/clubs/<id>` | Delete club |

### Meetings
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/meetings` | Get all meetings |
| POST | `/api/meetings` | Create meeting request |
| PUT | `/api/meetings/<id>` | Update meeting status |
| DELETE | `/api/meetings/<id>` | Delete meeting |

### Outlets
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/outlets` | Get all outlets |
| POST | `/api/outlets` | Create new outlet |
| PUT | `/api/outlets/<id>` | Update outlet |
| DELETE | `/api/outlets/<id>` | Delete outlet |

### Notices
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notices` | Get all notices |
| POST | `/api/notices` | Create new notice |
| DELETE | `/api/notices/<id>` | Delete notice |

---

## Troubleshooting

### "Backend server is not running" Error
**Problem**: Frontend cannot connect to backend.

**Solution**: Make sure the backend server is running on port 5000. Check if the terminal window with `python app.py` is still open.

### Port Already in Use
**Problem**: Flask cannot start because port 5000 is occupied.

**Solution**: 
- Kill the existing process using port 5000
- Or change the port in `app.py` (line 397-398)

### Python Not Found
**Problem**: `python` command not recognized.

**Solution**: Install Python 3.x and add it to system PATH.

### Import Errors
**Problem**: Missing Python packages.

**Solution**: Run `pip install -r requirements.txt` from the backend directory.

---

## Developer Notes

### Project Context
This is a **Python Flask project** demonstrating:
- RESTful API design
- File-based database operations
- OAuth 2.0 integration
- Frontend-backend separation
- CRUD operations on multiple entities

### For Practical Exam Presentation
**Key Points to Explain**:
1. **Flask Framework**: Lightweight Python web framework
2. **REST API**: Each endpoint follows REST conventions (GET, POST, PUT, DELETE)
3. **Data Persistence**: JSON files act as a simple database
4. **Authentication**: Custom + OAuth for flexibility
5. **CORS**: Allows frontend to communicate with backend from different origins
6. **Modular Design**: Separated concerns (app, config, data, oauth)

**Code to Highlight**:
- Route decorators in `app.py` (`@app.route()`)
- JSON file operations in `data_manager.py`
- OAuth flow in `oauth_helper.py`
- API client in `js/api.js`

---

## License & Credits

**Project**: EduConnect Educational Management System  
**Framework**: Flask (Python), TailwindCSS  
**Institution**: Bennett University  
**Purpose**: Python Practical Project

---

**Last Updated**: December 2024
