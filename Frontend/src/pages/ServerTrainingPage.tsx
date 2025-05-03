import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, Server, Database, Cpu, LineChart, Brain, Microscope, Activity, Clock, 
  Image, Sliders, Filter, Layers, Stethoscope, FileText, Dna, Heart, Eye, 
  Shield, Zap, BarChart, Settings, CheckCircle, X, Upload
} from "lucide-react";
import { motion } from "framer-motion";

// Types for better type safety and future extensibility
type TrainingModal = {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  features: string[];
  configuration: {
    tabs: {
      id: string;
      label: string;
      icon: React.ElementType;
    }[];
    dataTypes?: {
      id: string;
      label: string;
      description: string;
      icon: React.ElementType;
    }[];
    modelTypes?: ModelType[];
    preprocessingOptions?: PreprocessingOption[];
  };
};

type CancerType = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
};

type ModelType = {
  id: string;
  label: string;
  description: string;
  recommendedFor: string[];
};

type TrainingDuration = {
  id: string;
  label: string;
  description: string;
  estimatedTime: string;
};

type PreprocessingOption = {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  default: boolean;
};

const ServerTrainingPage = () => {
  const navigate = useNavigate();
  const [selectedModal, setSelectedModal] = useState<string | null>(null);
  const [modelType, setModelType] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedCancerType, setSelectedCancerType] = useState<string>("");
  const [showCancerTypes, setShowCancerTypes] = useState(false);
  const [activeTab, setActiveTab] = useState("types");
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [selectedModelType, setSelectedModelType] = useState<string | null>(null);

  const cancerTypes = [
    { id: "breast", label: "Breast Cancer", description: "Mammography analysis and tumor detection" },
    { id: "lung", label: "Lung Cancer", description: "CT scan interpretation and lesion detection" },
    { id: "skin", label: "Skin Cancer", description: "Dermatoscopic analysis and lesion classification" },
    { id: "prostate", label: "Prostate Cancer", description: "MRI-based tumor detection and analysis" }
  ];

  const chestTypes = [
    { id: "pneumonia", label: "Pneumonia", description: "Detection and classification of pneumonia from X-ray images" },
    { id: "tuberculosis", label: "Tuberculosis", description: "Identification of tuberculosis patterns in chest X-rays" },
    { id: "lung_cancer", label: "Lung Cancer", description: "Early detection of lung cancer from X-ray scans" },
    { id: "covid", label: "COVID-19", description: "Detection of COVID-19 related lung patterns" }
  ];

  const dermTypes = [
    { id: "melanoma", label: "Melanoma", description: "Detection and classification of melanoma lesions" },
    { id: "eczema", label: "Eczema", description: "Identification and severity assessment of eczema" },
    { id: "psoriasis", label: "Psoriasis", description: "Analysis of psoriasis patterns and severity" },
    { id: "acne", label: "Acne", description: "Classification and severity assessment of acne" }
  ];

  const trainingModals = [
    {
      id: "cancer",
      title: "Cancer Detection Model Training",
      description: "Configure your AI model for cancer detection and diagnosis",
      icon: Microscope,
      color: "bg-blue-600",
      features: [
        "Advanced image analysis",
        "High accuracy detection",
        "Real-time processing",
        "Multi-modal support"
      ],
      configuration: {
        tabs: [
          { id: "types", label: "Cancer Types", icon: Dna },
          { id: "model", label: "Model Settings", icon: Brain }
        ],
        modelTypes: [
          { 
            id: "segresnet", 
            label: "CancerModel (SegResNet-backbone)", 
            description: "Specialized model for cancer detection and segmentation",
            recommendedFor: ["breast", "lung", "skin", "prostate"]
          }
        ]
      }
    },
    {
      id: "chest",
      title: "Chest X-ray Analysis",
      description: "Train a model for chest X-ray interpretation and diagnosis",
      icon: Activity,
      color: "bg-green-600",
      features: [
        "Pneumonia detection",
        "Lung condition analysis",
        "Automated diagnosis",
        "High-resolution imaging"
      ],
      configuration: {
        tabs: [
          { id: "types", label: "Analysis Types", icon: Eye },
          { id: "model", label: "Model Settings", icon: Brain }
        ],
        modelTypes: [
          { 
            id: "resnet", 
            label: "ChestXNet (ResNet-backbone)", 
            description: "Specialized model for chest X-ray analysis",
            recommendedFor: ["pneumonia", "tuberculosis", "lung_cancer", "covid"]
          }
        ]
      }
    },
    {
      id: "derm",
      title: "Dermatology Foundation",
      description: "Train a model for skin condition analysis and diagnosis",
      icon: Stethoscope,
      color: "bg-purple-600",
      features: [
        "Skin lesion analysis",
        "Condition classification",
        "Early detection",
        "Multi-skin type support"
      ],
      configuration: {
        tabs: [
          { id: "types", label: "Skin Conditions", icon: Heart },
          { id: "model", label: "Model Settings", icon: Brain }
        ],
        modelTypes: [
          { 
            id: "efficientnet", 
            label: "DermAI (EfficientNet-backbone)", 
            description: "Specialized model for dermatological analysis",
            recommendedFor: ["melanoma", "eczema", "psoriasis", "acne"]
          }
        ]
      }
    }
  ];

  const handleModalSelect = (modalId: string) => {
    setSelectedModal(modalId);
    setCurrentStep(1);
    setActiveTab("types");
  };

  const handleNextStep = () => {
    if (currentStep < 2) {
      setCurrentStep(prev => prev + 1);
      setActiveTab(currentStep === 1 ? "model" : "preprocessing");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setShowUploadModal(true);
    }
  };

  const handleStartTraining = () => {
    if (modelType && selectedFile) {
      setShowSuccessModal(true);
      // In a real application, you would start the training process here
      // and handle the actual file upload to the server
    }
  };

  const handleUploadConfirm = () => {
    setShowUploadModal(false);
    setShowSuccessModal(true);
    // In a real application, you would handle the actual file upload here
  };

  const handleUploadCancel = () => {
    setShowUploadModal(false);
    setSelectedFile(null);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    navigate('/dashboard');
  };

  const handleBack = () => {
    if (selectedModal) {
      setSelectedModal(null);
    } else {
      navigate("/organization-dashboard");
    }
  };

  const handleModelTypeSelect = (typeId: string) => {
    setModelType(typeId);
  };

  const renderModalSelection = () => (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Training Type</h1>
        <p className="text-gray-600">Choose the type of AI model you want to train</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {trainingModals.map((modal) => (
          <motion.div
            key={modal.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200"
              onClick={() => handleModalSelect(modal.id)}
            >
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="p-4 bg-blue-100 rounded-full">
                    <modal.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{modal.title}</h3>
                  <p className="text-gray-600">{modal.description}</p>
                  <div className="w-full pt-4 border-t border-gray-100">
                    <ul className="space-y-2 text-sm text-gray-600">
                      {modal.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <Shield className="h-4 w-4 text-blue-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderTrainingConfiguration = () => {
    const selectedModalData = trainingModals.find((m: TrainingModal) => m.id === selectedModal);
    const ModalIcon = selectedModalData?.icon;
    const configuration = selectedModalData?.configuration;

    const getTypesForModal = () => {
      switch (selectedModal) {
        case "cancer":
          return cancerTypes;
        case "chest":
          return chestTypes;
        case "derm":
          return dermTypes;
        default:
          return [];
      }
    };

    const types = getTypesForModal();

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              onClick={handleBack}
              className="text-gray-600 hover:bg-blue-50"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Selection
            </Button>
            {ModalIcon && (
              <div className="p-2 bg-blue-100 rounded-lg">
                <ModalIcon className="h-6 w-6 text-blue-600" />
              </div>
            )}
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedModalData?.title} Configuration
            </h2>
          </div>
        </div>

        {/* Step Progress */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step === currentStep 
                    ? 'bg-blue-600 text-white' 
                    : step < currentStep 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'bg-gray-100 text-gray-400'
                }`}>
                  {step === 1 ? "1" : "2"}
                </div>
                {step < 2 && (
                  <div className={`w-16 h-1 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full max-w-2xl mx-auto bg-blue-50">
            {configuration?.tabs.map((tab) => (
              <TabsTrigger 
                key={tab.id} 
                value={tab.id} 
                className="flex items-center gap-2 data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-blue-100"
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {configuration?.tabs.map((tab) => (
            <TabsContent key={tab.id} value={tab.id} className="space-y-6">
              {tab.id === "types" ? (
                <div className="space-y-6">
                  <Card className="hover:shadow-md transition-all duration-300 border-2 border-blue-100">
                    <CardHeader className="bg-blue-50 rounded-t-xl">
                      <CardTitle className="text-blue-600">{selectedModalData?.title}</CardTitle>
                      <CardDescription>{selectedModalData?.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <tab.icon className="h-4 w-4 text-blue-500" />
                            Training Type
                          </label>
                          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-blue-100 rounded-lg">
                                <ModalIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-gray-900">{selectedModalData?.title}</div>
                                <div className="text-sm text-gray-500">{selectedModalData?.description}</div>
                              </div>
                              <button
                                onClick={() => setShowCancerTypes(!showCancerTypes)}
                                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 cursor-pointer"
                              >
                                <Eye className="h-4 w-4" />
                                View types
                              </button>
                            </div>
                            {showCancerTypes && (
                              <div className="mt-4 bg-white rounded-lg border border-blue-200 shadow-sm">
                                <div className="p-4">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className="text-lg font-medium text-gray-900">{tab.label}</div>
                                    <button 
                                      onClick={() => setShowCancerTypes(false)}
                                      className="p-1 hover:bg-blue-50 rounded-full transition-colors duration-150"
                                    >
                                      <X className="h-5 w-5 text-gray-500" />
                                    </button>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {types.map((type) => (
                                      <div 
                                        key={type.id}
                                        className={`p-4 rounded-lg cursor-pointer transition-colors duration-150 ${
                                          selectedCancerType === type.id 
                                            ? 'bg-blue-50 border-2 border-blue-200' 
                                            : 'hover:bg-blue-50 border border-transparent hover:border-blue-100'
                                        }`}
                                        onClick={() => {
                                          setSelectedCancerType(type.id);
                                          setShowCancerTypes(false);
                                        }}
                                      >
                                        <div className="font-medium text-gray-900">{type.label}</div>
                                        <div className="text-sm text-gray-500 mt-1">{type.description}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                            {selectedCancerType && (
                              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center gap-2">
                                  <div className="font-medium text-gray-900">
                                    {types.find(t => t.id === selectedCancerType)?.label}
                                  </div>
                                  <button 
                                    onClick={() => setSelectedCancerType("")}
                                    className="p-1 hover:bg-blue-100 rounded-full transition-colors duration-150"
                                  >
                                    <X className="h-4 w-4 text-gray-500" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : tab.id === "model" ? (
                <div className="grid grid-cols-1 gap-6">
                  <Card className="hover:shadow-md transition-all duration-300 border-2 border-blue-100">
                    <CardHeader className="bg-blue-50 rounded-t-xl">
                      <CardTitle className="text-blue-600">Model Configuration</CardTitle>
                      <CardDescription>Configure your {selectedModalData?.title.toLowerCase()} model settings</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6 pt-6">
                      <div className="space-y-6">
                        <div>
                          <label className="text-sm font-medium text-gray-700">Model Type</label>
                          <Select value={modelType} onValueChange={handleModelTypeSelect}>
                            <SelectTrigger className="mt-1 border-blue-200 focus:ring-blue-500 hover:border-blue-300">
                              <SelectValue placeholder="Select model type" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border border-blue-200 shadow-lg z-50">
                              {configuration.modelTypes?.map((type) => (
                                <SelectItem 
                                  key={type.id} 
                                  value={type.id}
                                  className="hover:bg-blue-50 focus:bg-blue-50 cursor-pointer data-[highlighted]:bg-blue-50"
                                >
                                  <div>
                                    <div className="font-medium">{type.label}</div>
                                    <div className="text-sm text-gray-500">{type.description}</div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700">Upload Training Data</label>
                          <div className="mt-1">
                            <div className="flex items-center justify-center w-full">
                              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-blue-200 border-dashed rounded-lg cursor-pointer bg-blue-50 hover:bg-blue-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <Upload className="w-8 h-8 mb-3 text-blue-600" />
                                  <p className="mb-2 text-sm text-gray-500">
                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                  </p>
                                  <p className="text-xs text-gray-500">Folder or ZIP file only</p>
                                </div>
                                <input 
                                  type="file" 
                                  className="hidden" 
                                  onChange={handleFileUpload}
                                  // @ts-ignore - webkitdirectory is a valid attribute but not in TypeScript types
                                  webkitdirectory=""
                                  // @ts-ignore - directory is a valid attribute but not in TypeScript types
                                  directory=""
                                  accept=".zip"
                                />
                              </label>
                            </div>
                            {selectedFile && (
                              <div className="mt-2 text-sm text-gray-600">
                                Selected: {selectedFile.name}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : null}
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end space-x-4 mt-8">
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="hover:bg-blue-50 border-blue-200"
          >
            Cancel
          </Button>
          {currentStep < 2 ? (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleNextStep}
            >
              Next Step
            </Button>
          ) : (
            <Button 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8"
              onClick={handleStartTraining}
              disabled={!modelType || !selectedFile || !selectedCancerType}
            >
              Submit
            </Button>
          )}
        </div>
      </div>
    );
  };

  const isStartTrainingEnabled = modelType && selectedFile;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
            {!selectedModal ? renderModalSelection() : renderTrainingConfiguration()}
          </div>
        </div>
      </div>
      <Footer />

      {/* Upload Confirmation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirm Upload</h3>
              <button 
                onClick={handleUploadCancel}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Are you sure you want to upload <span className="font-medium">{selectedFile?.name}</span>?
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleUploadCancel}
                className="border-gray-300 hover:bg-gray-50"
              >
                Cancel
              </Button>
              <Button
                onClick={handleUploadConfirm}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Upload
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Success Message */}
      {showSuccessMessage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed top-4 right-4 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg z-50"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-green-800">Training Started Successfully!</h3>
              <p className="text-sm text-green-600">Your model is now being trained. You will be redirected to the dashboard shortly.</p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Training Started Successfully!</h3>
              <button 
                onClick={handleSuccessModalClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-600">
                Your model is now being trained. You will be redirected to the dashboard shortly.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={handleSuccessModalClose}
                className="border-gray-300 hover:bg-gray-50"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServerTrainingPage;