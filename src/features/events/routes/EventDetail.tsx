import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getEventById } from '../api/getEvents';
import type { EventItem } from '../../../types';
import { Calendar, MapPin, ChevronLeft, Clock, Share2, AlertCircle, Info } from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import SEO from '../../../components/seo/SEO';
import { getGoogleCalendarLink, downloadICS } from '../../../utils/calendar';

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) return;
      try {
        const data = await getEventById(id);
        if (data) {
          setEvent(data);
        } else {
          setError('Event not found.');
        }
      } catch (err) {
        setError('Failed to load event details.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();

  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
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
        <p className="text-muted-foreground animate-pulse">Syncing with the calendar...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="max-w-2xl mx-auto pt-52 pb-20 px-4 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-50 text-red-500 rounded-full mb-6">
          <AlertCircle size={32} />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-4">{error || 'Event not found'}</h1>
        <p className="text-muted-foreground mb-8">This event may have passed or the link is incorrect.</p>
        <Link to="/events">
          <Button variant="outline" className="rounded-xl">
            <ChevronLeft size={18} className="mr-2" /> Back to Events
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-20">
      <SEO
        title={event.title}
        description={event.description?.substring(0, 160) || 'Upcoming event at Zion Baptist Church Church Thika, Kenya. Join us!'}
        url={`/events/${event.id}`}
        type="article"
        publishedTime={event.date ? new Date(event.date).toISOString() : undefined}
        keywords={`${event.title}, Zion Baptist Church event, church event Thika, ${event.location || 'Happy Valley'} Kenya`}
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          'name': event.title,
          'description': event.description,
          'url': `https://aichappyvalley.org/events/${event.id}`,
          'startDate': event.date ? new Date(event.date).toISOString() : undefined,
          'location': {
            '@type': 'Place',
            'name': event.location || 'Zion Baptist Church',
            'address': {
              '@type': 'PostalAddress',
              'addressLocality': 'Thika',
              'addressRegion': 'Kiambu',
              'addressCountry': 'KE'
            }
          },
          'organizer': {
            '@type': 'Church',
            '@id': 'https://aichappyvalley.org/#church',
            'name': 'Zion Baptist Church',
            'url': 'https://aichappyvalley.org'
          },
          'image': 'https://aichappyvalley.org/og-image.png',
          'eventStatus': 'https://schema.org/EventScheduled',
          'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode'
        }}
      />

      {/* Header Section */}
      <section className="bg-slate-50 border-b border-border py-12 md:pt-52 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/events" className="inline-flex items-center text-muted-foreground hover:text-primary mb-8 transition-colors text-sm font-medium">
            <ChevronLeft size={16} className="mr-1" /> Back to Events
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex-1">
              <div className="inline-block px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full uppercase tracking-widest mb-4">
                Upcoming Event
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-foreground tracking-tight leading-tight">
                {event.title}
              </h1>
            </div>
            
            <Button onClick={handleShare} variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm border border-border">
              <Share2 size={20} />
            </Button>
          </div>
        </div>
      </section>

      {/* Details Grid */}
      <section className="mt-[-30px] px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Main Info */}
          <div className="md:col-span-2 bg-white rounded-3xl border border-border shadow-xl p-8 md:p-10">
            <div className="prose prose-slate max-w-none">
              <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                <Info size={20} className="text-primary" /> About Event
              </h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100 italic text-sm text-slate-500">
              * Please note that event times and locations are subject to change. Contact the church office for the latest updates.
            </div>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl border border-border shadow-lg p-6">
              <h3 className="font-bold text-foreground mb-6 border-b border-slate-100 pb-3">When & Where</h3>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Date</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Time</p>
                    <p className="text-sm font-semibold text-slate-700">
                      {new Date(event.date).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center shrink-0">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Location</p>
                    <p className="text-sm font-semibold text-slate-700">{event.location}</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Add to My Calendar</h4>
                <div className="grid grid-cols-2 gap-3">
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-12 text-xs font-bold border-brand-sage/20 text-brand-grey hover:bg-brand-sage/5"
                    onClick={() => {
                      const link = getGoogleCalendarLink({
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        startTime: event.date
                      });
                      window.open(link, '_blank');
                    }}
                  >
                    Google
                  </Button>
                  <Button 
                    variant="outline" 
                    className="rounded-xl h-12 text-xs font-bold border-brand-sky/20 text-brand-grey hover:bg-brand-sky/5"
                    onClick={() => {
                      downloadICS({
                        title: event.title,
                        description: event.description,
                        location: event.location,
                        startTime: event.date
                      });
                    }}
                  >
                    Apple / iCal
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <Link to="/contact">
                  <Button className="w-full rounded-2xl h-14 font-bold bg-brand-sage text-white shadow-lg shadow-brand-sage/20">I'm Interested</Button>
                </Link>
              </div>
            </div>

            {/* Google Maps Iframe for Location (Placeholder if specific map URL not provided, using generic Happy Valley search) */}
            <div className="rounded-3xl overflow-hidden border border-border shadow-lg h-64 relative bg-slate-100">
               <iframe
                title={`Map of ${event.location}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(event.location + ' Zion Baptist Church Thika')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-500"
                allowFullScreen
                loading="lazy"
                sandbox="allow-scripts allow-same-origin"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default EventDetail;
