from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI()

# In-memory database (dictionary)
# Predefined users with username, password, and superuser status
users_db = {
    "test": {"password": "pass", "superuser": False},
    "admin": {"password": "pass", "superuser": True},
    "user1": {"password": "pass", "superuser": False},
    "user2": {"password": "pass", "superuser": False},
}

# Define Pydantic models for incoming request data
class UserRequest(BaseModel):
    username: str
    password: str

class SuperuserRequest(BaseModel):
    username: str

class ACLRequest(BaseModel):
    username: str
    topic: str
    acc: int  # 1: subscribe, 2: publish, 3: read/write


@app.post("/auth/user")
async def post_user(request: UserRequest):
    """
    - Called by mosquitto-go-auth to authenticate a username/password.
    - Expects: POST /auth/user with JSON payload {"username": "...", "password": "..."}.
    - Return JSON with `{"allow": true}` if authenticated, otherwise 401.
    """
    user = users_db.get(request.username)
    if user and user["password"] == request.password:
        return {"allow": True}
    raise HTTPException(status_code=401, detail="Invalid credentials")


@app.post("/auth/superuser")
async def post_superuser(request: SuperuserRequest):
    """
    - Called by mosquitto-go-auth to check if a user is superuser.
    - Expects: POST /auth/superuser with JSON payload {"username": "..."}.
    - Return JSON with `{"allow": true}` if user is a superuser, otherwise 401.
    """
    user = users_db.get(request.username)
    if user and user["superuser"]:
        return {"allow": True}
    raise HTTPException(status_code=401, detail="Superuser access denied")


@app.post("/auth/acl")
async def post_acl(request: ACLRequest):
    """
    - Called by mosquitto-go-auth to check ACL (access control list).
    - Expects: POST /auth/acl with JSON payload {"username": "...", "topic": "...", "acc": ...}.
    - Return JSON with `{"allow": true}` if authorized, otherwise 401.
    """
    user = users_db.get(request.username)
    if user:
        # Restrict "test" or "user1" from publishing to the "admin" topic
        if request.topic.startswith("admin") and request.acc == 2:  # 2 = publish
            raise HTTPException(status_code=401, detail="Unauthorized to publish to admin topics")
        # Allow all other cases
        return {"allow": True}
    raise HTTPException(status_code=401, detail="Unauthorized access")
