"""
🔥 VIRAL ENGINE PRO - API DEPENDENCIES
Built: December 13, 2025 by RJ Business Solutions

Reusable dependencies for:
- Authentication
- Rate limiting
- Database sessions
- Permission checks
"""

from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional, Dict
import time

# OAuth2 scheme
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

# JWT configuration
SECRET_KEY = "your-secret-key-change-in-production"
ALGORITHM = "HS256"

# Rate limiting storage (in-memory, use Redis in production)
rate_limit_storage: Dict[str, list] = {}

# ═══════════════════════════════════════════════════════════════
# AUTHENTICATION DEPENDENCIES
# ═══════════════════════════════════════════════════════════════

async def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    Dependency to get current authenticated user from JWT token
    """
    
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
            "subscription_tier": "pro",
            "is_verified": True
        }
        
        return user
        
    except JWTError:
        raise credentials_exception

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """
    Ensure user is active and verified
    """
    
    if not current_user.get("is_verified"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Email not verified"
        )
    
    # Check if account is suspended
    if current_user.get("is_suspended"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account suspended"
        )
    
    return current_user

async def get_current_pro_user(current_user: dict = Depends(get_current_active_user)) -> dict:
    """
    Ensure user has Pro subscription or higher
    """
    
    allowed_tiers = ["pro", "business", "enterprise"]
    
    if current_user.get("subscription_tier") not in allowed_tiers:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Pro subscription required"
        )
    
    return current_user

async def get_current_business_user(current_user: dict = Depends(get_current_active_user)) -> dict:
    """
    Ensure user has Business subscription or higher
    """
    
    allowed_tiers = ["business", "enterprise"]
    
    if current_user.get("subscription_tier") not in allowed_tiers:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Business subscription required"
        )
    
    return current_user

# ═══════════════════════════════════════════════════════════════
# RATE LIMITING
# ═══════════════════════════════════════════════════════════════

class RateLimiter:
    """
    Rate limiter decorator for API endpoints
    """
    
    def __init__(self, limit: int, window: int):
        """
        Args:
            limit: Maximum number of requests
            window: Time window in seconds
        """
        self.limit = limit
        self.window = window
    
    async def __call__(self, request: Request, current_user: dict = Depends(get_current_user)):
        """
        Check rate limit for user
        """
        
        user_id = current_user["id"]
        key = f"{user_id}:{request.url.path}"
        
        now = time.time()
        
        # Initialize if not exists
        if key not in rate_limit_storage:
            rate_limit_storage[key] = []
        
        # Remove old requests outside window
        rate_limit_storage[key] = [
            timestamp for timestamp in rate_limit_storage[key]
            if now - timestamp < self.window
        ]
        
        # Check if limit exceeded
        if len(rate_limit_storage[key]) >= self.limit:
            retry_after = int(self.window - (now - rate_limit_storage[key][0]))
            
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Rate limit exceeded. Try again in {retry_after} seconds.",
                headers={"Retry-After": str(retry_after)}
            )
        
        # Add current request
        rate_limit_storage[key].append(now)
        
        return True

def rate_limit(limit: int, window: int):
    """
    Rate limiter factory
    
    Usage:
        @router.get("/endpoint")
        @rate_limit(limit=10, window=60)
        async def endpoint():
            ...
    """
    return RateLimiter(limit=limit, window=window)

# ═══════════════════════════════════════════════════════════════
# DATABASE DEPENDENCIES
# ═══════════════════════════════════════════════════════════════

async def get_db():
    """
    Get database session
    """
    # TODO: Implement database session management
    db = None
    try:
        yield db
    finally:
        if db:
            await db.close()

# ═══════════════════════════════════════════════════════════════
# PERMISSION CHECKS
# ═══════════════════════════════════════════════════════════════

def require_permission(permission: str):
    """
    Decorator to require specific permission
    
    Usage:
        @require_permission("videos.create")
        async def create_video():
            ...
    """
    
    async def permission_checker(current_user: dict = Depends(get_current_user)):
        # TODO: Check user permissions from database
        user_permissions = current_user.get("permissions", [])
        
        if permission not in user_permissions and "admin" not in user_permissions:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission '{permission}' required"
            )
        
        return current_user
    
    return permission_checker

# ═══════════════════════════════════════════════════════════════
# SUBSCRIPTION TIER CHECKS
# ═══════════════════════════════════════════════════════════════

def check_feature_access(feature: str):
    """
    Check if user's subscription tier has access to feature
    
    Features:
    - batch_generation: Pro+
    - auto_posting: Pro+
    - white_label: Business+
    - api_access: Pro+
    - 4k_export: Business+
    """
    
    feature_requirements = {
        "batch_generation": ["pro", "business", "enterprise"],
        "auto_posting": ["pro", "business", "enterprise"],
        "white_label": ["business", "enterprise"],
        "api_access": ["pro", "business", "enterprise"],
        "4k_export": ["business", "enterprise"],
        "unlimited_exports": ["enterprise"],
        "priority_support": ["business", "enterprise"],
        "custom_branding": ["enterprise"]
    }
    
    async def feature_checker(current_user: dict = Depends(get_current_active_user)):
        required_tiers = feature_requirements.get(feature, ["free"])
        user_tier = current_user.get("subscription_tier", "free")
        
        if user_tier not in required_tiers:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Feature '{feature}' requires {required_tiers[0]} subscription or higher"
            )
        
        return current_user
    
    return feature_checker

# ═══════════════════════════════════════════════════════════════
# USAGE LIMIT CHECKS
# ═══════════════════════════════════════════════════════════════

async def check_video_generation_limit(current_user: dict = Depends(get_current_active_user)):
    """
    Check if user has remaining video generation quota
    """
    
    # Usage limits by tier
    limits = {
        "free": 5,          # 5 videos/month
        "pro": 100,         # 100 videos/month
        "business": 500,    # 500 videos/month
        "enterprise": -1    # Unlimited
    }
    
    tier = current_user.get("subscription_tier", "free")
    limit = limits.get(tier, 5)
    
    if limit == -1:  # Unlimited
        return current_user
    
    # TODO: Check actual usage from database
    current_usage = 0
    
    if current_usage >= limit:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=f"Video generation limit reached ({limit}/month). Upgrade to generate more."
        )
    
    return current_user

async def check_storage_limit(file_size: int, current_user: dict = Depends(get_current_active_user)):
    """
    Check if user has enough storage space
    """
    
    # Storage limits by tier (in GB)
    storage_limits = {
        "free": 1,
        "pro": 50,
        "business": 500,
        "enterprise": -1  # Unlimited
    }
    
    tier = current_user.get("subscription_tier", "free")
    limit_gb = storage_limits.get(tier, 1)
    
    if limit_gb == -1:  # Unlimited
        return current_user
    
    # TODO: Check actual storage usage from database
    current_usage_bytes = 0
    limit_bytes = limit_gb * 1024 * 1024 * 1024
    
    if current_usage_bytes + file_size > limit_bytes:
        raise HTTPException(
            status_code=status.HTTP_507_INSUFFICIENT_STORAGE,
            detail=f"Storage limit reached ({limit_gb}GB). Delete old files or upgrade."
        )
    
    return current_user

# ═══════════════════════════════════════════════════════════════
# API KEY AUTHENTICATION (for programmatic access)
# ═══════════════════════════════════════════════════════════════

async def verify_api_key(api_key: str) -> dict:
    """
    Verify API key for programmatic access
    """
    
    # TODO: Verify API key from database
    
    if not api_key or not api_key.startswith("vep_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid API key"
        )
    
    # Return associated user
    return {
        "id": "api_user_id",
        "email": "api@example.com",
        "subscription_tier": "pro"
    }
