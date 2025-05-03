import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useToast } from "@/hooks/use-toast";

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null; // Add user object
  login: (access: string, refresh: string, userData?: User) => void;
  logout: () => void;
  // Authentication state
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  // OTP states
  otpSent: boolean;
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  otp: string;
  setOtp: React.Dispatch<React.SetStateAction<string>>;
  countdown: number;
  resendDisabled: boolean;
  // Authentication methods
  handleLoginSubmit: (e: React.FormEvent, loginData: LoginData) => Promise<void>;
  handleSignupSubmit: (e: React.FormEvent, signupData: SignupData) => Promise<void>;
  handleVerifyOTP: (e: React.FormEvent, email: string) => Promise<void>;
  handleResendOTP: (email: string) => Promise<void>;
  // Forgot password methods
  handleForgotPassword: (e: React.FormEvent, email: string) => Promise<void>;
  handleVerifyForgotOTP: (e: React.FormEvent, email: string) => Promise<void>;
  handleResetPassword: (e: React.FormEvent, resetData: ResetPasswordData) => Promise<void>;
  // Helper functions
  startResendTimer: () => void;
  formatTime: (seconds: number) => string;
  getErrorMessage: (error: any) => string;
  // New checkAuth function
  checkAuth: () => Promise<boolean>;
}

interface LoginData {
  username: string;
  password: string;
  remember: boolean;
}

interface SignupData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

// Base API URL
const API_BASE_URL = 'http://127.0.0.1:8000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null); // Add user state
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(false);

  // On mount, check if tokens exist and get user data
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsAuthenticated(true);
      // Try to get user data from localStorage
      const userData = localStorage.getItem('userData');
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          console.error('Failed to parse user data from localStorage');
        }
      }
      // You might want to fetch fresh user data from the server here
    }
  }, []);

  // Timer effect for countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, resendDisabled]);

  // Function to verify token validity and refresh if needed
  const checkAuth = async (): Promise<boolean> => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    // If no tokens, user is not authenticated
    if (!accessToken || !refreshToken) {
      setIsAuthenticated(false);
      setUser(null);
      return false;
    }

    try {
      const userResponse = await axios.get(`${API_BASE_URL}/auth/user/`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
  
      const userData = userResponse.data;
      setUser(userData);
      localStorage.setItem('userData', JSON.stringify(userData));
      setIsAuthenticated(true);
      return true;
  
    } catch (error: any) {
      console.warn("Access token may be expired, attempting refresh...");
  
      
      // If token verification failed, try to refresh the token
      try {
        const refreshResponse = await axios.post(
          `${API_BASE_URL}/auth/refresh/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
        
        // If refresh successful, update tokens and set authenticated
        if (refreshResponse.data.access) {
          localStorage.setItem('accessToken', refreshResponse.data.access);
          if (refreshResponse.data.refresh) {
            localStorage.setItem('refreshToken', refreshResponse.data.refresh);
          }
          
          // If we have a user in the response, update the user state
          if (refreshResponse.data.user) {
            setUser(refreshResponse.data.user);
            localStorage.setItem('userData', JSON.stringify(refreshResponse.data.user));
          }
          
          setIsAuthenticated(true);
          return true;
        }
      } catch (refreshError) {
        console.error('Token refresh failed, logging out...', refreshError);
        // If refresh failed, logout
        logout();
        return false;
      }
    }
    
    return isAuthenticated;
  };

  // Function to start the countdown timer
  const startResendTimer = () => {
    setResendDisabled(true);
    setCountdown(90); // 90 seconds countdown
  };

  // Helper function to extract error message from response
  const getErrorMessage = (error: any) => {
    if (!error.response) {
      return "Network error occurred. Please try again.";
    }
    
    const { data } = error.response;
    
    // Handle string error messages
    if (typeof data === 'string') {
      return data;
    }
    
    // Handle common error field formats
    if (data.detail) {
      return data.detail;
    }
    
    // Handle field-specific errors
    if (data.username || data.email || data.password || data.non_field_errors) {
      const fieldErrors = [];
      
      if (Array.isArray(data.username)) {
        fieldErrors.push(`Username: ${data.username.join(', ')}`);
      }
      
      if (Array.isArray(data.email)) {
        fieldErrors.push(`Email: ${data.email.join(', ')}`);
      }
      
      if (Array.isArray(data.password)) {
        fieldErrors.push(`Password: ${data.password.join(', ')}`);
      }
      
      if (Array.isArray(data.non_field_errors)) {
        fieldErrors.push(data.non_field_errors.join(', '));
      }
      
      return fieldErrors.join('. ');
    }
    
    // Check if there's any other error messages in the response
    const errorMessages = [];
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        errorMessages.push(`${key}: ${value.join(', ')}`);
      } else if (typeof value === 'string') {
        errorMessages.push(`${key}: ${value}`);
      }
    });
    
    if (errorMessages.length > 0) {
      return errorMessages.join('. ');
    }
    
    return "An error occurred. Please try again.";
  };

  const login = (access: string, refresh: string, userData?: User) => {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
    
    // Store user data if provided
    if (userData) {
      localStorage.setItem('userData', JSON.stringify(userData));
      setUser(userData);
    }
    
    setIsAuthenticated(true);
    navigate('/', { replace: true });
  };

  const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (accessToken && refreshToken) {
      try {
        // Call logout API
        await axios.post(
          `${API_BASE_URL}/auth/logout/`,
          { refresh: refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${accessToken}`
            }
          }
        );
      } catch (error) {
        console.error('Logout API call failed:', error);
        // Continue with local logout even if the API call fails
      }
    }
    
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/login', { replace: true });
  };

  const handleLoginSubmit = async (e: React.FormEvent, loginData: LoginData) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/login/`,
        {
          username: loginData.username,
          password: loginData.password,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      const { access, refresh, user: userData } = response.data;

      login(access, refresh, userData);

      toast({
        title: "Login Successful",
        description: "You have been logged in successfully!",
      });

    } catch (error) {
      console.error(error);
      toast({
        title: "Login Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent, signupData: SignupData) => {
    e.preventDefault();

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Submit registration data to backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/register/`,
        {
          username: signupData.username,
          email: signupData.email,
          password: signupData.password,
          confirm_password: signupData.confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Registration Successful",
        description: response.data.message || "Please verify your email with the OTP sent to your inbox.",
      });

      setOtpSent(true);
      // Start the resend timer when OTP is first sent
      startResendTimer();
    } catch (error) {
      console.error(error);
      toast({
        title: "Registration Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent, email: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Verify OTP with backend
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-otp/`,
        {
          email: email,
          otp: otp
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Email Verified",
        description: response.data.message || "Your email has been verified successfully. You can now login.",
      });

      // Reset states
      setOtpSent(false);
      setOtp("");
      setResendDisabled(false);
      setCountdown(0);
      
      // Navigate to login
      navigate('/login', { replace: true, state: { activeTab: 'login' } });
    } catch (error) {
      console.error(error);
      toast({
        title: "Verification Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async (email: string) => {
    setIsLoading(true);

    try {
      // Resend OTP to email
      const response = await axios.post(
        `${API_BASE_URL}/auth/resend-otp/`,
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "OTP Resent",
        description: response.data.message || "A new verification code has been sent to your email.",
      });
      
      // Start the resend timer again
      startResendTimer();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Resend OTP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle forgot password request
  const handleForgotPassword = async (e: React.FormEvent, email: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password/`,
        {
          email: email
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "OTP Sent",
        description: response.data.message || "A verification code has been sent to your email.",
      });

      setOtpSent(true);
      startResendTimer();
    } catch (error) {
      console.error(error);
      toast({
        title: "Failed to Send OTP",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification of forgot password OTP
  const handleVerifyForgotOTP = async (e: React.FormEvent, email: string) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/verify-forgot-otp/`,
        {
          email: email,
          otp: otp
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "OTP Verified",
        description: response.data.message || "Your OTP has been verified successfully. You can now reset your password.",
      });

      // Move to reset password stage, but keep otpSent true to show we're in the flow
      navigate('/forgot-password/reset', { 
        replace: true, 
        state: { email: email, verified: true } 
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Verification Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password reset submission
  const handleResetPassword = async (e: React.FormEvent, resetData: ResetPasswordData) => {
    e.preventDefault();
    setIsLoading(true);

    if (resetData.newPassword !== resetData.confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/reset-password/`,
        {
          email: resetData.email,
          new_password: resetData.newPassword,
          confirm_password: resetData.confirmPassword
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      toast({
        title: "Password Reset Successful",
        description: response.data.message || "Your password has been reset successfully. You can now login with your new password.",
      });

      // Reset states
      setOtpSent(false);
      setOtp("");
      setResendDisabled(false);
      setCountdown(0);
      
      // Navigate to login
      navigate('/login', { replace: true });
    } catch (error) {
      console.error(error);
      toast({
        title: "Password Reset Failed",
        description: getErrorMessage(error),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Format seconds to MM:SS format
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated,
      user,
      login, 
      logout,
      isLoading,
      setIsLoading, 
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
      handleForgotPassword,
      handleVerifyForgotOTP,
      handleResetPassword,
      checkAuth,
      startResendTimer,
      formatTime,
      getErrorMessage
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// custom hook to consume
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
};