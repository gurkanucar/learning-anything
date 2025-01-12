from flask import Flask, request, redirect, session, render_template, jsonify, make_response
from requests_oauthlib import OAuth2Session
import os
import ssl
import requests
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
USERINFO_URL = 'http://localhost:8080/realms/general_project/protocol/openid-connect/userinfo'
LOGOUT_URL = 'http://localhost:8080/realms/general_project/protocol/openid-connect/logout'
CLIENT_SECRET = 'oOdEnLuqHmV0NU7ORbF0gkIu6MeKshDm'

# SSL configuration
SSL_CERT = '../certs/example.com.crt'
SSL_KEY = '../certs/example.com.key'

def set_tokens_cookies(response, access_token, refresh_token):
    """Set secure cookies for tokens"""
    response.set_cookie(
        'access_token',
        access_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=3600,  # 1 hour
        domain='example.com',
        path='/'
    )
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=True,
        samesite='Lax',
        max_age=86400,  # 24 hours
        domain='example.com',
        path='/'
    )

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

@app.route('/api/userinfo')
def get_userinfo():
    """Fetch user info using stored access token"""
    access_token = request.cookies.get('access_token')
    if not access_token:
        return jsonify({'error': 'No access token found'}), 401

    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Accept': 'application/json'
        }
        
        # Print debug information
        print("Making request to:", USERINFO_URL)
        print("Headers:", headers)
        
        response = requests.get(
            USERINFO_URL,
            headers=headers,
            verify=False
        )
        
        # Print response details for debugging
        print("Response status:", response.status_code)
        print("Response headers:", response.headers)
        print("Response body:", response.text)
        
        if response.status_code == 401:
            # Try to refresh the token
            refresh_token = request.cookies.get('refresh_token')
            if refresh_token:
                try:
                    new_token = refresh_access_token(refresh_token)
                    if new_token:
                        headers['Authorization'] = f'Bearer {new_token["access_token"]}'
                        response = requests.get(USERINFO_URL, headers=headers, verify=False)
                except Exception as e:
                    print("Token refresh failed:", str(e))
                    return jsonify({'error': 'Token refresh failed'}), 401
            else:
                return jsonify({'error': 'Token expired and no refresh token available'}), 401
        
        if response.status_code != 200:
            return jsonify({'error': f'Failed to fetch user info: {response.text}'}), response.status_code
            
        return jsonify(response.json())
    except Exception as e:
        print("Error in get_userinfo:", str(e))
        return jsonify({'error': str(e)}), 500

def refresh_access_token(refresh_token):
    """Refresh the access token using the refresh token"""
    try:
        data = {
            'grant_type': 'refresh_token',
            'client_id': CLIENT_ID,
            'client_secret': CLIENT_SECRET,
            'refresh_token': refresh_token
        }
        response = requests.post(TOKEN_URL, data=data, verify=False)
        if response.status_code == 200:
            new_token = response.json()
            return new_token
    except Exception as e:
        print("Error refreshing token:", str(e))
    return None

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
        
        # Print token for debugging
        print("Received token:", token)

        # Fetch user information using the token
        headers = {
            'Authorization': f'Bearer {token["access_token"]}',
            'Accept': 'application/json'
        }
        user_info_response = requests.get(USERINFO_URL, headers=headers, verify=False)
        user_info = user_info_response.json()
        roles = user_info.get('roles', [])

        # Create response with tokens in secure cookies
        response = make_response(render_template(
            'login_success.html',
            user_info=user_info,
            roles=roles,
            access_token=token['access_token'],
            refresh_token=token.get('refresh_token', 'No refresh token provided')
        ))
        
        # Set cookies with the tokens
        set_tokens_cookies(response, token['access_token'], token.get('refresh_token', ''))
        return response

    except Exception as e:
        print("Callback error:", str(e))
        return render_template('error.html', error_message=str(e))

@app.route('/logout')
def logout():
    """Handle logout"""
    try:
        refresh_token = request.cookies.get('refresh_token')
        if refresh_token:
            # Invalidate the refresh token on Keycloak server
            data = {
                'client_id': CLIENT_ID,
                'client_secret': CLIENT_SECRET,
                'refresh_token': refresh_token
            }
            requests.post(LOGOUT_URL, data=data)

        # Create response that clears cookies
        response = make_response(redirect('/'))
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response

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
