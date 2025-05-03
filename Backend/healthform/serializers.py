from rest_framework import serializers
from .models import GeneralHealthForm

class EmergencyContactSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255)
    relationship = serializers.CharField(max_length=100)
    number = serializers.CharField(max_length=15)

class GeneralHealthFormSerializer(serializers.ModelSerializer):
    user = serializers.CharField(read_only=True)
    email = serializers.SerializerMethodField()
    emergency_contact = EmergencyContactSerializer()  # Use nested serializer

    class Meta:
        model = GeneralHealthForm
        fields = [
            "id",
            "user",
            "email",
            "name",
            "age",
            "gender",
            "state",
            "contact_details",
            "chronic_conditions",
            "past_surgeries",
            "allergies",
            "medications",
            "symptoms",
            "symptom_severity",
            "symptom_duration",
            "mental_health_stress",
            "mental_health_anxiety",
            "mental_health_depression",
            "vaccination_history",
            "accessibility_needs",
            "pregnancy_status",
            "health_insurance_provider",
            "health_insurance_policy",
            "preferred_language",
            "research_participation",
            "emergency_contact",  # Move this field near the end
            "created_at",
            "updated_at",
        ]

        read_only_fields = ['user', 'created_at', 'updated_at']

    def get_email(self, obj) -> str:
        return obj.user.email if obj.user else ""

    def validate_health_insurance_policy(self, value):
        """Mask or encrypt health insurance policy for security"""
        return f"****{value[-4:]}" if value else value  # Masking example (only show last 4 digits)


