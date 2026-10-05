import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, Youtube, Database } from 'lucide-react';
import { CHURCH_CONFIG } from '../../config/church-config';

const Footer = () => {
  return (
    <footer className="bg-background pt-24 pb-12 text-foreground relative overflow-hidden border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105 group">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm shrink-0 border-2 border-primary/20 bg-white flex items-center justify-center">
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
            <p className="text-muted-foreground leading-relaxed text-xs font-medium max-w-xs">
              "{CHURCH_CONFIG.tagline}" — {CHURCH_CONFIG.scripture}
            </p>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Explore</h3>
            <ul className="space-y-3 font-semibold text-sm">
              <li><Link to="/about" className="hover:text-primary transition-colors">Our Story</Link></li>
              <li><Link to="/sermons" className="hover:text-primary transition-colors">Sermon Library</Link></li>
              <li><Link to="/ministries" className="hover:text-primary transition-colors">Find Your Place</Link></li>
              <li><Link to="/events" className="hover:text-primary transition-colors">Schedule of Services</Link></li>
              <li><Link to="/bible" className="hover:text-primary transition-colors">Bible Reader</Link></li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Location & Contact</h3>
            <ul className="space-y-4 text-xs font-medium">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">{CHURCH_CONFIG.address.fullLocation}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-primary shrink-0" />
                <span>{CHURCH_CONFIG.contact.phone}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>{CHURCH_CONFIG.contact.email}</span>
              </li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">Follow Us</h3>
            <div className="flex gap-3">
              {[
                { icon: Facebook, href: CHURCH_CONFIG.socials.facebook },
                { icon: Youtube, href: CHURCH_CONFIG.socials.youtube },
              ].map((social, i) => (
                <a 
                  key={i}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all transform hover:scale-110 shadow-sm"
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>
        </div>
        
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] uppercase tracking-wider font-bold text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {CHURCH_CONFIG.name}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms</Link>
            <Link to="/login" className="text-primary hover:underline transition-colors">Member Portal</Link>
            <Link to="/admin" className="text-primary hover:underline transition-colors flex items-center gap-1">
              <Database size={12} />
              CMS Dashboard
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
