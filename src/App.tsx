import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { RequireAuth } from './features/auth/components/RequireAuth';
import AppSmartBanner from './features/misc/components/AppSmartBanner';
import NotificationModal from './features/misc/components/NotificationModal';
import ScrollToTop from './components/layout/ScrollToTop';

// Lazy-loaded routes for code splitting — reduces initial bundle size
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const PastorProfile = lazy(() => import('./pages/PastorProfile'));
const Sermons = lazy(() => import('./features/sermons/routes/Sermons'));
const Events = lazy(() => import('./features/events/routes/Events'));
const Ministries = lazy(() => import('./features/ministries/routes/Ministries'));
const Giving = lazy(() => import('./pages/Giving'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./features/auth/routes/Login'));
const Admin = lazy(() => import('./features/admin/routes/Admin'));
const SermonDetail = lazy(() => import('./features/sermons/routes/SermonDetail'));
const EventDetail = lazy(() => import('./features/events/routes/EventDetail'));
const MinistryDetail = lazy(() => import('./features/ministries/routes/MinistryDetail'));
const DailyWord = lazy(() => import('./features/bible/routes/DailyWord'));
const BibleReader = lazy(() => import('./features/bible/routes/BibleReader'));
const NotFound = lazy(() => import('./pages/NotFound'));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary" aria-label="Loading page" />
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
          <AppSmartBanner />
          <NotificationModal />
          <Navbar />
          <main className="flex-grow overflow-x-hidden">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/about/pastors/:id" element={<PastorProfile />} />
                <Route path="/sermons" element={<Sermons />} />
                <Route path="/events" element={<Events />} />
                <Route path="/ministries" element={<Ministries />} />
                <Route path="/ministries/:id" element={<MinistryDetail />} />
                <Route path="/daily-word" element={<DailyWord />} />
                <Route path="/bible" element={<BibleReader />} />
                <Route path="/app" element={<Navigate to="/" replace />} />
                <Route path="/giving" element={<Giving />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/sermons/:id" element={<SermonDetail />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/admin"
                  element={
                    <RequireAuth>
                      <Admin />
                    </RequireAuth>
                  }
                />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </Router>
    </HelmetProvider>
  );
}

export default App;
