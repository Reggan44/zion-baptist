import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, BellRing, Settings, Info, AlertTriangle, Loader2, CheckCircle } from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import { useNotifications } from '../../../hooks/useNotifications';

const NotificationModal: React.FC = () => {
  const { permission, requestPermission, isSupported, isLoading, error } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const isDismissed = localStorage.getItem('notification-modal-dismissed');
    const dismissTime = isDismissed ? parseInt(isDismissed) : 0;
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    if (isSupported && permission === 'default' && now - dismissTime > oneMonth) {
      const timer = setTimeout(() => setIsOpen(true), 10_000);
      return () => clearTimeout(timer);
    }
  }, [permission, isSupported]);

  const handleRequest = async () => {
    await requestPermission();
    if (Notification.permission === 'granted') {
      setSuccess(true);
      setTimeout(() => setIsOpen(false), 2000);
    }
  };

  const handleDismiss = () => {
    localStorage.setItem('notification-modal-dismissed', Date.now().toString());
    setIsOpen(false);
  };

  if (!isSupported) return null;

  const errorMessage = (() => {
    if (error === 'token-failed')
      return 'Notifications are set up but we couldn\'t register your device. Please try again or refresh the page.';
    if (error === 'sw-failed')
      return 'Your browser couldn\'t start the background service. Try refreshing the page.';
    if (error === 'unsupported')
      return 'Your browser doesn\'t fully support push notifications. Try Chrome or Edge.';
    return null;
  })();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-md z-[100]"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 100 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 100 }}
            className="fixed md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bottom-0 left-0 w-full md:w-[calc(100%-2rem)] md:max-w-md bg-white rounded-t-[2.5rem] md:rounded-[2.5rem] shadow-[0_-20px_50px_-12px_rgba(0,0,0,0.15)] md:shadow-2xl z-[101] overflow-hidden"
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleDismiss}
                className="p-2 rounded-full bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 pt-12 text-center">
              {/* Icon */}
              <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-6 relative">
                {success ? (
                  <CheckCircle size={40} className="text-green-500" />
                ) : (
                  <motion.div
                    animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <BellRing size={40} className="text-primary" />
                  </motion.div>
                )}
                {!success && (
                  <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white animate-pulse" />
                )}
              </div>

              {/* Title */}
              <h2 className="text-2xl font-black text-slate-900 mb-3 tracking-tight uppercase">
                {success ? 'You\'re all set!' : 'Stay Connected'}
              </h2>

              {success ? (
                <p className="text-green-600 font-semibold mb-8">
                  You'll now receive church updates and service reminders.
                </p>
              ) : (
                <p className="text-slate-500 font-medium mb-6 leading-relaxed">
                  Receive spiritual encouragement, sermon alerts, and church updates instantly on your device.
                </p>
              )}

              {/* Error State */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-6 flex items-start gap-3 text-left">
                  <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-700 font-medium">{errorMessage}</p>
                </div>
              )}

              {/* Denied State */}
              {permission === 'denied' && !errorMessage && (
                <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-left mb-6">
                  <div className="flex items-center gap-2 mb-2 text-amber-700 font-bold text-sm">
                    <Settings size={16} /> <span>How to unblock notifications:</span>
                  </div>
                  <ol className="text-xs text-amber-800 space-y-2 font-medium list-decimal pl-4">
                    <li>Tap the <strong>Lock / Info</strong> icon in your browser address bar.</li>
                    <li>Find <strong>Notifications</strong> and change it to <strong>Allow</strong>.</li>
                    <li>Refresh this page.</li>
                  </ol>
                </div>
              )}

              {/* Info pill for default state */}
              {permission !== 'denied' && !errorMessage && !success && (
                <div className="flex flex-col gap-3 mb-6">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl text-left border border-slate-100">
                    <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                      <Info size={16} />
                    </div>
                    <p className="text-xs font-bold text-slate-700">
                      Get notified about services, events, and daily devotions.
                    </p>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!success && (
                <div className="flex flex-col gap-3 pt-2">
                  <Button
                    onClick={handleRequest}
                    disabled={isLoading}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-bold text-lg hover:bg-primary/90 shadow-lg shadow-primary/20 disabled:opacity-60"
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 size={20} className="animate-spin" />
                        Enabling…
                      </span>
                    ) : permission === 'denied' ? (
                      'I\'ve updated my settings'
                    ) : error ? (
                      'Try Again'
                    ) : (
                      'Enable Notifications'
                    )}
                  </Button>
                  <button
                    onClick={handleDismiss}
                    className="text-slate-400 font-bold uppercase tracking-widest text-[10px] py-2 hover:text-slate-600 transition-colors"
                  >
                    Maybe later
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationModal;
