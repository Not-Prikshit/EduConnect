# src/webapp.py
import os
from flask import Flask, render_template, request, redirect, url_for, flash, session
from dotenv import load_dotenv

# local imports (run app from src/)
from excel_ops import (
    ensure_files_exist,
    get_free_slots,
    book_slot,
    add_faculty_slot,
    get_requests,
    approve_request,
    get_all_faculty_names,
    get_slots_by_faculty,
    faculty_exists,
    get_student_pending,
    reject_request
)
from utils.email_send import send_email_with_ics
from utils.calendar_ics import make_ics

load_dotenv()
app = Flask(__name__)
app.secret_key = os.getenv("FLASK_SECRET", "educonnect-dev-secret")

ensure_files_exist()

# ----------------- small helper decorator -----------------
def login_required(role=None):
    def wrapper(fn):
        def wrapped(*args, **kwargs):
            if not session.get("logged_in"):
                flash("Please login first.")
                return redirect(url_for("login"))
            if role and session.get("role") != role:
                flash("Access denied for your user type.")
                # redirect to their dashboard
                if session.get("role") == "teacher":
                    return redirect(url_for("teacher_dashboard"))
                else:
                    return redirect(url_for("student_dashboard"))
            return fn(*args, **kwargs)
        wrapped.__name__ = fn.__name__
        return wrapped
    return wrapper

# ----------------- public & auth routes -----------------
@app.route("/")
def landing():
    faculty = get_all_faculty_names()
    return render_template("landing.html", faculty=faculty)

@app.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        role = request.form.get("role")
        if role == "student":
            name = (request.form.get("student_name") or "").strip()
            email = (request.form.get("student_email") or "").strip()
            if not name or not email:
                flash("Enter name and email.")
                return redirect(url_for("login"))
            session["logged_in"] = True
            session["role"] = "student"
            session["name"] = name
            session["email"] = email
            flash(f"Logged in as student: {name}")
            return redirect(url_for("student_dashboard"))
        elif role == "teacher":
            # teacher_name may come from select or typed input
            teacher_name = (request.form.get("teacher_name") or "").strip()
            typed = (request.form.get("teacher_name_typed") or "").strip()
            if typed:
                teacher_name = typed
            if not teacher_name:
                flash("Enter or select teacher name.")
                return redirect(url_for("login"))
            if not faculty_exists(teacher_name):
                flash("Teacher not found. Add a slot with this teacher name first or use an existing Teacher name.")
                return redirect(url_for("login"))
            session["logged_in"] = True
            session["role"] = "teacher"
            session["name"] = teacher_name
            # try to get email for teacher
            slots = get_slots_by_faculty(teacher_name)
            session["email"] = slots[0].get("faculty_email") if slots else ""
            flash(f"Logged in as teacher: {teacher_name}")
            return redirect(url_for("teacher_dashboard"))
        else:
            flash("Choose a role.")
            return redirect(url_for("login"))
    # GET
    faculty = get_all_faculty_names()
    return render_template("login.html", faculty=faculty)

@app.route("/logout")
def logout():
    session.clear()
    flash("Logged out.")
    return redirect(url_for("landing"))

# ----------------- student routes -----------------
@app.route("/student")
@login_required(role="student")
def student_dashboard():
    slots = get_free_slots()
    pending = get_student_pending(session.get("email"))
    return render_template("student_dashboard.html", slots=slots, name=session.get("name"), pending=pending)

@app.route("/student/book", methods=["POST"])
@login_required(role="student")
def student_book():
    faculty = request.form.get("faculty")
    date = request.form.get("date")
    start_time = request.form.get("start_time")
    student_name = session.get("name")
    student_email = session.get("email")
    ok, msg = book_slot(faculty, date, start_time, student_name, student_email)
    flash(msg)
    return redirect(url_for("student_dashboard"))

# ----------------- teacher routes -----------------
@app.route("/teacher")
@login_required(role="teacher")
def teacher_dashboard():
    teacher_name = session.get("name")
    my_slots = get_slots_by_faculty(teacher_name)
    requests = [s for s in my_slots if (s.get("status") or "").strip().lower() == "requested"]
    return render_template("teacher_dashboard.html", slots=my_slots, requests=requests, teacher=teacher_name)

@app.route("/teacher/add-slot", methods=["GET", "POST"])
@login_required(role="teacher")
def teacher_add_slot():
    if request.method == "POST":
        faculty_name = session.get("name")
        department = request.form.get("department")
        faculty_email = request.form.get("faculty_email") or session.get("email") or ""
        date = request.form.get("date")
        start_time = request.form.get("start_time")
        end_time = request.form.get("end_time")
        ok, msg = add_faculty_slot(faculty_name, department, date, start_time, end_time, faculty_email)
        flash(msg)
        return redirect(url_for("teacher_dashboard"))
    return render_template("add_slot.html", teacher=session.get("name"))

@app.route("/teacher/approve/<slot_id>")
@login_required(role="teacher")
def teacher_approve(slot_id):
    # only teacher who owns the slot can approve
    slot = approve_request(slot_id)
    if not slot:
        flash("Slot not found or not in requested state.")
        return redirect(url_for("teacher_dashboard"))
    if slot.get("faculty_name") != session.get("name"):
        flash("You can only approve your own slots.")
        return redirect(url_for("teacher_dashboard"))

    # send email + ics if configured
    ics = make_ics(slot)
    subject = f"EduConnect: Meeting confirmed — {slot['date']} {slot['start_time']}"
    body_html = (
        f"<p>Hi {slot['student_name']},</p>"
        f"<p>Your meeting with {slot['faculty_name']} has been confirmed for "
        f"{slot['date']} {slot['start_time']} - {slot['end_time']}.</p>"
        f"<p>Slot ID: {slot['slot_id']}</p>"
        f"<p>Regards,<br/>EduConnect</p>"
    )
    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587")) if os.getenv("SMTP_PORT") else None
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")
    recipients = []
    if slot.get("student_email"):
        recipients.append(slot["student_email"])
    if slot.get("faculty_email") and slot["faculty_email"] not in recipients:
        recipients.append(slot["faculty_email"])
    try:
        if smtp_host and smtp_user and smtp_pass and recipients:
            send_email_with_ics(smtp_host, smtp_port, smtp_user, smtp_pass, subject, body_html, recipients, ics)
            flash("Slot approved and email invite sent.")
        else:
            flash("Slot approved. (Email not sent — SMTP not configured or no recipient.)")
    except Exception as e:
        flash(f"Slot approved but failed to send email: {e}")
    return redirect(url_for("teacher_dashboard"))

@app.route("/teacher/reject/<slot_id>")
@login_required(role="teacher")
def teacher_reject(slot_id):
    # only teacher who owns the slot can reject
    # reject_request returns True/False
    success = reject_request(slot_id)
    if success:
        flash("Request rejected and slot freed.")
    else:
        flash("Failed to reject request (maybe not found).")
    return redirect(url_for("teacher_dashboard"))

# public view
@app.route("/public/faculty/<name>")
def public_faculty(name):
    slots = get_slots_by_faculty(name)
    return render_template("public_faculty.html", slots=slots, faculty=name)

if __name__ == "__main__":
    app.run(debug=True)
