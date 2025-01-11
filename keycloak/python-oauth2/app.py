from flask import Flask, request, redirect, session, render_template
from requests_oauthlib import OAuth2Session
import os
import ssl
os.chdir(os.path.dirname(os.path.abspath(__file__)))

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Allow OAuth2 to work with HTTP for local development
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# OAuth2 configuration
CLIENT_ID = 'my_app_frontend_local_client'
REDIRECT_URI = 'https://example.com/oauth2/callback'
AUTH_BASE_URL = 'http://localhost:8080/realms/general_project/protocol/openid-connect/auth'
TOKEN_URL = 'http://localhost:8080/realms/general_project/protocol/openid-connect/token'
CLIENT_SECRET = 'oOdEnLuqHmV0NU7ORbF0gkIu6MeKshDm'

# SSL configuration
SSL_CERT = '../certs/example.com.crt'
SSL_KEY = '../certs/example.com.key'

@app.route('/')
def home():
    """Home page with login link"""
    return render_template('home.html')

@app.route('/login')
def login():
    """Initialize OAuth2 flow"""
    oauth2_session = OAuth2Session(
        CLIENT_ID,
        redirect_uri=REDIRECT_URI,
        scope=['openid', 'profile', 'email', 'roles']
    )
    authorization_url, state = oauth2_session.authorization_url(AUTH_BASE_URL)
    session['oauth_state'] = state
    return redirect(authorization_url)

@app.route('/oauth2/callback')
def callback():
    """Handle OAuth2 callback"""
    try:
        oauth2_session = OAuth2Session(
            CLIENT_ID,
            redirect_uri=REDIRECT_URI,
            state=session['oauth_state']
        )
        token = oauth2_session.fetch_token(
            TOKEN_URL,
            client_secret=CLIENT_SECRET,
            authorization_response=request.url
        )
        session['oauth_token'] = token

        # Fetch user information
        user_info = oauth2_session.get('http://localhost:8080/realms/general_project/protocol/openid-connect/userinfo').json()
        roles = user_info.get('roles', [])  # Mock roles if not available
        truncated_token = token['access_token'][:20] + '...'  # Truncate token for display

        return render_template(
            'login_success.html',
            user_info=user_info,
            roles=roles,
            truncated_token=truncated_token
        )
    except Exception as e:
        return render_template('error.html', error_message=str(e))

def setup_ssl_context():
    """Create SSL context for HTTPS"""
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    try:
        context.load_cert_chain(SSL_CERT, SSL_KEY)
        context.check_hostname = False
        context.verify_mode = ssl.CERT_NONE
        return context
    except Exception as e:
        print(f"Error loading SSL certificates: {e}")
        return None

if __name__ == '__main__':
    ssl_context = setup_ssl_context()
    if ssl_context:
        app.run(
            host='example.com',
            port=443,
            ssl_context=ssl_context,
            debug=True
        )
    else:
        print("Error: Could not set up SSL context. Check your certificate files.")
