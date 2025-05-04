import { motion, useScroll, useTransform } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Heart, Activity, Award, Clock, MapPin, Star, Leaf, Target, Smile } from "lucide-react";
import { useRef } from "react";

const impactData = [
  {
    title: "Community Impact",
    value: "500+",
    description: "Lives transformed through healthcare initiatives",
    icon: <Heart className="w-10 h-10" />,
    color: "from-healthbridge-blue to-healthbridge-teal",
    delay: 0.1
  },
  {
    title: "Rural Development",
    value: "100+",
    description: "Villages with improved healthcare infrastructure",
    icon: <MapPin className="w-10 h-10" />,
    color: "from-healthbridge-teal to-emerald-500",
    delay: 0.2
  },
  {
    title: "Health Awareness",
    value: "50+",
    description: "Individuals educated on preventive healthcare",
    icon: <Target className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-500",
    delay: 0.3
  },
  {
    title: "Patient Satisfaction",
    value: "95%",
    description: "Positive feedback from community members",
    icon: <Smile className="w-10 h-10" />,
    color: "from-healthbridge-blue to-indigo-500",
    delay: 0.4
  },
  {
    title: "Sustainable Impact",
    value: "20+",
    description: "Environmentally conscious healthcare delivery",
    icon: <Leaf className="w-10 h-10" />,
    color: "from-healthbridge-teal to-cyan-500",
    delay: 0.5
  },
  {
    title: "Years of Service",
    value: "3+",
    description: "Dedicated to community healthcare",
    icon: <Award className="w-10 h-10" />,
    color: "from-indigo-500 to-purple-500",
    delay: 0.6
  }
];

const ImpactSection = () => {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
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
      className="py-24 bg-gradient-to-br from-healthbridge-dark to-healthbridge-teal relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-healthbridge-blue/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/dots.svg')] bg-repeat opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-healthbridge-dark/50 to-transparent"></div>
      </div>

      <div className="container relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6 text-white">
            Community Impact
          </h2>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Making a difference in communities through sustainable healthcare initiatives
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {impactData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: item.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105 relative overflow-hidden">
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-healthbridge-blue/20 to-healthbridge-teal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-6">
                    <motion.div 
                      className={`p-4 rounded-xl bg-gradient-to-br ${item.color} text-white shadow-lg`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {item.icon}
                    </motion.div>
                    <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                  </div>
                  <motion.div 
                    className="text-5xl font-bold text-white mb-3 min-h-[60px] flex items-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, delay: item.delay + 0.2 }}
                    viewport={{ once: true }}
                  >
                    {item.value}
                  </motion.div>
                  <p className="text-white/80 text-lg">{item.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20 relative overflow-hidden"
        >
          {/* Hover Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-healthbridge-blue/20 to-healthbridge-teal/20 opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
          
          <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Community Commitment</h3>
              <ul className="space-y-6">
                <motion.li 
                  className="flex items-center gap-4 text-white"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded-lg bg-healthbridge-blue/20">
                    <Heart className="w-6 h-6 text-healthbridge-blue" />
                  </div>
                  <span className="text-lg">Empowering local communities</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-4 text-white"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded-lg bg-healthbridge-teal/20">
                    <Activity className="w-6 h-6 text-healthbridge-teal" />
                  </div>
                  <span className="text-lg">Sustainable healthcare solutions</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-4 text-white"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded-lg bg-emerald-500/20">
                    <Leaf className="w-6 h-6 text-emerald-400" />
                  </div>
                  <span className="text-lg">Environmentally friendly practices</span>
                </motion.li>
                <motion.li 
                  className="flex items-center gap-4 text-white"
                  whileHover={{ x: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="p-3 rounded-lg bg-indigo-500/20">
                    <Users className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-lg">Community-driven initiatives</span>
                </motion.li>
              </ul>
            </div>
            <motion.div 
              className="relative rounded-2xl overflow-hidden"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2670&h=2000" 
                alt="Community impact"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-healthbridge-dark/80 via-transparent to-transparent"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default ImpactSection;
