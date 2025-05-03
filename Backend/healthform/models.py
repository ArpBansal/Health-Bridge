from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()

class GeneralHealthForm(models.Model):

    GENDER_CHOICES = [
        ('Male', 'Male'),
        ('Female', 'Female'),
        ('Other', 'Other'),
        ('Prefer not to say', 'Prefer Not to Say'),
    ]

    LANGUAGE_CHOICES = [
        ('English', 'English'),
        ('Hindi', 'Hindi'),
        ('Other', 'Other'),
    ]

    SYMPTOM_SEVERITY_CHOICES = [
        ('Mild', 'Mild'),
        ('Moderate', 'Moderate'),
        ('Severe', 'Severe'),
        ('Critical', 'Critical'),
    ]

    SYMPTOM_DURATION_CHOICES = [
        ('Less than a day', 'Less than a day'),
        ('1-3 days', '1-3 days'),
        ('More than a week', 'More than a week'),
        ('Chronic', 'Chronic'),
    ]

    PREGNANCY_STATUS_CHOICES = [
        ('Not Pregnant', 'Not Pregnant'),
        ('Pregnant', 'Pregnant'),
        ('Not Applicable', 'Not Applicable'),
    ]

    STATE_CHOICES = [
        ('Andhra Pradesh', 'Andhra Pradesh'),
        ('Arunachal Pradesh', 'Arunachal Pradesh'),
        ('Assam', 'Assam'),
        ('Bihar', 'Bihar'),
        ('Chhattisgarh', 'Chhattisgarh'),
        ('Goa', 'Goa'),
        ('Gujarat', 'Gujarat'),
        ('Haryana', 'Haryana'),
        ('Himachal Pradesh', 'Himachal Pradesh'),
        ('Jharkhand', 'Jharkhand'),
        ('Karnataka', 'Karnataka'),
        ('Kerala', 'Kerala'),
        ('Madhya Pradesh', 'Madhya Pradesh'),
        ('Maharashtra', 'Maharashtra'),
        ('Manipur', 'Manipur'),
        ('Meghalaya', 'Meghalaya'),
        ('Mizoram', 'Mizoram'),
        ('Nagaland', 'Nagaland'),
        ('Odisha', 'Odisha'),
        ('Punjab', 'Punjab'),
        ('Rajasthan', 'Rajasthan'),
        ('Sikkim', 'Sikkim'),
        ('Tamil Nadu', 'Tamil Nadu'),
        ('Telangana', 'Telangana'),
        ('Tripura', 'Tripura'),
        ('Uttar Pradesh', 'Uttar Pradesh'),
        ('Uttarakhand', 'Uttarakhand'),
        ('West Bengal', 'West Bengal'),
        ('Andaman and Nicobar Islands', 'Andaman and Nicobar Islands'),
        ('Chandigarh', 'Chandigarh'),
        ('Dadra and Nagar Haveli and Daman and Diu', 'Dadra and Nagar Haveli and Daman and Diu'),
        ('Lakshadweep', 'Lakshadweep'),
        ('Delhi', 'Delhi'),
        ('Puducherry', 'Puducherry'),
        ('Ladakh', 'Ladakh'),
        ('Jammu and Kashmir', 'Jammu and Kashmir'),
    ]

    id = models.UUIDField(editable=False, primary_key=True, default=uuid.uuid4)
    user = models.OneToOneField(User, on_delete=models.CASCADE)  
    name = models.CharField(max_length=100)  
    age = models.PositiveIntegerField()  
    gender = models.CharField(max_length=20, choices=GENDER_CHOICES)  
    state = models.CharField(max_length=50, choices=STATE_CHOICES)
    contact_details = models.CharField(max_length=15)  

    chronic_conditions = models.TextField(blank=True, null=True)  
    past_surgeries = models.TextField(blank=True, null=True)  
    allergies = models.TextField(blank=True, null=True)  
    medications = models.TextField(blank=True, null=True)  

    symptoms = models.TextField(blank=True, null=True)  
    symptom_severity = models.CharField(max_length=20, choices=SYMPTOM_SEVERITY_CHOICES, blank=True, null=True)  
    symptom_duration = models.CharField(max_length=20, choices=SYMPTOM_DURATION_CHOICES, blank=True, null=True)  

    mental_health_stress = models.BooleanField(default=False)  
    mental_health_anxiety = models.BooleanField(default=False)  
    mental_health_depression = models.BooleanField(default=False)  

    vaccination_history = models.TextField(blank=True, null=True)  
    accessibility_needs = models.TextField(blank=True, null=True)  

    pregnancy_status = models.CharField(max_length=20, choices=PREGNANCY_STATUS_CHOICES, default='Not Applicable')

    emergency_contact = models.JSONField(default=dict)

    health_insurance_provider = models.CharField(max_length=100, blank=True, null=True)  
    health_insurance_policy = models.CharField(max_length=100, blank=True, null=True)  

    preferred_language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES, blank=True, null=True)  
    research_participation = models.BooleanField(default=False)  

    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):  
        return f"{self.name}'s Health Form"
    
    """
        Mandatory form fields -
        1. name
        2. age
        3. gender
        4. contact_detailss
        6. mental_health_stress
        7. mental_health_anxiety
        8. mental_health_depression
        9. pregnancy_status
        10. emergency_contact
    """

