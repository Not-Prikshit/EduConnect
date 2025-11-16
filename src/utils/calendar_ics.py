# src/utils/calendar_ics.py
from datetime import datetime

def _to_ics_dt(dt: datetime):
    return dt.strftime("%Y%m%dT%H%M%S")

def make_ics(slot: dict) -> str:
    start = datetime.strptime(f"{slot['date']} {slot['start_time']}", "%Y-%m-%d %H:%M")
    end = datetime.strptime(f"{slot['date']} {slot['end_time']}", "%Y-%m-%d %H:%M")
    dtstamp = datetime.utcnow().strftime("%Y%m%dT%H%M%SZ")
    uid = f"{slot.get('slot_id','slot')}-educonnect"

    start_str = _to_ics_dt(start)
    end_str = _to_ics_dt(end)

    organizer = slot.get("faculty_email", "")
    attendee = slot.get("student_email", "")

    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//EduConnect//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:REQUEST",
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{dtstamp}",
        f"DTSTART:{start_str}",
        f"DTEND:{end_str}",
        f"SUMMARY:Meeting — {slot.get('faculty_name','Faculty')} & {slot.get('student_name','Student')}",
        f"DESCRIPTION:EduConnect Slot ID: {slot.get('slot_id','')}"
    ]
    if organizer:
        lines.append(f"ORGANIZER;CN={slot.get('faculty_name','')}:MAILTO:{organizer}")
    if attendee:
        lines.append(f"ATTENDEE;CN={slot.get('student_name','')};ROLE=REQ-PARTICIPANT:MAILTO:{attendee}")
    lines.extend([
        "BEGIN:VALARM",
        "TRIGGER:-PT60M",
        "ACTION:DISPLAY",
        "DESCRIPTION:Reminder",
        "END:VALARM",
        "END:VEVENT",
        "END:VCALENDAR"
    ])
    return "\r\n".join(lines)
