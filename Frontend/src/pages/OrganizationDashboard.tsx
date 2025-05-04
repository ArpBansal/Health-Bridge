import { useState, useCallback, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Server,
  Laptop,
  ArrowRight,
  ArrowLeft,
  Microscope,
  Brain,
  Activity,
  Clock,
  Database,
  Cpu,
  LineChart,
  Loader2
} from "lucide-react";
import { motion } from "framer-motion";

// Constants
const QUICK_STATS = [
  { icon: Activity, label: "Active Models", value: "3", trend: "+1" },
  { icon: Clock, label: "Training Time", value: "24h", trend: "-2h" },
  { icon: Database, label: "Data Size", value: "1.2TB", trend: "+0.3TB" },
  { icon: Cpu, label: "Performance", value: "92%", trend: "+2%" }
] as const;

const MODEL_TYPES = [
  { value: "cnn", label: "Convolutional Neural Network" },
  { value: "rnn", label: "Recurrent Neural Network" },
  { value: "transformer", label: "Transformer" }
] as const;

const TRAINING_DURATIONS = [
  { value: "1", label: "1 Week" },
  { value: "2", label: "2 Weeks" },
  { value: "4", label: "4 Weeks" }
] as const;

const CANCER_TYPES = [
  { id: "breast", label: "Breast Cancer" },
  { id: "lung", label: "Lung Cancer" },
  { id: "skin", label: "Skin Cancer" },
  { id: "prostate", label: "Prostate Cancer" }
] as const;

const API_ENDPOINT = "https://health-bridge-mtzy.onrender.com/diagnosing/diagnose-image/";

const OrganizationDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTraining, setSelectedTraining] = useState<"server" | "local" | null>(null);
  const [showTrainingDialog, setShowTrainingDialog] = useState(true);
  const [showCancerModal, setShowCancerModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [serverStatus, setServerStatus] = useState<"checking" | "online" | "offline">("checking");

  // Add health check function
  const checkServerHealth = useCallback(async () => {
    try {
      const response = await fetch("https://health-bridge-mtzy.onrender.com/");
      if (response.ok) {
        setServerStatus("online");
      } else {
        setServerStatus("offline");
      }
    } catch (error) {
      console.error("Server health check failed:", error);
      setServerStatus("offline");
    }
  }, []);

  useEffect(() => {
    checkServerHealth();
  }, [checkServerHealth]);

  const handleTrainingSelect = useCallback((type: "server" | "local") => {
    setSelectedTraining(type);
    setShowTrainingDialog(false);
    if (type === "server") {
      navigate("/server-training");
    } else {
      setShowCancerModal(true);
    }
  }, [navigate]);

  const TrainingSelection = useMemo(() => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select Training Mode</h2>
        <p className="text-gray-600">Choose how you want to train your organization's AI model</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all duration-200"
            onClick={() => handleTrainingSelect("server")}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Server className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Server Training</h3>
                <p className="text-gray-600">Train your model on our cloud servers</p>
                <div className="flex items-center gap-2 text-blue-500">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Card 
            className="cursor-pointer hover:border-blue-500 transition-all duration-200"
            onClick={() => handleTrainingSelect("local")}
          >
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-4 bg-blue-50 rounded-full">
                  <Laptop className="h-8 w-8 text-blue-500" />
                </div>
                <h3 className="text-xl font-semibold">Local Training</h3>
                <p className="text-gray-600">Train your model on your local infrastructure</p>
                <div className="flex items-center gap-2 text-blue-500">
                  <span>Learn more</span>
                  <ArrowRight className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  ), [handleTrainingSelect]);

  const CancerTrainingModal = useMemo(() => (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setShowTrainingDialog(true)} 
              className="text-gray-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Training Selection
            </Button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cancer Training Configuration</h1>
              <p className="text-gray-600">Configure your AI model for cancer detection and analysis</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-blue-50 rounded-t-xl">
                    <CardTitle className="text-blue-600">Model Configuration</CardTitle>
                    <CardDescription>Set up your model's core parameters</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-700">Model Type</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select model type" />
                          </SelectTrigger>
                          <SelectContent>
                            {MODEL_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-700">Training Duration</label>
                        <Select>
                          <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {TRAINING_DURATIONS.map((duration) => (
                              <SelectItem key={duration.value} value={duration.value}>
                                {duration.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-blue-50 rounded-t-xl">
                    <CardTitle className="text-blue-600">Cancer Types</CardTitle>
                    <CardDescription>Select the types of cancer to train on</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 gap-4">
                      {CANCER_TYPES.map((cancer) => (
                        <div key={cancer.id} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                          <Checkbox id={cancer.id} />
                          <label htmlFor={cancer.id} className="text-sm font-medium">{cancer.label}</label>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader className="bg-blue-50 rounded-t-xl">
                    <CardTitle className="text-blue-600">Performance Targets</CardTitle>
                    <CardDescription>Set your desired performance metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-6">
                    <div className="space-y-4">
                      {["Target Accuracy", "Sensitivity", "Specificity"].map((metric) => (
                        <div key={metric}>
                          <label className="text-sm font-medium text-gray-700">{metric}</label>
                          <div className="relative mt-1">
                            <Input 
                              type="number" 
                              placeholder={`e.g., ${metric === "Target Accuracy" ? "95" : "90"}`}
                              className="pr-12"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-end space-x-4 mt-6">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTrainingDialog(true)}
                    className="hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    Start Training
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ), []);

  const handleFileUpload = useCallback(async (e: Event) => {
    const target = e.target as HTMLInputElement;
    const files = target.files;
    
    if (files && files.length > 0) {
      // Show confirmation dialog
      const confirmUpload = window.confirm(`You have selected ${files.length} image(s). Proceed with upload?`);
      
      if (confirmUpload) {
        setIsUploading(true);
        setUploadError("");
        
        try {
          // Check server status before proceeding
          if (serverStatus === "offline") {
            throw new Error("Server is currently offline. Please try again later.");
          }

          // Create FormData for each file and send request
          const file = files[0]; // Process first file for simplicity
          const formData = new FormData();
          formData.append('image', file);
          
          console.log("Sending request to:", API_ENDPOINT);
          console.log("File type:", file.type);
          console.log("File size:", file.size);
          console.log("Server status:", serverStatus);
          
          const response = await fetch(API_ENDPOINT, {
            method: 'POST',
            body: formData,
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          });
          
          console.log("Response status:", response.status);
          console.log("Response headers:", Object.fromEntries(response.headers.entries()));
          
          // Check if response is ok and has content
          if (!response.ok) {
            let errorMessage = `Server error: ${response.status}`;
            
            // Only try to parse JSON if there's content
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              try {
                const text = await response.text();
                if (text && text.trim()) {
                  const errorData = JSON.parse(text);
                  errorMessage = errorData.error || errorMessage;
                }
              } catch (parseError) {
                console.error("Error parsing error response:", parseError);
              }
            }
            
            throw new Error(errorMessage);
          }
          
          // First check if there's any content
          const text = await response.text();
          if (!text || !text.trim()) {
            throw new Error("Server returned empty response");
          }
          
          // Then parse as JSON
          const result = JSON.parse(text);
          console.log("Result:", result);
          
          if (result && result.message) {
            setDiagnosisResult({
              status: "success",
              message: result.message
            });
            setShowResultModal(true);
          } else if (result && result.error) {
            throw new Error(result.error);
          } else {
            throw new Error("Invalid response format from server");
          }
        } catch (error) {
          console.error('Upload error:', error);
          setUploadError(error instanceof Error ? error.message : 'An unknown error occurred');
        } finally {
          setIsUploading(false);
        }
      }
    }
  }, [serverStatus]);

  const handleImageUploadClick = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.jpg,.jpeg,.png,.webp,.tiff,.tif';
    input.multiple = true;
    input.addEventListener('change', handleFileUpload);
    input.click();
  }, [handleFileUpload]);

  const ResultModal = useMemo(() => {
    if (!diagnosisResult) return null;
    
    // Handle various possible result formats
    const renderResultContent = () => {
      if (typeof diagnosisResult === 'object') {
        if (diagnosisResult.status === "success") {
          return (
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">Status:</span>
                <span className="font-medium text-green-500">Success</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Message:</span>
                <span className="font-medium">{diagnosisResult.message}</span>
              </div>
            </div>
          );
        }
        return (
          <div className="space-y-2">
            {Object.entries(diagnosisResult).map(([key, value]) => (
              <div key={key} className="flex justify-between">
                <span className="text-gray-700">{key}:</span>
                <span className="font-medium">
                  {typeof value === 'number' 
                    ? `${(value as number * 100).toFixed(2)}%` 
                    : value as string}
                </span>
              </div>
            ))}
          </div>
        );
      } else if (typeof diagnosisResult === 'string') {
        return <p className="text-gray-700">{diagnosisResult}</p>;
      } else {
        return <p className="text-gray-700">Received diagnosis result in unknown format</p>;
      }
    };
    
    return (
      <Dialog open={showResultModal} onOpenChange={setShowResultModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Diagnosis Results</DialogTitle>
            <DialogDescription>
              Analysis results from the cancer detection model
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium text-lg mb-2">Detection Results</h3>
              {renderResultContent()}
            </div>
            <div className="flex justify-end">
              <Button 
                className="bg-blue-500 hover:bg-blue-600 text-white"
                onClick={() => setShowResultModal(false)}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [diagnosisResult, showResultModal]);

  const ErrorModal = useMemo(() => {
    if (!uploadError) return null;
    
    return (
      <Dialog open={!!uploadError} onOpenChange={() => setUploadError("")}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-red-500">Upload Error</DialogTitle>
            <DialogDescription>
              There was a problem processing your image
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-gray-700">{uploadError}</p>
          </div>
          <div className="flex justify-end mt-4">
            <Button 
              className="bg-red-500 hover:bg-red-600 text-white"
              onClick={() => setUploadError("")}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }, [uploadError]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showCancerModal ? (
        CancerTrainingModal
      ) : (
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {!showTrainingDialog && (
              <div className="space-y-8">
                <div className="text-center">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Organization Dashboard</h1>
                  <p className="text-gray-600">Welcome back, {user?.username || "Organization Admin"}</p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {QUICK_STATS.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="hover:shadow-md transition-all duration-300">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-50 rounded-full">
                              <stat.icon className="h-5 w-5 text-blue-500" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                              <div className="flex items-center gap-2">
                                <p className="text-lg font-semibold text-gray-900">{stat.value}</p>
                                <span className="text-xs text-green-500">{stat.trend}</span>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Training Section */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-gray-900">AI Model Training</h2>
                        <p className="text-gray-600">Configure and manage your AI training sessions</p>
                      </div>
                      <Button 
                        className="bg-blue-500 hover:bg-blue-600"
                        onClick={() => setShowTrainingDialog(true)}
                      >
                        Start Training
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Available Diagnosing Models */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Available Diagnosing Models</h2>
                        <p className="text-sm text-gray-600">Select a model to analyze medical images</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <button
                          className="w-full aspect-[3/2] bg-gradient-to-br from-blue-500 to-blue-400 hover:from-blue-600 hover:to-blue-500 border-2 border-blue-300 rounded-lg transition-all duration-200 flex flex-col items-center justify-center p-4 text-center space-y-3 group shadow-md hover:shadow-lg"
                          onClick={handleImageUploadClick}
                          disabled={isUploading}
                        >
                          {isUploading ? (
                            <>
                              <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-200">
                                <Loader2 className="h-6 w-6 text-white animate-spin" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-lg font-medium text-white">Processing...</h3>
                                <p className="text-base text-white/90">Please wait</p>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="p-3 bg-white/20 rounded-full group-hover:bg-white/30 transition-colors duration-200">
                                <Microscope className="h-6 w-6 text-white" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-lg font-medium text-white">Cancer Detection</h3>
                                <p className="text-base text-white/90">Analyze medical images</p>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="hover:shadow-md transition-all duration-300">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>Latest training sessions and updates</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <LineChart className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">Model accuracy improved to 94%</p>
                          <p className="text-sm text-gray-500">2 hours ago</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="p-2 bg-blue-50 rounded-full">
                          <Database className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="font-medium">New training dataset uploaded</p>
                          <p className="text-sm text-gray-500">5 hours ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {showTrainingDialog && (
              <Dialog open={showTrainingDialog} onOpenChange={setShowTrainingDialog}>
                <DialogContent className="sm:max-w-[600px]">
                  <DialogHeader>
                    <DialogTitle>AI Model Training</DialogTitle>
                    <DialogDescription>
                      Choose your preferred training method for the organization's AI model
                    </DialogDescription>
                  </DialogHeader>
                  {TrainingSelection}
                </DialogContent>
              </Dialog>
            )}

            {/* Result Modal */}
            {ResultModal}
            
            {/* Error Modal */}
            {ErrorModal}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default OrganizationDashboard;