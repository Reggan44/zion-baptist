import type { Sermon } from '../../../types';
import {
  isNonEmpty,
  isValidUrl,
  isWithinMaxLength,
} from '../../../utils/validation';

export const validateSermon = (data: Omit<Sermon, 'id'>): string | null => {
  if (!isNonEmpty(data.title)) return 'Title is required.';
  if (!isWithinMaxLength(data.title, 200)) return 'Title must be 200 characters or fewer.';
  if (!isNonEmpty(data.date)) return 'Date is required.';
  if (!isNonEmpty(data.videoUrl)) return 'Video URL is required.';
  if (!isValidUrl(data.videoUrl)) return 'Video URL must be a valid https:// URL.';
  if (!isWithinMaxLength(data.description, 2000)) return 'Description must be 2000 characters or fewer.';
  return null;
};
