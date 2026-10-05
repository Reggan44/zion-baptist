import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMinistryById } from '../api/getMinistries';
import type { Ministry } from '../../../types';
import { Heart, ChevronLeft, Share2, AlertCircle, Quote, Loader2 } from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import SEO from '../../../components/seo/SEO';

const MinistryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [ministry, setMinistry] = useState<Ministry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMinistry = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await getMinistryById(id);
        if (data) {
          setMinistry(data);
        } else {
          setError('Ministry not found.');
        }
      } catch (err: any) {
        console.error('Error fetching ministry:', err);
        setError('Failed to load ministry details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMinistry();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: ministry?.name,
        text: ministry?.description,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center pt-32">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-muted-foreground font-bold tracking-widest uppercase text-xs animate-pulse">Heart for the mission...</p>
      </div>
    );
  }

  if (error || !ministry) {
    return (
      <div className="max-w-2xl mx-auto pt-52 pb-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">{error || 'Ministry not found'}</h1>
        <p className="text-muted-foreground mb-8">This ministry page may be under construction or the link is incorrect.</p>
        <Link to="/ministries">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft size={18} className="mr-2" /> Back to Ministries
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO
        title={ministry.name}
        description={ministry.description?.substring(0, 160) || `Discover the ${ministry.name} at Zion Baptist Church Church in Thika, Kenya. Connect, serve and grow with us.`}
        url={`/ministries/${ministry.id}`}
        image={ministry.image}
        keywords={`${ministry.name} Zion Baptist Church, ${ministry.name.toLowerCase()} Thika, church ministry Kenya, ${ministry.name.toLowerCase()} church`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Organization',
          'name': `Zion Baptist Church — ${ministry.name}`,
          'description': ministry.description,
          'url': `https://aichappyvalley.org/ministries/${ministry.id}`,
          'image': `https://aichappyvalley.org${ministry.image?.startsWith('/') ? ministry.image : `/${ministry.image}`}`,
          'parentOrganization': {
            '@type': 'Church',
            '@id': 'https://aichappyvalley.org/#church',
            'name': 'Zion Baptist Church'
          },
          'address': {
            '@type': 'PostalAddress',
            'addressLocality': 'Thika',
            'addressRegion': 'Kiambu',
            'addressCountry': 'KE'
          }
        }}
      />

      {/* Hero Header */}
      <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={ministry.image} 
            alt="" 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center text-white">
          <Link to="/ministries" className="inline-flex items-center text-white/70 hover:text-white mb-8 transition-colors text-sm font-medium">
            <ChevronLeft size={16} className="mr-1" /> All Ministries
          </Link>
          <div className="flex justify-center mb-6">
             <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <Heart size={30} className="text-primary fill-primary" />
             </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4">
            {ministry.name}
          </h1>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
        </div>
      </section>

      {/* Content */}
      <section className="mt-[-60px] px-4 relative z-20">
        <div className="max-w-3xl mx-auto bg-white rounded-[2.5rem] shadow-2xl border border-border p-8 md:p-16">
          <div className="flex justify-center md:justify-end mb-8 md:mb-0 md:absolute md:top-8 md:right-8">
            <Button onClick={handleShare} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-slate-100">
              <Share2 size={18} />
            </Button>
          </div>

          <div className="prose prose-slate max-w-none">
            <div className="flex items-start gap-4 mb-8">
               <Quote size={32} className="text-primary/20 shrink-0 rotate-180" aria-hidden="true" />
               <p className="text-xl md:text-2xl font-semibold text-slate-700 italic leading-snug">
                 Our mission is to serve with a {ministry.name.toLowerCase()} heart, bringing hope and fellowship to the Happy Valley community.
               </p>
            </div>
            
            <div className="h-px bg-slate-100 w-full mb-10" />

            <h2 className="text-2xl font-bold text-foreground mb-6">Mission & Vision</h2>
            <p className="text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap mb-12">
              {ministry.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
               <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100">
                  <h4 className="font-bold text-slate-800 mb-2">Get Involved</h4>
                  <p className="text-sm text-slate-600">Want to join or volunteer in this ministry? We'd love to hear from you.</p>
                  <Link to="/contact">
                    <Button variant="link" className="p-0 h-auto mt-4 text-primary font-bold">Contact Leader &rarr;</Button>
                  </Link>
               </div>
               <div className="p-8 bg-primary/5 rounded-3xl border border-primary/10">
                  <h4 className="font-bold text-primary mb-2">Support Us</h4>
                  <p className="text-sm text-primary/70">Your prayers and support help us grow our impact in this specific area.</p>
                  <Link to="/giving">
                    <Button variant="link" className="p-0 h-auto mt-4 text-primary font-bold font-bold">Give to Ministry &rarr;</Button>
                  </Link>
               </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default MinistryDetail;
