"""
Stripe Payment Integration for Viral Engine Pro
Handles subscriptions, one-time payments, webhooks
"""

import stripe
import os
from typing import Dict, Optional
from datetime import datetime, timedelta
from fastapi import HTTPException

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY", "sk_test_...")

# Subscription Price IDs (replace with your actual Stripe Price IDs)
STRIPE_PRICES = {
    "pro_monthly": "price_pro_monthly_xxx",
    "pro_annual": "price_pro_annual_xxx",
    "business_monthly": "price_business_monthly_xxx",
    "business_annual": "price_business_annual_xxx",
    "enterprise_monthly": "price_enterprise_monthly_xxx",
    "enterprise_annual": "price_enterprise_annual_xxx",
}

# Webhook Secret
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "whsec_...")


class StripeService:
    """Handle all Stripe payment operations"""

    @staticmethod
    async def create_customer(email: str, name: str, metadata: Dict = None) -> Dict:
        """Create a Stripe customer"""
        try:
            customer = stripe.Customer.create(
                email=email,
                name=name,
                metadata=metadata or {}
            )
            return {
                "customer_id": customer.id,
                "email": customer.email,
                "created": datetime.fromtimestamp(customer.created)
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def create_checkout_session(
        customer_id: str,
        price_id: str,
        success_url: str,
        cancel_url: str,
        metadata: Dict = None
    ) -> Dict:
        """Create a Stripe Checkout session for subscription"""
        try:
            session = stripe.checkout.Session.create(
                customer=customer_id,
                payment_method_types=["card"],
                line_items=[{
                    "price": price_id,
                    "quantity": 1,
                }],
                mode="subscription",
                success_url=success_url,
                cancel_url=cancel_url,
                metadata=metadata or {},
                allow_promotion_codes=True,
                billing_address_collection="required",
            )
            return {
                "session_id": session.id,
                "checkout_url": session.url,
                "status": session.status
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def create_subscription(
        customer_id: str,
        price_id: str,
        trial_days: Optional[int] = None
    ) -> Dict:
        """Create a subscription directly (without Checkout)"""
        try:
            subscription_params = {
                "customer": customer_id,
                "items": [{"price": price_id}],
                "payment_behavior": "default_incomplete",
                "expand": ["latest_invoice.payment_intent"],
            }
            
            if trial_days:
                subscription_params["trial_period_days"] = trial_days

            subscription = stripe.Subscription.create(**subscription_params)
            
            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end),
                "client_secret": subscription.latest_invoice.payment_intent.client_secret
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def cancel_subscription(subscription_id: str, at_period_end: bool = True) -> Dict:
        """Cancel a subscription"""
        try:
            if at_period_end:
                subscription = stripe.Subscription.modify(
                    subscription_id,
                    cancel_at_period_end=True
                )
            else:
                subscription = stripe.Subscription.delete(subscription_id)
            
            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "canceled_at": datetime.fromtimestamp(subscription.canceled_at) if subscription.canceled_at else None,
                "cancel_at_period_end": subscription.cancel_at_period_end
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def update_subscription(subscription_id: str, new_price_id: str) -> Dict:
        """Upgrade/downgrade subscription"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            
            updated_subscription = stripe.Subscription.modify(
                subscription_id,
                items=[{
                    "id": subscription["items"]["data"][0].id,
                    "price": new_price_id,
                }],
                proration_behavior="always_invoice",
            )
            
            return {
                "subscription_id": updated_subscription.id,
                "status": updated_subscription.status,
                "current_period_end": datetime.fromtimestamp(updated_subscription.current_period_end),
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def get_subscription(subscription_id: str) -> Dict:
        """Get subscription details"""
        try:
            subscription = stripe.Subscription.retrieve(subscription_id)
            return {
                "subscription_id": subscription.id,
                "status": subscription.status,
                "current_period_start": datetime.fromtimestamp(subscription.current_period_start),
                "current_period_end": datetime.fromtimestamp(subscription.current_period_end),
                "cancel_at_period_end": subscription.cancel_at_period_end,
                "plan": subscription.items.data[0].price.id
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def create_portal_session(customer_id: str, return_url: str) -> Dict:
        """Create Stripe Customer Portal session for managing subscriptions"""
        try:
            session = stripe.billing_portal.Session.create(
                customer=customer_id,
                return_url=return_url,
            )
            return {
                "portal_url": session.url
            }
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def handle_webhook(payload: bytes, sig_header: str) -> Dict:
        """Handle Stripe webhook events"""
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid payload")
        except stripe.error.SignatureVerificationError:
            raise HTTPException(status_code=400, detail="Invalid signature")

        event_type = event["type"]
        data = event["data"]["object"]

        # Handle different event types
        handlers = {
            "checkout.session.completed": handle_checkout_completed,
            "customer.subscription.created": handle_subscription_created,
            "customer.subscription.updated": handle_subscription_updated,
            "customer.subscription.deleted": handle_subscription_deleted,
            "invoice.payment_succeeded": handle_payment_succeeded,
            "invoice.payment_failed": handle_payment_failed,
        }

        handler = handlers.get(event_type)
        if handler:
            return await handler(data)
        
        return {"status": "unhandled_event", "type": event_type}


# Webhook Event Handlers

async def handle_checkout_completed(session: Dict) -> Dict:
    """Handle successful checkout"""
    customer_id = session.get("customer")
    subscription_id = session.get("subscription")
    
    # TODO: Update database with subscription info
    print(f"Checkout completed: customer={customer_id}, subscription={subscription_id}")
    
    return {
        "status": "success",
        "customer_id": customer_id,
        "subscription_id": subscription_id
    }


async def handle_subscription_created(subscription: Dict) -> Dict:
    """Handle new subscription"""
    customer_id = subscription.get("customer")
    subscription_id = subscription.get("id")
    status = subscription.get("status")
    
    # TODO: Update database
    print(f"Subscription created: {subscription_id} for customer {customer_id}")
    
    return {
        "status": "subscription_created",
        "subscription_id": subscription_id,
        "customer_id": customer_id
    }


async def handle_subscription_updated(subscription: Dict) -> Dict:
    """Handle subscription updates (upgrades/downgrades)"""
    subscription_id = subscription.get("id")
    status = subscription.get("status")
    
    # TODO: Update database with new plan details
    print(f"Subscription updated: {subscription_id}, status={status}")
    
    return {
        "status": "subscription_updated",
        "subscription_id": subscription_id
    }


async def handle_subscription_deleted(subscription: Dict) -> Dict:
    """Handle subscription cancellation"""
    subscription_id = subscription.get("id")
    customer_id = subscription.get("customer")
    
    # TODO: Revoke access in database
    print(f"Subscription canceled: {subscription_id}")
    
    return {
        "status": "subscription_canceled",
        "subscription_id": subscription_id
    }


async def handle_payment_succeeded(invoice: Dict) -> Dict:
    """Handle successful payment"""
    customer_id = invoice.get("customer")
    subscription_id = invoice.get("subscription")
    amount_paid = invoice.get("amount_paid")
    
    # TODO: Record payment in database
    print(f"Payment succeeded: ${amount_paid/100} for subscription {subscription_id}")
    
    return {
        "status": "payment_succeeded",
        "amount": amount_paid,
        "subscription_id": subscription_id
    }


async def handle_payment_failed(invoice: Dict) -> Dict:
    """Handle failed payment"""
    customer_id = invoice.get("customer")
    subscription_id = invoice.get("subscription")
    
    # TODO: Send notification email, suspend account
    print(f"Payment failed for subscription {subscription_id}")
    
    return {
        "status": "payment_failed",
        "subscription_id": subscription_id
    }


# Usage tracking and enforcement

class UsageLimiter:
    """Track and enforce subscription usage limits"""
    
    @staticmethod
    async def check_video_limit(user_id: str, subscription_tier: str) -> bool:
        """Check if user can generate more videos"""
        limits = {
            "free": 5,
            "pro": 100,
            "business": 500,
            "enterprise": -1  # unlimited
        }
        
        limit = limits.get(subscription_tier, 5)
        if limit == -1:
            return True
        
        # TODO: Query database for current month usage
        current_usage = 0  # placeholder
        
        return current_usage < limit
    
    @staticmethod
    async def check_storage_limit(user_id: str, subscription_tier: str, new_file_size_mb: float) -> bool:
        """Check if user has storage space"""
        limits = {
            "free": 2048,  # 2GB in MB
            "pro": 51200,  # 50GB
            "business": 204800,  # 200GB
            "enterprise": 1048576  # 1TB
        }
        
        limit = limits.get(subscription_tier, 2048)
        
        # TODO: Query database for current storage usage
        current_usage_mb = 0  # placeholder
        
        return (current_usage_mb + new_file_size_mb) < limit
    
    @staticmethod
    async def increment_usage(user_id: str, video_size_mb: float):
        """Increment user's video count and storage usage"""
        # TODO: Update database
        pass


# Promotion Codes

async def create_promo_code(
    code: str,
    discount_percent: int,
    duration: str = "once",
    max_redemptions: Optional[int] = None
) -> Dict:
    """Create a promotional discount code"""
    try:
        coupon = stripe.Coupon.create(
            percent_off=discount_percent,
            duration=duration,
            max_redemptions=max_redemptions
        )
        
        promo_code = stripe.PromotionCode.create(
            coupon=coupon.id,
            code=code,
        )
        
        return {
            "promo_code": promo_code.code,
            "discount": f"{discount_percent}%",
            "coupon_id": coupon.id
        }
    except stripe.error.StripeError as e:
        raise HTTPException(status_code=400, detail=str(e))
