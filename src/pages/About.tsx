import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Target, Heart, Anchor, Users, Sparkles, BookOpen, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';
import SEO from '../components/seo/SEO';
import { CHURCH_CONFIG } from '../config/church-config';

const ABOUT_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'AboutPage',
      '@id': 'https://zionroadbaptist.org/about#webpage',
      'url': 'https://zionroadbaptist.org/about',
      'name': `About ${CHURCH_CONFIG.name}`,
      'description': CHURCH_CONFIG.aboutText,
      'isPartOf': { '@id': 'https://zionroadbaptist.org/#church' }
    }
  ]
};

const About = () => {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaders = async () => {
      try {
        const { getLeaders } = await import('../features/leaders/api/getLeaders');
        const data = await getLeaders();
        setLeaders(data);
      } catch (err) {
        console.error("Failed to load leaders:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaders();
  }, []);

  const coreValues = [
    { icon: BookOpen, title: "Bible Based", desc: "We preach and teach the Bible as God's inspired word which has answers to all life questions." },
    { icon: Target, title: "Christ Centered", desc: "We preach Christ crucified, risen and coming again!" },
    { icon: Users, title: "Family & Youth", desc: "Dedicated Sunday School and full youth activities for all age groups." },
    { icon: Anchor, title: "Firm Foundation", desc: "Building lives on the firm foundation of God's Word (1 Thess 2:13)." },
    { icon: Heart, title: "Fellowship & Care", desc: "Part of a fellowship of Baptist Churches ministering in Kenya since 1965." },
  ];

  return (
    <div className="min-h-screen bg-background pt-32 pb-20 overflow-x-hidden">
      <SEO
        title={`About Us — ${CHURCH_CONFIG.name}`}
        description={`${CHURCH_CONFIG.name} in Kasarani, Clay Works Estate. ${CHURCH_CONFIG.aboutText}`}
        url="/about"
        image="/church-compound-view.jpeg"
        keywords="Zion Road Independent Baptist Church, Kasarani Baptist Church, Clay Works Estate, Kenya Baptist Fellowship"
        schema={ABOUT_SCHEMA}
      />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 relative text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <span className="inline-block px-4 py-1.5 border border-primary/20 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] rounded-full">
            Who Are We?
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground tracking-tight leading-tight">
            {CHURCH_CONFIG.name}
          </h1>
          <p className="text-xl md:text-2xl text-primary max-w-3xl mx-auto leading-relaxed font-bold italic">
            "{CHURCH_CONFIG.tagline}"
          </p>
          <p className="text-muted-foreground font-semibold uppercase text-xs tracking-widest">— {CHURCH_CONFIG.scripture}</p>
        </motion.div>
      </div>

      {/* About & Fellowship History */}
      <div className="bg-secondary/40 border-y border-border py-20 mb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-md space-y-6">
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-2xl font-black text-foreground">Ministering in Kenya Since {CHURCH_CONFIG.establishedYear}</h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {CHURCH_CONFIG.aboutText}
              </p>
              <div className="pt-2 text-xs font-bold text-primary uppercase tracking-wider">
                Independent Baptist Fellowship
              </div>
            </div>

            <div className="bg-primary text-white p-8 rounded-3xl shadow-xl space-y-6">
              <div className="w-12 h-12 bg-white/20 text-white rounded-2xl flex items-center justify-center">
                <BookOpen size={28} />
              </div>
              <h2 className="text-2xl font-black text-white">Why Are We Here?</h2>
              <p className="text-white/90 leading-relaxed text-sm">
                We are a Bible-believing church which wants to help you and your family enjoy a personal relationship with Jesus Christ and build your life on the firm foundation of God’s Word.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Core Pillars */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-foreground tracking-tight">Our Core Pillars</h2>
          <div className="w-20 h-1.5 bg-primary mx-auto mt-4 rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {coreValues.map((val, i) => (
            <div key={i} className="bg-white p-6 rounded-2xl border border-border shadow-sm text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-primary/10 text-primary rounded-xl flex items-center justify-center">
                <val.icon size={22} />
              </div>
              <h3 className="font-bold text-foreground text-sm">{val.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pastoral Team */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-3">
            Weekly Ministry Leaders
          </span>
          <h2 className="text-3xl font-black text-foreground tracking-tight">Our Pastoral Leadership</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto gap-8">
            {leaders.map((leader) => (
              <div key={leader.id} className="bg-white rounded-3xl p-8 border border-border shadow-md text-center space-y-4">
                <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-primary/20 bg-secondary">
                  <img src={leader.image} alt={leader.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-xl font-bold text-foreground">{leader.name}</h3>
                <p className="text-primary font-bold text-xs uppercase tracking-widest">{leader.role}</p>
                <p className="text-muted-foreground text-xs leading-relaxed">{leader.bio}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
