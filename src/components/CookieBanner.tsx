import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface CookieBannerProps {
  onAccept: () => void;
  onDecline: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({ onAccept, onDecline }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    onAccept();
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    onDecline();
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-sm z-50"
        >
          <div className="bg-paper border border-ink/10 p-6 shadow-2xl relative overflow-hidden group">
            {/* Subtle gold accent line */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gold/30 group-hover:bg-gold transition-colors duration-500" />
            
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-ink/40">Privacy Preference</h3>
              <button 
                onClick={() => setIsVisible(false)}
                className="text-ink/30 hover:text-ink transition-colors"
              >
                <X size={14} />
              </button>
            </div>
            
            <p className="text-xs text-ink/70 leading-relaxed mb-6">
              We use cookies to enhance your experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={handleAccept}
                className="flex-1 bg-ink text-paper text-[10px] font-bold uppercase tracking-widest py-3 hover:bg-gold hover:text-ink transition-all duration-300"
              >
                Accept
              </button>
              <button
                onClick={handleDecline}
                className="flex-1 border border-ink/10 text-ink/60 text-[10px] font-bold uppercase tracking-widest py-3 hover:border-ink hover:text-ink transition-all duration-300"
              >
                Decline
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
