import type { Sermon } from '../../../types';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
// The "Uploads" playlist ID for Zion Rd. Independent Baptist Church Kasarani
const UPLOADS_PLAYLIST_ID = 'UU5HBZHuj5z9pP6b28UZCFbg';
const STORAGE_KEY = 'zribc_cached_sermons_v1';

// Seeded verified sermons from Zion Rd Independent Baptist Church Kasarani YouTube channel
// Ensures sermons are ALWAYS visible immediately, even offline or if YouTube API limits are reached
const FALLBACK_SERMONS: Sermon[] = [
  {
    id: 'agm4xCKJYiE',
    title: '2 Paths; 1 Choice | Youth Sunday Sermon | Preached by Bro. Victor Kahuthia',
    date: '2026-09-21',
    videoUrl: 'https://www.youtube.com/watch?v=agm4xCKJYiE',
    description: 'A sermon preached by Bro. Victor Kahuthia at Zion Road Independent Baptist Church Kasarani as part of Youth Sunday. Be challenged and encouraged in God\'s Word.',
    category: 'Sermon'
  },
  {
    id: '-1juCs3182g',
    title: 'Pastor Henry Juma | Sunday sermon recap | "How can we achieve God\'s blessing and victory in 2025?"',
    date: '2025-12-05',
    videoUrl: 'https://www.youtube.com/watch?v=-1juCs3182g',
    description: 'Pastor Henry Juma recaps his sermon answering the question, "How can we achieve God\'s blessing and victory in 2025?" Zion Road Independent Baptist Church.',
    category: 'Sermon'
  },
  {
    id: 'a3alYyEcSV4',
    title: 'Walking in the Spirit — Sunday Message',
    date: '2025-05-13',
    videoUrl: 'https://www.youtube.com/watch?v=a3alYyEcSV4',
    description: 'Sunday morning worship and sermon at Zion Road Independent Baptist Church Kasarani.',
    category: 'Sermon'
  },
  {
    id: 'atb50pBPRr0',
    title: 'Why you should join our Bible Institute - Pastor Michael Mestler',
    date: '2025-05-13',
    videoUrl: 'https://www.youtube.com/watch?v=atb50pBPRr0',
    description: 'Join our Bible Institute to deepen your understanding of Scripture, grow in your personal relationship with God, and be equipped for impactful ministry.',
    category: 'Sermon'
  },
  {
    id: '0mGKDLhcU6E',
    title: 'The Personal Prayer Life of Jesus - Pastor Brent Halstead',
    date: '2025-05-13',
    videoUrl: 'https://www.youtube.com/watch?v=0mGKDLhcU6E',
    description: 'We should follow the example of Jesus’ personal prayer life because it reveals the power of consistent, intimate connection with God.',
    category: 'Sermon'
  },
  {
    id: '0DB0Vq24XvE',
    title: 'Impactful Faith - Pastor James Mugo',
    date: '2025-03-30',
    videoUrl: 'https://www.youtube.com/watch?v=0DB0Vq24XvE',
    description: 'Faith in God gives us strength, hope, and peace in every season. Trust His plan even when you cannot see the way.',
    category: 'Sermon'
  }
];

export const getSermons = async (maxResults = 50): Promise<Sermon[]> => {
  // Read local cache first for instant UI response
  let cached: Sermon[] | null = null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      cached = JSON.parse(raw);
    }
  } catch {
    // ignore localStorage errors
  }

  if (!YOUTUBE_API_KEY) {
    return cached && cached.length > 0 ? cached : FALLBACK_SERMONS;
  }
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&playlistId=${UPLOADS_PLAYLIST_ID}&maxResults=${maxResults}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const fetchedSermons: Sermon[] = data.items.map((item: any) => ({
        id: item.snippet?.resourceId?.videoId || item.id,
        title: item.snippet?.title || 'Sunday Sermon',
        date: item.snippet?.publishedAt ? new Date(item.snippet.publishedAt).toISOString().split('T')[0] : 'Recent',
        videoUrl: `https://www.youtube.com/watch?v=${item.snippet?.resourceId?.videoId}`,
        description: item.snippet?.description || '',
        category: 'Sermon'
      }));

      // Cache fresh result in localStorage
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(fetchedSermons));
      } catch {
        // ignore storage quota errors
      }

      return fetchedSermons;
    }

    // If API returned empty items, use cached or fallback
    return cached && cached.length > 0 ? cached : FALLBACK_SERMONS;
  } catch (error) {
    console.error('Error fetching from YouTube API, using cached sermons', error);
    return cached && cached.length > 0 ? cached : FALLBACK_SERMONS;
  }
};

export const getSermonById = async (id: string): Promise<Sermon | null> => {
  // Check local fallback first
  const fallbackMatch = FALLBACK_SERMONS.find(s => s.id === id);

  if (!YOUTUBE_API_KEY) return fallbackMatch || null;
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${YOUTUBE_API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.items && data.items.length > 0) {
      const item = data.items[0];
      return {
        id: item.id,
        title: item.snippet.title,
        date: new Date(item.snippet.publishedAt).toISOString().split('T')[0],
        videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
        description: item.snippet.description || '',
        category: 'Sermon'
      };
    }
    return fallbackMatch || null;
  } catch (error) {
    console.error('Error fetching single video from YouTube API', error);
    return fallbackMatch || null;
  }
};

// Dummy functions to satisfy the Admin CMS components that used to manage Firebase sermons
export const addSermon = async (..._args: any[]) => {};
export const updateSermon = async (..._args: any[]) => {};
export const deleteSermon = async (..._args: any[]) => {};
