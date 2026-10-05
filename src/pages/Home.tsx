import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, MapPin, BookOpen, Heart, Shield, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/elements/Button';
import { Link } from 'react-router-dom';
import { getMinistries } from '../features/ministries/api/getMinistries';
import { CircularGallery } from '../components/ui/circular-gallery-og';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Ministry } from '../types';
import SEO from '../components/seo/SEO';
import { CHURCH_CONFIG } from '../config/church-config';

gsap.registerPlugin(ScrollTrigger);

const HOME_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Church',
  '@id': 'https://zionroadbaptist.org/#church',
  'name': CHURCH_CONFIG.name,
  'alternateName': CHURCH_CONFIG.shortName,
  'description': CHURCH_CONFIG.aboutText,
  'url': 'https://zionroadbaptist.org',
  'logo': 'https://zionroadbaptist.org/logo.png',
  'image': 'https://zionroadbaptist.org/church-drone-view.jpeg',
  'telephone': CHURCH_CONFIG.contact.phone,
  'email': CHURCH_CONFIG.contact.email,
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': CHURCH_CONFIG.address.intersection,
    'addressLocality': CHURCH_CONFIG.address.subcounty,
    'addressRegion': CHURCH_CONFIG.address.city,
    'addressCountry': 'KE'
  },
  'openingHoursSpecification': [
    { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Sunday', 'opens': '10:00', 'closes': '18:00' },
    { '@type': 'OpeningHoursSpecification', 'dayOfWeek': 'Friday', 'opens': '19:30', 'closes': '21:00' }
  ],
  'hasMap': CHURCH_CONFIG.address.mapLink,
  'currenciesAccepted': 'KES',
  'paymentAccepted': 'Cash, M-PESA',
  'priceRange': 'Free'
};

const Home = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: 'easeOut' }
    }
  };

  const [ministries, setMinistries] = useState<Ministry[]>([]);

  useEffect(() => {
    const fetchMin = async () => {
      try {
        const data = await getMinistries(5);
        setMinistries(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchMin();
  }, []);

  const bgRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (!bgRef.current) return;
    
    gsap.fromTo(".bg-glow-1", 
      { x: -100, opacity: 0 },
      { 
        x: 100, 
        opacity: 0.3,
        scrollTrigger: {
          trigger: bgRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      }
    );
  }, { scope: bgRef });

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <SEO
        title={`Welcome to ${CHURCH_CONFIG.name}`}
        description={`${CHURCH_CONFIG.name} — ${CHURCH_CONFIG.tagline}. Join us in Kasarani, Clay Works Estate for Sunday Worship at 11:00 AM.`}
        url="/"
        image="/church-drone-view.jpeg"
        keywords="Zion Road Independent Baptist Church, Kasarani church, Clay Works Estate, Baptist Church Nairobi"
        schema={HOME_SCHEMA}
      />
      
      {/* HERO SECTION */}
      <section className="relative min-h-[95vh] flex items-center justify-center pt-32 px-4 overflow-hidden bg-secondary/30">
        <div className="absolute inset-0 z-0">
          <video autoPlay loop muted playsInline className="w-full h-full object-cover opacity-20 mix-blend-multiply">
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/40 to-background"></div>
        </div>

        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse"></div>
        
        <motion.div 
          className="max-w-4xl mx-auto text-center relative z-10"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.span 
            variants={itemVariants}
            className="inline-block px-5 py-2 bg-primary/10 text-primary font-bold text-xs rounded-full uppercase tracking-[0.2em] mb-6 border border-primary/20"
          >
            {CHURCH_CONFIG.acronym} • {CHURCH_CONFIG.name}
          </motion.span>
          
          <motion.h1 
            variants={itemVariants}
            className="text-4xl sm:text-6xl lg:text-7xl font-black leading-[1.15] tracking-tight mb-6 text-foreground"
          >
            Building Lives on the <br />
            <span className="text-primary italic">Foundation</span> of God's Word
          </motion.h1>
          
          <motion.p 
            variants={itemVariants}
            className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed font-medium italic"
          >
            "{CHURCH_CONFIG.motto}"
          </motion.p>
          
          <motion.div 
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/contact">
              <Button size="lg" className="rounded-full px-8 py-7 text-base font-bold bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/25 border-none group">
                Plan Your Visit
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/sermons">
              <Button variant="outline" size="lg" className="rounded-full px-8 py-7 text-base font-bold border-primary/30 text-foreground hover:bg-primary/5 hover:border-primary transition-all">
                Watch Sermons
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            variants={itemVariants} 
            className="flex flex-wrap justify-center gap-6 text-xs sm:text-sm font-semibold text-muted-foreground bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-border shadow-sm max-w-3xl mx-auto"
          >
            <div className="flex items-center gap-2">
              <Calendar size={16} className="text-primary" />
              <span>Sunday Worship @ 11:00 AM</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} className="text-primary" />
              <span>Clay Works Estate, Kasarani</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* GOD'S PLAN OF SALVATION BANNER */}
      <section className="py-16 bg-primary text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-8 relative z-10">
          <span className="inline-block px-4 py-1.5 bg-white/10 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-white/20">
            {CHURCH_CONFIG.salvationMessage.subtitle}
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            {CHURCH_CONFIG.salvationMessage.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 text-left">
            {CHURCH_CONFIG.salvationMessage.points.map((pt, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/15 space-y-3">
                <div className="w-8 h-8 rounded-full bg-white text-primary font-black flex items-center justify-center text-sm shadow-md">
                  {i + 1}
                </div>
                <h3 className="font-bold text-white text-base leading-snug">{pt.text}</h3>
                <p className="text-xs text-white/80 italic font-serif leading-relaxed">{pt.verse}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICE SCHEDULE & LOCATION */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block">
                Join Us In Worship
              </span>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
                Schedule of Services
              </h2>
              
              <div className="space-y-4">
                {CHURCH_CONFIG.services.map((svc, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-border shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="px-3 py-2 bg-primary/10 text-primary rounded-xl font-bold text-xs uppercase tracking-wider shrink-0 text-center">
                      <div>{svc.day}</div>
                      <div className="text-sm">{svc.time}</div>
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-base">{svc.name}</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">Clay Works Estate, Kasarani Sanctuary</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <a href={CHURCH_CONFIG.address.mapLink} target="_blank" rel="noopener noreferrer">
                  <Button className="rounded-full px-6 py-6 font-bold bg-accent text-white hover:bg-accent/90 shadow-lg flex items-center gap-2">
                    <MapPin size={18} /> Open in Google Maps
                  </Button>
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-3xl border border-border shadow-xl space-y-6"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <MapPin size={24} />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Where Are We Located?</h3>
              <p className="text-muted-foreground leading-relaxed text-sm">
                {CHURCH_CONFIG.address.fullLocation}
              </p>

              <div className="border-t border-border pt-6 space-y-4">
                <h4 className="font-bold text-foreground text-sm uppercase tracking-wider">Ministering To You Weekly:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CHURCH_CONFIG.leaders.map((ldr, idx) => (
                    <div key={idx} className="bg-secondary/40 p-4 rounded-xl border border-border">
                      <div className="font-bold text-foreground text-sm">{ldr.name}</div>
                      <div className="text-xs text-primary font-medium">{ldr.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* MINISTRIES CAROUSEL */}
      <section ref={bgRef} className="py-24 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase block">
            Fellowship & Growth
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tight">
            Our Church Ministries
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm">
            We have Sunday School for children, full Youth activities, Adult Bible study, and Bible Institute.
          </p>
        </div>

        <div className="relative h-[450px] md:h-[600px] w-full">
          <CircularGallery
            items={ministries.map(m => ({
              id: m.id,
              image: m.image,
              text: m.name
            }))}
            bend={3}
            borderRadius={0.05}
            autoScrollSpeed={0.01}
            resumeDelay={2000}
            scrollEase={0.05}
          />
        </div>

        <div className="text-center mt-10">
          <Link to="/ministries">
            <Button variant="ghost" className="rounded-full px-8 py-6 text-base font-bold border border-primary/20 text-foreground hover:bg-primary/5 hover:text-primary">
              Explore All Ministries <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
