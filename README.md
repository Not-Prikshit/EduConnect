💻 EduConnect — Working Prototype (Team Pixel Pioneers)

Type: Local Web App Prototype (Free & Offline)
Tech Stack: Python + Flask + Excel (openpyxl)
UI Design: Figma


---

🎯 Core Idea

A smart campus tool that connects students and faculty, letting students book meeting slots and teachers manage availability & approvals — all stored in Excel files, no internet or hosting needed.


---

⚙ Technical Features

100 % Python / Flask-based web app (runs locally)

Data stored in Excel files (faculty_data.xlsx, student_data.xlsx)

UI designed in Figma and implemented with HTML, CSS & Bootstrap

Dynamic pages using Jinja templates

Works completely offline and free of cost



---

👨‍🎓 Student Features

View all faculty and available slots

Filter by faculty or date

Book a slot (enter name & email)

Instant confirmation message after booking

Slot status auto-updates to “Requested” in Excel



---

👩‍🏫 Faculty Features

Add new available slots (date & time)

View student booking requests

Approve or Reject requests

Automatically updates Excel (Status → Booked/Free)

Mock “Connect Google” button for future calendar sync



---

✉ Email & Calendar Features

When faculty approves a slot:

Sends confirmation email to student & faculty

Attaches a calendar invite (.ics file) that adds to Google or Outlook Calendar


Works using Python’s built-in email & SMTP (no paid Google API needed)

Optional mock messages for demo mode



---

🧾 Excel Data Format

faculty_data.xlsx

Faculty	Dept	Date	Start	End	Status	Student	Contact



student_data.xlsx
| Student | Contact | Faculty | Dept | Date | Start | End | Status |


---

🖥 UI / UX Highlights

Clean Figma-designed responsive interface

Bootstrap cards for slots & simple forms

Flash messages for actions (“Slot Added”, “Request Sent”)

Reusable components (Navbar, Slot Card, Forms)

Fully demo-ready in VS Code / Browser



---

🗂 Developer Details

Organized folders (src/, data/, templates/, static/)

Easy to run:

python src/webapp.py

Completely offline — no hosting or paid APIs

Simple setup for local presentation or college demo



---

🚀 Future Upgrades

Real Google Calendar integration (OAuth)

Auto email reminders before meeting

Faculty & student login system

Export to Excel / Reports / Analytics

Mobile responsive version



---

💰 Cost

✅ 100 % Free to build and run
✅ No database server, no Google Cloud billing, no hosting


---

In short:
EduConnect lets students book faculty meeting slots, faculty approve them, and both receive email + calendar invites — all powered by Python and Excel, completely offline and free.
