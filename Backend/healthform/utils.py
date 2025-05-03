from django.core.mail import send_mail
from django.core.mail import EmailMessage
from django.conf import settings
import google.generativeai as genai

genai.configure(api_key=settings.GEMINI_API_KEY)


def send_email(email, pdf_content, subject="Health Summary PDF"):
    """Send email with the generated Health Summary PDF attached."""
    message = f"This is your Health Summary PDF, which was auto-generated from the details you filled. You can download the PDF and view it."

    # Create an email message
    email_message = EmailMessage(
        subject=subject,
        body=message,
        from_email=settings.EMAIL_HOST_USER,
        to=[email]
    )

    # Attach the PDF
    email_message.attach('health_summary.pdf', pdf_content, 'application/pdf')

    # Send the email
    email_message.send(fail_silently=False)




def generate_health_prompt(data):
    prompt = f"""
    Based on the following health data, provide a summary and some personalized health tips.

    Name: {data.name}
    Age: {data.age}
    Gender: {data.gender}
    Chronic Conditions: {data.chronic_conditions}
    Past Surgeries: {data.past_surgeries}
    Allergies: {data.allergies}
    Medications: {data.medications}
    Symptoms: {data.symptoms}
    Symptom Severity: {data.symptom_severity}
    Mental Health - Stress: {data.mental_health_stress}
    Mental Health - Anxiety: {data.mental_health_anxiety}
    Mental Health - Depression: {data.mental_health_depression}
    Accessibility Needs: {data.accessibility_needs}
    Pregnancy Status: {data.pregnancy_status}

    Please provide a compassionate and easy-to-understand summary of their current health along with 3 general suggestions.
     - Don't use Markdown format.
    """
    return prompt


def generate_gemini_response(prompt):
    model = genai.GenerativeModel("gemini-1.5-flash")
    response = model.generate_content(prompt, stream=False)
    return response.text