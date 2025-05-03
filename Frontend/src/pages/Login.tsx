import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import the AuthContext

interface LocationState {
  activeTab?: string;
  email?: string;
  fromReset?: boolean;
}

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const locationState = location.state as LocationState;
  
  // Get all auth-related state and functions from AuthContext
  const { 
    isLoading, 
    otpSent, 
    setOtpSent, 
    otp, 
    setOtp, 
    countdown,
    resendDisabled,
    handleLoginSubmit,
    handleSignupSubmit,
    handleVerifyOTP,
    handleResendOTP,
    formatTime
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState(locationState?.activeTab || "login");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    remember: false,
  });

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
    role: "user", // Default role
  });

  // Update activeTab when location state changes
  useEffect(() => {
    if (locationState?.activeTab) {
      setActiveTab(locationState.activeTab);
    }
  }, [locationState]);

  // If returning from password reset, show notification
  useEffect(() => {
    if (locationState?.fromReset) {
      // You can show a success toast here if needed
      // or handle any other logic needed when returning from password reset
    }
  }, [locationState?.fromReset]);

  // Reset OTP state when tab changes
  useEffect(() => {
    if (activeTab === "login") {
      setOtpSent(false);
      setOtp("");
    }
  }, [activeTab, setOtpSent, setOtp]);

  // Handle form submissions using context functions
  const onLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLoginSubmit(e, loginData);
  };

  const onSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSignupSubmit(e, signupData);
  };

  const onVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerifyOTP(e, signupData.email);
  };

  const onResendOTP = () => {
    handleResendOTP(signupData.email);
  };

  // Navigate to forgot password
  const navigateToForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/forgot-password', { 
      state: { email: loginData.username.includes('@') ? loginData.username : '' }
    });
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.target as HTMLDivElement;
    const bottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 1;
    setHasScrolledToBottom(bottom);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-12">
        <div className="container px-4">
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal p-6 text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-healthbridge-blue font-bold">
                  HB
                </div>
              </div>
              <h1 className="text-2xl font-bold text-white">Welcome to HealthBridge</h1>
              <p className="text-white/80 text-sm mt-2">Access quality healthcare services</p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Sign Up</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={onLoginSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="username" className="text-sm font-medium">Username</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="username"
                        type="text"
                        placeholder="your_username"
                        className="pl-10"
                        value={loginData.username}
                        onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label htmlFor="password" className="text-sm font-medium">Password</label>
                      <a 
                        href="#" 
                        onClick={navigateToForgotPassword} 
                        className="text-xs text-healthbridge-blue hover:underline"
                      >
                        Forgot password?
                      </a>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={loginData.remember}
                      onCheckedChange={(checked) =>
                        setLoginData({...loginData, remember: checked === true})
                      }
                    />
                    <label
                      htmlFor="remember"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Remember me
                    </label>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Logging in...' : 'Login'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                {!otpSent ? (
                  <form onSubmit={onSignupSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="username" className="text-sm font-medium">Username</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="username"
                          type="text"
                          placeholder="Choose a username"
                          className="pl-10"
                          value={signupData.username}
                          onChange={(e) => setSignupData({...signupData, username: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signup-email" className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={signupData.email}
                          onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Account Type</label>
                      <RadioGroup 
                        value={signupData.role} 
                        onValueChange={(value) => setSignupData({...signupData, role: value})}
                        className="flex space-x-6 pt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="user" id="individual" />
                          <label htmlFor="individual" className="text-sm">Individual</label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="organisation" id="organisation" />
                          <label htmlFor="organisation" className="text-sm">Organisation</label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="signup-password" className="text-sm font-medium">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="signup-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={signupData.password}
                          onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                        >
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="confirm-password" className="text-sm font-medium">Confirm Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="confirm-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10"
                          value={signupData.confirmPassword}
                          onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="terms"
                        checked={signupData.agreeTerms}
                        onCheckedChange={(checked) =>
                          setSignupData({...signupData, agreeTerms: checked === true})
                        }
                        required
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <button
                          type="button"
                          onClick={() => setShowTermsModal(true)}
                          className="text-healthbridge-blue hover:underline font-medium"
                        >
                          terms and conditions
                        </button>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                      disabled={isLoading || !signupData.agreeTerms}
                    >
                      {isLoading ? 'Creating account...' : 'Sign Up'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Verify Your Email</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We've sent a verification code to {signupData.email}
                      </p>
                    </div>
                    
                    <form onSubmit={onVerifyOTP} className="space-y-4">
                      <div className="space-y-2">
                        <label htmlFor="otp" className="text-sm font-medium">Verification Code (OTP)</label>
                        <Input
                          id="otp"
                          type="text"
                          placeholder="Enter 6-digit code"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          maxLength={6}
                          required
                          className="text-center text-lg tracking-widest"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Verify Email'}
                      </Button>
                    </form>
                    
                    <div className="text-center pt-2">
                      <p className="text-sm text-gray-500">
                        Didn't receive the code?{" "}
                        <button
                          type="button"
                          onClick={onResendOTP}
                          className="text-healthbridge-blue hover:underline font-medium"
                          disabled={isLoading || resendDisabled}
                        >
                          {resendDisabled 
                            ? `Resend OTP (${formatTime(countdown)})` 
                            : 'Resend OTP'}
                        </button>
                      </p>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>

      <Footer />

      <Dialog open={showTermsModal} onOpenChange={setShowTermsModal}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Terms and Conditions</DialogTitle>
            <DialogDescription className="text-sm text-gray-600">
              Please read these terms carefully before using our services
            </DialogDescription>
          </DialogHeader>
          <div 
            className="space-y-4 max-h-[60vh] overflow-y-auto"
            onScroll={handleScroll}
          >
            <div className="space-y-3">
              <h3 className="text-lg font-medium">1. Acceptance of Terms</h3>
              <p className="text-sm text-gray-600">
                By accessing or using this AI health chatbot ("Service"), you (the "User") agree to these Terms and Conditions. The Service is provided by [Organization Name] to help users in rural communities understand their health symptoms. The chatbot is not a licensed healthcare provider. You agree to use the Service only as permitted by law and these terms. If you do not agree with any part of these terms, do not use the Service.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">2. Use of Service</h3>
              <p className="text-sm text-gray-600">
                The chatbot uses algorithms to analyze user-entered symptoms and provide information about possible health issues. The Service is intended for informational purposes only. You must be at least 18 years old (or the age of majority in your jurisdiction) to use it. If you are a parent or guardian, you must supervise any minor's use of the Service. You agree not to share any sensitive personal health data beyond what is necessary for the chatbot's function. You also agree not to use the Service in any illegal manner.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">3. Health Information Disclaimer</h3>
              <p className="text-sm text-gray-600">
                The medical and health-related content provided by this Service is not professional medical advice and should not be used as a substitute for consultation with a qualified healthcare professional. The chatbot's responses are based on patterns in data and do not account for your full medical history or individual circumstances. We expressly disclaim any liability for reliance on the Service's output.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600">
                <li>No Guarantee of Accuracy: We strive for accuracy, but we do not guarantee that the chatbot's suggestions are correct or complete. Always verify information with a healthcare professional.</li>
                <li>No Emergency Use: In an emergency, or for severe or life-threatening conditions, do not rely on the chatbot. Instead, seek immediate medical attention (e.g., call emergency services).</li>
                <li>Local Expertise: The Service does not replace in-person examinations or diagnostic tests. It cannot evaluate symptoms with the nuance a trained provider can.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">4. Limitation of Liability</h3>
              <p className="text-sm text-gray-600">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE." [Organization Name] and its partners are not liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of the Service. This includes, without limitation, harm from misdiagnosis, delays, errors, or omissions in information. You agree to use the Service at your own risk.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600">
                <li>We are not liable for any health-related outcomes you experience.</li>
                <li>We do not guarantee uninterrupted or secure access. Connectivity issues in rural areas are beyond our control.</li>
                <li>We do not assume responsibility if the chatbot's advice conflicts with local medical protocols or if a healthcare professional disagrees with its suggestions.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">5. Privacy and Data Use</h3>
              <p className="text-sm text-gray-600">
                Your privacy is a priority. We collect, store, and process any health-related information you enter only to improve the Service. Data handling will comply with applicable privacy laws (e.g. HIPAA in the U.S. or similar regulations elsewhere) and best practices in data security.
              </p>
              <ul className="list-disc pl-4 space-y-2 text-sm text-gray-600">
                <li>Data Collection: We may collect symptoms, demographic information (e.g. age, gender), device information, and usage logs. This helps improve diagnostic algorithms and service quality.</li>
                <li>Data Protection: We use encryption and access controls to protect data. We will not sell or rent your personal health information.</li>
                <li>De-identification: Wherever possible, personal identifiers are removed. Generative or synthetic data techniques may be used to protect your privacy.</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">6. Patient Agency and Consent</h3>
              <p className="text-sm text-gray-600">
                You expressly consent to this data collection by using the Service. Consent is informed and revocable. We follow expert guidance to emphasize your control over data. You may withdraw your consent and delete your data at any time by contacting us; we will accommodate this unless prohibited by law or technical limitations.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">7. Third-Party Services</h3>
              <p className="text-sm text-gray-600">
                The Service may use third-party analytics or cloud hosting. These providers are chosen for reliability and security. Any PHI shared with them is governed by strict agreements to ensure HIPAA compliance (if in the U.S.).
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">8. User Consent and Representations</h3>
              <p className="text-sm text-gray-600">
                By using the Service, you represent that: (a) you have provided truthful and accurate information about your symptoms and health background to the best of your knowledge; (b) you understand the chatbot's limitations and are seeking general information only; and (c) you consent to receive automated health-related guidance. If you do not want your data used in this manner, do not proceed with the Service. We reserve the right to refuse service to anyone.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">9. Modifications to Terms</h3>
              <p className="text-sm text-gray-600">
                We may update these terms at any time to comply with new laws or improve the Service. We will notify users of significant changes. Continued use of the Service constitutes acceptance of the new terms.
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">10. Applicable Law and Jurisdiction</h3>
              <p className="text-sm text-gray-600">
                These terms are governed by the laws of [State/Country]. Any disputes will be resolved in the competent courts of [Jurisdiction].
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-medium">11. Contact Information</h3>
              <p className="text-sm text-gray-600">
                For questions about these terms, privacy, or the Service, please contact [Organization Contact Info].
              </p>
            </div>
          </div>
          <div className="flex justify-end mt-6 space-x-2">
            <Button
              onClick={() => setShowTermsModal(false)}
              variant="outline"
              className="border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setSignupData({...signupData, agreeTerms: true});
                setShowTermsModal(false);
              }}
              className="bg-healthbridge-blue hover:bg-healthbridge-blue/90 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!hasScrolledToBottom}
            >
              I Agree
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoginPage;