import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../lib/firebase';
import { Button } from '../components/elements/Button';
import { Input } from '../components/elements/Input';
import { Label } from '../components/elements/Label';
import { checkRateLimit, recordSubmission } from '../utils/validation';
import SEO from '../components/seo/SEO';
import { CHURCH_CONFIG } from '../config/church-config';

const CONTACT_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ContactPage',
      '@id': 'https://zionroadbaptist.org/contact#webpage',
      'url': 'https://zionroadbaptist.org/contact',
      'name': `Contact ${CHURCH_CONFIG.name}`,
      'description': `Get in touch with ${CHURCH_CONFIG.name} in Kasarani, Nairobi. Visit us on Sundays or send a message.`,
      'isPartOf': { '@id': 'https://zionroadbaptist.org/#church' }
    }
  ]
};

const RATE_LIMIT_KEY = 'zribc_contact_last_submission';
const COOLDOWN_MS = 60_000;

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!recaptchaToken) {
      setErrorMessage('Please verify that you are not a robot.');
      return;
    }

    if (!formData.name || !formData.email || !formData.message) {
      setErrorMessage('Please fill in all required fields.');
      return;
    }

    if (!checkRateLimit(RATE_LIMIT_KEY, COOLDOWN_MS)) {
      setErrorMessage('Please wait 60 seconds before sending another message.');
      return;
    }

    setStatus('submitting');
    try {
      const submitContactMessage = httpsCallable(functions, 'submitContactMessage');
      await submitContactMessage({
        ...formData,
        recaptchaToken
      });
      
      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      recaptchaRef.current?.reset();
      setRecaptchaToken(null);
      recordSubmission(RATE_LIMIT_KEY);
      
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Failed to send message. Please try again.');
    }
  };

  return (
    <div className="bg-background min-h-screen pb-20">
      <SEO
        title={`Contact Us — ${CHURCH_CONFIG.name}`}
        description={`Get in touch with ${CHURCH_CONFIG.name} in Kasarani, Nairobi. Visit us for Sunday worship at 11:00 AM.`}
        url="/contact"
        keywords="contact Zion Road Independent Baptist Church, Kasarani church address, Clay Works Estate location"
        schema={CONTACT_SCHEMA}
      />
      
      {/* Hero */}
      <section className="bg-secondary/40 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-foreground mb-4 tracking-tight">
            Get in <span className="text-primary">Touch</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground font-medium max-w-2xl mx-auto">
            Whether you have a question, a prayer request, or want to visit us, we'd love to connect with you.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 mt-[-40px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-8 rounded-3xl border border-border shadow-xl space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Visit Us</h3>
                  <p className="text-muted-foreground mt-1 text-xs leading-relaxed">
                    {CHURCH_CONFIG.address.fullLocation}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Email Us</h3>
                  <p className="text-muted-foreground mt-1 text-xs">{CHURCH_CONFIG.contact.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-base text-foreground">Call Us</h3>
                  <p className="text-muted-foreground mt-1 text-xs">{CHURCH_CONFIG.contact.phone}</p>
                </div>
              </div>
            </div>

            {/* Service Times */}
            <div className="bg-accent text-white p-8 rounded-3xl shadow-xl space-y-4">
              <h3 className="font-bold text-base flex items-center gap-2">
                <MessageSquare size={18} className="text-muted-gold" />
                Schedule of Services
              </h3>
              <ul className="space-y-3 text-xs text-slate-200">
                {CHURCH_CONFIG.services.map((svc, i) => (
                  <li key={i} className="flex justify-between border-b border-white/10 pb-2">
                    <span>{svc.name}</span>
                    <span className="font-bold text-white shrink-0 ml-2">{svc.day} {svc.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-border shadow-2xl h-full font-sans">
              <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>

              <AnimatePresence>
                {status === 'success' && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="mb-6 p-6 bg-green-50 border border-green-200 rounded-2xl flex flex-col items-center text-center gap-3 text-green-900"
                  >
                    <CheckCircle size={32} className="text-green-600" />
                    <div>
                      <h4 className="font-bold text-lg">Message Received</h4>
                      <p className="text-xs mt-1">Thank you! We've received your message and will get back to you soon.</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {errorMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start gap-3 text-red-800">
                  <AlertCircle className="shrink-0 mt-0.5" size={18} />
                  <p className="text-xs font-medium">{errorMessage}</p>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="c-name">Full Name <span className="text-red-500">*</span></Label>
                    <Input 
                      id="c-name" 
                      required
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="John Doe" 
                      className="h-11 rounded-xl" 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="c-email">Email Address <span className="text-red-500">*</span></Label>
                    <Input 
                      id="c-email" 
                      type="email" 
                      required
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                      placeholder="john@example.com" 
                      className="h-11 rounded-xl" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-subject">Subject</Label>
                  <Input 
                    id="c-subject" 
                    value={formData.subject}
                    onChange={e => setFormData({...formData, subject: e.target.value})}
                    placeholder="How can we help?" 
                    className="h-11 rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-msg">Message <span className="text-red-500">*</span></Label>
                  <textarea 
                    id="c-msg" 
                    rows={5} 
                    required
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    className="w-full border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-sans"
                    placeholder="Your message here..."
                  />
                </div>

                <div className="pt-1 min-h-[78px]">
                  {import.meta.env.VITE_RECAPTCHA_SITE_KEY ? (
                    <ReCAPTCHA
                      ref={recaptchaRef}
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(token) => setRecaptchaToken(token)}
                    />
                  ) : (
                    <div className="text-xs text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center gap-2">
                      <AlertCircle size={16} /> Captcha configuration missing.
                    </div>
                  )}
                </div>

                <Button 
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full h-12 rounded-xl text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-md"
                >
                  {status === 'submitting' ? (
                    <><Loader2 className="animate-spin mr-2" size={18} /> Sending...</>
                  ) : (
                    <><Send className="mr-2 w-4 h-4" /> Send Message</>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
