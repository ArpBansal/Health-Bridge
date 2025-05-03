import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MapPin, Phone, Star, Award, Users, Heart, 
  Brain, Shield, Globe, Sparkles,
  Microscope, Stethoscope, Activity, Bot, Dna,
  Scan, Waves, Atom, Clipboard, HeartPulse
} from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRef } from "react";

const About = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0.8]);

  const imageGrid = [
    {
      src: "https://images.pexels.com/photos/7089629/pexels-photo-7089629.jpeg",
      alt: "AI-powered medical diagnosis",
      title: "AI Diagnostics",
      description: "Advanced machine learning for accurate diagnosis"
    },
    {
      src: "https://images.pexels.com/photos/4226256/pexels-photo-4226256.jpeg",
      alt: "Telemedicine consultation",
      title: "Virtual Care",
      description: "Remote healthcare solutions"
    },
    {
      src: "https://images.pexels.com/photos/8460157/pexels-photo-8460157.jpeg",
      alt: "Medical research laboratory",
      title: "Research",
      description: "Cutting-edge medical research"
    },
    {
      src: "https://images.pexels.com/photos/7659564/pexels-photo-7659564.jpeg",
      alt: "Patient care technology",
      title: "Patient Care",
      description: "Advanced patient monitoring"
    }
  ];

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Healthcare",
      description: "Advanced artificial intelligence for precise diagnostics",
      color: "from-blue-500 to-purple-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "Global Network",
      description: "Connected healthcare ecosystem across regions",
      color: "from-green-500 to-teal-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Platform",
      description: "Enterprise-grade security for patient data",
      color: "from-orange-500 to-red-500"
    }
  ];

  const hospitals = [
    {
      id: 1,
      name: "Yashoda Super Speciality Hospital",
      address: "Kaushambi, Ghaziabad",
      phone: "+91 120 456 7890",
      specialties: ["Cardiology", "Neurology", "Oncology"],
      rating: 4.8,
      image: "https://images.pexels.com/photos/668298/pexels-photo-668298.jpeg",
      icon: <Stethoscope className="w-8 h-8" />
    },
    {
      id: 2,
      name: "Max Super Speciality Hospital",
      address: "Vaishali, Ghaziabad",
      phone: "+91 120 123 4567",
      specialties: ["Orthopedics", "Pediatrics", "Dermatology"],
      rating: 4.7,
      image: "https://images.pexels.com/photos/247786/pexels-photo-247786.jpeg",
      icon: <Microscope className="w-8 h-8" />
    },
    {
      id: 3,
      name: "Santosh Medical College & Hospital",
      address: "Ghaziabad",
      phone: "+91 120 789 0123",
      specialties: ["General Medicine", "Surgery", "Gynecology"],
      rating: 4.5,
      image: "https://images.pexels.com/photos/1692693/pexels-photo-1692693.jpeg",
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 4,
      name: "Apollo Hospitals",
      address: "Sector 26, Noida",
      phone: "+91 120 876 5432",
      specialties: ["Cardiac Sciences", "Robotic Surgery", "Transplants"],
      rating: 4.9,
      image: "https://images.pexels.com/photos/236380/pexels-photo-236380.jpeg",
      icon: <Heart className="w-8 h-8" />
    },
    {
      id: 5,
      name: "Fortis Memorial Research",
      address: "Sector 62, Noida",
      phone: "+91 120 234 5678",
      specialties: ["Cancer Care", "Nuclear Medicine", "Neurosciences"],
      rating: 4.8,
      image: "https://images.pexels.com/photos/127873/pexels-photo-127873.jpeg",
      icon: <Microscope className="w-8 h-8" />
    },
    {
      id: 6,
      name: "Medanta - The Medicity",
      address: "Sector 38, Gurgaon",
      phone: "+91 124 456 7890",
      specialties: ["Organ Transplant", "Cardiac Sciences", "Neurosciences"],
      rating: 4.9,
      image: "https://images.pexels.com/photos/263402/pexels-photo-263402.jpeg",
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 7,
      name: "AIIMS Delhi",
      address: "Ansari Nagar, New Delhi",
      phone: "+91 011 2658 8500",
      specialties: ["Multi-Specialty", "Research", "Advanced Treatment"],
      rating: 4.9,
      image: "https://images.pexels.com/photos/2324837/pexels-photo-2324837.jpeg",
      icon: <Microscope className="w-8 h-8" />
    },
    {
      id: 8,
      name: "Sir Ganga Ram Hospital",
      address: "Rajinder Nagar, Delhi",
      phone: "+91 011 2575 7575",
      specialties: ["Gastroenterology", "Nephrology", "Urology"],
      rating: 4.7,
      image: "https://images.pexels.com/photos/1250655/pexels-photo-1250655.jpeg",
      icon: <Activity className="w-8 h-8" />
    },
    {
      id: 9,
      name: "Safdarjung Hospital",
      address: "Ansari Nagar West, Delhi",
      phone: "+91 011 2673 0000",
      specialties: ["Emergency Care", "General Surgery", "Internal Medicine"],
      rating: 4.6,
      image: "https://images.pexels.com/photos/3938022/pexels-photo-3938022.jpeg",
      icon: <Heart className="w-8 h-8" />
    }
  ];

  const achievements = [
    {
      number: "500+",
      label: "AI Diagnoses",
      icon: <Brain className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500"
    },
    {
      number: "100+",
      label: "Research Papers",
      icon: <Clipboard className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500"
    },
    {
      number: "50+",
      label: "Patents Filed",
      icon: <Shield className="w-8 h-8" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      number: "1000+",
      label: "Lives Improved",
      icon: <HeartPulse className="w-8 h-8" />,
      color: "from-red-500 to-orange-500"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 relative">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Subtle Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundSize: '30px 30px',
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1.5 0H0V1.5M28.5 0H30V1.5M1.5 30H0V28.5M28.5 30H30V28.5' stroke='%234B5563' stroke-width='0.5'/%3E%3C/svg%3E")`
          }}
        />
        
        {/* Gradient Orbs */}
        <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-gradient-to-br from-blue-200/20 via-slate-200/20 to-transparent rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-slate-200/20 via-blue-200/20 to-transparent rounded-full blur-3xl transform translate-x-1/2" />
      </div>

      <Header />
      <main className="flex-1 relative" ref={containerRef}>
        {/* Hero Section */}
        <motion.div
          style={{ y, opacity, scale }}
          className="relative min-h-[80vh] flex items-center justify-center overflow-hidden"
        >
          <div className="container relative z-10 px-4 grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-left"
            >
              <motion.h1 
                className="text-6xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Future of Healthcare
              </motion.h1>
              <motion.p 
                className="text-xl text-gray-600 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Revolutionizing healthcare delivery through cutting-edge technology and compassionate care
              </motion.p>

              {/* Feature Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    className="backdrop-blur-xl bg-white/80 rounded-xl p-4 border border-blue-100 shadow-lg"
                    whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(59, 130, 246, 0.2)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                  >
                    <div className={`bg-gradient-to-br ${feature.color} p-2 rounded-lg inline-block mb-2`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
                <img 
                  src="https://images.pexels.com/photos/3825527/pexels-photo-3825527.jpeg"
                  alt="Healthcare Innovation"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Hospital Cards Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Partner Hospitals
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {hospitals.map((hospital, index) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  whileHover={{ 
                    scale: 1.02,
                    rotateY: 5,
                    z: 50
                  }}
                  className="group perspective"
                >
                  <div className="relative h-full transform-gpu transition-all duration-500 group-hover:rotate-y-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-2xl transform-gpu transition-opacity duration-500 opacity-0 group-hover:opacity-100"></div>
                    <Card className="h-full bg-white/80 backdrop-blur-xl border-blue-100 overflow-hidden shadow-lg">
                      <div className="relative h-48">
                        <img src={hospital.image} alt={hospital.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-800/90 to-transparent"></div>
                        <div className="absolute bottom-4 left-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                            {hospital.icon}
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-white">{hospital.name}</h3>
                            <div className="flex items-center gap-1 text-yellow-300">
                              <Star className="w-4 h-4" />
                              <span>{hospital.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <div className="space-y-4 text-gray-600">
                          <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5" />
                            <p>{hospital.address}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Phone className="w-5 h-5" />
                            <p>{hospital.phone}</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {hospital.specialties.map((specialty, idx) => (
                              <span 
                                key={idx}
                                className="px-3 py-1 rounded-full text-sm bg-blue-50 border border-blue-200"
                              >
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Technology Showcase Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Cutting-Edge Technology
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: <Bot className="w-8 h-8 text-white" />,
                  title: "AI Diagnostics",
                  description: "Advanced machine learning algorithms for accurate diagnosis",
                  stats: "99.9% Accuracy",
                  color: "from-purple-500 to-indigo-500"
                },
                {
                  icon: <Dna className="w-8 h-8 text-white" />,
                  title: "Genetic Analysis",
                  description: "Personalized medicine through genetic profiling",
                  stats: "100K+ Profiles",
                  color: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Scan className="w-8 h-8 text-white" />,
                  title: "3D Imaging",
                  description: "Advanced medical imaging with 3D reconstruction",
                  stats: "Real-time Processing",
                  color: "from-teal-500 to-green-500"
                },
                {
                  icon: <Waves className="w-8 h-8 text-white" />,
                  title: "Neural Mapping",
                  description: "Brain activity monitoring and analysis",
                  stats: "High Precision",
                  color: "from-orange-500 to-red-500"
                }
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-blue-100 shadow-lg">
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl bg-gradient-to-br ${tech.color}`}>
                          {tech.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{tech.title}</h3>
                          <p className="text-blue-600">{tech.stats}</p>
                        </div>
                      </div>
                      <p className="text-gray-600">{tech.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Innovation Highlights Section */}
        <section className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 to-blue-50">
          <div className="container px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Healthcare Innovations
            </motion.h2>

            <div className="grid lg:grid-cols-2 gap-12">
              {[
                {
                  title: "Quantum Computing in Healthcare",
                  description: "Leveraging quantum algorithms for drug discovery and molecular simulation, accelerating medical research exponentially.",
                  icon: <Atom className="w-12 h-12 text-white" />,
                  stats: "100x Faster Processing",
                  color: "from-violet-500 to-purple-500"
                },
                {
                  title: "Nanobot Treatment",
                  description: "Microscopic robots programmed for targeted drug delivery and precise surgical procedures at the cellular level.",
                  icon: <Bot className="w-12 h-12 text-white" />,
                  stats: "99.9% Precision",
                  color: "from-blue-500 to-indigo-500"
                },
                {
                  title: "AI-Powered Diagnostics",
                  description: "Advanced machine learning algorithms analyzing medical imaging and patient data for early disease detection and personalized treatment plans.",
                  icon: <Brain className="w-12 h-12 text-white" />,
                  stats: "95% Early Detection Rate",
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  title: "Telemedicine Revolution",
                  description: "Next-generation virtual healthcare platform with AR/VR integration for immersive remote consultations and real-time health monitoring.",
                  icon: <Globe className="w-12 h-12 text-white" />,
                  stats: "24/7 Accessibility",
                  color: "from-emerald-500 to-green-500"
                },
                {
                  title: "Blockchain Health Records",
                  description: "Secure, decentralized patient health records ensuring data integrity and seamless sharing across healthcare providers.",
                  icon: <Shield className="w-12 h-12 text-white" />,
                  stats: "100% Data Security",
                  color: "from-amber-500 to-orange-500"
                },
                {
                  title: "Gene Therapy Breakthroughs",
                  description: "Revolutionary gene editing techniques for treating genetic disorders and developing personalized medicine solutions.",
                  icon: <Dna className="w-12 h-12 text-white" />,
                  stats: "85% Success Rate",
                  color: "from-rose-500 to-red-500"
                }
              ].map((innovation, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative group"
                >
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-blue-100 shadow-lg">
                    <div className="p-8">
                      <div className="flex items-center gap-4 mb-6">
                        <div className={`p-4 rounded-xl bg-gradient-to-br ${innovation.color}`}>
                          {innovation.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-800">{innovation.title}</h3>
                          <p className="text-blue-600">{innovation.stats}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 leading-relaxed">{innovation.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Expert Team
            </motion.h2>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dr. Rajesh Kumar",
                  role: "Chief Medical Officer",
                  specialization: "Cardiology",
                  experience: "15+ years",
                  image: "https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg",
                  color: "from-blue-500 to-indigo-500"
                },
                {
                  name: "Dr. Priya Sharma",
                  role: "Head of Research",
                  specialization: "Neurology",
                  experience: "12+ years",
                  image: "https://images.pexels.com/photos/5407206/pexels-photo-5407206.jpeg",
                  color: "from-purple-500 to-pink-500"
                },
                {
                  name: "Dr. Amit Patel",
                  role: "Technology Director",
                  specialization: "AI in Healthcare",
                  experience: "10+ years",
                  image: "https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg",
                  color: "from-green-500 to-teal-500"
                },
                {
                  name: "Dr. Sarah Johnson",
                  role: "Head of Oncology",
                  specialization: "Cancer Research",
                  experience: "14+ years",
                  image: "https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg",
                  color: "from-orange-500 to-red-500"
                },
                {
                  name: "Dr. Michael Chen",
                  role: "Surgical Director",
                  specialization: "Robotic Surgery",
                  experience: "16+ years",
                  image: "https://images.pexels.com/photos/5452291/pexels-photo-5452291.jpeg",
                  color: "from-cyan-500 to-blue-500"
                },
                {
                  name: "Dr. Anita Desai",
                  role: "Research Scientist",
                  specialization: "Genetic Engineering",
                  experience: "11+ years",
                  image: "https://images.pexels.com/photos/5407113/pexels-photo-5407113.jpeg",
                  color: "from-violet-500 to-purple-500"
                }
              ].map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="group"
                >
                  <div className="relative rounded-2xl overflow-hidden backdrop-blur-xl bg-white/80 border border-blue-100 shadow-lg">
                    <div className="aspect-square relative">
                      <img 
                        src={member.image} 
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 text-white">
                        <h3 className="text-2xl font-bold">{member.name}</h3>
                        <p className="text-blue-200">{member.role}</p>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-2">
                        <p className="text-gray-600"><span className="font-semibold">Specialization:</span> {member.specialization}</p>
                        <p className="text-gray-600"><span className="font-semibold">Experience:</span> {member.experience}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Achievement Stats Section */}
        <section className="py-24 relative overflow-hidden">
          <div className="container px-4">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold text-center mb-16 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              Our Achievements
            </motion.h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="relative group"
                >
                  <div className="relative backdrop-blur-xl bg-white/80 rounded-2xl p-6 border border-blue-100 shadow-lg">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${achievement.color} mb-4`}>
                      {achievement.icon}
                    </div>
                    <h4 className="text-3xl font-bold text-gray-800 mb-2">{achievement.number}</h4>
                    <p className="text-gray-600">{achievement.label}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;
