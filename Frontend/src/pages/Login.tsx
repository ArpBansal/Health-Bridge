import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
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
    handleLoginSubmit(e, loginData);
  };

  const onSignupSubmit = (e: React.FormEvent) => {
    handleSignupSubmit(e, signupData);
  };

  const onVerifyOTP = (e: React.FormEvent) => {
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
                        I agree to the <a href="#" className="text-healthbridge-blue hover:underline">terms and conditions</a>
                      </label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                      disabled={isLoading}
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
    </div>
  );
};

export default LoginPage;