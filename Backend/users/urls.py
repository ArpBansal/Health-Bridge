from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from users import views

urlpatterns = [
    # Custom OTP-based Registration & Verification
    path('register/', views.RegistrationView.as_view(), name='register'),
    path('verify-otp/', views.VerifyOTPView.as_view(), name='verify-otp'),
    path('resend-otp/', views.ResendOTPView.as_view(), name='resend-otp'),
    
    # Login & JWT Token Handling
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', views.LogoutView.as_view(), name='logout'),  # Only if custom logic is needed
    path('user/', views.UserDetailView.as_view(), name='user-detail'),


    # Password Reset 
    path('forgot-password/', views.ForgotPasswordView.as_view(), name='forgot-password'),
    path('verify-forgot-otp/', views.VerifyForgotOTPView.as_view(), name='verify-forgot-otp'),
    path('reset-password/', views.ResetPasswordView.as_view(), name='reset-password'),

]   
