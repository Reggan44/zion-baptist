import React from 'react';
import { motion } from 'framer-motion';
import { Hammer, Phone, Mail, User, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const Maintenance = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#A8D5BA]"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.05, scale: 1 }}
          transition={{ duration: 2.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
          className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#E6C79C]"
        />
      </div>

      <div className="max-w-2xl w-full text-center relative z-10">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-8">
            <div className="p-4 bg-white rounded-2xl shadow-sm border border-slate-100">
              <Hammer className="w-12 h-12 text-[#A8D5BA]" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-6 font-serif">
            Refining Our Sanctuary
          </h1>
          
          <p className="text-lg text-slate-600 mb-12 leading-relaxed">
            Zion Baptist Church is currently undergoing scheduled updates to better serve our community. 
            We are working hard to enhance your digital experience and will be back online shortly.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center">
              <User className="w-6 h-6 text-[#E6C79C] mb-3" />
              <h3 className="font-semibold text-slate-800">Software Engineer</h3>
              <p className="text-slate-600">Reggan Nzuki</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 flex flex-col items-center">
              <Phone className="w-6 h-6 text-[#A8D5BA] mb-3" />
              <h3 className="font-semibold text-slate-800">Support Line</h3>
              <a href="tel:+25417018722" className="text-[#A8D5BA] hover:underline">+254 170 18722</a>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-slate-400 text-sm italic">
              <div className="w-2 h-2 rounded-full bg-[#A8D5BA] animate-pulse" />
              Upgrading systems...
            </div>
            
            <Link 
              to="/login" 
              className="mt-8 text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
            >
              <ShieldAlert className="w-3 h-3" />
              Administrator Access
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Maintenance;
