import random
from django.core.mail import send_mail
import time
from django.core.cache import cache
from django.conf import settings

def generate_otp():
    """Generate a 6-digit OTP."""
    return str(random.randint(100000, 999999))

def store_otp(email, otp, timeout=300):
    """Store OTP in cache for a given timeout (default: 5 minutes)."""
    cache.set(f"otp_{email}", {"otp": otp, "timestamp": time.time()}, timeout=300)  # 5 minutes expiry

def get_stored_otp(email):
    """Retrieve stored OTP from cache."""
    return cache.get(f'otp_{email}')

def delete_otp(email):
    """Delete OTP from cache after verification."""
    cache.delete(f'otp_{email}')

def send_otp_email(email, otp, message, subject="Your OTP Code"):
    """Send OTP email to the user."""
    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [email],
        fail_silently=False,
    )
