import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSermons } from '../../../hooks/useSermons';
import { Button } from '../../../components/elements/Button';
import { Play, Calendar, ChevronRight, AlertCircle } from 'lucide-react';

import { useState } from 'react';
import SEO from '../../../components/seo/SEO';

const SERMONS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://aichappyvalley.org/sermons#webpage',
  'url': 'https://aichappyvalley.org/sermons',
  'name': 'Sermon Archive — Zion Baptist Church',
  'description': 'Watch and listen to sermon messages from Zion Baptist Church church in Thika, Kenya. Our digital library of Bible teachings.',
  'isPartOf': { '@id': 'https://aichappyvalley.org/#church' },
  'breadcrumb': {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://aichappyvalley.org/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Sermons', 'item': 'https://aichappyvalley.org/sermons' }
    ]
  }
};

const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  
  let id = '';
  if (url.includes('v=')) {
    id = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('shorts/')) {
    id = url.split('shorts/')[1].split('?')[0];
  }
  
  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
};

const Sermons = () => {
  const { sermons, loading, error } = useSermons(24);
  const [activeCategory, setActiveCategory] = useState<string>('All');

  const categories = ['All', ...Array.from(new Set(sermons.map(s => s.category || 'Service')))];


  return (
    <div className="w-full bg-white">
      <SEO
        title="Sermon Archive"
        description="Watch and listen to uplifting Bible messages from Zion Baptist Church Thika. Catch up on the latest Sunday sermons and teachings anytime, anywhere."
        url="/sermons"
        keywords="sermons Thika church, Bible messages Kenya, Zion Baptist Church sermons, Sunday service preaching, Christian teaching Thika"
        schema={SERMONS_SCHEMA}
      />
      {/* Header - Rebranded */}
      <section className="relative pt-52 pb-24 px-4 bg-primary overflow-hidden">
        <div className="absolute top-0 right-0 w-[40%] h-full bg-secondary/5 blur-[100px] rounded-full translate-x-1/2"></div>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-10 relative z-10">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <span className="inline-block px-4 py-1.5 bg-secondary/10 text-secondary text-[10px] font-black rounded-full uppercase tracking-[0.3em] mb-6 border border-secondary/20 backdrop-blur-sm">
              Media Library
            </span>
            <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter italic uppercase mb-4">
              Sermon <span className="text-secondary transition-colors">Archive</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-xl font-medium leading-relaxed">
              Catch up on the latest messages. Immerse yourself in the Word of God anytime, anywhere with our digital library.
            </p>
          </motion.div>

          {!loading && !error && sermons.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }}
              className="flex bg-white/5 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-2xl overflow-x-auto"
            >
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  aria-pressed={activeCategory === category}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap",
                    activeCategory === category
                      ? 'bg-secondary text-primary shadow-lg'
                      : 'text-slate-400 hover:text-white'
                  )}
                >
                  {category}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Content Grid - Modernized */}
      <section className="pt-52 pb-24 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div role="alert" className="flex items-center gap-4 p-6 bg-red-50 border border-red-100 text-red-700 rounded-[2rem] mb-12 shadow-sm">
              <AlertCircle size={24} aria-hidden="true" />
              <p className="font-bold">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-96 bg-slate-50 rounded-[3rem] border border-slate-100 shadow-inner">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-secondary shadow-lg shadow-secondary/20 mb-6" aria-label="Loading sermons" />
              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Gathering Messages…</p>
            </div>
          ) : sermons.length === 0 && !error ? (
            <div className="text-center py-32 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
              <p className="text-slate-400 font-black text-xl uppercase tracking-widest mb-2">No sermons yet</p>
              <p className="text-slate-500 font-medium">We're uploading our latest Sunday service. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {sermons
                .filter(s => activeCategory === 'All' || (s.category || 'Service') === activeCategory)
                .map((sermon, index) => (
                <motion.div
                  key={sermon.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link to={`/sermons/${sermon.id}`} className="block h-full group">
                    <div className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 h-full flex flex-col relative">
                      <div className="aspect-video relative overflow-hidden bg-slate-950">
                        {sermon.videoUrl && (
                          <iframe
                            src={getYouTubeEmbedUrl(sermon.videoUrl)}
                            title={`Sermon: ${sermon.title}`}
                            className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-700"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            loading="lazy"
                            sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
                          />
                        )}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                        <div className="absolute top-4 left-4 z-20">
                          <span className="px-3 py-1 bg-secondary text-primary text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">
                            {sermon.category || 'Service'}
                          </span>
                        </div>
                        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 shadow-2xl">
                              <Play size={24} className="text-white ml-1" fill="currentColor" />
                           </div>
                        </div>
                      </div>

                      <div className="p-10 flex flex-col flex-grow bg-white">
                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-widest mb-4">
                          <Calendar size={14} className="text-secondary" aria-hidden="true" />
                          <time dateTime={sermon.date}>
                            {sermon.date ? new Date(sermon.date).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'Recent'}
                          </time>
                        </div>
                        <h3 className="text-2xl font-black text-primary mb-4 group-hover:text-secondary transition-colors tracking-tighter leading-none">
                          {sermon.title}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mb-6 font-medium leading-relaxed">
                          {sermon.description}
                        </p>
                        <div className="mt-auto pt-6 border-t border-slate-50">
                          <span className="text-xs font-black text-secondary flex items-center gap-2 uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                            Watch Full Sermon <ChevronRight size={18} aria-hidden="true" />
                          </span>
                        </div>
                      </div>
                      <div className="absolute inset-x-0 bottom-0 h-1 bg-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left"></div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Sermons;
