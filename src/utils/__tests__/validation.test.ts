import { describe, it, expect } from 'vitest';
import { isValidUrl } from '../validation';

describe('isValidUrl', () => {
  it('returns true for valid https URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('https://google.com/search?q=test')).toBe(true);
  });

  it('returns false for http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(false);
  });

  it('returns false for dangerous protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==')).toBe(false);
    expect(isValidUrl('blob:https://example.com/some-uuid')).toBe(false);
  });

  it('returns false for invalid URL inputs (triggers catch block)', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('://bad-url')).toBe(false);
    expect(isValidUrl('invalid')).toBe(false);
  });
});
