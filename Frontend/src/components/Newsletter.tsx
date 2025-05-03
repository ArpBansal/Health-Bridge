import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { Mail, Send, Sparkles, CheckCircle, XCircle, Bell, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const Newsletter = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      if (email.includes("@")) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    }, 1500);
  };
  
  return (
    <section className="relative overflow-hidden py-24">
      {/* Enhanced 3D Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-teal-50/30 to-purple-50/20" />
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] opacity-[0.03]" />
        
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                width: "40%",
                height: "40%",
                background: `radial-gradient(circle, ${
                  i === 0 ? "rgba(59, 130, 246, 0.03)" :
                  i === 1 ? "rgba(45, 212, 191, 0.03)" :
                  "rgba(168, 85, 247, 0.03)"
                } 0%, transparent 70%)`,
                top: `${i * 30}%`,
                left: `${i * 30}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 15 + i * 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Content Container with Enhanced 3D Effect */}
      <div className="container relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-2xl mx-auto"
        >
          {/* Enhanced 3D Icon Container */}
          <div className="relative w-24 h-24 mx-auto mb-10">
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-2xl"
              animate={{
                rotate: [0, 10, 0],
                scale: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <motion.div
              className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-2xl"
              animate={{
                rotate: [0, -8, 0],
                scale: [0.95, 1.05, 0.95],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.2,
              }}
            />
            <motion.div
              className="relative h-full flex items-center justify-center"
              animate={{
                y: [-4, 4, -4],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Mail className="w-10 h-10 text-healthbridge-blue/80" />
              <motion.div
                className="absolute -top-1 -right-1"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Bell className="w-5 h-5 text-healthbridge-teal/80" />
              </motion.div>
            </motion.div>
          </div>

          {/* Enhanced Title with 3D Effect */}
          <motion.div
            className="text-center space-y-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold">
              <span className="inline-block bg-gradient-to-r from-healthbridge-blue via-healthbridge-teal to-purple-500 bg-clip-text text-transparent pb-2">
                {t('subscribe')}
              </span>
            </h2>
            <p className="text-lg text-gray-600/90 max-w-xl mx-auto">
              Stay connected with the latest healthcare innovations and community initiatives
              <motion.span
                className="inline-block ml-2"
                animate={{
                  rotate: [0, 20, 0],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Star className="w-5 h-5 text-yellow-400 inline" />
              </motion.span>
            </p>
          </motion.div>

          {/* Enhanced Form Container */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            onSubmit={handleSubmit}
            className="relative"
          >
            <motion.div
              className={cn(
                "p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg",
                "hover:shadow-xl hover:-translate-y-1",
                "border border-blue-100/30",
                "transition-all duration-300 ease-out",
                isHovered && "scale-[1.02] shadow-blue-100/20"
              )}
              whileHover={{
                boxShadow: "0 20px 40px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="flex gap-3">
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  className="flex-1 border-0 bg-transparent text-gray-800 placeholder:text-gray-400 h-12 text-lg"
                />
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className={cn(
                    "px-6 h-12",
                    "bg-gradient-to-r from-healthbridge-blue via-healthbridge-teal to-purple-500",
                    "hover:opacity-90 transition-all duration-300",
                    "shadow-lg hover:shadow-xl hover:shadow-blue-100/30",
                    "relative overflow-hidden group"
                  )}
                >
                  <span className="relative z-10 flex items-center gap-2 text-white font-medium">
                    {status === "loading" ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Send className="w-5 h-5" />
                      </motion.div>
                    ) : (
                      <>
                        {t('subscribe_button')}
                        <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </span>
                </Button>
              </div>
            </motion.div>

            {/* Enhanced Status Messages */}
            <AnimatePresence mode="wait">
              {status && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className={cn(
                    "absolute left-0 right-0 mt-4 p-4 rounded-xl",
                    "backdrop-blur-sm shadow-lg",
                    status === "success"
                      ? "bg-green-50/90 text-green-600 border border-green-100"
                      : "bg-red-50/90 text-red-600 border border-red-100"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {status === "success" ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Thank you for joining our community!</span>
                        <Sparkles className="w-4 h-4 ml-auto animate-pulse text-yellow-500" />
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5" />
                        <span className="font-medium">Please enter a valid email address</span>
                      </>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.form>

          {/* Enhanced Privacy Note */}
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-16 text-sm text-gray-500/80 text-center"
          >
            We value your privacy. Unsubscribe anytime with one click.
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/50 to-transparent" />
    </section>
  );
};

export default Newsletter;
