import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Mail, Phone, Calendar, ArrowRight } from 'lucide-react';
import SEO from '../components/seo/SEO';

// Mock data (In a real app, this might come from Firebase or a CMS)
const PASTORS_DATA: Record<string, any> = {
  'albunus-musyoka': {
    id: 'albunus-musyoka',
    name: 'Bishop Albunus Musyoka',
    role: 'Presiding Bishop',
    image: '/bishop.jpeg',
    email: 'bishop@aichappyvalley.org',
    phone: '+254 700 000 000',
    bio: [
      "Bishop Albunus Musyoka leads Zion Baptist Church with a profound vision for spiritual depth, community impact, and the faithful proclamation of the Gospel.",
      "With decades of dedicated service to the church, Bishop Musyoka has been instrumental in guiding the congregation through transformative seasons. His leadership is marked by a deep commitment to the authoritative teaching of the Word and a pastoral heart that cares for every member of the flock.",
      "Under his guidance, Zion Baptist Church continues to embrace the vision of 'Growing Deeper, Living Stronger', ensuring that every believer is rooted in Christ and equipped to make a kingdom impact in their families and communities."
    ],
    responsibilities: [
      'Spiritual oversight and visionary leadership of the church.',
      'Preaching and teaching the Word of God.',
      'Mentoring pastors and church leaders.',
      'Providing pastoral care and counseling.'
    ]
  },
  'sam': {
    id: 'sam',
    name: 'Pastor Sam',
    role: 'Associate Pastor',
    image: '/pastor-sam.jpeg',
    fallbackImage: null,
    email: 'pastorsam@aichappyvalley.org',
    phone: '+254 700 000 001',
    bio: [
      "Pastor Sam serves as a dynamic and passionate leader at Zion Baptist Church, focusing on spiritual formation and community engagement.",
      "He brings a vibrant energy to the pulpit and a genuine love for people, actively working to ensure the church family is deeply connected and growing in their faith journey.",
      "Pastor Sam champions our 'Living Stronger' initiative, empowering members to step out in faith, serve their community with purpose, and support one another in practical, life-changing ways."
    ],
    responsibilities: [
      'Leading discipleship and youth programs.',
      'Coordinating community outreach initiatives.',
      'Assisting in preaching and pastoral care.',
      'Overseeing volunteer ministries.'
    ]
  },
  'miriam': {
    id: 'miriam',
    name: 'Pastor Miriam',
    role: 'Associate Pastor',
    image: '/pastor Miriam.jpeg',
    email: 'pastormiriam@aichappyvalley.org',
    phone: '+254 700 000 002',
    bio: [
      "Pastor Miriam is a dedicated leader at Zion Baptist Church, where she provides spiritual guidance and fosters a loving, faith-filled environment.",
      "She ensures that every member feels welcomed and supported, and she is deeply committed to nurturing the congregation through the Word of God.",
      "In her role, she leads and supports various church initiatives, focusing on community outreach and family-centered growth."
    ],
    responsibilities: [
      'Leading small group fellowships.',
      'Providing pastoral care and spiritual guidance.',
      'Overseeing outreach and community support.',
      'Ensuring a welcoming environment for visitors.'
    ]
  }
};

const PastorProfile = () => {
  const { id } = useParams<{ id: string }>();
  const [leader, setLeader] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeader = async () => {
      try {
        if (!id) return;
        const { getLeaderById } = await import('../features/leaders/api/getLeaders');
        const data = await getLeaderById(id);
        setLeader(data);
      } catch (err) {
        console.error("Failed to load leader profile", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeader();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen pt-32 pb-24 flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-brand-sage/30 border-t-brand-sage animate-spin"></div>
      </div>
    );
  }

  if (!leader) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 pt-32">
        <h1 className="text-3xl font-bold mb-4">Profile Not Found</h1>
        <p className="text-muted-foreground mb-8">We couldn't find the pastoral profile you were looking for.</p>
        <Link to="/about" className="text-brand-sage hover:underline flex items-center font-bold">
          <ChevronLeft size={20} className="mr-1" /> Back to About Us
        </Link>
      </div>
    );
  }

  const bioParagraphs = leader.bio ? leader.bio.split('\n').filter((p: string) => p.trim() !== '') : [];

  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <SEO
        title={`${leader.name} — ${leader.role}`}
        description={bioParagraphs[0] || 'Leadership profile for Zion Baptist Church'}
        url={`/about/pastors/${leader.id}`}
        image={leader.image}
        keywords={`${leader.name}, ${leader.role}, Zion Baptist Church pastor, church leader Thika`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Person',
          '@id': `https://aichappyvalley.org/about/pastors/${leader.id}`,
          'name': leader.name,
          'jobTitle': leader.role,
          'description': bioParagraphs[0] || '',
          'image': `https://aichappyvalley.org${leader.image}`,
          'url': `https://aichappyvalley.org/about/pastors/${leader.id}`,
          'worksFor': {
            '@type': 'Church',
            '@id': 'https://aichappyvalley.org/#church',
            'name': 'Zion Baptist Church'
          },
          'knowsAbout': ['Christian theology', 'Pastoral care', 'Discipleship'],
          'sameAs': ['https://aichappyvalley.org/about']
        }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/about" className="inline-flex items-center text-muted-foreground hover:text-brand-sage mb-8 transition-colors font-semibold text-sm uppercase tracking-wider">
          <ChevronLeft size={16} className="mr-1" /> Back to Leadership
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* Left Column: Image & Quick Info */}
          <div className="lg:col-span-5 space-y-8">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative w-full aspect-[4/5] rounded-[3rem] overflow-hidden shadow-2xl border-8 border-white bg-slate-100"
            >
              <img 
                src={leader.image}
                onError={(e) => {
                  e.currentTarget.src = '/pwa-512x512.png';
                }}
                alt={leader.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <div className="bg-white rounded-[2rem] p-8 shadow-lg border border-border">
              <h3 className="font-bold text-lg mb-6 border-b border-border pb-4">Connect</h3>
              <ul className="space-y-4">
                <li className="flex items-center gap-4 text-muted-foreground hover:text-brand-sage transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand-sage/10 flex items-center justify-center text-brand-sage shrink-0">
                    <Mail size={18} />
                  </div>
                  <a href={`mailto:info@aichappyvalley.org`} className="text-sm font-medium">info@aichappyvalley.org</a>
                </li>
                <li className="flex items-center gap-4 text-muted-foreground hover:text-brand-sage transition-colors">
                  <div className="w-10 h-10 rounded-full bg-brand-sage/10 flex items-center justify-center text-brand-sage shrink-0">
                    <Phone size={18} />
                  </div>
                  <a href={`tel:+254700000000`} className="text-sm font-medium">Church Office</a>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-border">
                 <Link to="/contact" className="w-full py-4 bg-brand-sage/10 text-brand-sage font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-brand-sage/20 transition-colors">
                    <Calendar size={18} /> Request a Meeting
                 </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Bio & Details */}
          <div className="lg:col-span-7 pt-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="mb-10">
                <span className="inline-block px-4 py-1.5 bg-brand-sage/10 text-brand-sage text-xs font-bold uppercase tracking-[0.2em] rounded-full mb-4">
                  {leader.role}
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-brand-grey tracking-tight leading-tight">
                  {leader.name}
                </h1>
              </div>

              <div className="prose prose-lg prose-slate max-w-none mb-12">
                {bioParagraphs.map((paragraph: string, index: number) => (
                  <p key={index} className="text-muted-foreground leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>

              {leader.responsibilities && leader.responsibilities.length > 0 && (
                <div className="bg-slate-50 rounded-[2rem] p-8 border border-border">
                  <h3 className="text-xl font-bold text-brand-grey mb-6 flex items-center gap-3">
                    <div className="w-2 h-8 bg-brand-sage rounded-full"></div>
                    Key Areas of Focus
                  </h3>
                  <ul className="space-y-4">
                    {leader.responsibilities.map((req: string, index: number) => (
                      <li key={index} className="flex items-start gap-4 text-muted-foreground">
                        <ArrowRight size={20} className="text-brand-sage shrink-0 mt-0.5" />
                        <span className="font-medium text-brand-grey/80">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PastorProfile;
