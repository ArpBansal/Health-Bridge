import { motion, useScroll, useTransform, useAnimation } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Users, Heart, Activity, Award, Clock, MapPin, Star, TrendingUp, Shield, Globe } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const stats = [
  {
    title: "Healthcare Coverage",
    value: 500,
    description: "Individuals with access to quality healthcare",
    icon: <Shield className="w-10 h-10" />,
    color: "from-healthbridge-blue to-healthbridge-teal",
    delay: 0.1
  },
  {
    title: "Global Reach",
    value: 10,
    description: "Countries with our healthcare initiatives",
    icon: <Globe className="w-10 h-10" />,
    color: "from-healthbridge-teal to-emerald-500",
    delay: 0.2
  },
  {
    title: "Growth Rate",
    value: 100,
    description: "Year-over-year expansion in services",
    icon: <TrendingUp className="w-10 h-10" />,
    color: "from-emerald-500 to-teal-500",
    delay: 0.3
  },
  {
    title: "Medical Facilities",
    value: 50,
    description: "Partner hospitals and clinics",
    icon: <Activity className="w-10 h-10" />,
    color: "from-healthbridge-blue to-indigo-500",
    delay: 0.4
  },
  {
    title: "Health Camps",
    value: 20,
    description: "Community health initiatives annually",
    icon: <Heart className="w-10 h-10" />,
    color: "from-healthbridge-teal to-cyan-500",
    delay: 0.5
  },
  {
    title: "Years of Excellence",
    value: 3,
    description: "Dedicated to healthcare innovation",
    icon: <Award className="w-10 h-10" />,
    color: "from-indigo-500 to-purple-500",
    delay: 0.6
  }
];

const AnimatedNumber = ({ value, delay }: { value: number; delay: number }) => {
  const [count, setCount] = useState(0);
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.3 });

  useEffect(() => {
    if (inView) {
      const duration = 2; // seconds
      const steps = 60; // frames per second
      const increment = value / (duration * steps);
      let currentCount = 0;
      let frameCount = 0;

      const animate = () => {
        if (frameCount < duration * steps) {
          currentCount += increment;
          setCount(Math.floor(currentCount));
          frameCount++;
          requestAnimationFrame(animate);
        } else {
          setCount(value);
        }
      };

      const timeout = setTimeout(() => {
        animate();
      }, delay * 1000);

      return () => clearTimeout(timeout);
    }
  }, [inView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay }}
      className="text-5xl font-bold text-white mb-3 min-h-[60px] flex items-center"
    >
      {count.toLocaleString()}
      {value === 200 && "%"}
      {value === 15 && "+"}
      {value === 25 && "+"}
      {value === 500 && "+"}
      {value === 1000 && "+"}
      {value === 5000000 && "+"}
    </motion.div>
  );
};

const Stats = () => {
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
      className="py-24 bg-gradient-to-br from-healthbridge-dark to-healthbridge-blue relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-healthbridge-teal/10 via-transparent to-transparent animate-pulse"></div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10"></div>
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
            Healthcare Statistics
          </h2>
          <p className="text-white/80 text-xl max-w-3xl mx-auto">
            Transforming healthcare delivery through innovation and dedication
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: stat.delay }}
              viewport={{ once: true }}
              className="group"
            >
              <div className="h-full bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-500 hover:scale-105">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${stat.color} text-white shadow-lg`}>
                    {stat.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{stat.title}</h3>
                </div>
                <AnimatedNumber value={stat.value} delay={stat.delay + 0.2} />
                <p className="text-white/80 text-lg">{stat.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          viewport={{ once: true }}
          className="mt-20 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-2xl p-12 border border-white/20"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Global Healthcare Vision</h3>
              <ul className="space-y-6">
                <li className="flex items-center gap-4 text-white">
                  <div className="p-3 rounded-lg bg-healthbridge-blue/20">
                    <Heart className="w-6 h-6 text-healthbridge-blue" />
                  </div>
                  <span className="text-lg">Expanding healthcare access worldwide</span>
                </li>
                <li className="flex items-center gap-4 text-white">
                  <div className="p-3 rounded-lg bg-healthbridge-teal/20">
                    <Clock className="w-6 h-6 text-healthbridge-teal" />
                  </div>
                  <span className="text-lg">24/7 healthcare support and assistance</span>
                </li>
                <li className="flex items-center gap-4 text-white">
                  <div className="p-3 rounded-lg bg-amber-500/20">
                    <Activity className="w-6 h-6 text-amber-400" />
                  </div>
                  <span className="text-lg">Innovative healthcare solutions</span>
                </li>
                <li className="flex items-center gap-4 text-white">
                  <div className="p-3 rounded-lg bg-indigo-500/20">
                    <Award className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-lg">Excellence in healthcare delivery</span>
                </li>
              </ul>
            </div>
            <div className="relative rounded-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&q=80&w=2670&h=2000" 
                alt="Global healthcare vision"
                className="w-full h-full object-cover rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-healthbridge-dark/80 via-transparent to-transparent"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default Stats;
