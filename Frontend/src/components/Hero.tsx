import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Shield, Clock, Heart, Bot, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";

const Hero = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Smooth spring animation for better feel
  const springConfig = { stiffness: 100, damping: 20 };
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, 100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0]), springConfig);
  const scale = useSpring(useTransform(scrollYProgress, [0, 0.5], [1, 0.8]), springConfig);

  // Handle Get Started click
  const handleGetStarted = () => {
    const isLoggedIn = localStorage.getItem('accessToken');
    if (isLoggedIn) {
      navigate('/chat', { replace: true });
    } else {
      setShowLoginPrompt(true);
    }
  };

  // Features data
  const features = [
    {
      icon: Shield,
      text: t('govt_certified')
    },
    {
      icon: Clock,
      text: t('support_24_7')
    },
    {
      icon: Bot,
      text: t('ai_healthcare')
    }
  ];

  return (
    <>
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

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute -right-20 top-1/4 w-40 h-40 rounded-full"
            style={{
              background: "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(20, 184, 166, 0.1))",
              filter: "blur(5px)",
              y: useTransform(scrollYProgress, [0, 1], [0, 100]),
              scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
            }}
          />
          <motion.div
            className="absolute -left-20 top-2/3 w-60 h-60 rounded-full"
            style={{
              background: "linear-gradient(45deg, rgba(20, 184, 166, 0.1), rgba(59, 130, 246, 0.1))",
              filter: "blur(5px)",
              y: useTransform(scrollYProgress, [0, 1], [0, -100]),
              scale: useTransform(scrollYProgress, [0, 1], [1, 1.2]),
            }}
          />
        </div>

        {/* Main Content */}
        <div className="container relative z-10 pt-32 pb-20">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            style={{ y, opacity }}
          >
            {/* Title with Gradient Text */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-display font-bold mb-6"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal">
                {t('hero_title')}
              </span>
            </motion.h1>

            {/* Subtitle with Sparkle Effect */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl text-gray-600 mb-12 relative inline-block"
            >
              {t('hero_subtitle')}
              <Sparkles className="absolute -top-4 -right-4 h-6 w-6 text-healthbridge-teal animate-pulse" />
            </motion.p>

            {/* AI Healthcare Icon */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-12 flex justify-center"
            >
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-healthbridge-blue/20 to-healthbridge-teal/20 flex items-center justify-center group">
                <Bot className="w-12 h-12 text-healthbridge-blue group-hover:text-healthbridge-teal transition-colors duration-300" />
                <div className="absolute inset-0 rounded-full bg-white/30 backdrop-blur-sm -z-10" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-healthbridge-blue/10 to-healthbridge-teal/10 animate-pulse" />
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal hover:from-healthbridge-teal hover:to-healthbridge-blue text-white shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
              >
                <span className="relative z-10">
                  {t('get_started')}
                  <ArrowRight className="ml-2 h-5 w-5 inline-block group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-healthbridge-teal to-healthbridge-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    scale: useSpring(useTransform(scrollYProgress, [0, 1], [1, 1.1]), { stiffness: 200, damping: 30 })
                  }}
                />
              </Button>
              <Link to="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 hover:border-healthbridge-blue hover:text-healthbridge-blue transition-all duration-300 bg-white/50"
                >
                  {t('learn_more')}
                </Button>
              </Link>
            </motion.div>

            {/* Features Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  className={cn(
                    "p-6 rounded-2xl bg-white/60 backdrop-blur-[2px] shadow-lg hover:shadow-xl transition-all duration-300",
                    "border border-gray-100/20 hover:border-transparent"
                  )}
                >
                  <div className={cn(
                    "w-12 h-12 rounded-xl mb-4 flex items-center justify-center",
                    "bg-gradient-to-br from-healthbridge-blue to-healthbridge-teal"
                  )}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {feature.text}
                  </h3>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom Gradient Fade */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-32"
          style={{
            background: "linear-gradient(to top, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 100%)",
            opacity
          }}
        />
      </motion.section>

      {/* Login Prompt Dialog */}
      <AnimatePresence>
        {showLoginPrompt && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLoginPrompt(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            />
            
            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
            >
              <div className="bg-white rounded-2xl shadow-xl p-6 m-4">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-healthbridge-blue/10 rounded-lg">
                    <Bot className="w-6 h-6 text-healthbridge-blue" />
                  </div>
                  <button
                    onClick={() => setShowLoginPrompt(false)}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Login Required
                </h3>
                <p className="text-gray-600 mb-6">
                  Please log in to your account to chat with our AI assistant.
                </p>
                
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/login');
                    }}
                    className="w-full bg-healthbridge-blue hover:bg-healthbridge-blue/90 text-white"
                  >
                    Log In
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowLoginPrompt(false);
                      navigate('/signup');
                    }}
                    className="w-full border-healthbridge-blue text-healthbridge-blue hover:bg-healthbridge-blue/5"
                  >
                    Create Account
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Hero;