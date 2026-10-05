import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '../../../components/elements/Button';
import { BookOpen, ArrowRight, Calendar, Search } from 'lucide-react';
import SEO from '../../../components/seo/SEO';

const Blog = () => {
  return (
    <div className="w-full min-h-screen">
      <SEO 
        title="Blog & Teachings" 
        description="Explore spiritual insights, biblical teachings, and guidance for Christian living from our pastoral team at Zion Baptist Church Thika."
        url="/blog"
      />
      
      <section className="bg-gradient-to-br from-slate-50 to-white pt-52 pb-20 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
              Resources
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
              Teachings & <span className="text-primary">Insights</span>
            </h1>
            <p className="text-muted-foreground text-lg max-w-xl">
              Equipping the church through the Word. Explore articles on faith, family, and spiritual growth.
            </p>
          </div>
          
          <div className="relative w-full max-w-xs">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
             <input 
               type="text" 
               placeholder="Search articles..."
               className="w-full pl-12 pr-4 py-3 bg-white border border-border rounded-xl focus:ring-2 focus:ring-primary/20 transition-all outline-none"
             />
          </div>
        </div>
      </section>

      <section className="pt-52 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-border border-2">
            <BookOpen className="w-16 h-16 text-muted-foreground/20 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Blog Under Construction</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              We're preparing the first set of articles to help you grow in your walk with Christ. Stay tuned for updates!
            </p>
            <Link to="/">
               <Button className="rounded-xl px-8">Back to Home</Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blog;
