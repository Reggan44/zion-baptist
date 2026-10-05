import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Smartphone, Copy, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';
import { Button } from '../components/elements/Button';
import SEO from '../components/seo/SEO';
import { CHURCH_CONFIG } from '../config/church-config';

const GIVING_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'DonateAction',
  'name': `Give to ${CHURCH_CONFIG.name}`,
  'description': `Support the mission of ${CHURCH_CONFIG.name} in Kasarani, Nairobi through your generous tithes and offerings.`,
  'agent': {
    '@type': 'Church',
    '@id': 'https://zionroadbaptist.org/#church',
    'name': CHURCH_CONFIG.name
  },
  'url': 'https://zionroadbaptist.org/giving',
  'instrument': [
    { '@type': 'PaymentMethod', 'name': 'M-PESA' }
  ]
};

const Giving = () => {
  const [copiedPaybill, setCopiedPaybill] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const handleCopy = (text: string, type: 'paybill' | 'account') => {
    navigator.clipboard.writeText(text);
    if (type === 'paybill') {
      setCopiedPaybill(true);
      setTimeout(() => setCopiedPaybill(false), 2000);
    } else {
      setCopiedAccount(true);
      setTimeout(() => setCopiedAccount(false), 2000);
    }
  };

  return (
    <div className="bg-gradient-to-b from-secondary/40 to-background min-h-screen pb-24 font-sans">
      <SEO
        title={`Give & Support — ${CHURCH_CONFIG.name}`}
        description={`Support the mission of ${CHURCH_CONFIG.name}. Give securely via M-PESA or during Sunday worship services.`}
        url="/giving"
        keywords="Zion Road Independent Baptist Church giving, M-PESA church donation Kasarani, tithe Kenya"
        schema={GIVING_SCHEMA}
      />

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-4 overflow-hidden">
        <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 mx-auto bg-white rounded-full shadow-lg flex items-center justify-center border border-primary/20"
          >
            <Heart className="w-8 h-8 text-primary fill-primary/20" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
              Worship Through <br /> <span className="text-primary">Generosity</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
              Your faithful giving supports the mission of {CHURCH_CONFIG.name} to preach Christ crucified, risen and coming again, and build lives on the foundation of God's Word.
            </p>
          </motion.div>
        </div>
      </section>

      {/* M-PESA Giving Card */}
      <section className="max-w-2xl mx-auto px-4 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-border shadow-2xl overflow-hidden relative"
        >
          <div className="absolute top-0 left-0 right-0 h-2 bg-primary rounded-t-full" />
          
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-border">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-primary mb-1">Giving Methods</p>
              <h2 className="text-2xl font-black text-foreground">
                M-PESA / Tithes & Offerings
              </h2>
            </div>
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
              <Smartphone size={24} />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-secondary/40 p-6 rounded-3xl border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-xs uppercase font-bold tracking-widest text-muted-foreground mb-1">M-PESA Paybill / Till</p>
                  <p className="text-2xl lg:text-3xl font-black text-foreground tracking-tight font-mono">Contact Admin</p>
                </div>
                <Button 
                  onClick={() => handleCopy('Contact Admin', 'paybill')}
                  variant={copiedPaybill ? 'default' : 'outline'}
                  className={`rounded-xl shrink-0 transition-all ${copiedPaybill ? 'bg-green-600 text-white' : ''}`}
                >
                  {copiedPaybill ? <CheckCircle2 size={16} className="mr-2" /> : <Copy size={16} className="mr-2" />}
                  {copiedPaybill ? 'Copied' : 'Copy'}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-border flex items-center gap-2 text-xs font-semibold text-muted-foreground justify-center">
            <ShieldCheck size={16} className="text-primary" /> You can also give in person during any Sunday Worship Service.
          </div>
        </motion.div>
      </section>

      {/* Scripture */}
      <section className="py-20 px-4 max-w-3xl mx-auto">
        <div className="bg-white border border-border p-8 md:p-12 rounded-[2.5rem] text-center shadow-sm">
          <p className="text-lg md:text-xl font-bold text-foreground leading-relaxed italic">
            "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."
          </p>
          <p className="mt-6 text-xs font-bold text-primary uppercase tracking-widest">
            2 Corinthians 9:7
          </p>
        </div>
      </section>
    </div>
  );
};

export default Giving;
