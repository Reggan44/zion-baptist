import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../elements/Button';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { CHURCH_CONFIG } from '../../config/church-config';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser);
    return () => unsub();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Sermons', path: '/sermons' },
    { name: 'Bible', path: '/bible' },
    { name: 'Daily Word', path: '/daily-word' },
    { name: 'Ministries', path: '/ministries' },
    { name: 'Events', path: '/events' },
    { name: 'Giving', path: '/giving' },
    { name: 'Contact', path: '/contact' },
  ];

  const activeNavLinks = user 
    ? [...navLinks, { name: 'Admin', path: '/admin' }]
    : navLinks;

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-background/90 backdrop-blur-md py-3 shadow-md border-b border-border' : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm transition-transform group-hover:scale-105 shrink-0 aspect-square border-2 border-primary/20 bg-white flex items-center justify-center">
              <img 
                src="/logo.png" 
                alt={CHURCH_CONFIG.name} 
                className="w-full h-full object-cover" 
                onError={(e) => {
                  e.currentTarget.src = "/pwa-192x192.png";
                }}
              />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-black tracking-tight text-foreground group-hover:text-primary transition-colors leading-none">
                Zion Road
              </span>
              <span className="text-xs font-bold text-primary tracking-wider uppercase">
                Baptist Church
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {activeNavLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path}
                className="px-4 py-2 text-[13px] font-bold text-foreground/80 hover:text-primary uppercase tracking-wider transition-all rounded-full hover:bg-primary/10"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* CTAs */}
          <div className="hidden md:flex items-center gap-4 border-l border-border pl-6 ml-4">
            {user ? (
              <Link to="/admin">
                <Button size="sm" className="rounded-full bg-primary text-white font-bold shadow-md hover:scale-105 transition-all">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="sm" className="rounded-full bg-primary text-white font-bold shadow-md hover:scale-105 transition-all">
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-full text-foreground hover:bg-primary/10 transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border absolute top-full left-0 w-full p-6 space-y-4 shadow-2xl"
        >
          {activeNavLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className="block text-xl font-bold text-foreground hover:text-primary transition-colors py-1"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-border flex flex-col gap-3">
            {user ? (
              <Link to="/admin" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full rounded-full py-4 border-primary/30 text-foreground font-bold">
                  Admin Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login" onClick={() => setIsOpen(false)}>
                <Button variant="outline" className="w-full rounded-full py-4 border-primary/30 text-foreground font-bold">
                  Login
                </Button>
              </Link>
            )}
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
