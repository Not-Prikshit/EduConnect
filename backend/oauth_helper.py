"""
Microsoft OAuth Helper Functions
"""
import requests
from config import Config

def get_microsoft_auth_url(state=None):
    """
    Generate Microsoft OAuth authorization URL
    """
    params = {
        'client_id': Config.MICROSOFT_CLIENT_ID,
        'response_type': 'code',
        'redirect_uri': Config.REDIRECT_URI,
        'response_mode': 'query',
        'scope': ' '.join(Config.SCOPE),
        'state': state or 'default_state'
    }
    
    auth_url = Config.MICROSOFT_AUTHORIZE_ENDPOINT + '?'
    auth_url += '&'.join([f"{key}={value}" for key, value in params.items()])
    
    return auth_url

def exchange_code_for_token(code):
    """
    Exchange authorization code for access token
    """
    token_data = {
        'client_id': Config.MICROSOFT_CLIENT_ID,
        'client_secret': Config.MICROSOFT_CLIENT_SECRET,
        'code': code,
        'redirect_uri': Config.REDIRECT_URI,
        'grant_type': 'authorization_code',
        'scope': ' '.join(Config.SCOPE)
    }
    
    response = requests.post(Config.MICROSOFT_TOKEN_ENDPOINT, data=token_data)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Token exchange failed: {response.text}")

def get_user_info(access_token):
    """
    Get user information from Microsoft Graph API
    """
    headers = {
        'Authorization': f'Bearer {access_token}'
    }
    
    response = requests.get(Config.MICROSOFT_GRAPH_ENDPOINT, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Failed to get user info: {response.text}")

def validate_email_domain(email):
    """
    Validate that email belongs to allowed domain
    """
    return email.lower().endswith(Config.ALLOWED_EMAIL_DOMAIN)

def determine_role_from_email(email):
    """
    Determine if user is student or teacher based on email pattern
    You can customize this logic based on your college's email conventions
    """
    # Example logic - customize as needed:
    # Teachers might have emails like: firstname.lastname@bennett.edu.in
    # Students might have emails like: e12345@bennett.edu.in or rollnumber@bennett.edu.in
    
    email_prefix = email.split('@')[0].lower()
    
    # If email starts with 'e' followed by numbers, likely a student
    if email_prefix.startswith('e') and email_prefix[1:].isdigit():
        return 'student'
    
    # If email contains only numbers, likely a student enrollment number
    if email_prefix.isdigit():
        return 'student'
    
    # Otherwise, assume teacher (contains name)
    return 'teacher'
