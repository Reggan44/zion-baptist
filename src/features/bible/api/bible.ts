import { getBooksFromDB, saveBooksToDB, getChapterFromDB } from './offlineBible';

const BASE_URL = 'https://bolls.life';

export interface BibleBook {
  bookid: number;
  name: string;
  chapters: number;
}

export interface BibleVerse {
  pk: number;
  verse: number;
  text: string;
}

export const BIBLE_VERSIONS = {
  ENGLISH: 'NKJV',
  SWAHILI: 'SUV'
};

export const BIBLE_BOOK_MAP: Record<number, { en: string; sw: string }> = {
  1: { en: 'Genesis', sw: 'Mwanzo' },
  2: { en: 'Exodus', sw: 'Kutoka' },
  3: { en: 'Leviticus', sw: 'Walawi' },
  4: { en: 'Numbers', sw: 'Hesabu' },
  5: { en: 'Deuteronomy', sw: 'Kumbukumbu la Torati' },
  6: { en: 'Joshua', sw: 'Yoshua' },
  7: { en: 'Judges', sw: 'Waamuzi' },
  8: { en: 'Ruth', sw: 'Ruthu' },
  9: { en: '1 Samuel', sw: '1 Samweli' },
  10: { en: '2 Samuel', sw: '2 Samweli' },
  11: { en: '1 Kings', sw: '1 Wafalme' },
  12: { en: '2 Kings', sw: '2 Wafalme' },
  13: { en: '1 Chronicles', sw: '1 Mambo ya Nyakati' },
  14: { en: '2 Chronicles', sw: '2 Mambo ya Nyakati' },
  15: { en: 'Ezra', sw: 'Ezra' },
  16: { en: 'Nehemiah', sw: 'Nehemia' },
  17: { en: 'Esther', sw: 'Esta' },
  18: { en: 'Job', sw: 'Ayubu' },
  19: { en: 'Psalms', sw: 'Zaburi' },
  20: { en: 'Proverbs', sw: 'Methali' },
  21: { en: 'Ecclesiastes', sw: 'Mhubiri' },
  22: { en: 'Song of Solomon', sw: 'Wimbo Ulio Bora' },
  23: { en: 'Isaiah', sw: 'Isaya' },
  24: { en: 'Jeremiah', sw: 'Yeremia' },
  25: { en: 'Lamentations', sw: 'Maombolezo' },
  26: { en: 'Ezekiel', sw: 'Ezekieli' },
  27: { en: 'Daniel', sw: 'Danieli' },
  28: { en: 'Hosea', sw: 'Hosea' },
  29: { en: 'Joel', sw: 'Yoeli' },
  30: { en: 'Amos', sw: 'Amosi' },
  31: { en: 'Obadiah', sw: 'Obadia' },
  32: { en: 'Jonah', sw: 'Yona' },
  33: { en: 'Micah', sw: 'Mika' },
  34: { en: 'Nahum', sw: 'Nahumu' },
  35: { en: 'Habakkuk', sw: 'Habakuki' },
  36: { en: 'Zephaniah', sw: 'Sefania' },
  37: { en: 'Haggai', sw: 'Hagai' },
  38: { en: 'Zechariah', sw: 'Zekaria' },
  39: { en: 'Malachi', sw: 'Malaki' },
  40: { en: 'Matthew', sw: 'Mathayo' },
  41: { en: 'Mark', sw: 'Marko' },
  42: { en: 'Luke', sw: 'Luka' },
  43: { en: 'John', sw: 'Yohana' },
  44: { en: 'Acts', sw: 'Matendo ya Mitume' },
  45: { en: 'Romans', sw: 'Warumi' },
  46: { en: '1 Corinthians', sw: '1 Wakorintho' },
  47: { en: '2 Corinthians', sw: '2 Wakorintho' },
  48: { en: 'Galatians', sw: 'Wagalatia' },
  49: { en: 'Ephesians', sw: 'Waefeso' },
  50: { en: 'Philippians', sw: 'Wafilipi' },
  51: { en: 'Colossians', sw: 'Wakolosai' },
  52: { en: '1 Thessalonians', sw: '1 Wathesalonike' },
  53: { en: '2 Thessalonians', sw: '2 Wathesalonike' },
  54: { en: '1 Timothy', sw: '1 Timotheo' },
  55: { en: '2 Timothy', sw: '2 Timotheo' },
  56: { en: 'Titus', sw: 'Tito' },
  57: { en: 'Philemon', sw: 'Filemoni' },
  58: { en: 'Hebrews', sw: 'Waebrania' },
  59: { en: 'James', sw: 'Yakobo' },
  60: { en: '1 Peter', sw: '1 Petro' },
  61: { en: '2 Peter', sw: '2 Petro' },
  62: { en: '1 John', sw: '1 Yohana' },
  63: { en: '2 John', sw: '2 Yohana' },
  64: { en: '3 John', sw: '3 Yohana' },
  65: { en: 'Jude', sw: 'Yuda' },
  66: { en: 'Revelation', sw: 'Ufunuo wa Yohana' }
};

export const getBibleBooks = async (translation: string): Promise<BibleBook[]> => {
  try {
    const localBooks = await getBooksFromDB(translation);
    if (localBooks && localBooks.length > 0) {
      return localBooks;
    }
  } catch (error) {
    console.error('Failed to get books from IDB:', error);
  }

  const response = await fetch(`${BASE_URL}/get-books/${translation}/`);
  if (!response.ok) throw new Error('Failed to fetch books');
  const books = await response.json();

  // Cache the fetched books in IDB
  await saveBooksToDB(translation, books).catch(console.error);

  return books;
};

export const getBibleChapter = async (translation: string, bookId: number, chapter: number): Promise<BibleVerse[]> => {
  try {
    const localChapter = await getChapterFromDB(translation, bookId, chapter);
    if (localChapter && localChapter.length > 0) {
      return localChapter;
    }
  } catch (error) {
    console.error('Failed to get chapter from IDB:', error);
  }

  const response = await fetch(`${BASE_URL}/get-text/${translation}/${bookId}/${chapter}/`);
  if (!response.ok) throw new Error('Failed to fetch chapter');
  return response.json();
};
