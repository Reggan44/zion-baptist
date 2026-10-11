import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getYouTubeEmbedUrl = (url: string) => {
  if (!url) return '';
  if (url.includes('embed/')) return url;

  let id = '';
  if (url.includes('v=')) {
    id = url.split('v=')[1].split('&')[0];
  } else if (url.includes('youtu.be/')) {
    id = url.split('youtu.be/')[1].split('?')[0];
  } else if (url.includes('shorts/')) {
    id = url.split('shorts/')[1].split('?')[0];
  }

  return id ? `https://www.youtube-nocookie.com/embed/${id}` : url;
};
