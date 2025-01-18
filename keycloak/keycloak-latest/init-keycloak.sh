#!/bin/bash

# Enable debug mode to see more information
set -x

# Wait for Keycloak to be ready
echo "Waiting for Keycloak to be ready..."
while ! curl -s http://localhost:8080/health/ready > /dev/null; do
    sleep 5
done

# Login to Keycloak and get admin token with direct response handling
echo "Logging in to Keycloak..."
TOKEN_RESPONSE=$(curl -s -X POST http://localhost:8080/realms/master/protocol/openid-connect/token \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin" \
    -d "password=password" \
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

# Create general_project realm
echo "Creating general_project realm..."
make_request -X POST http://localhost:8080/admin/realms \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "realm": "general_project",
        "enabled": true,
        "displayName": "General Project Realm",
        "registrationAllowed": false,
        "resetPasswordAllowed": true,
        "loginWithEmailAllowed": true,
        "duplicateEmailsAllowed": false,
        "sslRequired": "external"
    }'

# Create public client for frontend
echo "Creating public client for frontend..."
make_request -X POST http://localhost:8080/admin/realms/general_project/clients \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "clientId": "frontend-client",
        "enabled": true,
        "publicClient": true,
        "standardFlowEnabled": true,
        "implicitFlowEnabled": true,
        "directAccessGrantsEnabled": true,
        "serviceAccountsEnabled": false,
        "redirectUris": ["http://localhost:5173/*"],
        "webOrigins": ["*"]
    }'

# Create admin role in realm
echo "Creating admin role..."
make_request -X POST http://localhost:8080/admin/realms/general_project/roles \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "name": "admin",
        "description": "Administrator role"
    }'

# Create admin user
echo "Creating admin user..."
make_request -X POST http://localhost:8080/admin/realms/general_project/users \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "admin",
        "email": "admin@example.com",
        "enabled": true,
        "emailVerified": true,
        "credentials": [{
            "type": "password",
            "value": "pass",
            "temporary": false
        }]
    }'

# Get admin role details with proper JSON handling
echo "Getting admin role details..."
ROLES_RESPONSE=$(make_request -X GET http://localhost:8080/admin/realms/general_project/roles \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
if [ $? -ne 0 ]; then
  echo "Failed to retrieve roles."
  exit 1
fi

# Extract admin role ID with proper error handling
ADMIN_ROLE_ID=$(echo "$ROLES_RESPONSE" | jq -r '.[] | select(.name=="admin") | .id')
if [ -z "$ADMIN_ROLE_ID" ] || [ "$ADMIN_ROLE_ID" = "null" ]; then
    echo "Failed to get admin role ID. Full roles response:"
    echo "$ROLES_RESPONSE"
    exit 1
fi

# Get admin user ID with proper error handling
USERS_RESPONSE=$(make_request -X GET "http://localhost:8080/admin/realms/general_project/users" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json")
if [ $? -ne 0 ]; then
  echo "Failed to retrieve users."
  exit 1
fi

ADMIN_USER_ID=$(echo "$USERS_RESPONSE" | jq -r '.[] | select(.username=="admin") | .id')
if [ -z "$ADMIN_USER_ID" ] || [ "$ADMIN_USER_ID" = "null" ]; then
    echo "Failed to get admin user ID. Full users response:"
    echo "$USERS_RESPONSE"
    exit 1
fi

# Assign admin role to admin user
echo "Assigning admin role to admin user..."
make_request -X POST "http://localhost:8080/admin/realms/general_project/users/$ADMIN_USER_ID/role-mappings/realm" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "[{
        \"id\": \"$ADMIN_ROLE_ID\",
        \"name\": \"admin\"
    }]"

# Create John Doe user
echo "Creating user John Doe..."
make_request -X POST http://localhost:8080/admin/realms/general_project/users \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{
        "username": "jdoe",
        "email": "jdoe@mail.com",
        "enabled": true,
        "emailVerified": true,
        "credentials": [{
            "type": "password",
            "value": "pass",
            "temporary": false
        }]
    }'

echo "Initialization completed successfully!"
