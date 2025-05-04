from django.shortcuts import HttpResponse
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import GeneralHealthForm
from .serializers import GeneralHealthFormSerializer
from django.http import Http404
from django.http import HttpResponse
from healthform.utils import send_email, generate_gemini_response, generate_health_prompt
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from datetime import datetime
import re


# Create and submit a new form
class GeneralHealthFormCreateView(generics.CreateAPIView):
    serializer_class = GeneralHealthFormSerializer
    permission_classes = [permissions.IsAuthenticated]  # Only logged-in users

    def perform_create(self, serializer):
        try:
            serializer.save(user=self.request.user)  # Assign form to the logged-in user
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

# List all forms submitted by the authenticated user
class GeneralHealthFormListView(generics.ListAPIView):
    serializer_class = GeneralHealthFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        try:
            return GeneralHealthForm.objects.filter(user=self.request.user)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Retrieve a specific form
class GeneralHealthFormDetailView(APIView):
    serializer_class = GeneralHealthFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        try:
            form = GeneralHealthForm.objects.get(user=request.user)  # Get form for logged-in user
            serializer = GeneralHealthFormSerializer(form)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except GeneralHealthForm.DoesNotExist:
            return Response({"error": "Form not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Update a specific form
class GeneralHealthFormUpdateView(generics.UpdateAPIView):
    serializer_class = GeneralHealthFormSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        try:
            form = GeneralHealthForm.objects.filter(user=self.request.user).last()
            if not form:
                raise GeneralHealthForm.DoesNotExist  # Raise the correct exception
            return form
        except GeneralHealthForm.DoesNotExist:
            # Instead of returning Response, we raise a proper Django exception
            raise Http404("No form found to update")
        except Exception as e:
            # Handle unexpected errors properly
            from rest_framework.exceptions import APIException
            raise APIException(f"Unexpected error: {str(e)}")
        
        
class GenerateHealthSummaryView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        
        # Retrieve the user's health data
        try:
            data = GeneralHealthForm.objects.get(user=user)
        except GeneralHealthForm.DoesNotExist:
            return HttpResponse("No health data found.", status=404)
        
        # Create PDF response
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'inline; filename="healthbridge_summary.pdf"'
        
        # Create document template with custom page settings
        doc = SimpleDocTemplate(
            response,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=72
        )
        
        # Container for elements to be added to the PDF
        elements = []
        
        # Define styles
        styles = getSampleStyleSheet()
        
        # Title style for main headings
        styles.add(ParagraphStyle(
            name='BridgeTitle', 
            parent=styles['Title'],
            fontSize=24,
            textColor=colors.darkblue,
            spaceAfter=12
        ))
        
        # Section heading style
        styles.add(ParagraphStyle(
            name='BridgeHeading', 
            parent=styles['Heading1'],
            fontSize=16,
            textColor=colors.darkblue,
            borderWidth=1,
            borderColor=colors.lightgrey,
            borderPadding=8,
            borderRadius=5,
            spaceAfter=12,
            spaceBefore=6
        ))
        
        # Style for general text
        styles.add(ParagraphStyle(
            name='BridgeNormal', 
            parent=styles['Normal'],
            fontSize=10,
            leading=14,
            spaceBefore=2,
            spaceAfter=6
        ))
        
        # Style for disclaimer text
        styles.add(ParagraphStyle(
            name='BridgeDisclaimer',
            parent=styles['Normal'],
            fontSize=9,
            textColor=colors.darkgrey,
            leading=12,
            alignment=TA_CENTER,
            spaceBefore=6,
            spaceAfter=6
        ))
        
        # Assign styles to variables
        title_style = styles['BridgeTitle']
        heading_style = styles['BridgeHeading']
        normal_style = styles['BridgeNormal']
        disclaimer_style = styles['BridgeDisclaimer']
        
        # Create a header with gradient background
        def add_header(canvas, doc):
            canvas.saveState()
            
            from reportlab.lib.colors import HexColor

            canvas.setFillColor(HexColor("#4A90E2"))  # Use any hex color you like
            canvas.rect(36, letter[1]-108, letter[0]-72, 72, fill=True, stroke=False)

            # Add HealthBridge logo/text
            canvas.setFillColorRGB(1, 1, 1)  # White text
            canvas.setFont('Helvetica-Bold', 24)
            canvas.drawString(72, letter[1]-70, "HealthBridge™ Summary")
            
            # Add date
            canvas.setFont('Helvetica', 12)
            current_date = datetime.now().strftime("%B %d, %Y")
            canvas.drawString(72, letter[1]-90, f"Generated on: {current_date}")
            
            # Add page number
            canvas.setFont('Helvetica', 9)
            page_num = canvas.getPageNumber()
            text = f"Page {page_num}"
            canvas.drawRightString(letter[0] - 72, 40, text)
            
            # Add footer with HealthBridge branding
            canvas.setFillColorRGB(0.1, 0.4, 0.7)
            canvas.line(72, 30, letter[0] - 72, 30)
            canvas.setFont('Helvetica', 8)
            canvas.drawString(72, 20, "HealthBridge — Your Health, Our Priority")
            
            canvas.restoreState()
        
        # Add space at the top
        elements.append(Spacer(1, 60))
        
        # Personal Information Section
        elements.append(Paragraph("Personal Information", heading_style))
        
        # Define personal info items with clean layout
        personal_info = [
            ['Name', data.name or 'Not provided'],
            ['Age', str(data.age) if data.age else 'Not provided'],
            ['Gender', data.gender or 'Not provided'],
            ['State', data.state or 'Not provided'],
            ['Contact Details', data.contact_details or 'Not provided'],
            ['Preferred Language', data.preferred_language or 'Not provided'],
        ]
        
        # Create personal info table with improved styling
        personal_table = Table(personal_info, colWidths=[150, 300])
        personal_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightblue),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.darkblue),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(personal_table)
        elements.append(Spacer(1, 20))
        
        # Medical History Section
        elements.append(Paragraph("Medical History", heading_style))
        
        # Define medical history items
        medical_history = [
            ['Chronic Conditions', data.chronic_conditions or 'None reported'],
            ['Past Surgeries', data.past_surgeries or 'None reported'],
            ['Allergies', data.allergies or 'None reported'],
            ['Medications', data.medications or 'None reported'],
            ['Vaccination History', data.vaccination_history or 'None reported'],
        ]
        
        # Create medical history table
        medical_table = Table(medical_history, colWidths=[150, 300])
        medical_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgreen),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.darkgreen),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(medical_table)
        elements.append(Spacer(1, 20))
        
        # Current Symptoms Section
        elements.append(Paragraph("Current Symptoms", heading_style))
        
        # Define symptoms items
        symptoms_data = [
            ['Symptoms', data.symptoms or 'None reported'],
            ['Symptom Severity', data.symptom_severity or 'N/A'],
            ['Symptom Duration', data.symptom_duration or 'N/A'],
        ]
        
        # Create symptoms table
        symptoms_table = Table(symptoms_data, colWidths=[150, 300])
        symptoms_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.mistyrose),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.darkred),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(symptoms_table)
        elements.append(Spacer(1, 20))
        
        # Mental Health Section
        elements.append(Paragraph("Mental Health", heading_style))
        
        # Define mental health items
        mental_health_data = [
            ['Stress', 'Yes' if data.mental_health_stress else 'No'],
            ['Anxiety', 'Yes' if data.mental_health_anxiety else 'No'],
            ['Depression', 'Yes' if data.mental_health_depression else 'No'],
        ]
        
        # Create mental health table
        mental_health_table = Table(mental_health_data, colWidths=[150, 300])
        mental_health_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lavender),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.purple),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(mental_health_table)
        elements.append(Spacer(1, 20))
        
        # Additional Information Section
        elements.append(Paragraph("Additional Information", heading_style))
        
        # Define additional info items
        additional_info = [
            ['Accessibility Needs', data.accessibility_needs or 'None reported'],
            ['Pregnancy Status', data.pregnancy_status or 'Not applicable'],
            ['Research Participation', 'Yes' if data.research_participation else 'No'],
        ]
        
        # Create additional info table
        additional_table = Table(additional_info, colWidths=[150, 300])
        additional_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightyellow),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.brown),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(additional_table)
        elements.append(Spacer(1, 20))
        
        # Insurance Information Section
        elements.append(Paragraph("Insurance Information", heading_style))
        
        # Define insurance info items
        insurance_info = [
            ['Health Insurance Provider', data.health_insurance_provider or 'Not provided'],
            ['Health Insurance Policy', data.health_insurance_policy or 'Not provided'],
        ]
        
        # Create insurance info table
        insurance_table = Table(insurance_info, colWidths=[150, 300])
        insurance_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightcyan),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.teal),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(insurance_table)
        elements.append(Spacer(1, 20))
        
        # Emergency Contact Section
        elements.append(Paragraph("Emergency Contact", heading_style))
        
        # Check if emergency contact data exists and handle it properly
        emergency_contact = {}
        if hasattr(data, 'emergency_contact'):
            if isinstance(data.emergency_contact, dict):
                emergency_contact = data.emergency_contact
            elif isinstance(data.emergency_contact, str):
                try:
                    # Try to parse JSON if it's stored as a string
                    import json
                    emergency_contact = json.loads(data.emergency_contact)
                except:
                    pass
        
        # Define emergency contact items
        emergency_data = [
            ['Name', emergency_contact.get('name', 'Not provided')],
            ['Relationship', emergency_contact.get('relationship', 'Not provided')],
            ['Number', emergency_contact.get('number', 'Not provided')],
        ]
        
        # Create emergency contact table
        emergency_table = Table(emergency_data, colWidths=[150, 300])
        emergency_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightpink),
            ('TEXTCOLOR', (0, 0), (0, -1), colors.darkred),
            ('ALIGN', (0, 0), (0, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('BACKGROUND', (1, 0), (1, -1), colors.white),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.lightgrey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('PADDING', (0, 0), (-1, -1), 8),
            ('ROWBACKGROUNDS', (0, 0), (-1, -1), [colors.whitesmoke, colors.white]),
        ]))
        elements.append(emergency_table)
        elements.append(Spacer(1, 20))
        
        # Add a disclaimer
        disclaimer_text = """DISCLAIMER: This health summary contains your self-reported information. Please review for accuracy and share with your healthcare provider as needed."""
        elements.append(Paragraph(disclaimer_text, disclaimer_style))
        
        # Build the PDF with consistent header and footer
        doc.build(elements, onFirstPage=add_header)
        
        # Send the email with the PDF as an attachment
        try:
            send_email(user.email, response.getvalue())
            return HttpResponse("Your HealthBridge summary has been sent successfully to your email!", status=200)
        except Exception as e:
            return HttpResponse(f"An error occurred while sending your summary: {str(e)}", status=500)