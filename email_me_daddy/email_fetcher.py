import os
import imaplib
import email
import json

def load_env_manually(env_path):
    with open(env_path, 'r') as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith('#'):
                key, value = line.split('=', 1)
                os.environ[key] = value

def get_email_body(msg):
    body = ""
    if msg.is_multipart():
        for part in msg.walk():
            ctype = part.get_content_type()
            cdisposition = part.get('Content-Disposition')
            if ctype == 'text/plain' and 'attachment' not in str(cdisposition):
                body = part.get_payload(decode=True).decode()
                break
    else:
        body = msg.get_payload(decode=True).decode()
    return body

load_env_manually('C:/Users/frost/Documents/GitHub/experiments/email_me_daddy/.env')

IMAP_HOST = os.getenv("IMAP_HOST")
IMAP_PORT = int(os.getenv("IMAP_PORT", 993))
IMAP_USERNAME = os.getenv("IMAP_USERNAME")
IMAP_PASSWORD = os.getenv("IMAP_PASSWORD")
IMAP_USE_SSL = os.getenv("IMAP_USE_SSL", "true").lower() == "true"

def fetch_emails():
    emails_data = []
    try:
        if IMAP_USE_SSL:
            mail = imaplib.IMAP4_SSL(IMAP_HOST, IMAP_PORT)
        else:
            mail = imaplib.IMAP4(IMAP_HOST, IMAP_PORT)

        mail.login(IMAP_USERNAME, IMAP_PASSWORD)
        mail.select('inbox')

        status, email_ids = mail.search(None, 'ALL')
        email_id_list = email_ids[0].split()
        latest_emails = email_id_list[-10:]

        for email_id in latest_emails:
            status, msg_data = mail.fetch(email_id, '(RFC822)')
            for response_part in msg_data:
                if isinstance(response_part, tuple):
                    msg = email.message_from_bytes(response_part[1])
                    subject = msg['subject']
                    sender = msg['from']
                    date = msg['date']
                    body = get_email_body(msg)
                    emails_data.append({
                        "sender": sender,
                        "subject": subject,
                        "date": date,
                        "body": body
                    })
        mail.logout()
    except Exception as e:
        # In case of error, return an empty list or error message in JSON
        emails_data = {"error": str(e)}
    finally:
        print(json.dumps(emails_data))

if __name__ == "__main__":
    fetch_emails()
