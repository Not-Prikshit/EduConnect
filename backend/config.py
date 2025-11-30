import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Microsoft OAuth Configuration
    MICROSOFT_CLIENT_ID = os.getenv('MICROSOFT_CLIENT_ID', 'YOUR_CLIENT_ID_HERE')
    MICROSOFT_CLIENT_SECRET = os.getenv('MICROSOFT_CLIENT_SECRET', 'YOUR_CLIENT_SECRET_HERE')
    MICROSOFT_TENANT_ID = os.getenv('MICROSOFT_TENANT_ID', 'YOUR_TENANT_ID_HERE')
    
    # OAuth URLs
    MICROSOFT_AUTHORITY = f"https://login.microsoftonline.com/{MICROSOFT_TENANT_ID}"
    MICROSOFT_AUTHORIZE_ENDPOINT = f"{MICROSOFT_AUTHORITY}/oauth2/v2.0/authorize"
    MICROSOFT_TOKEN_ENDPOINT = f"{MICROSOFT_AUTHORITY}/oauth2/v2.0/token"
    MICROSOFT_GRAPH_ENDPOINT = "https://graph.microsoft.com/v1.0/me"
    
    # Redirect URI (update this for production)
    REDIRECT_URI = os.getenv('REDIRECT_URI', 'http://localhost:5000/api/auth/microsoft/callback')
    
    # OAuth Scopes
    SCOPE = ["User.Read", "email", "profile", "openid"]
    
    # Email domain restriction
    ALLOWED_EMAIL_DOMAIN = "@bennett.edu.in"
    
    # Session configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'your-secret-key-change-this-in-production')
    SESSION_TYPE = 'filesystem'
