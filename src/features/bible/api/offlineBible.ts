import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { BibleVerse, BibleBook } from './bible';

interface BibleDB extends DBSchema {
  books: {
    key: string; // translation as key
    value: {
      translation: string;
      books: BibleBook[];
    };
  };
  chapters: {
    key: string; // e.g. "NKJV-1-1" for translation, book, chapter
    value: {
      id: string;
      translation: string;
      book: number;
      chapter: number;
      verses: BibleVerse[];
    };
    indexes: {
      'by-translation-book-chapter': [string, number, number];
    };
  };
  metadata: {
    key: string; // translation name
    value: {
      translation: string;
      downloaded: boolean;
      timestamp: number;
    };
  };
}

const DB_NAME = 'bible-offline-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<BibleDB>> | null = null;

export const getDB = () => {
  if (!dbPromise) {
    dbPromise = openDB<BibleDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        db.createObjectStore('books', { keyPath: 'translation' });

        const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' });
        chapterStore.createIndex('by-translation-book-chapter', ['translation', 'book', 'chapter']);

        db.createObjectStore('metadata', { keyPath: 'translation' });
      },
    });
  }
  return dbPromise;
};

// Check if translation is fully downloaded
export const isTranslationDownloaded = async (translation: string): Promise<boolean> => {
  try {
    const db = await getDB();
    const meta = await db.get('metadata', translation);
    return !!meta?.downloaded;
  } catch (error) {
    console.error('Failed to check download status:', error);
    return false;
  }
};

// Background download script for full bundled JSON
export const downloadFullTranslation = async (translation: string): Promise<void> => {
  try {
    const db = await getDB();
    const isDownloaded = await isTranslationDownloaded(translation);
    if (isDownloaded) {
      console.log(`[Bible Sync] ${translation} already downloaded.`);
      return;
    }

    console.log(`[Bible Sync] Starting download for ${translation}...`);
    const response = await fetch(`https://bolls.life/static/translations/${translation}.json`);

    if (!response.ok) {
      throw new Error(`Failed to fetch ${translation} translation`);
    }

    const data: BibleVerse[] & { book: number, chapter: number, translation: string }[] = await response.json();
    console.log(`[Bible Sync] Downloaded ${translation}. Parsing verses...`);

    // Group verses by book and chapter
    const chaptersMap = new Map<string, {
      id: string;
      translation: string;
      book: number;
      chapter: number;
      verses: BibleVerse[];
    }>();

    for (const verse of data) {
      // The API's bundled JSON structure:
      // [{"pk": 2153705, "translation": "NKJV", "book": 1, "chapter": 1, "verse": 1, "text": "...", "comment": "..."}, ...]
      const b = verse.book;
      const c = verse.chapter;
      const id = `${translation}-${b}-${c}`;

      if (!chaptersMap.has(id)) {
        chaptersMap.set(id, {
          id,
          translation,
          book: b,
          chapter: c,
          verses: []
        });
      }

      const chapterData = chaptersMap.get(id)!;
      // ensure we just save what's necessary to save space (and match the API shape if possible)
      chapterData.verses.push({
        pk: verse.pk,
        verse: verse.verse,
        text: verse.text
      });
    }

    console.log(`[Bible Sync] Found ${chaptersMap.size} chapters. Saving to IDB...`);

    // Use a transaction to put all chapters
    const tx = db.transaction('chapters', 'readwrite');
    const store = tx.objectStore('chapters');

    for (const chapter of chaptersMap.values()) {
      await store.put(chapter);
    }

    await tx.done;

    // Mark as downloaded
    await db.put('metadata', {
      translation,
      downloaded: true,
      timestamp: Date.now()
    });

    console.log(`[Bible Sync] ${translation} saved successfully.`);
  } catch (error) {
    console.error(`[Bible Sync] Error downloading ${translation}:`, error);
  }
};

export const getChapterFromDB = async (translation: string, book: number, chapter: number): Promise<BibleVerse[] | null> => {
  try {
    const db = await getDB();
    const id = `${translation}-${book}-${chapter}`;
    const chapterData = await db.get('chapters', id);
    return chapterData ? chapterData.verses : null;
  } catch (error) {
    console.error('Error fetching chapter from IDB:', error);
    return null;
  }
};

export const getBooksFromDB = async (translation: string): Promise<BibleBook[] | null> => {
  try {
    const db = await getDB();
    const data = await db.get('books', translation);
    return data ? data.books : null;
  } catch (error) {
    console.error('Error fetching books from IDB:', error);
    return null;
  }
};

export const saveBooksToDB = async (translation: string, books: BibleBook[]): Promise<void> => {
  try {
    const db = await getDB();
    await db.put('books', {
      translation,
      books
    });
  } catch (error) {
    console.error('Error saving books to IDB:', error);
  }
};
