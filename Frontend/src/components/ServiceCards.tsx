import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Users, Pill, Activity, Bot, Stethoscope, Calendar, FileText, Heart, Brain, Microscope, Ambulance, Sparkles } from "lucide-react";
import { useRef, useState } from "react";

const services = [
  {
    id: 'talk_with_ai',
    icon: <Bot className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-100',
    action: 'Start Chat',
    description: 'Get instant medical advice and information from our AI healthcare assistant.',
    sparkles: true
  },
  {
    id: 'telemedicine',
    icon: <Phone className="h-6 w-6" />,
    color: 'from-healthbridge-blue to-blue-600',
    bgColor: 'bg-blue-100',
    action: 'Connect Now',
    description: 'Virtual consultations with qualified doctors from the comfort of your home.',
    sparkles: true
  },
  {
    id: 'health_camps',
    icon: <Users className="h-6 w-6" />,
    color: 'from-green-500 to-emerald-600',
    bgColor: 'bg-green-100',
    action: 'Find Camps',
    description: 'Access free health checkups and medical services in your community.',
    sparkles: true
  },
  {
    id: 'medicine_delivery',
    icon: <Pill className="h-6 w-6" />,
    color: 'from-orange-500 to-amber-600',
    bgColor: 'bg-orange-100',
    action: 'Order Medicine',
    description: 'Get prescribed medications delivered to your doorstep within hours.',
    sparkles: true
  },
  {
    id: 'diagnostics',
    icon: <Activity className="h-6 w-6" />,
    color: 'from-purple-500 to-violet-600',
    bgColor: 'bg-purple-100',
    action: 'Book Test',
    description: 'Schedule lab tests and diagnostic procedures with ease.',
    sparkles: true
  },
  {
    id: 'doctor_appointment',
    icon: <Calendar className="h-6 w-6" />,
    color: 'from-pink-500 to-rose-600',
    bgColor: 'bg-pink-100',
    action: 'Book Now',
    description: 'Schedule appointments with specialists and general practitioners.',
    sparkles: true
  },
  {
    id: 'health_records',
    icon: <FileText className="h-6 w-6" />,
    color: 'from-teal-500 to-cyan-600',
    bgColor: 'bg-teal-100',
    action: 'View Records',
    description: 'Access and manage your digital health records securely.',
    sparkles: true
  },
  {
    id: 'emergency_care',
    icon: <Ambulance className="h-6 w-6" />,
    color: 'from-red-500 to-rose-600',
    bgColor: 'bg-red-100',
    action: 'Get Help',
    description: '24/7 emergency medical assistance and ambulance services.',
    sparkles: true
  },
  {
    id: 'mental_health',
    icon: <Brain className="h-6 w-6" />,
    color: 'from-yellow-500 to-amber-600',
    bgColor: 'bg-yellow-100',
    action: 'Get Support',
    description: 'Professional mental health counseling and therapy services.',
    sparkles: true
  },
  {
    id: 'preventive_care',
    icon: <Heart className="h-6 w-6" />,
    color: 'from-rose-500 to-pink-600',
    bgColor: 'bg-rose-100',
    action: 'Learn More',
    description: 'Health screenings and preventive care programs.',
    sparkles: true
  },
  {
    id: 'specialist_care',
    icon: <Stethoscope className="h-6 w-6" />,
    color: 'from-cyan-500 to-blue-600',
    bgColor: 'bg-cyan-100',
    action: 'Find Specialist',
    description: 'Connect with specialized doctors for specific health conditions.',
    sparkles: true
  },
  {
    id: 'lab_services',
    icon: <Microscope className="h-6 w-6" />,
    color: 'from-violet-500 to-purple-600',
    bgColor: 'bg-violet-100',
    action: 'Book Lab',
    description: 'Comprehensive laboratory testing and diagnostic services.',
    sparkles: true
  }
];

const ServiceCards = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.8, 1, 1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [50, 0, 0, 50]);

  return (
    <motion.section 
      ref={sectionRef}
      style={{ opacity, scale, y }}
      className="py-24 bg-gradient-to-b from-white to-healthbridge-light relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-healthbridge-blue/5 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-transparent"></div>
      </div>

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <span className="text-gradient bg-clip-text text-transparent bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal">
              Our Services
            </span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Comprehensive healthcare solutions designed for the unique needs of rural and underserved communities across India.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              }
            }
          }}
        >
          {services.map((service) => (
            <motion.div
              key={service.id}
              variants={{
                hidden: { y: 20, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ 
                y: -10,
                transition: { type: "spring", stiffness: 300 }
              }}
              className="group perspective-1000"
              onHoverStart={() => setHoveredCard(service.id)}
              onHoverEnd={() => setHoveredCard(null)}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden">
                {/* 3D Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-white/50 backdrop-blur-sm"></div>
                
                {/* Icon Container with 3D Effect */}
                <div className="relative z-10">
                  <CardHeader>
                    <motion.div 
                      className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-4 relative`}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: 5,
                        transition: { type: "spring", stiffness: 300 }
                      }}
                    >
                      <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                      <div className="relative z-10 text-white">
                        {service.icon}
                      </div>
                      {service.sparkles && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                          className="absolute -top-2 -right-2"
                        >
                          <Sparkles className="h-4 w-4 text-yellow-400" />
                        </motion.div>
                      )}
                    </motion.div>
                    <CardTitle className="text-xl font-display bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                      {t(service.id)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-6 text-gray-600">
                      {service.description}
                    </CardDescription>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full border-2 hover:border-transparent transition-all duration-300 ${service.bgColor} hover:bg-gradient-to-r ${service.color} hover:text-white`}
                      >
                        {service.action}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </div>

                {/* Hover Effect Overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                
                {/* Animated Border */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-lg"
                  animate={{
                    borderColor: hoveredCard === service.id ? `var(--${service.color.split('-')[1]}-500)` : 'transparent',
                  }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ServiceCards;
