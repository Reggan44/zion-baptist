import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, PlusSquare } from 'lucide-react';
import { Button } from '../../../components/elements/Button';

interface IOSInstallPromptProps {
  isOpen: boolean;
  onClose: () => void;
}

const SafariShareIcon = () => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className="text-blue-500"
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
);

const IOSInstallPrompt: React.FC<IOSInstallPromptProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-0 left-0 right-0 bg-white rounded-t-[2.5rem] z-[101] px-6 pt-8 pb-12 text-slate-900 shadow-2xl safe-area-bottom lg:max-w-md lg:mx-auto lg:rounded-b-[2.5rem] lg:mb-8"
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Install App</h2>
              <button 
                onClick={onClose}
                className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-8">
              {/* Animation Placeholder / Visual Guide */}
              <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                <div className="flex justify-center mb-6">
                  <motion.div
                    animate={{ 
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                    className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center"
                  >
                    <img src="/pwa-192x192.png" alt="App Icon" className="w-12 h-12 rounded-xl" />
                  </motion.div>
                </div>
                <p className="text-center text-slate-600 font-medium">
                  Follow these 2 steps to add **Zion Baptist Church** to your home screen.
                </p>
              </div>

              {/* Instructions */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Tap the Share button</p>
                    <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1">
                      Located at the bottom of Safari <SafariShareIcon />
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Tap 'Add to Home Screen'</p>
                    <p className="text-slate-500 text-sm flex items-center gap-1.5 mt-1 text-wrap">
                      Scroll down slightly to find <PlusSquare size={16} className="text-slate-400" />
                    </p>
                  </div>
                </div>
              </div>

              <Button 
                onClick={onClose}
                className="w-full h-14 rounded-2xl bg-slate-900 text-white font-bold text-lg hover:bg-slate-800"
              >
                Got it
              </Button>
            </div>
            
            {/* Handle for the bottom sheet */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-1.5 bg-slate-200 rounded-full" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default IOSInstallPrompt;
