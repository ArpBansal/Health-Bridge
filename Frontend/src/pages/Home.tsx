import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, MessageSquare, Bot, Zap, Sparkles, Info } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/context/AuthContext";
import { useRef } from "react";
import ServiceCards from "@/components/ServiceCards";
import Stats from "@/components/Stats";
import Testimonials from "@/components/Testimonials";
import Newsletter from "@/components/Newsletter";
import ImpactSection from "@/components/ImpactSection";
import { toast } from "@/components/ui/sonner";

const Home = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8]);

  useEffect(() => {
    console.log('Auth state:', {
      isAuthenticated,
      localStorage: {
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken')
      },
      sessionStorage: {
        accessToken: sessionStorage.getItem('accessToken'),
        refreshToken: sessionStorage.getItem('refreshToken')
      }
    });
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <motion.section
        ref={containerRef}
        className="relative min-h-screen overflow-hidden"
      >
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/bg-uploads/719f9236-4ef9-4250-aec0-901cdb639bd3.png')",
              filter: "brightness(0.95)"
            }}
          />
          <div 
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to bottom, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0.2) 100%)"
            }}
          />
          
          {/* Animated Gradient Overlays */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 70%)",
              scale,
              opacity
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              background: "radial-gradient(circle at 30% 70%, rgba(20, 184, 166, 0.1) 0%, transparent 70%)",
              scale,
              opacity
            }}
          />
        </div>

        {/* Content Container with Semi-transparent Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-white/30 backdrop-blur-[0.1px]" />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 px-4 mx-auto">
          <div className="flex flex-col items-center text-center">
            <motion.div
              style={{ y, opacity }}
              className="max-w-4xl mx-auto text-center"
            >
              {/* Animated Robot Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.8, type: "spring" }}
                className="mb-8 inline-block"
              >
                <div className="relative">
                  <Bot className="h-24 w-24 text-healthbridge-blue" />
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute -top-2 -right-2"
                  >
                    <Zap className="h-8 w-8 text-healthbridge-teal animate-pulse" />
                  </motion.div>
                </div>
              </motion.div>

              {/* Title with Gradient Text */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-7xl font-display font-bold mb-6"
              >
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal">
                  Meet Your AI Health Companion
                </span>
              </motion.h1>

              {/* Subtitle with Sparkle Effect */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-gray-600 mb-12 relative inline-block"
              >
                Your friendly AI assistant is here to guide you through your health journey
                <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-healthbridge-teal animate-pulse" />
              </motion.p>

              {/* CTA Button */}
              {isAuthenticated ? (
                <Button
                  size="lg"
                  className="bg-healthbridge-blue hover:bg-healthbridge-blue/90 text-white"
                  onClick={() => navigate('/ai-chat')}
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  Talk with your Health AI
                </Button>
              ) : (
                <Button
                  size="lg"
                  className="bg-healthbridge-blue hover:bg-healthbridge-blue/90 text-white"
                  onClick={() => {
                    toast(
                      "Welcome to HealthBridge! Please log in to access your AI health assistant.",
                      {
                        icon: <Info className="h-6 w-6 text-cyan-500" />,
                        duration: 2000,
                        className: "bg-white border-cyan-400 text-cyan-900 shadow-xl rounded-xl px-4 py-3",
                      }
                    );
                    setTimeout(() => navigate('/login'), 2000);
                  }}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Original Components */}
      <ServiceCards />
      <Stats />
      <ImpactSection />
      <Testimonials />
      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home; 