from rest_framework import serializers
from users.models import CustomUser
from django.contrib.auth.password_validation import validate_password
from users.utils import send_otp_email 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'role', 'email']  

class RegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    confirm_password = serializers.CharField(write_only=True, required=True)
    role = serializers.ChoiceField(choices=CustomUser.USER_ROLE_CHOICE, required=True)

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'role', 'password', 'confirm_password')

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        if attrs['role'] not in dict(CustomUser.USER_ROLE_CHOICE).keys():
            raise serializers.ValidationError({"role": "Invalid role selected."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove extra password field
        user = CustomUser.objects.create_user(**validated_data)
        user.is_active = False  # User cannot log in until email is verified
        user.save()

        send_otp_email(user)  # Send OTP after registration
        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)

class ResendOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()

class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()


class VerifyForgotOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    otp = serializers.CharField(max_length=6)


class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    new_password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True, min_length=8)


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
