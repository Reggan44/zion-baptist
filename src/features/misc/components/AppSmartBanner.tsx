import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight } from 'lucide-react';
import IOSInstallPrompt from './IOSInstallPrompt';

const AppSmartBanner: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showIOSPrompt, setShowIOSPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [platform, setPlatform] = useState<'ios' | 'android' | 'other'>('other');

  useEffect(() => {
    // 1. Platform & Standalone Detection
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    const isIOS = /iPad|iPhone|iPod/.test(ua) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    
    setPlatform(isIOS ? 'ios' : isAndroid ? 'android' : 'other');

    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                         (window.navigator as any).standalone;
    
    // Check for Force Mode (for testing)
    const urlParams = new URLSearchParams(window.location.search);
    const isForceMode = urlParams.get('force-ios-guide') === 'true' || urlParams.get('force-app-banner') === 'true';
    
    // 2. Handle Android Install Prompt
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // If we have the prompt and it's Android, we might want to show the banner
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // 3. Banner Visibility Logic (3-second delay)
    const isDismissed = localStorage.getItem('app-pwa-banner-dismissed');
    const dismissTime = isDismissed ? parseInt(isDismissed) : 0;
    const now = new Date().getTime();
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    
    if (isForceMode || ((isIOS || isAndroid) && !isStandalone && (now - dismissTime > oneWeek))) {
      const timer = setTimeout(() => setShowBanner(true), 3000);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      };
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem('app-pwa-banner-dismissed', new Date().getTime().toString());
    setShowBanner(false);
  };

  const handleInstallClick = async () => {
    if (platform === 'ios' || new URLSearchParams(window.location.search).get('force-ios-guide') === 'true') {
      setShowIOSPrompt(true);
    } else if (deferredPrompt) {
      // Android / Chrome flow
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowBanner(false);
      }
      setDeferredPrompt(null);
    } else {
      // Fallback if no prompt is available yet
      alert("To install, use your browser's menu (three dots) and select 'Install App' or 'Add to Home Screen'.");
    }
  };

  return (
    <>
      <AnimatePresence>
        {showBanner && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[90] p-3 px-4 md:px-6"
          >
            <div className="max-w-4xl mx-auto bg-slate-900 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl flex items-center justify-between gap-4 p-3 pr-4">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-10 h-10 rounded-xl bg-white flex-shrink-0 shadow-sm overflow-hidden p-1">
                  <img src="/pwa-192x192.png" alt="App Icon" className="w-full h-full rounded-lg" />
                </div>
                <div className="overflow-hidden">
                  <div className="flex items-center gap-2">
                    <h4 className="text-white font-bold text-sm truncate">Zion Baptist Church</h4>
                    <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase">Official</span>
                  </div>
                  <p className="text-slate-400 text-[10px] truncate uppercase tracking-widest font-bold">Fast • Offline • Reliable</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={handleInstallClick}
                  className="px-4 py-2 bg-secondary text-secondary-foreground text-xs font-bold rounded-full hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/20 flex items-center gap-1.5 whitespace-nowrap active:scale-95"
                >
                  Install <ArrowRight size={12} />
                </button>
                <button
                  onClick={handleDismiss}
                  className="p-1.5 text-slate-500 hover:text-white transition-colors h-8 w-8 flex items-center justify-center rounded-full hover:bg-white/10"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <IOSInstallPrompt isOpen={showIOSPrompt} onClose={() => setShowIOSPrompt(false)} />
    </>
  );
};

export default AppSmartBanner;
