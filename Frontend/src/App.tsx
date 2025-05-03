import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";
import { ChatProvider } from "./context/ChatContext"; // Import ChatProvider

// pages...
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Schemes from "./pages/Schemes";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import BlogForm from "./pages/BlogForm";
import Login from "./pages/Login";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Research from "./pages/Research";
import ForgotPassword from "./pages/ForgotPassword";
import ChatInterface from "./pages/ChatInterface"; // Import ChatInterface component
import AccountDashboard from "./pages/AccountDashboard";
import HealthAssessment from "./pages/HealthAssessment";

import { AnimatePresence } from "framer-motion";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <BrowserRouter>
        {/* AuthProvider wraps all routes */}
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/schemes" element={<Schemes />} />
                <Route path="/research" element={<Research />} />

                {/* Blog routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/new" element={<BlogForm />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />
                <Route path="/blog/edit/:id" element={<BlogForm />} />

                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/forgot-password/reset" element={<ForgotPassword />} />

                <Route path="/account-dashboard" element={<AccountDashboard />} />
                <Route path="/health-assessment" element={<HealthAssessment />} />

                {/* Chat system route - wrapped in ChatProvider */}
                <Route 
                  path="/chat" 
                  element={
                    <ChatProvider>
                      <ChatInterface />
                    </ChatProvider>
                  } 
                />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;