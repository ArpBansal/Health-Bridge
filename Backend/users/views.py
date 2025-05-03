from rest_framework import status, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import generics
from users.models import CustomUser
from users.serializers import (
    RegistrationSerializer,
    VerifyOTPSerializer,
    ResendOTPSerializer,
    LogoutSerializer,
    ForgotPasswordSerializer,
    VerifyForgotOTPSerializer,
    ResetPasswordSerializer,
    UserSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from users.utils import (
    generate_otp,
    store_otp,
    get_stored_otp,
    delete_otp,
    send_otp_email,
)
import time
import textwrap
from django.core.cache import cache
from django.contrib.auth.hashers import make_password




class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


class RegistrationView(APIView):
    permission_classes = [permissions.AllowAny]
    serializer_classes = RegistrationSerializer

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']

            if CustomUser.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)

            if CustomUser.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

            # Generate and store OTP
            otp = generate_otp()
            store_otp(email, otp)

            message = textwrap.dedent(f"""\
                Dear User,

                Thank you for registering with HealthBridge. To complete your registration process, please verify your email address by using the following One-Time Password (OTP):

                OTP: {otp}

                This OTP is valid for the next 5 minutes. If you did not initiate this registration, please disregard this email.

                Best regards,
                HealthBridge Support Team
                """)

            send_otp_email(email, otp, message, subject="Email Verification OTP")

            # Create the user but keep them inactive
            user = CustomUser.objects.create(
                username=serializer.validated_data['username'],
                email=email,
                password=make_password(serializer.validated_data['password']),
                is_active=False  # User remains inactive until OTP verification
            )

            return Response({"message": "OTP sent to your email. Verify to activate your account."}, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(APIView):
    serializer_class = VerifyOTPSerializer

    def post(self, request):
        email = request.data.get("email")
        otp_entered = request.data.get("otp")
        otp_data = get_stored_otp(email)

        if not otp_data:
            return Response({"error": "OTP expired or invalid. Please request a new one."}, status=status.HTTP_400_BAD_REQUEST)

        otp_stored = otp_data["otp"]
        if otp_stored == otp_entered:
            try:
                user = CustomUser.objects.get(email=email, is_active=False)
                user.is_active = True
                user.save()

                delete_otp(email)

                return Response({"message": "Email verified! Your account is now active.", "success": True}, status=status.HTTP_200_OK)

            except CustomUser.DoesNotExist:
                return Response({"error": "User not found or already active."}, status=status.HTTP_404_NOT_FOUND)

        return Response({"error": "Invalid OTP."}, status=status.HTTP_400_BAD_REQUEST)


class ResendOTPView(APIView):
    serializer_class = ResendOTPSerializer

    def post(self, request):
        email = request.data.get("email")

        try:
            user = CustomUser.objects.get(email=email, is_active=False)

            otp_data = cache.get(f"otp_{email}")
            if otp_data:
                last_otp_time = otp_data["timestamp"]
                current_time = time.time()
                if current_time - last_otp_time < 90:
                    remaining_time = 90 - (current_time - last_otp_time)
                    return Response(
                        {"error": f"Please wait {int(remaining_time)} seconds before requesting a new OTP."},
                        status=status.HTTP_429_TOO_MANY_REQUESTS
                    )

            # Generate and store new OTP
            otp = generate_otp()
            store_otp(email, otp)

            message = textwrap.dedent(f"""\
                Dear User,

                We received a request to resend the One-Time Password (OTP) for verifying your email address with HealthBridge. Please use the following OTP to complete your verification process:

                OTP: {otp}

                This OTP is valid for the next 5 minutes. If you did not request this, please disregard this email.

                Best regards,
                HealthBridge Support Team
                """)

            send_otp_email(email, otp, message, subject="Resend OTP for Email Verification")

            return Response({"message": "New OTP sent to your email."}, status=status.HTTP_200_OK)

        except CustomUser.DoesNotExist:
            return Response({"error": "User not found or already verified."}, status=status.HTTP_404_NOT_FOUND)


class LogoutView(APIView):
    serializer_class = LogoutSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data['refresh']
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({'message': "Successfully Logged Out !"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({'message': "Invalid Token"}, status=status.HTTP_400_BAD_REQUEST)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ForgotPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            try:
                user = CustomUser.objects.get(email=email, is_active=True)
                otp = generate_otp()
                store_otp(email, otp)
                message = textwrap.dedent(f"""\
                    Dear User,

                    We received a request to reset your password for your HealthBridge account.
                    Please use the following One-Time Password (OTP) to verify your identity:

                    OTP: {otp}

                    This OTP is valid for the next 5 minutes. If you did not request a password reset, please disregard this email.

                    Best regards,
                    HealthBridge Support Team
                    """)

                send_otp_email(email, otp, message, subject="Reset Password OTP")
                return Response({'message': 'OTP sent to your email.'}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found or inactive.'}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class VerifyForgotOTPView(APIView):
    permission_permissions = [permissions.AllowAny]

    def post(self, request):
        serializer = VerifyForgotOTPSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            otp = serializer.validated_data['otp']
            otp_data = get_stored_otp(email)

            if not otp_data or otp_data['otp'] != otp:
                return Response({'error': 'Invalid or expired OTP.'}, status=status.HTTP_400_BAD_REQUEST)

            # Mark the email as verified for reset
            cache.set(f"reset_verified_{email}", True, timeout=900)  # valid for 15 mins
            return Response({'message': 'OTP verified. You can now reset your password.'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ResetPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ResetPasswordSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            new_password = serializer.validated_data['new_password']
            confirm_password = serializer.validated_data['confirm_password']

            if new_password != confirm_password:
                return Response({'error': 'Passwords do not match.'}, status=status.HTTP_400_BAD_REQUEST)

            if not cache.get(f"reset_verified_{email}"):
                return Response({'error': 'OTP verification required before resetting password.'}, status=status.HTTP_403_FORBIDDEN)

            try:
                user = CustomUser.objects.get(email=email, is_active=True)
                user.set_password(new_password)
                user.save()
                delete_otp(email)
                cache.delete(f"reset_verified_{email}")
                return Response({'message': 'Password reset successfully.'}, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({'error': 'User not found.'}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
