import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LogOut, User as UserIcon, Activity, Calendar, MessageSquare, Sparkles, Cpu, BarChart3, Bell, HelpCircle, TrendingUp, Link2, ShieldCheck, Sun, Moon, BellRing, CheckCircle, Award, Star, ArrowUpRight, Loader2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const quickLinks = [
  { label: "AI Chat", icon: <Cpu className="h-5 w-5 text-cyan-400" />, to: "/ai-chat" },
  { label: "Schemes", icon: <BarChart3 className="h-5 w-5 text-blue-400" />, to: "/schemes" },
  { label: "Blog", icon: <MessageSquare className="h-5 w-5 text-teal-400" />, to: "/blog" },
  { label: "Contact", icon: <Link2 className="h-5 w-5 text-cyan-400" />, to: "/contact" },
];

const healthTips = [
  "Stay hydrated and drink plenty of water.",
  "Take regular breaks from screens to rest your eyes.",
  "Incorporate at least 30 minutes of physical activity daily.",
  "Eat a balanced diet rich in fruits and vegetables.",
  "Prioritize sleep for better mental and physical health.",
  "Practice mindfulness or meditation to reduce stress."
];

const achievements = [
  { icon: <CheckCircle className="h-6 w-6 text-green-400" />, label: "First Chat", achieved: true },
  { icon: <Award className="h-6 w-6 text-yellow-400" />, label: "7-Day Streak", achieved: false },
  { icon: <Star className="h-6 w-6 text-cyan-400" />, label: "Milestone Reached", achieved: false },
];

const timeline = [
  { icon: <Cpu className="h-5 w-5 text-cyan-400" />, label: "Chatted with AI", time: "Today, 10:30 AM" },
  { icon: <Sparkles className="h-5 w-5 text-teal-400" />, label: "Received Health Tip", time: "Yesterday, 8:00 PM" },
  { icon: <Activity className="h-5 w-5 text-blue-400" />, label: "Progress Updated", time: "2 days ago" },
];

const AccountDashboard = () => {
  const { user, logout } = useAuth();
  console.log(user)
  const navigate = useNavigate();
  const [tipIndex, setTipIndex] = useState(0);
  const [darkMode, setDarkMode] = useState(() => {
    // Check if user has a dark mode preference in localStorage
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  const [notifications, setNotifications] = useState(true);
  const [recentConversations, setRecentConversations] = useState(() => {
    // Try to load from localStorage
    const saved = localStorage.getItem('ai_recent_conversations');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });
  const [showAd, setShowAd] = useState(true);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    // Update document class for dark mode
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Rotate health tips every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % healthTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-healthbridge-light to-white'} py-10 px-4`}>
      <div className="container mx-auto max-w-6xl">
        {/* Back to Home Button */}
        <div className="w-full flex justify-end mb-4">
          <Button
            className={`${darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-healthbridge-blue hover:bg-healthbridge-blue/90'} text-white`}
            onClick={() => navigate("/")}
          >
            Back to Home
          </Button>
        </div>
        
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4"
        >
          <div className="flex items-center gap-4">
            <motion.div
              className={`rounded-full ${darkMode ? 'bg-gray-800' : 'bg-healthbridge-blue'} p-5 text-white flex items-center justify-center shadow-md`}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
            >
              <UserIcon className="h-12 w-12" />
            </motion.div>
            <div>
              <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>
                Welcome, {user?.username}
              </h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} text-sm mt-1 flex items-center gap-2`}>
                <Sparkles className={`h-4 w-4 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-teal'}`} />
                {user?.email || "No email on file"}
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            className={`${darkMode ? 'border-gray-700 text-gray-300 hover:bg-gray-800' : 'border-healthbridge-blue text-healthbridge-blue hover:bg-healthbridge-blue/10'}`}
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            <LogOut className="h-5 w-5 mr-2" /> Log out
          </Button>
        </motion.div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                      <Activity className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                    </div>
                    <div>
                      <div className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>1</div>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Total Logins</div>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="relative"
              >
                <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                      <Calendar className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                    </div>
                    <div>
                      <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>Just now</div>
                      <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Last Login</div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Progress Card */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                    <TrendingUp className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                  </div>
                  <div>
                    <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>40%</div>
                    <div className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Milestone Progress</div>
                  </div>
                </div>
                <div className={`w-full ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} rounded-full h-2`}>
                  <div className={`${darkMode ? 'bg-healthbridge-teal' : 'bg-healthbridge-blue'} h-2 rounded-full`} style={{ width: '40%' }}></div>
                </div>
              </Card>
            </motion.div>

            {/* Recent AI Conversations */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                    <MessageSquare className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>Recent AI Conversations</div>
                </div>
                <div className="space-y-3">
                  {recentConversations.length === 0 ? (
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>No recent conversations yet.</p>
                  ) : (
                    recentConversations.map((conv: any, idx: number) => (
                      <div key={conv.id || idx} className={`flex items-center justify-between p-3 ${darkMode ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>
                        <div className="flex items-center gap-2">
                          <Cpu className={`h-4 w-4 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{conv.title}</span>
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{new Date(conv.date).toLocaleDateString()}</span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Quick Links */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                    <Link2 className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>Quick Links</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {quickLinks.map(link => (
                    <Button
                      key={link.label}
                      onClick={() => navigate(link.to)}
                      className={`${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-healthbridge-blue hover:bg-healthbridge-blue/90'} text-white`}
                    >
                      <span className="flex items-center gap-2">{link.icon}{link.label}</span>
                    </Button>
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Health Tips */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                    <Sparkles className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>Health Tip</div>
                </div>
                <div className={`${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'} rounded-lg p-4`}>
                  <p className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>{healthTips[tipIndex]}</p>
                </div>
                <div className="flex gap-2 mt-4 justify-center">
                  {healthTips.map((_, idx) => (
                    <button
                      key={idx}
                      className={`w-2 h-2 rounded-full ${tipIndex === idx ? (darkMode ? 'bg-healthbridge-teal' : 'bg-healthbridge-blue') : (darkMode ? 'bg-gray-600' : 'bg-gray-300')}`}
                      onClick={() => setTipIndex(idx)}
                      aria-label={`Show tip ${idx + 1}`}
                    />
                  ))}
                </div>
              </Card>
            </motion.div>

            {/* Personalization */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="relative"
            >
              <Card className={`${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-sm hover:shadow-md transition-shadow duration-300 p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-healthbridge-light'}`}>
                    <Sun className={`h-6 w-6 ${darkMode ? 'text-healthbridge-teal' : 'text-healthbridge-blue'}`} />
                  </div>
                  <div className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-healthbridge-blue'}`}>Personalization</div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Dark Mode</span>
                    <button
                      className={`w-16 h-7 rounded-full border-2 border-black/50 flex items-center transition-colors duration-300 ${darkMode ? 'bg-gradient-to-r from-blue-900/90 to-blue-950/90' : 'bg-gradient-to-r from-blue-50/90 to-white'} shadow-sm backdrop-blur-sm`}
                      onClick={() => setDarkMode((d) => !d)}
                      aria-label="Toggle dark mode"
                    >
                      <span className={`block w-6 h-6 rounded-full ${darkMode ? 'bg-blue-400 border border-blue-500/50' : 'bg-slate-700 border border-slate-800/50'} shadow-sm transform transition-transform duration-300 ${darkMode ? 'translate-x-9' : 'translate-x-1'}`}></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className={`${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>Notifications</span>
                    <button
                      className={`w-16 h-7 rounded-full border-2 border-black/50 flex items-center transition-colors duration-300 ${notifications ? (darkMode ? 'bg-gradient-to-r from-blue-900/90 to-blue-950/90' : 'bg-gradient-to-r from-blue-500/90 to-blue-400/90') : (darkMode ? 'bg-gradient-to-r from-blue-900/90 to-blue-950/90' : 'bg-gradient-to-r from-blue-50/90 to-white')} shadow-sm backdrop-blur-sm`}
                      onClick={() => setNotifications((n) => !n)}
                      aria-label="Toggle notifications"
                    >
                      <span className={`block w-6 h-6 rounded-full ${darkMode ? 'bg-blue-400 border border-blue-500/50' : 'bg-slate-700 border border-slate-800/50'} shadow-sm transform transition-transform duration-300 ${notifications ? 'translate-x-9' : 'translate-x-1'}`}></span>
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard; 