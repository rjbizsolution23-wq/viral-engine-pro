"""
Billing & Subscription API Routes
Stripe checkout, subscriptions, webhooks
"""

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, EmailStr
from typing import Optional
from ..dependencies import get_current_user, rate_limit_per_minute
from ...services.stripe_integration import StripeService, UsageLimiter

router = APIRouter()
stripe_service = StripeService()
usage_limiter = UsageLimiter()


# Request Models

class CreateCheckoutRequest(BaseModel):
    price_id: str
    success_url: str
    cancel_url: str


class CreateSubscriptionRequest(BaseModel):
    price_id: str
    trial_days: Optional[int] = None


class UpdateSubscriptionRequest(BaseModel):
    new_price_id: str


class CancelSubscriptionRequest(BaseModel):
    at_period_end: bool = True


class CreatePromoCodeRequest(BaseModel):
    code: str
    discount_percent: int
    duration: str = "once"
    max_redemptions: Optional[int] = None


# Routes

@router.post("/checkout/session")
@rate_limit_per_minute(limit=10)
async def create_checkout_session(
    request: CreateCheckoutRequest,
    current_user = Depends(get_current_user)
):
    """
    Create Stripe Checkout session for subscription
    """
    try:
        # Ensure user has Stripe customer ID
        if not current_user.get("stripe_customer_id"):
            # Create Stripe customer
            customer = await stripe_service.create_customer(
                email=current_user["email"],
                name=current_user.get("full_name", ""),
                metadata={"user_id": current_user["id"]}
            )
            # TODO: Update user in database with customer_id
            customer_id = customer["customer_id"]
        else:
            customer_id = current_user["stripe_customer_id"]

        # Create checkout session
        session = await stripe_service.create_checkout_session(
            customer_id=customer_id,
            price_id=request.price_id,
            success_url=request.success_url,
            cancel_url=request.cancel_url,
            metadata={"user_id": current_user["id"]}
        )

        return {
            "success": True,
            "data": session
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/subscription/create")
@rate_limit_per_minute(limit=5)
async def create_subscription(
    request: CreateSubscriptionRequest,
    current_user = Depends(get_current_user)
):
    """
    Create subscription directly (requires payment method attached)
    """
    try:
        if not current_user.get("stripe_customer_id"):
            raise HTTPException(
                status_code=400, 
                detail="No payment method on file. Use checkout flow first."
            )

        subscription = await stripe_service.create_subscription(
            customer_id=current_user["stripe_customer_id"],
            price_id=request.price_id,
            trial_days=request.trial_days
        )

        # TODO: Update database with subscription details
        
        return {
            "success": True,
            "data": subscription
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/subscription")
async def get_subscription(current_user = Depends(get_current_user)):
    """
    Get current user's subscription details
    """
    try:
        if not current_user.get("stripe_subscription_id"):
            return {
                "success": True,
                "data": {
                    "tier": "free",
                    "status": "active",
                    "message": "No active subscription"
                }
            }

        subscription = await stripe_service.get_subscription(
            current_user["stripe_subscription_id"]
        )

        return {
            "success": True,
            "data": subscription
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.put("/subscription/update")
@rate_limit_per_minute(limit=5)
async def update_subscription(
    request: UpdateSubscriptionRequest,
    current_user = Depends(get_current_user)
):
    """
    Upgrade or downgrade subscription
    """
    try:
        if not current_user.get("stripe_subscription_id"):
            raise HTTPException(status_code=400, detail="No active subscription")

        updated = await stripe_service.update_subscription(
            subscription_id=current_user["stripe_subscription_id"],
            new_price_id=request.new_price_id
        )

        # TODO: Update database

        return {
            "success": True,
            "data": updated,
            "message": "Subscription updated successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/subscription/cancel")
@rate_limit_per_minute(limit=5)
async def cancel_subscription(
    request: CancelSubscriptionRequest,
    current_user = Depends(get_current_user)
):
    """
    Cancel subscription (immediately or at period end)
    """
    try:
        if not current_user.get("stripe_subscription_id"):
            raise HTTPException(status_code=400, detail="No active subscription")

        canceled = await stripe_service.cancel_subscription(
            subscription_id=current_user["stripe_subscription_id"],
            at_period_end=request.at_period_end
        )

        # TODO: Update database

        return {
            "success": True,
            "data": canceled,
            "message": f"Subscription {'will be canceled at period end' if request.at_period_end else 'canceled immediately'}"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/portal")
async def create_portal_session(
    return_url: str,
    current_user = Depends(get_current_user)
):
    """
    Create Stripe Customer Portal session for self-service
    """
    try:
        if not current_user.get("stripe_customer_id"):
            raise HTTPException(status_code=400, detail="No Stripe customer found")

        portal = await stripe_service.create_portal_session(
            customer_id=current_user["stripe_customer_id"],
            return_url=return_url
        )

        return {
            "success": True,
            "data": portal
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/usage")
async def get_usage(current_user = Depends(get_current_user)):
    """
    Get current usage stats for user's subscription tier
    """
    try:
        tier = current_user.get("subscription_tier", "free")
        
        # TODO: Query actual usage from database
        # Placeholder data
        usage_data = {
            "tier": tier,
            "videos_generated": 3,
            "videos_limit": 5 if tier == "free" else 100,
            "storage_used_mb": 1200,
            "storage_limit_mb": 2048 if tier == "free" else 51200,
            "current_period_start": "2025-12-01",
            "current_period_end": "2025-12-31"
        }

        return {
            "success": True,
            "data": usage_data
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/webhook")
async def stripe_webhook(request: Request):
    """
    Handle Stripe webhook events
    """
    try:
        payload = await request.body()
        sig_header = request.headers.get("stripe-signature")

        if not sig_header:
            raise HTTPException(status_code=400, detail="Missing signature")

        result = await stripe_service.handle_webhook(payload, sig_header)

        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# Admin Routes (require admin permission)

@router.post("/admin/promo-code", dependencies=[Depends(get_current_user)])
@rate_limit_per_minute(limit=5)
async def create_promo_code(
    request: CreatePromoCodeRequest,
    current_user = Depends(get_current_user)
):
    """
    Create promotional discount code (admin only)
    """
    # TODO: Check if user is admin
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")

    try:
        from ...services.stripe_integration import create_promo_code
        
        promo = await create_promo_code(
            code=request.code,
            discount_percent=request.discount_percent,
            duration=request.duration,
            max_redemptions=request.max_redemptions
        )

        return {
            "success": True,
            "data": promo,
            "message": f"Promo code '{request.code}' created successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.get("/admin/stats", dependencies=[Depends(get_current_user)])
async def get_billing_stats(current_user = Depends(get_current_user)):
    """
    Get billing stats (admin only)
    """
    if not current_user.get("is_admin"):
        raise HTTPException(status_code=403, detail="Admin access required")

    # TODO: Query database for real stats
    stats = {
        "total_subscribers": 247,
        "active_subscriptions": 189,
        "monthly_revenue": 15783,
        "churn_rate": 4.2,
        "tier_breakdown": {
            "free": 58,
            "pro": 142,
            "business": 39,
            "enterprise": 8
        }
    }

    return {
        "success": True,
        "data": stats
    }
