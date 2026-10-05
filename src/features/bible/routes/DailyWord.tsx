import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Languages, Download, ArrowRight, Star, Quote } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/elements/Button';
import { dailyVerses } from '../../../data/daily-verses';

const DailyWord = () => {
  const [language, setLanguage] = useState<'english' | 'swahili'>('english');
  const [verse, setVerse] = useState(dailyVerses[0]);

  useEffect(() => {
    // Get verse of the day based on day of the month
    const today = new Date().getDate();
    const verseIndex = (today - 1) % dailyVerses.length;
    setVerse(dailyVerses[verseIndex]);
  }, []);

  return (
    <div className="min-h-screen pt-40 pb-24 px-4 bg-[#fdfdfd] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-brand-sage/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="max-w-2xl mx-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-16">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-brand-sage flex items-center justify-center text-brand-grey shadow-lg shadow-brand-sage/20">
              <BookOpen size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-brand-grey tracking-tight">The Daily Word</h1>
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-brand-sage px-1">Zion Baptist Church</p>
            </div>
          </div>
          
          <button 
            onClick={() => setLanguage(language === 'english' ? 'swahili' : 'english')}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-brand-sage/10 rounded-xl shadow-sm hover:bg-slate-50 transition-all font-bold text-sm text-brand-grey"
          >
            <Languages size={16} className="text-brand-sage" />
            {language === 'english' ? 'English' : 'Kiswahili'}
          </button>
        </div>

        {/* Verse Card */}
        <motion.div 
          key={language}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-12 md:p-16 rounded-[40px] shadow-2xl shadow-brand-sage/10 border border-brand-sage/5 relative"
        >
          <Quote size={60} className="absolute -top-6 -left-6 text-brand-sage/10 fill-current" />
          
          <div className="space-y-8">
            <p className="text-3xl md:text-4xl font-extrabold text-brand-grey leading-[1.3] tracking-tight text-center md:text-left italic">
              "{language === 'english' ? verse.english : verse.swahili}"
            </p>
            
            <div className="flex flex-col md:flex-row md:items-center justify-between pt-8 border-t border-brand-sage/5 gap-6">
              <div className="space-y-1 text-center md:text-left">
                <span className="text-[11px] uppercase font-black tracking-[0.25em] text-brand-sage/60 block">Scripture Reference</span>
                <h2 className="text-2xl font-black text-brand-grey">{verse.reference}</h2>
              </div>
              
              <div className="flex items-center justify-center gap-4">
                <Link to="/bible">
                  <Button variant="outline" className="rounded-2xl border-brand-sage/20 text-brand-grey font-bold hover:bg-brand-sage/5">
                    Read Full Bible <ArrowRight size={18} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer info */}
        <p className="mt-12 text-center text-muted-foreground font-medium text-sm max-w-sm mx-auto leading-relaxed">
          Start your day with the light of His Word. Share this verse with your community to spread the peace.
        </p>
        
        <div className="mt-12 flex justify-center gap-3">
          {[1,2,3].map(i => (
            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-brand-sage' : 'bg-brand-sage/20'}`}></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DailyWord;
