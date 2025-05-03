import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Brain, FileText, Heart, Phone, Shield, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

interface FormData {
  name: string;
  email: string;
  age: number;
  gender: string;
  state: string;
  contact_details: string;
  chronic_conditions: string;
  past_surgeries: string;
  allergies: string;
  medications: string;
  symptoms: string;
  symptom_severity: string;
  symptom_duration: string;
  mental_health_stress: boolean;
  mental_health_anxiety: boolean;
  mental_health_depression: boolean;
  vaccination_history: string;
  accessibility_needs: string;
  pregnancy_status: string;
  health_insurance_provider: string;
  health_insurance_policy: string;
  preferred_language: string;
  research_participation: boolean;
  emergency_contact: {
    name: string;
    relationship: string;
    number: string;
  };
}

interface HealthAssessmentReviewProps {
  formData?: FormData; // Make this optional since we'll fetch data if not provided
  showSuccessMessage: boolean;
}

const HealthAssessmentReview = ({ formData: initialFormData, showSuccessMessage }: HealthAssessmentReviewProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData | null>(initialFormData || null);
  const [isLoading, setIsLoading] = useState(!initialFormData);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If formData is already provided, don't fetch again
    if (initialFormData) {
      return;
    }

    const fetchFormData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }

        // Fetch the user's form data
        const response = await axios.get("http://localhost:8000/healthcare/form/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data) {
          setFormData(response.data);
        } else {
          setError("No form data found.");
        }
      } catch (error) {
        console.error("Failed to fetch form data:", error);
        setError("Failed to load your health assessment. Please try again later.");
        
        // Check if unauthorized
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          navigate("/login", { replace: true });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchFormData();
  }, [navigate, initialFormData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center items-center">
        <div className="animate-pulse text-blue-600">Loading your health assessment...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
        <Header />
        <div className="container mx-auto max-w-4xl text-center mt-10">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
            <p className="text-red-700">{error}</p>
            <Button 
              onClick={() => navigate("/")}
              className="mt-4"
            >
              Return to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-10 px-4">
        <Header />
        <div className="container mx-auto max-w-4xl text-center mt-10">
          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-md">
            <p className="text-yellow-700">No health assessment data found. Please complete the assessment form.</p>
            <Button 
              onClick={() => navigate("/health-assessment")}
              className="mt-4"
            >
              Complete Assessment
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
    <Header /> {/* Always on top */}

    <div className="py-4 sm:py-10 px-2 sm:px-4">
      <div className="container mx-auto max-w-4xl">
        {showSuccessMessage && (
          <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Health Assessment Completed</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Your health assessment has been successfully submitted and a detailed report has been sent to your verified email address.</p>
                  <p className="mt-1">You can review your assessment details below. For any updates or changes, please contact our support team.</p>
                </div>
              </div>
            </div>
          </div>
        )}
        <Card className="shadow-lg border-blue-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-xl sm:text-2xl font-bold text-blue-800 flex items-center gap-2">
              <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
              Your Health Assessment
            </CardTitle>
            <CardDescription className="space-y-2 mt-2 sm:mt-4">
              <div className="text-gray-600 text-xs sm:text-sm">
                Your submitted health assessment
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-4 sm:mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Your Health Assessment
              </h3>
              
              {/* Personal Information Review */}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Full Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.name}</p>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Email</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.email}</p>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Age</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.age}</p>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Gender</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.gender}</p>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">State</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.state}</p>
                  </div>
                  
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Contact Details</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.contact_details}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information Review */}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Medical Information
                </h4>
                <div className="space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Chronic Conditions</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.chronic_conditions || 'None'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Past Surgeries</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.past_surgeries || 'None'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Allergies</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.allergies || 'None'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Current Medications</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.medications || 'None'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Symptoms</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.symptoms || 'None'}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-500">Symptom Severity</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{formData.symptom_severity || 'Not specified'}</p>
                    </div>
                    <div className="space-y-1 sm:space-y-2">
                      <p className="text-xs sm:text-sm text-gray-500">Symptom Duration</p>
                      <p className="text-sm sm:text-base font-medium text-gray-900">{formData.symptom_duration || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mental Health Review */}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  Mental Health
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={formData.mental_health_stress} disabled />
                    <Label className="text-sm sm:text-base text-gray-900">Stress</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={formData.mental_health_anxiety} disabled />
                    <Label className="text-sm sm:text-base text-gray-900">Anxiety</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox checked={formData.mental_health_depression} disabled />
                    <Label className="text-sm sm:text-base text-gray-900">Depression</Label>
                  </div>
                </div>
              </div>

              {/* Insurance Information Review */}
              <div className="mb-6 sm:mb-8">
                <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Insurance Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Insurance Provider</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.health_insurance_provider || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Policy Number</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.health_insurance_policy || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Emergency Contact Review */}
              <div>
                <h4 className="text-base sm:text-lg font-medium text-gray-700 mb-3 sm:mb-4 flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Name</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.emergency_contact?.name || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Relationship</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.emergency_contact?.relationship || 'Not provided'}</p>
                  </div>
                  <div className="space-y-1 sm:space-y-2">
                    <p className="text-xs sm:text-sm text-gray-500">Phone Number</p>
                    <p className="text-sm sm:text-base font-medium text-gray-900">{formData.emergency_contact?.number || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-center mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
                className="hover:bg-blue-50 hover:text-blue-600 text-xs sm:text-sm"
              >
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
};

export default HealthAssessmentReview;