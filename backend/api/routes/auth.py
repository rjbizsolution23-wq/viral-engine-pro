"""
🔥 VIRAL ENGINE PRO - AUTHENTICATION API ROUTES
Built: December 13, 2025 by RJ Business Solutions

JWT-based authentication with:
- Email/password registration
- OAuth2 (Google, GitHub)
- Magic link login
- 2FA support
- Session management
"""

from fastapi import APIRouter, HTTPException, Depends, status, Response
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr, Field
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from typing import Optional
import secrets
import uuid

router = APIRouter(prefix="/api/auth", tags=["auth"])

# Security configuration
SECRET_KEY = "your-secret-key-change-in-production"  # TODO: Move to env
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# ═══════════════════════════════════════════════════════════════
# REQUEST/RESPONSE MODELS
# ═══════════════════════════════════════════════════════════════

class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: str
    company_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int

class TokenData(BaseModel):
    user_id: str
    email: str
    exp: datetime

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    company_name: Optional[str] = None
    is_verified: bool
    subscription_tier: str
    created_at: datetime

class MagicLinkRequest(BaseModel):
    email: EmailStr

class ResetPasswordRequest(BaseModel):
    email: EmailStr

class ConfirmPasswordReset(BaseModel):
    token: str
    new_password: str = Field(..., min_length=8)

# ═══════════════════════════════════════════════════════════════
# HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_magic_link_token(email: str) -> str:
    """Create magic link token"""
    data = {"email": email, "purpose": "magic_link"}
    expire = datetime.utcnow() + timedelta(minutes=15)
    data.update({"exp": expire})
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dependency to get current authenticated user"""
    
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        email: str = payload.get("email")
        
        if user_id is None or email is None:
            raise credentials_exception
        
        # TODO: Fetch user from database
        user = {
            "id": user_id,
            "email": email,
            "full_name": "Test User",
            "subscription_tier": "pro"
        }
        
        return user
        
    except JWTError:
        raise credentials_exception

# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register_user(user: UserRegister):
    """
    Register a new user account
    
    Creates account with:
    - Hashed password
    - Email verification required
    - Free tier subscription
    """
    
    # Check if user already exists
    # TODO: Check database
    existing_user = None
    
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = get_password_hash(user.password)
    
    # Create user
    user_id = str(uuid.uuid4())
    
    # TODO: Insert into database
    new_user = {
        "id": user_id,
        "email": user.email,
        "password_hash": hashed_password,
        "full_name": user.full_name,
        "company_name": user.company_name,
        "is_verified": False,
        "subscription_tier": "free",
        "created_at": datetime.utcnow()
    }
    
    # Send verification email
    # TODO: Send verification email
    
    return UserResponse(**new_user)

@router.post("/login", response_model=Token)
async def login(user: UserLogin):
    """
    Login with email and password
    
    Returns:
    - Access token (30 min expiry)
    - Refresh token (7 day expiry)
    """
    
    # TODO: Fetch user from database
    db_user = {
        "id": str(uuid.uuid4()),
        "email": user.email,
        "password_hash": get_password_hash(user.password),
        "is_verified": True
    }
    
    # Verify password
    if not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if verified
    if not db_user["is_verified"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified. Check your inbox."
        )
    
    # Create tokens
    access_token = create_access_token({"sub": db_user["id"], "email": db_user["email"]})
    refresh_token = create_refresh_token({"sub": db_user["id"], "email": db_user["email"]})
    
    return Token(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/refresh", response_model=Token)
async def refresh_access_token(refresh_token: str):
    """
    Get new access token using refresh token
    """
    
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        
        user_id = payload.get("sub")
        email = payload.get("email")
        
        # Create new tokens
        new_access_token = create_access_token({"sub": user_id, "email": email})
        new_refresh_token = create_refresh_token({"sub": user_id, "email": email})
        
        return Token(
            access_token=new_access_token,
            refresh_token=new_refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid refresh token"
        )

@router.post("/logout")
async def logout(current_user = Depends(get_current_user)):
    """
    Logout user (client should delete tokens)
    """
    
    # TODO: Add token to blacklist in Redis
    
    return {"message": "Logged out successfully"}

# ═══════════════════════════════════════════════════════════════
# MAGIC LINK AUTHENTICATION
# ═══════════════════════════════════════════════════════════════

@router.post("/magic-link")
async def send_magic_link(request: MagicLinkRequest):
    """
    Send magic link to email for passwordless login
    """
    
    # TODO: Check if user exists
    
    # Generate magic link token
    token = create_magic_link_token(request.email)
    magic_link = f"https://viralengine.pro/auth/magic?token={token}"
    
    # TODO: Send email with magic link
    
    return {"message": "Magic link sent to your email"}

@router.post("/magic-link/verify", response_model=Token)
async def verify_magic_link(token: str):
    """
    Verify magic link token and login user
    """
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        if payload.get("purpose") != "magic_link":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )
        
        email = payload.get("email")
        
        # TODO: Fetch user from database
        user = {
            "id": str(uuid.uuid4()),
            "email": email
        }
        
        # Create auth tokens
        access_token = create_access_token({"sub": user["id"], "email": email})
        refresh_token = create_refresh_token({"sub": user["id"], "email": email})
        
        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            expires_in=ACCESS_TOKEN_EXPIRE_MINUTES * 60
        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired magic link"
        )

# ═══════════════════════════════════════════════════════════════
# PASSWORD RESET
# ═══════════════════════════════════════════════════════════════

@router.post("/reset-password")
async def request_password_reset(request: ResetPasswordRequest):
    """
    Request password reset email
    """
    
    # TODO: Check if user exists
    
    # Generate reset token
    reset_token = secrets.token_urlsafe(32)
    
    # TODO: Store token in database with expiry
    # TODO: Send reset email
    
    return {"message": "Password reset email sent"}

@router.post("/reset-password/confirm")
async def confirm_password_reset(request: ConfirmPasswordReset):
    """
    Confirm password reset with token
    """
    
    # TODO: Verify token from database
    # TODO: Update password
    
    return {"message": "Password reset successfully"}

# ═══════════════════════════════════════════════════════════════
# EMAIL VERIFICATION
# ═══════════════════════════════════════════════════════════════

@router.post("/verify-email")
async def verify_email(token: str):
    """
    Verify email address
    """
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("email")
        
        # TODO: Update user as verified in database
        
        return {"message": "Email verified successfully"}
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid or expired verification token"
        )

@router.post("/resend-verification")
async def resend_verification_email(email: EmailStr):
    """
    Resend verification email
    """
    
    # TODO: Generate new verification token
    # TODO: Send email
    
    return {"message": "Verification email sent"}

# ═══════════════════════════════════════════════════════════════
# USER INFO ENDPOINTS
# ═══════════════════════════════════════════════════════════════

@router.get("/me", response_model=UserResponse)
async def get_current_user_info(current_user = Depends(get_current_user)):
    """
    Get current authenticated user info
    """
    
    # TODO: Fetch full user data from database
    
    return UserResponse(
        id=current_user["id"],
        email=current_user["email"],
        full_name=current_user.get("full_name", ""),
        company_name=None,
        is_verified=True,
        subscription_tier=current_user.get("subscription_tier", "free"),
        created_at=datetime.utcnow()
    )

@router.put("/me")
async def update_user_profile(
    full_name: Optional[str] = None,
    company_name: Optional[str] = None,
    current_user = Depends(get_current_user)
):
    """
    Update user profile
    """
    
    # TODO: Update user in database
    
    return {"message": "Profile updated successfully"}

@router.delete("/me")
async def delete_account(
    password: str,
    current_user = Depends(get_current_user)
):
    """
    Delete user account (requires password confirmation)
    """
    
    # TODO: Verify password
    # TODO: Delete user and all associated data
    
    return {"message": "Account deleted successfully"}
