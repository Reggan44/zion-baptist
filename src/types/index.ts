export interface Sermon {
  id?: string;
  title: string;
  date: string;
  videoUrl: string;
  description: string;
  category: string;
}

export interface EventItem {
  id?: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface Ministry {
  id?: string;
  name: string;
  description: string;
  tagline?: string;
  image: string;
  gallery: string[];
  iconName: string;
  color: string;
  textColor: string;
  order: number;
  activities?: string[];
  meetingTime?: string;
  leader?: string;
}

export interface Message {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  sentAt: string;
  read?: boolean;
}

export interface GalleryItem {
  id?: string;
  title: string;
  imageUrl: string;
  category: string;
  date: string;
}

export interface BlogPost {
  id?: string;
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  author: string;
  date: string;
  tags: string[];
}

export interface BroadcastNotification {
  id?: string;
  title: string;
  body: string;
  sentAt: string;
}

export interface BroadcastNotification {
  id?: string;
  title: string;
  body: string;
  sentAt: string;
}

export interface Leader {
  id?: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  responsibilities: string[];
  order: number;
}
