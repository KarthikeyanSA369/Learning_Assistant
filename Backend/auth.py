from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db import get_db
import bcrypt
import jwt
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()
JWT_SECRET = os.getenv("JWT_SECRET", "secret")

class User(BaseModel):
    username: str
    password: str

class SignupRequest(BaseModel):
    username: str
    password: str
    confirm_password: str

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

def verify_password(password: str, hashed: str) -> bool:
    return bcrypt.checkpw(password.encode(), hashed.encode())

def create_jwt(user_id: int, username: str) -> str:
    return jwt.encode(
        {"user_id": user_id, "username": username},
        JWT_SECRET,
        algorithm="HS256"
    )

@router.post("/signup")
def signup(user: SignupRequest):
    # Validate passwords match
    if user.password != user.confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    
    # Validate password not empty
    if not user.password or len(user.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters long")
    
    db = get_db()
    cur = db.cursor()

    try:
        hashed_pw = hash_password(user.password)
        cur.execute(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (user.username, hashed_pw)
        )
        db.commit()
        user_id = cur.lastrowid
        
        token = create_jwt(user_id, user.username)
        return {"success": True, "user_id": user_id, "token": token, "username": user.username}
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username already exists")
    finally:
        cur.close()
        db.close()

@router.post("/login")
def login(user: User):
    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute(
        "SELECT id, username, password FROM users WHERE username=%s",
        (user.username,)
    )

    result = cur.fetchone()

    if result and verify_password(user.password, result["password"]):
        token = create_jwt(result["id"], result["username"])
        cur.close()
        db.close()
        return {"success": True, "user_id": result["id"], "token": token, "username": result["username"]}
    else:
        cur.close()
        db.close()
        raise HTTPException(status_code=401, detail="Invalid credentials")
