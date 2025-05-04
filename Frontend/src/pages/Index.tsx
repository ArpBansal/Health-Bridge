import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ServiceCards from "../components/ServiceCards";
import Stats from "../components/Stats";
import Testimonials from "../components/Testimonials";
import Newsletter from "../components/Newsletter";
import ImpactSection from "../components/ImpactSection";
import Footer from "../components/Footer";
import LoadingScreen from "../components/LoadingScreen";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

const Index = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { setCustomTranslations } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    // Load user data if needed when authenticated
    if (isAuthenticated) {
      // Set custom translations for personalized welcome
      setCustomTranslations({
        hero_title: "Welcome back to HealthBridge",
        hero_subtitle: "Continue your health journey with personalized care"
      });
    } else {
      // Reset to default translations
      setCustomTranslations(null);
    }
  }, [isAuthenticated, setCustomTranslations]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Show loader for 3 seconds

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen onFinished={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* The Hero component doesn't accept customTitle/customSubtitle props */}
        <Hero />
        <ServiceCards />
        <Stats />
        <ImpactSection />
        <Testimonials />
        <Newsletter />
      </main>
      <Footer />
    </div>
  );
};

export default Index;