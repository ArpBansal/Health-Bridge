import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface LocationState {
  email?: string;
  verified?: boolean;
}

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const locationState = location.state as LocationState;
  
  const { 
    isLoading, 
    otpSent, 
    setOtpSent, 
    otp, 
    setOtp, 
    countdown,
    resendDisabled,
    handleForgotPassword,
    handleVerifyForgotOTP,
    handleResetPassword,
    handleResendOTP,
    formatTime
  } = useAuth();

  const [email, setEmail] = useState(locationState?.email || "");
  const [showPassword, setShowPassword] = useState(false);
  const [resetData, setResetData] = useState({
    email: locationState?.email || "",
    newPassword: "",
    confirmPassword: ""
  });

  // Check if we're in the reset password phase
  const isResetPhase = location.pathname === "/forgot-password/reset";

  // Set OTP sent state based on location and pathname
  useEffect(() => {
    if (locationState?.verified && isResetPhase) {
      setOtpSent(true);
    }
  }, [locationState, isResetPhase, setOtpSent]);

  // Reset state when component unmounts
  useEffect(() => {
    return () => {
      if (!isResetPhase) {
        setOtpSent(false);
        setOtp("");
      }
    };
  }, [isResetPhase, setOtpSent, setOtp]);

  // Update email in resetData when email state changes
  useEffect(() => {
    setResetData(prev => ({ ...prev, email }));
  }, [email]);

  const onRequestOTP = (e: React.FormEvent) => {
    handleForgotPassword(e, email);
  };

  const onVerifyOTP = (e: React.FormEvent) => {
    handleVerifyForgotOTP(e, email);
  };

  const onResetPassword = (e: React.FormEvent) => {
    handleResetPassword(e, resetData);
  };

  const onResendOTP = () => {
    handleResendOTP(email);
  };

  const goBack = () => {
    if (otpSent && !isResetPhase) {
      // If we're at OTP verification step, go back to email entry
      setOtpSent(false);
      setOtp("");
    } else {
      // Otherwise go back to login page
      navigate('/login');
    }
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
              <h1 className="text-2xl font-bold text-white">
                {isResetPhase ? "Reset Password" : "Forgot Password"}
              </h1>
              <p className="text-white/80 text-sm mt-2">
                {isResetPhase 
                  ? "Create a new password for your account" 
                  : "Enter your email to recover your account"}
              </p>
            </div>

            <div className="p-6">
              <button 
                onClick={goBack}
                className="flex items-center text-healthbridge-blue mb-6 hover:underline"
              >
                <ArrowLeft size={16} className="mr-1" />
                <span>{otpSent && !isResetPhase ? "Back to Email" : "Back to Login"}</span>
              </button>

              {isResetPhase ? (
                // Reset Password Form
                <form onSubmit={onResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="email"
                        type="email"
                        placeholder="your.email@example.com"
                        className="pl-10"
                        value={resetData.email}
                        disabled
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="new-password" className="text-sm font-medium">New Password</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                      <Input
                        id="new-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={resetData.newPassword}
                        onChange={(e) => setResetData({...resetData, newPassword: e.target.value})}
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
                        value={resetData.confirmPassword}
                        onChange={(e) => setResetData({...resetData, confirmPassword: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Resetting Password...' : 'Reset Password'}
                  </Button>
                </form>
              ) : (
                // Email and OTP Forms
                !otpSent ? (
                  <form onSubmit={onRequestOTP} className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="email" className="text-sm font-medium">Email</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          id="email"
                          type="email"
                          placeholder="your.email@example.com"
                          className="pl-10"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Sending OTP...' : 'Send Recovery Code'}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-lg font-medium">Verify Your Email</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        We've sent a verification code to {email}
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
                        {isLoading ? 'Verifying...' : 'Verify Code'}
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
                )
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;