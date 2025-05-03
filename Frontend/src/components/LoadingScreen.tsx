
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type LoadingScreenProps = {
  onFinished: () => void;
};

const LoadingScreen = ({ onFinished }: LoadingScreenProps) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (progress < 100) {
        setProgress(prev => Math.min(prev + 2, 100));
      } else {
        onFinished();
      }
    }, 30);

    return () => clearTimeout(timer);
  }, [progress, onFinished]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-healthbridge-blue to-healthbridge-teal flex flex-col items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center"
      >
        <div className="w-32 h-32 relative mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 border-4 border-t-white border-opacity-30 rounded-full"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">HB</span>
          </div>
        </div>
        
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">HealthBridge</h1>
        <p className="text-white text-lg mb-6">Healthcare for Every Indian</p>
        
        <div className="w-64 h-2 bg-white/30 rounded-full mb-2 overflow-hidden">
          <motion.div 
            className="h-full bg-white rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="text-white">{progress}%</div>

        <div className="mt-6 flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-white loading-dot" />
          <div className="w-3 h-3 rounded-full bg-white loading-dot" />
          <div className="w-3 h-3 rounded-full bg-white loading-dot" />
        </div>
      </motion.div>
    </div>
  );
};

export default LoadingScreen;
