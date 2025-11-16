# src/utils/email_send.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication

def send_email_with_ics(smtp_host, smtp_port, smtp_user, smtp_pass, subject, body_html, to_emails, ics_content):
    if not to_emails:
        return False
    msg = MIMEMultipart("mixed")
    msg["From"] = smtp_user
    msg["To"] = ", ".join(to_emails)
    msg["Subject"] = subject

    alt = MIMEMultipart("alternative")
    alt.attach(MIMEText(body_html, "html"))
    msg.attach(alt)

    ics_part = MIMEApplication(ics_content.encode("utf-8"), _subtype="ics")
    ics_part.add_header("Content-Disposition", "attachment", filename="invite.ics")
    msg.attach(ics_part)

    server = smtplib.SMTP(smtp_host, smtp_port, timeout=30)
    try:
        server.starttls()
        server.login(smtp_user, smtp_pass)
        server.sendmail(smtp_user, to_emails, msg.as_string())
    finally:
        try:
            server.quit()
        except Exception:
            pass
    return True
