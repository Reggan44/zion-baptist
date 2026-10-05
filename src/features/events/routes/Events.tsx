import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useEvents } from '../../../hooks/useEvents';
import { Button } from '../../../components/elements/Button';
import { Calendar, MapPin, Clock, ChevronRight, AlertCircle, Share2, Plus } from 'lucide-react';
import SEO from '../../../components/seo/SEO';
import { getGoogleCalendarLink, downloadICS } from '../../../utils/calendar';

const EVENTS_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  '@id': 'https://aichappyvalley.org/events#webpage',
  'url': 'https://aichappyvalley.org/events',
  'name': 'Upcoming Events — Zion Baptist Church',
  'description': 'View all upcoming events at Zion Baptist Church Church in Thika, Kenya. Join us for worship, fellowship and community gatherings.',
  'isPartOf': { '@id': 'https://aichappyvalley.org/#church' },
  'breadcrumb': {
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://aichappyvalley.org/' },
      { '@type': 'ListItem', 'position': 2, 'name': 'Events', 'item': 'https://aichappyvalley.org/events' }
    ]
  }
};

const Events = () => {
  const { events, loading, error } = useEvents(24);

  return (
    <div className="w-full">
      <SEO
        title="Upcoming Events"
        description="Join us for worship, fellowship and community gatherings at Zion Baptist Church Church Thika. View our full events calendar and add events to your calendar."
        url="/events"
        keywords="church events Thika, Zion Baptist Church events, Christian gatherings Kenya, church calendar Thika"
        schema={EVENTS_SCHEMA}
      />
      {/* Header */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-52 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-4">
            Community Life
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-3">
            Upcoming <span className="text-primary">Events</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl">
            Join our vibrant community for worship, fellowship, and special gatherings.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div role="alert" className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl mb-8">
              <AlertCircle size={20} aria-hidden="true" />
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex flex-col justify-center items-center h-64 bg-slate-50 rounded-2xl border border-border">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mb-4" aria-label="Loading events" />
              <p className="text-sm text-muted-foreground">Loading events…</p>
            </div>
          ) : events.length === 0 && !error ? (
            <div className="text-center pt-52 pb-20 bg-slate-50 rounded-2xl border border-dashed border-border">
              <Calendar className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" aria-hidden="true" />
              <p className="text-muted-foreground font-medium">No upcoming events</p>
              <p className="text-sm text-muted-foreground mt-1">New events are added regularly. Stay tuned!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => {
                const eventDate = new Date(event.date);
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link to={`/events/${event.id}`} className="block h-full group">
                      <div className="bg-white border border-border rounded-2xl overflow-hidden hover:shadow-card-hover transition-all duration-300 h-full flex flex-col">
                        {/* Date Badge */}
                        <div className="p-6 pb-0 flex items-start justify-between">
                          <div
                            className="w-14 h-14 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors"
                            aria-hidden="true"
                          >
                            <span className="text-lg font-bold leading-none">{eventDate.getDate()}</span>
                            <span className="text-[10px] font-semibold uppercase">{eventDate.toLocaleDateString(undefined, { month: 'short' })}</span>
                          </div>
                        </div>

                        <div className="p-6 flex flex-col flex-grow">
                          <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                            {event.title}
                          </h3>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock size={14} className="text-primary shrink-0" aria-hidden="true" />
                              <time dateTime={event.date}>
                                {eventDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} · {eventDate.toLocaleDateString(undefined, { weekday: 'long' })}
                              </time>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                              <span className="line-clamp-1">{event.location}</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                            {event.description}
                          </p>

                          <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                              Event Details <ChevronRight size={16} aria-hidden="true" />
                            </span>
                            <div className="flex gap-2" onClick={(e) => e.preventDefault()}>
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                                  onClick={() => window.open(getGoogleCalendarLink({
                                    title: event.title,
                                    description: event.description,
                                    location: event.location,
                                    startTime: event.date
                                  }), '_blank')}
                                  title="Add to Google Calendar"
                               >
                                  <Plus size={14} />
                               </Button>
                               <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="h-8 w-8 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/5"
                                  onClick={() => downloadICS({
                                    title: event.title,
                                    description: event.description,
                                    location: event.location,
                                    startTime: event.date
                                  })}
                                  title="Download Apple/Outlook Calendar File"
                               >
                                  <Calendar size={14} />
                               </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;
