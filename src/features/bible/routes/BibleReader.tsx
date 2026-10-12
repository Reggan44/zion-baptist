import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Languages, Download, Loader2 } from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import { getBibleBooks, getBibleChapter, BIBLE_VERSIONS, BibleBook, BibleVerse, BIBLE_BOOK_MAP } from '../api/bible';
import { downloadFullTranslation } from '../api/offlineBible';
import SEO from '../../../components/seo/SEO';

const BibleReader = () => {
  const [books, setBooks] = useState<BibleBook[]>([]);
  const [selectedBook, setSelectedBook] = useState<BibleBook | null>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [verses, setVerses] = useState<BibleVerse[]>([]);
  const [language, setLanguage] = useState<'english' | 'swahili'>('english');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'chapters' | 'reader'>('list');

  useEffect(() => {
    let isMounted = true;
    const loadBooks = async () => {
      try {
        const data = await getBibleBooks(BIBLE_VERSIONS.ENGLISH);
        if (isMounted) setBooks(data);
      } catch (err) {
        if (isMounted) setError('Failed to load Bible books.');
      }
    };
    loadBooks();

    // Defer background offline sync by 5s so immediate user queries get 100% bandwidth
    const timer = setTimeout(() => {
      downloadFullTranslation(BIBLE_VERSIONS.ENGLISH).catch(console.error);
    }, 5000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const loadChapter = useCallback(async (book: BibleBook, chapter: number) => {
    setLoading(true);
    setError(null);
    try {
      const translation = language === 'english' ? BIBLE_VERSIONS.ENGLISH : BIBLE_VERSIONS.SWAHILI;
      const data = await getBibleChapter(translation, book.bookid, chapter);
      setVerses(data);
    } catch (err) {
      setError('Could not load scripture. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Single effect to load chapter whenever reader view is active and book/chapter/language changes
  useEffect(() => {
    if (selectedBook && view === 'reader') {
      loadChapter(selectedBook, currentChapter);
    }
  }, [selectedBook, currentChapter, view, language, loadChapter]);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setView('chapters');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleChapterSelect = (chapter: number) => {
    if (!selectedBook) return;
    setCurrentChapter(chapter);
    setView('reader'); // Instantly transition to reader with skeleton!
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleChapterNav = (dir: 'prev' | 'next') => {
    if (!selectedBook) return;
    if (dir === 'next' && currentChapter < selectedBook.chapters) {
      setCurrentChapter(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } else if (dir === 'prev' && currentChapter > 1) {
      setCurrentChapter(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen pt-24 sm:pt-28 pb-24 bg-white antialiased relative overflow-hidden scroll-smooth">
      <SEO 
        title="Holy Bible (English & Swahili)"
        description="Read the complete Holy Bible in English and Swahili. Zion Baptist Church offers full offline access to the New King James Version (NKJV) and Swahili Union Version (SUV)."
        url="/bible"
        keywords="Swahili Bible online, SUV Bible, New King James Version, NKJV, read bible offline, Zion Baptist church bible"
      />
      
      <div className="absolute top-0 right-0 w-full h-full opacity-[0.03] pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-sage rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-sky rounded-full blur-[140px]"></div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Sticky Controls Header */}
        <div className="sticky top-[64px] sm:top-[72px] z-40 bg-white/95 backdrop-blur-2xl pb-3 pt-2 border-b border-brand-sage/10 mb-6">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
              {view !== 'list' && (
                <button 
                  onClick={() => setView(view === 'reader' ? 'chapters' : 'list')}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border border-slate-200 flex items-center justify-center text-brand-grey hover:bg-brand-sage/10 transition-all shadow-sm shrink-0"
                  aria-label="Back"
                >
                  <ChevronLeft size={18} />
                </button>
              )}
              <div className="overflow-hidden">
                <h1 className="text-lg sm:text-2xl font-bold text-brand-grey tracking-tight uppercase truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {view === 'reader' && selectedBook 
                    ? `${language === 'english' ? BIBLE_BOOK_MAP[selectedBook.bookid]?.en || selectedBook.name : BIBLE_BOOK_MAP[selectedBook.bookid]?.sw || selectedBook.name} ${currentChapter}` 
                    : view === 'chapters' && selectedBook
                    ? language === 'english' ? BIBLE_BOOK_MAP[selectedBook.bookid]?.en || selectedBook.name : BIBLE_BOOK_MAP[selectedBook.bookid]?.sw || selectedBook.name
                    : "Holy Bible"}
                </h1>
                <p className="text-[9px] uppercase font-semibold tracking-[0.25em] sm:tracking-[0.35em] text-brand-sage flex items-center gap-1.5 mt-0.5 truncate" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {language === 'english' ? 'New King James Version' : 'Swahili Union Version'}
                </p>
              </div>
            </div>

            <div className="shrink-0">
              <button 
                onClick={() => setLanguage(language === 'english' ? 'swahili' : 'english')}
                className="flex items-center gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 bg-brand-grey text-white text-[10px] font-semibold uppercase tracking-[0.15em] sm:tracking-[0.2em] rounded-full shadow-md hover:bg-brand-sage transition-all active:scale-95"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Languages size={13} />
                <span>{language === 'english' ? 'Swahili' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {view === 'list' ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-2 sm:mt-4"
            >
              {error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 font-bold">{error}</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 gap-4">
                  <Loader2 size={40} className="animate-spin text-brand-sage/40" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-brand-sage animate-pulse" style={{ fontFamily: "'Montserrat', sans-serif" }}>Loading Books...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2.5 sm:gap-3">
                  {books.map(book => (
                    <button
                      key={book.bookid}
                      onClick={() => handleBookSelect(book)}
                      className="p-4 sm:p-5 text-left border border-slate-100 rounded-2xl hover:border-brand-sage hover:bg-brand-sage/5 transition-all group overflow-hidden relative shadow-sm"
                    >
                      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-brand-sage/5 rounded-full group-hover:scale-[3] transition-transform duration-700"></div>
                      <span className="text-[9px] uppercase font-semibold text-brand-sage/50 block mb-1 tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {book.chapters} {book.chapters === 1 ? 'Ch' : 'Chs'}
                      </span>
                      <span className="text-xs sm:text-sm font-semibold text-brand-grey group-hover:text-brand-sage transition-colors uppercase tracking-tight line-clamp-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {language === 'english' ? (BIBLE_BOOK_MAP[book.bookid]?.en || book.name) : (BIBLE_BOOK_MAP[book.bookid]?.sw || book.name)}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : view === 'chapters' ? (
            <motion.div 
              key="chapters"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-2 sm:mt-4"
            >
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-[10px] font-bold uppercase tracking-[0.4em] text-brand-sage" style={{ fontFamily: "'Montserrat', sans-serif" }}>Select Chapter</h2>
                  <div className="w-10 h-0.5 bg-brand-sage rounded-full opacity-40 mt-1"></div>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {selectedBook?.chapters} Chapters
                </span>
              </div>
              
              <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2 sm:gap-3">
                {selectedBook && Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className="aspect-square flex items-center justify-center border border-slate-200/80 rounded-xl sm:rounded-2xl hover:border-brand-sage hover:bg-brand-sage/10 transition-all group active:scale-95 shadow-sm"
                  >
                    <span className="text-base sm:text-lg font-normal text-brand-grey group-hover:text-brand-sage transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>{chapter}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reader"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="mt-2 sm:mt-4"
            >
              {loading ? (
                /* Instant skeleton reader so user immediately sees scripture outline */
                <div className="space-y-6 py-4 animate-pulse">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-36 bg-slate-200 rounded-lg"></div>
                    <div className="h-4 w-16 bg-slate-100 rounded-full"></div>
                  </div>
                  <div className="space-y-4 pt-4">
                    <div className="h-5 bg-slate-100 rounded w-full"></div>
                    <div className="h-5 bg-slate-100 rounded w-11/12"></div>
                    <div className="h-5 bg-slate-100 rounded w-full"></div>
                    <div className="h-5 bg-slate-100 rounded w-4/5"></div>
                    <div className="h-5 bg-slate-100 rounded w-full"></div>
                    <div className="h-5 bg-slate-100 rounded w-5/6"></div>
                    <div className="h-5 bg-slate-100 rounded w-full"></div>
                    <div className="h-5 bg-slate-100 rounded w-3/4"></div>
                  </div>
                  <div className="flex items-center gap-2 pt-6 text-brand-sage/70 text-xs font-semibold uppercase tracking-wider">
                    <Loader2 size={15} className="animate-spin text-brand-sage" />
                    <span>Opening verses...</span>
                  </div>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 font-bold mb-4">{error}</p>
                  <Button onClick={() => loadChapter(selectedBook!, currentChapter)} className="rounded-full px-6">
                    Try Again
                  </Button>
                </div>
              ) : verses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center px-6">
                  <Download size={40} className="text-brand-sage/30 mb-4" />
                  <h3 className="text-lg font-semibold text-brand-grey mb-2 uppercase tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Restoring Chapter...</h3>
                  <p className="text-xs text-brand-grey/60 max-w-sm mb-6 leading-relaxed">
                    This scripture is downloading. Tap below to retry.
                  </p>
                  <Button 
                    onClick={() => loadChapter(selectedBook!, currentChapter)}
                    variant="outline"
                    className="border-brand-sage text-brand-sage hover:bg-brand-sage hover:text-white rounded-full px-6"
                  >
                    Load Live Scripture
                  </Button>
                </div>
              ) : (
                <div className="space-y-10 pb-16">
                  <div className="prose prose-slate max-w-none text-lg sm:text-xl md:text-2xl font-light text-brand-grey leading-relaxed sm:leading-loose tracking-tight" style={{ fontFamily: "'Merriweather', 'Georgia', serif" }}>
                    <p>
                      {verses.map(v => (
                        <span key={v.pk} className="inline group hover:bg-slate-50 transition-colors rounded-sm px-0.5">
                          <sup className="text-[11px] md:text-xs font-semibold text-brand-sage mr-1 group-hover:text-primary transition-colors select-none font-sans">
                            {v.verse}
                          </sup>
                          {stripHtml(v.text)}{" "}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Chapter Navigation Footer */}
                  <div className="flex items-center justify-between pt-10 border-t border-brand-sage/10">
                    <button 
                      onClick={() => handleChapterNav('prev')}
                      disabled={currentChapter <= 1}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-brand-grey uppercase tracking-wider hover:border-brand-sage hover:text-brand-sage transition-all disabled:opacity-20 active:scale-95"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <div className="text-center px-4 sm:px-8">
                      <span className="text-[9px] uppercase font-semibold text-brand-sage block tracking-[0.3em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chapter</span>
                      <span className="text-2xl sm:text-3xl font-light text-brand-grey leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>{currentChapter}</span>
                    </div>
                    <button 
                      onClick={() => handleChapterNav('next')}
                      disabled={!selectedBook || currentChapter >= selectedBook.chapters}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-slate-200 text-xs font-semibold text-brand-grey uppercase tracking-wider hover:border-brand-sage hover:text-brand-sage transition-all disabled:opacity-20 active:scale-95"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      Next <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BibleReader;
