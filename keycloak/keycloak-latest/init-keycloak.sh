#!/bin/bash

# Exit on error, undefined variables, and pipe failures
set -euo pipefail

###################
# Configuration
###################

# Keycloak connection settings
readonly KEYCLOAK_URL="http://localhost:8080"
readonly ADMIN_USERNAME="admin"
readonly ADMIN_PASSWORD="password"

# Realm configuration
readonly REALM_NAME="general_project"
readonly REALM_DISPLAY_NAME="General Project Realm"

# Frontend client settings
readonly FRONTEND_CLIENT_ID="frontend-client"
readonly FRONTEND_REDIRECT_URIS="http://localhost:5173/*"
readonly FRONTEND_WEB_ORIGINS="*"

# User configurations
declare -A ADMIN_USER=(
    [username]="admin"
    [email]="admin@example.com"
    [password]="pass"
    [firstName]="Admin"
    [lastName]="User"
)

declare -A REGULAR_USER=(
    [username]="jdoe"
    [email]="jdoe@mail.com"
    [password]="pass"
    [firstName]="John"
    [lastName]="Doe"
)

# Role definitions
readonly ROLES=(
    "admin:Administrator role"
    "moderator:Moderator role"
    "user:Regular user role"
)

###################
# Helper Functions
###################

log_info() {
    echo "[INFO] $1"
}

log_error() {
    echo "[ERROR] $1" >&2
}

# Enhanced request function with better error handling and logging
make_request() {
    local method=$1
    local endpoint=$2
    shift 2
    local response
    local http_code
    
    response=$(curl -s -w "\n%{http_code}" \
        -X "$method" \
        "$KEYCLOAK_URL$endpoint" \
        -H "Authorization: Bearer $TOKEN" \
        -H "Content-Type: application/json" \
        "$@")
    
    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | sed '$d')

    if [[ ! "$http_code" =~ ^2[0-9][0-9]$ ]]; then
        log_error "Request failed with status $http_code"
        log_error "Response: $body"
        return 1
    fi

    echo "$body"
}

wait_for_keycloak() {
    log_info "Waiting for Keycloak to be ready..."
    while ! curl -s "${KEYCLOAK_URL}/health/ready" > /dev/null; do
        sleep 5
    done
    log_info "Keycloak is ready"
}

get_admin_token() {
    local token_response
    
    token_response=$(curl -s -X POST "${KEYCLOAK_URL}/realms/master/protocol/openid-connect/token" \
        -H "Content-Type: application/x-www-form-urlencoded" \
        -d "username=${ADMIN_USERNAME}" \
        -d "password=${ADMIN_PASSWORD}" \
        -d "grant_type=password" \
        -d "client_id=admin-cli")

    TOKEN=$(echo "$token_response" | jq -r '.access_token')
    if [ "$TOKEN" = "null" ] || [ -z "$TOKEN" ]; then
        log_error "Failed to obtain access token"
        echo "$token_response"
        exit 1
    fi
}

create_realm() {
    log_info "Creating realm: ${REALM_NAME}"
    make_request POST "/admin/realms" -d "{
        \"realm\": \"${REALM_NAME}\",
        \"enabled\": true,
        \"displayName\": \"${REALM_DISPLAY_NAME}\",
        \"registrationAllowed\": false,
        \"resetPasswordAllowed\": true,
        \"loginWithEmailAllowed\": true,
        \"duplicateEmailsAllowed\": false,
        \"sslRequired\": \"external\"
    }"
}

create_client() {
    log_info "Creating frontend client: ${FRONTEND_CLIENT_ID}"
    make_request POST "/admin/realms/${REALM_NAME}/clients" -d "{
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
}

get_client_id() {
    local clients_response
    
    clients_response=$(make_request GET "/admin/realms/${REALM_NAME}/clients")
    CLIENT_ID=$(echo "$clients_response" | jq -r ".[] | select(.clientId==\"${FRONTEND_CLIENT_ID}\") | .id")
    
    if [ -z "$CLIENT_ID" ] || [ "$CLIENT_ID" = "null" ]; then
        log_error "Failed to get client ID"
        exit 1
    fi
}

create_roles() {
    for role_def in "${ROLES[@]}"; do
        local role_name="${role_def%%:*}"
        local role_desc="${role_def#*:}"
        
        log_info "Creating role: ${role_name}"
        make_request POST "/admin/realms/${REALM_NAME}/roles" -d "{
            \"name\": \"${role_name}\",
            \"description\": \"${role_desc}\"
        }"
    done
}

create_user() {
    local -n user=$1
    local username=${user[username]}
    
    log_info "Creating user: ${username}"
    make_request POST "/admin/realms/${REALM_NAME}/users" -d "{
        \"username\": \"${username}\",
        \"email\": \"${user[email]}\",
        \"enabled\": true,
        \"emailVerified\": true,
        \"firstName\": \"${user[firstName]}\",
        \"lastName\": \"${user[lastName]}\",
        \"credentials\": [{
            \"type\": \"password\",
            \"value\": \"${user[password]}\",
            \"temporary\": false
        }]
    }"
}

get_role_id() {
    local role_name=$1
    local roles_response
    
    roles_response=$(make_request GET "/admin/realms/${REALM_NAME}/roles")
    echo "$roles_response" | jq -r ".[] | select(.name==\"${role_name}\") | .id"
}

get_user_id() {
    local username=$1
    local users_response
    
    users_response=$(make_request GET "/admin/realms/${REALM_NAME}/users")
    echo "$users_response" | jq -r ".[] | select(.username==\"${username}\") | .id"
}

assign_role() {
    local user_id=$1
    local role_id=$2
    local role_name=$3
    
    log_info "Assigning role ${role_name} to user"
    make_request POST "/admin/realms/${REALM_NAME}/users/${user_id}/role-mappings/realm" -d "[{
        \"id\": \"${role_id}\",
        \"name\": \"${role_name}\"
    }]"
}

setup_role_mapper() {
    log_info "Setting up role mapper for client"
    make_request POST "/admin/realms/${REALM_NAME}/clients/${CLIENT_ID}/protocol-mappers/models" -d "{
        \"protocol\": \"openid-connect\",
        \"protocolMapper\": \"oidc-usermodel-realm-role-mapper\",
        \"name\": \"roles\",
        \"config\": {
            \"usermodel.realmRoleMapping.rolePrefix\": \"\",
            \"multivalued\": \"true\",
            \"claim.name\": \"roles\",
            \"jsonType.label\": \"String\",
            \"id.token.claim\": \"true\",
            \"access.token.claim\": \"true\",
            \"lightweight.claim\": \"false\",
            \"userinfo.token.claim\": \"true\",
            \"introspection.token.claim\": \"true\"
        }
    }"
}

###################
# Main Execution
###################

main() {
    wait_for_keycloak
    get_admin_token
    
    create_realm
    create_client
    get_client_id
    create_roles
    
    # Create and setup admin user
    create_user ADMIN_USER
    local admin_user_id=$(get_user_id "${ADMIN_USER[username]}")
    local admin_role_id=$(get_role_id "admin")
    assign_role "$admin_user_id" "$admin_role_id" "admin"
    
    # Create and setup regular user
    create_user REGULAR_USER
    local regular_user_id=$(get_user_id "${REGULAR_USER[username]}")
    local user_role_id=$(get_role_id "user")
    assign_role "$regular_user_id" "$user_role_id" "user"
    
    setup_role_mapper
    
    log_info "Initialization completed successfully!"
}

main