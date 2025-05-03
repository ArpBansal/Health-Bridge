import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: 1,
    name: "Rajesh Kumar",
    location: "Rural Bihar",
    role: "Farmer",
    image: "https://images.unsplash.com/photo-1606041008023-472dfb5e530f?w=200&h=200&fit=crop&auto=format&q=60",
    content: "HealthBridge's telemedicine service saved my wife's life. We couldn't afford to travel to the city hospital, but the online consultation helped us get the right treatment.",
    rating: 5
  },
  {
    id: 2,
    name: "Priya Devi",
    location: "Tribal Area, Jharkhand",
    role: "Community Health Worker",
    image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop&auto=format&q=60",
    content: "The mobile health camps organized by HealthBridge have transformed healthcare access in our remote village. Now, we get regular checkups and medicines.",
    rating: 5
  },
  {
    id: 3,
    name: "Arjun Singh",
    location: "Rural Rajasthan",
    role: "Student",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=60",
    content: "The AI health assistant helped me understand my symptoms and guided me to the right treatment. It's like having a doctor in your pocket!",
    rating: 4
  },
  {
    id: 4,
    name: "Meena Patel",
    location: "Gujarat Village",
    role: "Housewife",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&auto=format&q=60",
    content: "Medicine delivery service is a blessing for elderly people like my mother. We get quality medicines at our doorstep.",
    rating: 5
  },
  {
    id: 5,
    name: "Suresh Yadav",
    location: "Uttar Pradesh Village",
    role: "Daily Wage Worker",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&auto=format&q=60",
    content: "Free health camps have helped my family stay healthy. The doctors are very caring and explain everything clearly.",
    rating: 5
  },
  {
    id: 6,
    name: "Lakshmi Bai",
    location: "Rural Maharashtra",
    role: "Anganwadi Worker",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop&auto=format&q=60",
    content: "HealthBridge's preventive care programs have reduced common illnesses in our village. The health education sessions are very helpful.",
    rating: 4
  },
  {
    id: 7,
    name: "Rahul Verma",
    location: "Tribal Area, Odisha",
    role: "Community Leader",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&auto=format&q=60",
    content: "The mental health support has helped many in our community deal with stress and anxiety. It's a much-needed service.",
    rating: 5
  },
  {
    id: 8,
    name: "Anita Kumari",
    location: "Rural West Bengal",
    role: "Teacher",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c941b3d3?w=200&h=200&fit=crop&auto=format&q=60",
    content: "The health records system helps us track our medical history easily. No more lost prescriptions or forgotten treatments.",
    rating: 4
  }
];

const Testimonials = () => {
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
              Voices from the Community
            </span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Hear from those whose lives have been transformed by HealthBridge's services
          </motion.p>
        </motion.div>

        <div className="relative overflow-hidden">
          {/* Single Row - Continuous Flow */}
          <motion.div
            className="flex gap-6"
            animate={{
              x: [0, -2000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 30,
                ease: "linear",
              },
            }}
          >
            {/* First Set */}
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                className="flex-shrink-0 w-[350px]"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal"></div>
                  <Quote className="absolute top-4 right-4 h-6 w-6 text-healthbridge-blue/20" />
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 ring-2 ring-healthbridge-blue/20">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            {/* Second Set (Duplicate for seamless loop) */}
            {testimonials.map((testimonial) => (
              <motion.div
                key={`duplicate-${testimonial.id}`}
                className="flex-shrink-0 w-[350px]"
                whileHover={{ y: -10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="bg-white rounded-xl shadow-lg p-6 h-full relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-healthbridge-blue to-healthbridge-teal"></div>
                  <Quote className="absolute top-4 right-4 h-6 w-6 text-healthbridge-blue/20" />
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-4 ring-2 ring-healthbridge-blue/20">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h4 className="font-display font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}, {testimonial.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{testimonial.content}</p>
                  <div className="flex items-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Testimonials;
