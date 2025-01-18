#!/bin/bash

# Configurable parameters
KEYCLOAK_URL="http://localhost:8080"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="password"
ADMIN_NAME="Admin"
ADMIN_SURNAME="User"
REALM_NAME="general_project"
REALM_DISPLAY_NAME="General Project Realm"
FRONTEND_CLIENT_ID="frontend-client"
FRONTEND_REDIRECT_URIS="http://localhost:5173/*"
FRONTEND_WEB_ORIGINS="*"
ADMIN_ROLE_NAME="admin"
ADMIN_ROLE_DESCRIPTION="Administrator role"
ADMIN_USER_USERNAME="admin"
ADMIN_USER_EMAIL="admin@example.com"
ADMIN_USER_PASSWORD="pass"
USER_USERNAME="jdoe"
USER_NAME="John"
USER_SURNAME="Doe"
USER_EMAIL="jdoe@mail.com"
USER_PASSWORD="pass"

# Enable debug mode to see more information
set -x

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
while ! curl -s "${KEYCLOAK_URL}/health/ready" > /dev/null; do
    sleep 5
done

# Login to Keycloak and get admin token with direct response handling
echo "Logging in to Keycloak..."
TOKEN_RESPONSE=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=${ADMIN_USERNAME}" \
    -d "password=${ADMIN_PASSWORD}" \
    -d "grant_type=password" \
    -d "client_id=admin-cli")

# Extract token with error handling
TOKEN=$(echo "$TOKEN_RESPONSE" | jq -r '.access_token')
if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
    echo "Failed to obtain access token. Response was:"
    echo "$TOKEN_RESPONSE"
    exit 1
fi

echo "Successfully obtained access token"

# Function to make curl requests with error handling.
# Print extra info to stderr (so it won't pollute JSON in stdout).
make_request() {
    local response
    local http_code
    response=$(curl -s -w "\n%{http_code}" "$@")
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    # Print debug info to stderr:
    echo "HTTP Status Code: $http_code" >&2
    echo "Response Body:" >&2
    echo "$body" >&2

    # If HTTP code is not 2xx, return error
    if [[ ! "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        return 1
    fi

    # Echo **only** the JSON body to stdout
    echo "$body"
    return 0
}

# Create realm
echo "Creating realm: ${REALM_NAME}..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"realm\": \"${REALM_NAME}\",
        \"enabled\": true,
        \"displayName\": \"${REALM_DISPLAY_NAME}\",
        \"registrationAllowed\": false,
        \"resetPasswordAllowed\": true,
        \"loginWithEmailAllowed\": true,
        \"duplicateEmailsAllowed\": false,
        \"sslRequired\": \"external\"
    }"

# Create public client for frontend
echo "Creating public client for frontend: ${FRONTEND_CLIENT_ID}..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/clients" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"clientId\": \"${FRONTEND_CLIENT_ID}\",
        \"enabled\": true,
        \"publicClient\": true,
        \"standardFlowEnabled\": true,
        \"implicitFlowEnabled\": true,
        \"directAccessGrantsEnabled\": true,
        \"serviceAccountsEnabled\": false,
        \"redirectUris\": [\"${FRONTEND_REDIRECT_URIS}\"],
        \"webOrigins\": [\"${FRONTEND_WEB_ORIGINS}\"]
    }"

# Create admin role in realm
echo "Creating admin role: ${ADMIN_ROLE_NAME}..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"name\": \"${ADMIN_ROLE_NAME}\",
        \"description\": \"${ADMIN_ROLE_DESCRIPTION}\"
    }"

# Create admin user
echo "Creating admin user: ${ADMIN_USER_USERNAME}..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"${ADMIN_USER_USERNAME}\",
        \"email\": \"${ADMIN_USER_EMAIL}\",
        \"enabled\": true,
        \"emailVerified\": true,
        \"firstName\": \"${ADMIN_NAME}\",
        \"lastName\": \"${ADMIN_SURNAME}\",
        \"credentials\": [{
            \"type\": \"password\",
            \"value\": \"${ADMIN_USER_PASSWORD}\",
            \"temporary\": false
        }]
    }"

# Get admin role details
echo "Getting admin role details..."
ROLES_RESPONSE=$(make_request -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/roles" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
if [ $? -ne 0 ]; then
  echo "Failed to retrieve roles."
  exit 1
fi

ADMIN_ROLE_ID=$(echo "$ROLES_RESPONSE" | jq -r ".[] | select(.name==\"${ADMIN_ROLE_NAME}\") | .id")
if [ -z "$ADMIN_ROLE_ID" ] || [ "$ADMIN_ROLE_ID" = "null" ]; then
    echo "Failed to get admin role ID. Full roles response:"
    echo "$ROLES_RESPONSE"
    exit 1
fi

# Get admin user ID
echo "Getting admin user ID..."
USERS_RESPONSE=$(make_request -X GET "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
if [ $? -ne 0 ]; then
  echo "Failed to retrieve users."
  exit 1
fi

ADMIN_USER_ID=$(echo "$USERS_RESPONSE" | jq -r ".[] | select(.username==\"${ADMIN_USER_USERNAME}\") | .id")
if [ -z "$ADMIN_USER_ID" ] || [ "$ADMIN_USER_ID" = "null" ]; then
    echo "Failed to get admin user ID. Full users response:"
    echo "$USERS_RESPONSE"
    exit 1
fi

# Assign admin role to admin user
echo "Assigning admin role to admin user..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users/${ADMIN_USER_ID}/role-mappings/realm" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "[{
        \"id\": \"${ADMIN_ROLE_ID}\",
        \"name\": \"${ADMIN_ROLE_NAME}\"
    }]"

# Create additional user
echo "Creating user: ${USER_USERNAME}..."
make_request -X POST "${KEYCLOAK_URL}/admin/realms/${REALM_NAME}/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "{
        \"username\": \"${USER_USERNAME}\",
        \"email\": \"${USER_EMAIL}\",
        \"enabled\": true,
        \"emailVerified\": true,
        \"firstName\": \"${USER_NAME}\",
        \"lastName\": \"${USER_SURNAME}\",
        \"credentials\": [{
            \"type\": \"password\",
            \"value\": \"${USER_PASSWORD}\",
            \"temporary\": false
        }]
    }"

echo "Initialization completed successfully!"
