import { useState } from "react";
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
  LineChart
} from "lucide-react";
import { motion } from "framer-motion";

const OrganizationDashboard = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedTraining, setSelectedTraining] = useState<"server" | "local" | null>(null);
  const [showTrainingDialog, setShowTrainingDialog] = useState(true);
  const [showCancerModal, setShowCancerModal] = useState(false);

  // Mock data for quick stats
  const quickStats = [
    { icon: Activity, label: "Active Models", value: "3", trend: "+1" },
    { icon: Clock, label: "Training Time", value: "24h", trend: "-2h" },
    { icon: Database, label: "Data Size", value: "1.2TB", trend: "+0.3TB" },
    { icon: Cpu, label: "Performance", value: "92%", trend: "+2%" }
  ];

  const handleTrainingSelect = (type: "server" | "local") => {
    setSelectedTraining(type);
    setShowTrainingDialog(false);
    if (type === "server") {
      navigate("/server-training");
    } else {
      setShowCancerModal(true);
    }
  };

  const TrainingSelection = () => (
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
  );

  const CancerTrainingModal = () => (
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
                            <SelectItem value="cnn">Convolutional Neural Network</SelectItem>
                            <SelectItem value="rnn">Recurrent Neural Network</SelectItem>
                            <SelectItem value="transformer">Transformer</SelectItem>
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
                            <SelectItem value="1">1 Week</SelectItem>
                            <SelectItem value="2">2 Weeks</SelectItem>
                            <SelectItem value="4">4 Weeks</SelectItem>
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
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="breast" />
                        <label htmlFor="breast" className="text-sm font-medium">Breast Cancer</label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="lung" />
                        <label htmlFor="lung" className="text-sm font-medium">Lung Cancer</label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="skin" />
                        <label htmlFor="skin" className="text-sm font-medium">Skin Cancer</label>
                      </div>
                      <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox id="prostate" />
                        <label htmlFor="prostate" className="text-sm font-medium">Prostate Cancer</label>
                      </div>
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
                      <div>
                        <label className="text-sm font-medium text-gray-700">Target Accuracy</label>
                        <div className="relative mt-1">
                          <Input 
                            type="number" 
                            placeholder="e.g., 95" 
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Sensitivity</label>
                        <div className="relative mt-1">
                          <Input 
                            type="number" 
                            placeholder="e.g., 90" 
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700">Specificity</label>
                        <div className="relative mt-1">
                          <Input 
                            type="number" 
                            placeholder="e.g., 92" 
                            className="pr-12"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                        </div>
                      </div>
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
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      {showCancerModal ? (
        <CancerTrainingModal />
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
                  {quickStats.map((stat, index) => (
                    <motion.div
                      key={index}
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
                  <TrainingSelection />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </main>
      )}
      <Footer />
    </div>
  );
};

export default OrganizationDashboard;