import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getSermonById, getSermons } from '../api/getSermons';
import type { Sermon } from '../../../types';
import { Calendar, ChevronLeft, Play, AlertCircle, Share2, Library, ArrowRight } from 'lucide-react';
import { Button } from '../../../components/elements/Button';

import SEO from '../../../components/seo/SEO';

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

const SermonDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [sermon, setSermon] = useState<Sermon | null>(null);
  const [recentSermons, setRecentSermons] = useState<Sermon[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const [sermonData, allSermons] = await Promise.all([
          getSermonById(id),
          getSermons(4)
        ]);

        if (sermonData) {
          setSermon(sermonData);
          setRecentSermons(allSermons.filter(s => s.id !== id).slice(0, 3));
        } else {
          setError('Sermon not found.');
        }
      } catch (err) {
        setError('Failed to load sermon content.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: sermon?.title,
        text: sermon?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Preparing the Word...</p>
      </div>
    );
  }

  if (error || !sermon) {
    return (
      <div className="max-w-2xl mx-auto pt-52 pb-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">{error || 'Something went wrong'}</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the sermon you're looking for. It might have been moved or deleted.</p>
        <Link to="/sermons">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft size={18} className="mr-2" /> Back to Library
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO
        title={sermon.title}
        description={sermon.description?.substring(0, 160) || 'Watch this sermon from Zion Baptist Church Thika. Powerful Bible teaching to grow your faith.'}
        url={`/sermons/${sermon.id}`}
        type="article"
        publishedTime={sermon.date ? new Date(sermon.date).toISOString() : undefined}
        keywords={`${sermon.title}, sermon Zion Baptist Church, Bible teaching Thika, ${sermon.category || 'Sunday service'} sermon Kenya`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          'name': sermon.title,
          'description': sermon.description || 'A sermon message from Zion Baptist Church Church, Thika, Kenya.',
          'thumbnailUrl': `https://img.youtube.com/vi/${sermon.videoUrl?.match(/(?:v=|youtu\.be\/|embed\/)([^&?/]+)/)?.[1] || ''}/maxresdefault.jpg`,
          'uploadDate': sermon.date ? new Date(sermon.date).toISOString() : new Date().toISOString(),
          'embedUrl': sermon.videoUrl,
          'contentUrl': sermon.videoUrl,
          'publisher': {
            '@type': 'Church',
            '@id': 'https://aichappyvalley.org/#church',
            'name': 'Zion Baptist Church',
            'logo': {
              '@type': 'ImageObject',
              'url': 'https://aichappyvalley.org/logo.png'
            }
          },
          'author': {
            '@type': 'Church',
            'name': 'Zion Baptist Church'
          }
        }}
      />

      {/* Hero Section with Video */}
      <section className="bg-slate-900 pt-8 pb-12 lg:pt-12 lg:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/sermons" className="inline-flex items-center text-slate-400 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ChevronLeft size={16} className="mr-1" /> Back to Sermons
          </Link>
          
          <div className="aspect-video w-full bg-black rounded-3xl overflow-hidden shadow-2xl border border-slate-800 ring-1 ring-white/5">
            <iframe
              src={getYouTubeEmbedUrl(sermon.videoUrl)}
              title={sermon.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-presentation allow-forms"
            />
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="mt-[-40px] px-4">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-border shadow-xl p-8 md:p-12">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8 border-b border-slate-100 pb-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full uppercase tracking-wider">
                  {sermon.category || 'Sunday Service'}
                </span>
                <div className="flex items-center text-muted-foreground text-sm font-medium">
                  <Calendar size={14} className="mr-1.5" />
                  {new Date(sermon.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
                </div>
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {sermon.title}
              </h1>
            </div>
            
            <div className="flex gap-2 shrink-0">
              <Button onClick={handleShare} variant="outline" size="sm" className="rounded-xl h-11 px-5 border-slate-200">
                <Share2 size={18} className="mr-2" /> Share
              </Button>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {sermon.description}
            </p>
          </div>

          {/* Call to Action */}
          <div className="mt-16 p-8 bg-blue-50 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-lg font-bold text-blue-900 mb-1">Impacted by this message?</h3>
              <p className="text-sm text-blue-700">Join us this coming Sunday for a deeper fellowship in Thika.</p>
            </div>
            <Link to="/contact">
              <Button className="rounded-xl bg-primary hover:bg-primary/90 text-white px-8 h-12 shadow-lg shadow-primary/20">
                Connect With Us
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recommended/Latest section */}
      {recentSermons.length > 0 && (
        <section className="pt-52 pb-20 px-4 max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8 px-4">
             <h2 className="text-2xl font-bold">Recommended Messages</h2>
             <Link to="/sermons" className="text-primary font-semibold flex items-center gap-1 hover:underline">
                View All <ArrowRight size={16} />
             </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentSermons.map((recent: Sermon) => (
              <Link key={recent.id} to={`/sermons/${recent.id}`}>
                <div className="bg-white border rounded-2xl p-5 hover:shadow-lg transition-all group h-full">
                  <div className="aspect-video bg-slate-100 rounded-xl mb-4 overflow-hidden relative">
                    <img src="https://images.unsplash.com/photo-1438232992991-995b7058bbb3?w=400&q=80" alt={recent.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <Play className="text-white fill-white" size={24} />
                    </div>
                  </div>
                  <h4 className="font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">{recent.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{new Date(recent.date).toLocaleDateString()}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default SermonDetail;
