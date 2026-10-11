import { describe, it, expect } from 'vitest';
import { validateSermon } from './validation';
import type { Sermon } from '../../../types';

describe('validateSermon', () => {
  const validSermon: Omit<Sermon, 'id'> = {
    title: 'A Valid Sermon Title',
    date: '2023-10-10',
    videoUrl: 'https://youtube.com/watch?v=123',
    description: 'This is a valid sermon description.',
    category: 'Sunday Service',
  };

  it('should return null for valid sermon data', () => {
    expect(validateSermon(validSermon)).toBeNull();
  });

  it('should return error if title is empty', () => {
    const invalidSermon = { ...validSermon, title: '' };
    expect(validateSermon(invalidSermon)).toBe('Title is required.');
  });

  it('should return error if title contains only spaces', () => {
    const invalidSermon = { ...validSermon, title: '   ' };
    expect(validateSermon(invalidSermon)).toBe('Title is required.');
  });

  it('should return error if title exceeds 200 characters', () => {
    const invalidSermon = { ...validSermon, title: 'a'.repeat(201) };
    expect(validateSermon(invalidSermon)).toBe('Title must be 200 characters or fewer.');
  });

  it('should return error if date is empty', () => {
    const invalidSermon = { ...validSermon, date: '' };
    expect(validateSermon(invalidSermon)).toBe('Date is required.');
  });

  it('should return error if date contains only spaces', () => {
    const invalidSermon = { ...validSermon, date: '   ' };
    expect(validateSermon(invalidSermon)).toBe('Date is required.');
  });

  it('should return error if videoUrl is empty', () => {
    const invalidSermon = { ...validSermon, videoUrl: '' };
    expect(validateSermon(invalidSermon)).toBe('Video URL is required.');
  });

  it('should return error if videoUrl contains only spaces', () => {
    const invalidSermon = { ...validSermon, videoUrl: '   ' };
    expect(validateSermon(invalidSermon)).toBe('Video URL is required.');
  });

  it('should return error if videoUrl is not a valid https URL', () => {
    const invalidSermon = { ...validSermon, videoUrl: 'http://youtube.com/watch?v=123' };
    expect(validateSermon(invalidSermon)).toBe('Video URL must be a valid https:// URL.');

    const invalidSermon2 = { ...validSermon, videoUrl: 'javascript:alert(1)' };
    expect(validateSermon(invalidSermon2)).toBe('Video URL must be a valid https:// URL.');
  });

  it('should return error if description exceeds 2000 characters', () => {
    const invalidSermon = { ...validSermon, description: 'a'.repeat(2001) };
    expect(validateSermon(invalidSermon)).toBe('Description must be 2000 characters or fewer.');
  });
});
