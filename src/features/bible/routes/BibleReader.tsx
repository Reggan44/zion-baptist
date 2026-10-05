import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Book, ChevronRight, ChevronLeft, Languages, Star, Download, ChevronDown, ListCheck, Loader2 } from 'lucide-react';
import { Button } from '../../../components/elements/Button';
import { getBibleBooks, getBibleChapter, BIBLE_VERSIONS, BibleBook, BibleVerse, BIBLE_BOOK_MAP } from '../api/bible';
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
    const loadBooks = async () => {
      try {
        const data = await getBibleBooks(BIBLE_VERSIONS.ENGLISH);
        setBooks(data);
      } catch (err) {
        setError('Failed to load Bible books.');
      }
    };
    loadBooks();
  }, []);

  const loadChapter = useCallback(async (book: BibleBook, chapter: number) => {
    setLoading(true);
    setError(null);
    try {
      const translation = language === 'english' ? BIBLE_VERSIONS.ENGLISH : BIBLE_VERSIONS.SWAHILI;
      const data = await getBibleChapter(translation, book.bookid, chapter);
      setVerses(data);
      setView('reader');
    } catch (err) {
      setError('Could not load scripture. Check your connection.');
    } finally {
      setLoading(false);
    }
  }, [language]);

  useEffect(() => {
    if (selectedBook && view === 'reader') {
      loadChapter(selectedBook, currentChapter);
    }
  }, [language, selectedBook, currentChapter, view, loadChapter]);

  const handleBookSelect = (book: BibleBook) => {
    setSelectedBook(book);
    setView('chapters');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleChapterSelect = (chapter: number) => {
    if (!selectedBook) return;
    setCurrentChapter(chapter);
    loadChapter(selectedBook, chapter);
  };

  const handleChapterNav = (dir: 'prev' | 'next') => {
    if (!selectedBook) return;
    if (dir === 'next' && currentChapter < selectedBook.chapters) {
      setCurrentChapter(currentChapter + 1);
    } else if (dir === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    }
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  return (
    <div className="min-h-screen pt-28 pb-32 lg:pb-24 bg-white antialiased relative overflow-hidden scroll-smooth">
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

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <div className="sticky top-[80px] z-40 bg-white/95 backdrop-blur-2xl pb-4 border-b border-brand-sage/10 mb-8 pt-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {view !== 'list' && (
                <button 
                  onClick={() => setView(view === 'reader' ? 'chapters' : 'list')}
                  className="w-12 h-12 rounded-full border border-slate-100 flex items-center justify-center text-brand-grey hover:bg-brand-sage/10 transition-all shadow-sm"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-semibold text-brand-grey tracking-tight uppercase" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {view === 'reader' && selectedBook 
                    ? `${language === 'english' ? BIBLE_BOOK_MAP[selectedBook.bookid].en : BIBLE_BOOK_MAP[selectedBook.bookid].sw} ${currentChapter}` 
                    : view === 'chapters' && selectedBook
                    ? language === 'english' ? BIBLE_BOOK_MAP[selectedBook.bookid].en : BIBLE_BOOK_MAP[selectedBook.bookid].sw
                    : "HOLY BIBLE (V2 ACTIVE)"}
                </h1>
                <p className="text-[9px] uppercase font-medium tracking-[0.4em] text-brand-sage flex items-center gap-2 mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  {language === 'english' ? 'New King James Version' : 'Swahili Union Version'} <div className="w-1 h-1 rounded-full bg-brand-sage/40" />
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setLanguage(language === 'english' ? 'swahili' : 'english')}
                className="flex items-center gap-3 px-8 py-3 bg-brand-grey text-white text-[10px] font-semibold uppercase tracking-[0.2em] rounded-full shadow-2xl hover:bg-brand-sage transition-all"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <Languages size={14} />
                {language === 'english' ? 'Swahili' : 'English'}
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
              className="mt-[60px] md:mt-[80px]"
            >
              {error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 font-bold">{error}</p>
                </div>
              ) : books.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-48 gap-6">
                  <Loader2 size={48} className="animate-spin text-brand-sage/40" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-sage animate-pulse" style={{ fontFamily: "'Montserrat', sans-serif" }}>Loading Library...</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {books.map(book => (
                    <button
                      key={book.bookid}
                      onClick={() => handleBookSelect(book)}
                      className="p-6 text-left border border-slate-100 rounded-[1.5rem] hover:border-brand-sage hover:bg-brand-sage/5 transition-all group overflow-hidden relative"
                    >
                      <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-brand-sage/5 rounded-full group-hover:scale-[3] transition-transform duration-700"></div>
                      <span className="text-[9px] uppercase font-semibold text-brand-sage/40 block mb-2 tracking-[0.2em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Mission</span>
                      <span className="text-sm font-semibold text-brand-grey group-hover:text-brand-sage transition-colors uppercase tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                        {language === 'english' ? BIBLE_BOOK_MAP[book.bookid].en : BIBLE_BOOK_MAP[book.bookid].sw}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ) : view === 'chapters' ? (
            <motion.div 
              key="chapters"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="mt-[60px] md:mt-[80px]"
            >
              <div className="mb-12">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.5em] text-brand-sage mb-2" style={{ fontFamily: "'Montserrat', sans-serif" }}>Select Chapter</h2>
                <div className="w-12 h-1 bg-brand-sage rounded-full opacity-20"></div>
              </div>
              
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {selectedBook && Array.from({ length: selectedBook.chapters }, (_, i) => i + 1).map(chapter => (
                  <button
                    key={chapter}
                    onClick={() => handleChapterSelect(chapter)}
                    className="aspect-square flex items-center justify-center border border-slate-100 rounded-2xl hover:border-brand-sage hover:bg-brand-sage/5 transition-all group"
                  >
                    <span className="text-lg font-light text-brand-grey group-hover:text-brand-sage transition-colors" style={{ fontFamily: "'Montserrat', sans-serif" }}>{chapter}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="reader"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-[80px] md:mt-[100px]"
            >
              {loading ? (
                <div className="flex flex-col items-center justify-center py-48 gap-6">
                  <Loader2 size={48} className="animate-spin text-brand-sage/40" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-brand-sage animate-pulse" style={{ fontFamily: "'Montserrat', sans-serif" }}>Decoding Scripture...</p>
                </div>
              ) : error ? (
                <div className="text-center py-20">
                  <p className="text-red-500 font-bold">{error}</p>
                  <Button onClick={() => loadChapter(selectedBook!, currentChapter)} className="mt-4">Try Again</Button>
                </div>
              ) : verses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 text-center px-6">
                  <Download size={48} className="text-brand-sage/20 mb-6" />
                  <h3 className="text-xl font-semibold text-brand-grey mb-2 uppercase tracking-tight" style={{ fontFamily: "'Montserrat', sans-serif" }}>Restoring Chapter...</h3>
                  <p className="text-sm text-brand-grey/60 max-w-sm mb-8 leading-relaxed">
                    This scripture is still synchronizing or was interrupted. Tap below to try a live fetch.
                  </p>
                  <Button 
                    onClick={() => loadChapter(selectedBook!, currentChapter)}
                    variant="outline"
                    className="border-brand-sage text-brand-sage hover:bg-brand-sage hover:text-white rounded-full px-8"
                  >
                    Load Live Scripture
                  </Button>
                </div>
              ) : (
                <div className="space-y-10 pb-20">
                  <div className="prose prose-slate max-w-none text-xl md:text-2xl font-light text-brand-grey leading-loose tracking-tight" style={{ fontFamily: "'Merriweather', 'Georgia', serif" }}>
                    <p>
                      {verses.map(v => (
                        <span key={v.pk} className="inline group hover:bg-slate-50/50 transition-colors rounded-sm px-1">
                          <sup className="text-[11px] md:text-xs font-semibold text-brand-sage/60 mr-1 group-hover:text-brand-sage transition-colors select-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                            {v.verse}
                          </sup>
                          {stripHtml(v.text)}{" "}
                        </span>
                      ))}
                    </p>
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex items-center justify-between pt-16 border-t border-brand-sage/10">
                    <button 
                      onClick={() => handleChapterNav('prev')}
                      disabled={currentChapter <= 1}
                      className="flex items-center gap-3 text-[10px] font-semibold text-brand-grey/40 uppercase tracking-[0.2em] hover:text-brand-sage transition-all disabled:opacity-10"
                      style={{ fontFamily: "'Montserrat', sans-serif" }}
                    >
                      <ChevronLeft size={16} /> Prev
                    </button>
                    <div className="text-center px-12 border-x border-slate-100">
                      <span className="text-[9px] uppercase font-semibold text-brand-sage/40 block mb-2 tracking-[0.4em]" style={{ fontFamily: "'Montserrat', sans-serif" }}>Chapter</span>
                      <span className="text-4xl font-light text-brand-grey leading-none" style={{ fontFamily: "'Montserrat', sans-serif" }}>{currentChapter}</span>
                    </div>
                    <button 
                      onClick={() => handleChapterNav('next')}
                      disabled={!selectedBook || currentChapter >= selectedBook.chapters}
                      className="flex items-center gap-3 text-[10px] font-semibold text-brand-grey/40 uppercase tracking-[0.2em] hover:text-brand-sage transition-all disabled:opacity-10"
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
