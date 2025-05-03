import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import Header from "@/components/Header";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Stethoscope, FileText, Check, ChevronLeft, ChevronRight, Info, AlertTriangle, Heart, Brain, Shield } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// Import the review component
import HealthAssessmentReview from "@/pages/HealthAssessmentReview";

const HealthAssessment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, user, checkAuth } = useAuth();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [checkingFormStatus, setCheckingFormStatus] = useState(true);
  const [serverError, setServerError] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");
  const [formAlreadyExists, setFormAlreadyExists] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: 0,
    gender: "",
    state: "",
    contact_details: "",
    chronic_conditions: "",
    past_surgeries: "",
    allergies: "",
    medications: "",
    symptoms: "",
    symptom_severity: "",
    symptom_duration: "",
    mental_health_stress: false,
    mental_health_anxiety: false,
    mental_health_depression: false,
    vaccination_history: "",
    accessibility_needs: "",
    pregnancy_status: "Not Applicable",
    emergency_contact: {
      name: "",
      relationship: "",
      number: "",
    },
    health_insurance_provider: "",
    health_insurance_policy: "",
    preferred_language: "English",
    research_participation: false,
    email: "",
  });

  // Combine auth check and form check into a single useEffect to prevent cascading effects
  useEffect(() => {
    const initializeComponent = async () => {
      try {
        // First verify authentication
        const token = localStorage.getItem("accessToken");
        if (!token) {
          navigate("/login", { replace: true });
          return;
        }
        
        let isAuthValid = true;
        // Only call checkAuth if it's available
        if (typeof checkAuth === 'function') {
          isAuthValid = await checkAuth();
        }
        
        if (!isAuthValid) {
          navigate("/login", { replace: true });
          return;
        }
        
        setAuthChecked(true);
        
        // Now check if form exists for this user
        try {
          setCheckingFormStatus(true);
          setServerError(null);
          
          // Check if the user already has a submitted form
          const response = await axios.get("http://localhost:8000/healthcare/form/me/", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          
          if (response.data) {
            setFormAlreadyExists(true);
            toast({
              title: "Form Already Submitted",
              description: "You have already submitted a health assessment form.",
              duration: 3000,
            });
          }
        } catch (error) {
          // 404 means no form exists yet, which is fine
          if (axios.isAxiosError(error) && error.response?.status !== 404) {
            setServerError("Failed to check your form status. Please try again later.");
          }
        } finally {
          setCheckingFormStatus(false);
        }
      } catch (error) {
        console.error("Component initialization failed:", error);
        navigate("/login", { replace: true });
      }
    };

    initializeComponent();
    // This effect should only run once on component mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The rest of your code remains the same
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "age" ? Number(value) : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle checkbox changes
  const handleCheckboxChange = (name, checked) => {
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // Handle emergency contact changes
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      emergency_contact: {
        ...prev.emergency_contact,
        [name]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async () => {
    setIsLoading(true);
    setServerError(null);
    
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        navigate("/login", { replace: true });
        return;
      }
      
      // Create a new form
      const response = await axios.post(
        "http://127.0.0.1:8000/healthcare/form/submit/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );  

      const pdf = await axios.get(
        "http://127.0.0.1:8000/healthcare/generate-pdf/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      toast({
        title: "Form Submitted Successfully",
        description: "Your health assessment has been saved.",
        duration: 5000,
      });
      
      // Set form exists to true to show the review component
      setFormAlreadyExists(true);
    } catch (error) {
      console.error("Form submission error:", error);
      // Check for auth errors specifically
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast({
          title: "Authentication Error",
          description: "Your session has expired. Please log in again.",
          variant: "destructive",
          duration: 5000,
        });
        navigate("/login", { replace: true });
        return;
      }
      
      setServerError("Failed to submit the form. Please try again later.");
      toast({
        title: "Submission Failed",
        description: "There was an error submitting your health assessment.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (value) => {
    setActiveTab(value);
    switch (value) {
      case "personal":
        setCurrentStep(0);
        break;
      case "medical":
        setCurrentStep(1);
        break;
      case "mental":
        setCurrentStep(2);
        break;
      case "insurance":
        setCurrentStep(3);
        break;
      case "review":
        setCurrentStep(4);
        break;
    }
  };

  // Move to next step
  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
      // Update active tab
      const tabs = ["personal", "medical", "mental", "insurance", "review"];
      setActiveTab(tabs[currentStep + 1]);
    }
  };

  // Move to previous step
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Update active tab
      const tabs = ["personal", "medical", "mental", "insurance", "review"];
      setActiveTab(tabs[currentStep - 1]);
    }
  };

  // Progress indicator
  const renderProgressIndicator = () => {
    return (
      <div className="flex justify-center items-center space-x-2 mb-4">
        {[0, 1, 2, 3, 4].map((step) => (
          <div 
            key={step}
            className={`h-2 rounded-full transition-all duration-300 ${
              step === currentStep 
                ? "w-8 bg-[#9b87f5]" 
                : step < currentStep 
                  ? "w-4 bg-[#c4b6f8]" 
                  : "w-4 bg-gray-200"
            }`}
          />
        ))}
      </div>
    );
  };

  // Show loading state while auth check is in progress
  if (!authChecked) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-[#9b87f5]">Verifying your session...</div>
      </div>
    );
  }

  // If auth checked but not authenticated, this shouldn't be shown
  // as the useEffect would have redirected already, but as a failsafe:
  if (!isAuthenticated) {
    return null;
  }

  if (checkingFormStatus) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-pulse text-[#9b87f5]">Checking your form status...</div>
      </div>
    );
  }

  // If form already exists, render the HealthAssessmentReview component
  if (formAlreadyExists) {
    return <HealthAssessmentReview 
      formData={formData} 
      showSuccessMessage={true} // or false depending on your requirements
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <Header />
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Stethoscope className="h-10 w-10 text-[#9b87f5]" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A1F2C] mb-2">Health Assessment Form</h1>
          
          {serverError && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{serverError}</AlertDescription>
            </Alert>
          )}
          
          <p className="text-gray-600 mb-2">
            Please fill out this comprehensive health assessment form to help us better understand your health needs.
          </p>
          
          {renderProgressIndicator()}
        </div>

        <Card className="shadow-lg border-0">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid grid-cols-5 mb-8">
                <TabsTrigger value="personal" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  <span className="hidden sm:inline">Personal</span>
                </TabsTrigger>
                <TabsTrigger value="medical" className="flex items-center gap-2">
                  <Stethoscope className="h-4 w-4" />
                  <span className="hidden sm:inline">Medical</span>
                </TabsTrigger>
                <TabsTrigger value="mental" className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="hidden sm:inline">Mental</span>
                </TabsTrigger>
                <TabsTrigger value="insurance" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  <span className="hidden sm:inline">Insurance</span>
                </TabsTrigger>
                <TabsTrigger value="review" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Review</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Full Name <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="Enter your full name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Age <span className="text-red-500">*</span></label>
                    <Input
                      type="number"
                      placeholder="Enter your age"
                      name="age"
                      value={formData.age}
                      onChange={handleInputChange}
                      required
                      min="0"
                      max="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Gender <span className="text-red-500">*</span></label>
                    <Select name="gender" value={formData.gender} onValueChange={(value) => handleSelectChange("gender", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State <span className="text-red-500">*</span></label>
                    <Select name="state" value={formData.state} onValueChange={(value) => handleSelectChange("state", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[200px] overflow-y-auto">
                        {[
                          "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
                          "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
                          "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
                          "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", 
                          "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
                          "Dadra and Nagar Haveli and Daman and Diu", "Lakshadweep", "Delhi", "Puducherry", "Ladakh", "Jammu and Kashmir"
                        ].map((state) => (
                          <SelectItem key={state} value={state}>{state}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Details <span className="text-red-500">*</span></label>
                    <Input
                      placeholder="Enter your phone number"
                      name="contact_details"
                      value={formData.contact_details}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Preferred Language</label>
                    <Select name="preferred_language" value={formData.preferred_language} onValueChange={(value) => handleSelectChange("preferred_language", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="medical" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Chronic Conditions</label>
                    <Textarea
                      placeholder="List any chronic conditions (e.g., Diabetes, Hypertension)"
                      name="chronic_conditions"
                      value={formData.chronic_conditions || ""}
                      onChange={handleInputChange}
                      className="h-24"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Past Surgeries</label>
                    <Textarea
                      placeholder="List any past surgeries and their dates"
                      name="past_surgeries"
                      value={formData.past_surgeries || ""}
                      onChange={handleInputChange}
                      className="h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Allergies</label>
                    <Textarea
                      placeholder="List any allergies you have"
                      name="allergies"
                      value={formData.allergies || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Medications</label>
                    <Textarea
                      placeholder="List any medications you currently take"
                      name="medications"
                      value={formData.medications || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Symptoms</label>
                    <Textarea
                      placeholder="Describe any current symptoms"
                      name="symptoms"
                      value={formData.symptoms || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Symptom Severity</label>
                    <Select name="symptom_severity" value={formData.symptom_severity || ""} onValueChange={(value) => handleSelectChange("symptom_severity", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select severity" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Mild">Mild</SelectItem>
                        <SelectItem value="Moderate">Moderate</SelectItem>
                        <SelectItem value="Severe">Severe</SelectItem>
                        <SelectItem value="Critical">Critical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Symptom Duration</label>
                    <Select name="symptom_duration" value={formData.symptom_duration || ""} onValueChange={(value) => handleSelectChange("symptom_duration", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Less than a day">Less than a day</SelectItem>
                        <SelectItem value="1-3 days">1-3 days</SelectItem>
                        <SelectItem value="More than a week">More than a week</SelectItem>
                        <SelectItem value="Chronic">Chronic</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Vaccination History</label>
                    <Textarea
                      placeholder="List any vaccinations you've received"
                      name="vaccination_history"
                      value={formData.vaccination_history || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Pregnancy Status</label>
                    <Select name="pregnancy_status" value={formData.pregnancy_status} onValueChange={(value) => handleSelectChange("pregnancy_status", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Not Pregnant">Not Pregnant</SelectItem>
                        <SelectItem value="Pregnant">Pregnant</SelectItem>
                        <SelectItem value="Not Applicable">Not Applicable</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Accessibility Needs</label>
                    <Textarea
                      placeholder="List any accessibility accommodations you require"
                      name="accessibility_needs"
                      value={formData.accessibility_needs || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="mental" className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-[#1A1F2C]">Mental Health Assessment</h3>
                  <p className="text-gray-600 text-sm">Please indicate if you're experiencing any of the following:</p>
                  
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mental_health_stress"
                        checked={formData.mental_health_stress}
                        onCheckedChange={(checked) => handleCheckboxChange("mental_health_stress", checked as boolean)}
                      />
                      <label 
                        htmlFor="mental_health_stress" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Stress
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mental_health_anxiety"
                        checked={formData.mental_health_anxiety}
                        onCheckedChange={(checked) => handleCheckboxChange("mental_health_anxiety", checked as boolean)}
                      />
                      <label 
                        htmlFor="mental_health_anxiety" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Anxiety
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="mental_health_depression"
                        checked={formData.mental_health_depression}
                        onCheckedChange={(checked) => handleCheckboxChange("mental_health_depression", checked as boolean)}
                      />
                      <label 
                        htmlFor="mental_health_depression" 
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Depression
                      </label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="research_participation"
                      checked={formData.research_participation}
                      onCheckedChange={(checked) => handleCheckboxChange("research_participation", checked as boolean)}
                    />
                    <label 
                      htmlFor="research_participation" 
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      I consent to participate in research studies (optional)
                    </label>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="insurance" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Health Insurance Provider</label>
                    <Input
                      placeholder="Enter your insurance provider"
                      name="health_insurance_provider"
                      value={formData.health_insurance_provider || ""}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Policy Number</label>
                    <Input
                      placeholder="Enter your policy number"
                      name="health_insurance_policy"
                      value={formData.health_insurance_policy || ""}
                      onChange={handleInputChange}
                    />
                  </div>

                  <div className="col-span-2 space-y-3">
                    <h3 className="text-lg font-medium text-[#1A1F2C]">Emergency Contact</h3>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Contact Name</label>
                      <Input
                        placeholder="Enter emergency contact name"
                        name="name"
                        value={formData.emergency_contact?.name || ""}
                        onChange={handleEmergencyContactChange}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Relationship</label>
                        <Input
                          placeholder="Enter relationship"
                          name="relationship"
                          value={formData.emergency_contact?.relationship || ""}
                          onChange={handleEmergencyContactChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Contact Number</label>
                        <Input
                          placeholder="Enter emergency contact number"
                          name="number"
                          value={formData.emergency_contact?.number || ""}
                          onChange={handleEmergencyContactChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              // Modified Review Tab Content
            <TabsContent value="review" className="space-y-6">
              <div className="space-y-6">
                {/* Personal Information Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4 text-[#9b87f5]">
                    <Heart className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Personal Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-sm font-medium">{formData.name || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Age</p>
                      <p className="text-sm font-medium">{formData.age || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Gender</p>
                      <p className="text-sm font-medium">{formData.gender || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">State</p>
                      <p className="text-sm font-medium">{formData.state || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact Details</p>
                      <p className="text-sm font-medium">{formData.contact_details || "-"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Preferred Language</p>
                      <p className="text-sm font-medium">{formData.preferred_language || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Medical Information Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4 text-[#9b87f5]">
                    <Stethoscope className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Medical Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Chronic Conditions</p>
                      <p className="text-sm">{formData.chronic_conditions || "None reported"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Past Surgeries</p>
                      <p className="text-sm">{formData.past_surgeries || "None reported"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Allergies</p>
                      <p className="text-sm">{formData.allergies || "None reported"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Current Medications</p>
                      <p className="text-sm">{formData.medications || "None reported"}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Current Symptoms</p>
                        <p className="text-sm">{formData.symptoms || "None reported"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Symptom Severity</p>
                        <p className="text-sm">{formData.symptom_severity || "Not specified"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Symptom Duration</p>
                        <p className="text-sm">{formData.symptom_duration || "Not specified"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Vaccination History</p>
                        <p className="text-sm">{formData.vaccination_history || "None reported"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Pregnancy Status</p>
                        <p className="text-sm">{formData.pregnancy_status || "Not specified"}</p>
                      </div>

                      <div className="md:col-span-2">
                        <p className="text-sm font-medium text-gray-500">Accessibility Needs</p>
                        <p className="text-sm">{formData.accessibility_needs || "None reported"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mental Health Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4 text-[#9b87f5]">
                    <Brain className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Mental Health Information</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Reported Conditions</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {formData.mental_health_stress && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Stress</span>
                        )}
                        {formData.mental_health_anxiety && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Anxiety</span>
                        )}
                        {formData.mental_health_depression && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">Depression</span>
                        )}
                        {!formData.mental_health_stress && !formData.mental_health_anxiety && !formData.mental_health_depression && (
                          <span className="text-sm">None reported</span>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Research Participation Consent</p>
                      <p className="text-sm">{formData.research_participation ? "Consented" : "Not consented"}</p>
                    </div>
                  </div>
                </div>

                {/* Insurance & Emergency Contact Section */}
                <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                  <div className="flex items-center mb-4 text-[#9b87f5]">
                    <Shield className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Insurance & Emergency Contact</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Health Insurance Provider</p>
                      <p className="text-sm">{formData.health_insurance_provider || "Not provided"}</p>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-gray-500">Policy Number</p>
                      <p className="text-sm">
                        {formData.health_insurance_policy ? 
                          formData.health_insurance_policy.length > 4 ? 
                            "*".repeat(formData.health_insurance_policy.length - 4) + 
                            formData.health_insurance_policy.slice(-4) : 
                            formData.health_insurance_policy : 
                          "Not provided"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-semibold mb-3">Emergency Contact</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-sm">{formData.emergency_contact?.name || "Not provided"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Relationship</p>
                        <p className="text-sm">{formData.emergency_contact?.relationship || "Not provided"}</p>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500">Contact Number</p>
                        <p className="text-sm">{formData.emergency_contact?.number || "Not provided"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Consent Notice */}
                <div className="bg-[#f1f0fb] p-4 rounded-lg border border-[#e7e5f9] flex items-center gap-3">
                  <Info className="h-5 w-5 text-[#7E69AB] flex-shrink-0" />
                  <p className="text-sm text-[#1A1F2C]">
                    By submitting this form, you consent to the collection and processing of your health information 
                    as described in our privacy policy. Please review all information above carefully before submitting.
                  </p>
                </div>
              </div>

              <div className="flex justify-center space-x-4">
                <Button 
                  type="button"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-[#9b87f5] hover:bg-[#7E69AB] gap-2"
                >
                  <Check className="h-4 w-4" />
                  {isLoading ? "Submitting..." : "Submit Form"}
                </Button>
              </div>
            </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 0}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          
          <Button
            type="button"
            onClick={handleNext}
            disabled={currentStep === 4}
            className="bg-[#9b87f5] hover:bg-[#7E69AB] gap-1"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HealthAssessment;