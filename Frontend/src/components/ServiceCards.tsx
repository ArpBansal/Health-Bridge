import { motion } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Brain, Microscope, Activity, Database, FileText } from "lucide-react";

const services = [
  {
    id: 'AI Chat',
    icon: <Bot className="h-6 w-6" />,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-gradient-to-br from-blue-400 to-blue-500',
    action: 'Start Chat',
    description: 'Get instant medical advice and information from our AI healthcare assistant.'
  },
  {
    id: 'Cancer Detection',
    icon: <Microscope className="h-6 w-6" />,
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-gradient-to-br from-teal-400 to-teal-500',
    action: 'Analyze Image',
    description: 'Upload medical images for AI-powered cancer detection and analysis.'
  },
  {
    id: 'Mental Health',
    icon: <Brain className="h-6 w-6" />,
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-gradient-to-br from-indigo-400 to-indigo-500',
    action: 'Get Support',
    description: 'Access mental health resources and support services.'
  },
  {
    id: 'Health Monitoring',
    icon: <Activity className="h-6 w-6" />,
    color: 'from-cyan-500 to-cyan-600',
    bgColor: 'bg-gradient-to-br from-cyan-400 to-cyan-500',
    action: 'Monitor Health',
    description: 'Track and monitor your health metrics and progress.'
  },
  {
    id: 'Data Analytics',
    icon: <Database className="h-6 w-6" />,
    color: 'from-sky-500 to-sky-600',
    bgColor: 'bg-gradient-to-br from-sky-400 to-sky-500',
    action: 'View Analytics',
    description: 'Access comprehensive health data analytics and insights.'
  },
  {
    id: 'Medical Records',
    icon: <FileText className="h-6 w-6" />,
    color: 'from-violet-500 to-violet-600',
    bgColor: 'bg-gradient-to-br from-violet-400 to-violet-500',
    action: 'View Records',
    description: 'Securely access and manage your medical records and history.'
  }
];

const ServiceCards = () => {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 text-blue-600">
            Healthcare Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empowering your health journey with advanced technology
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                scale: 1.02,
                transition: { type: "spring", stiffness: 300 }
              }}
            >
              <Card className="h-full border-none shadow-lg hover:shadow-2xl transition-all duration-300 group relative overflow-hidden">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                
                {/* Card Content */}
                <div className="relative z-10">
                  <CardHeader>
                    <motion.div 
                      className={`w-14 h-14 rounded-xl ${service.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                      whileHover={{ rotate: 5 }}
                    >
                      <div className="text-white drop-shadow-md">
                        {service.icon}
                      </div>
                    </motion.div>
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {service.id}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-6 text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                      {service.description}
                    </CardDescription>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className={`w-full border-2 hover:border-transparent transition-all duration-300 ${service.bgColor} hover:bg-gradient-to-r ${service.color} text-white hover:text-white group-hover:shadow-lg`}
                      >
                        {service.action}
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                      </Button>
                    </motion.div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceCards;
