import { describe, it, expect } from 'vitest';
import { isValidUrl } from './validation';

describe('isValidUrl', () => {
  it('should return true for valid https URLs', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
    expect(isValidUrl('https://www.google.com/path?query=1')).toBe(true);
    expect(isValidUrl('https://sub.domain.org')).toBe(true);
  });

  it('should return true for valid https URLs with leading/trailing spaces', () => {
    expect(isValidUrl('  https://example.com  ')).toBe(true);
    expect(isValidUrl('\nhttps://example.com\t')).toBe(true);
  });

  it('should return false for http URLs', () => {
    expect(isValidUrl('http://example.com')).toBe(false);
    expect(isValidUrl('http://www.google.com')).toBe(false);
  });

  it('should return false for unsupported protocols (javascript:, data:, blob:, etc.)', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==')).toBe(false);
    expect(isValidUrl('blob:https://example.com/1234')).toBe(false);
    expect(isValidUrl('ftp://example.com/file.txt')).toBe(false);
    expect(isValidUrl('file:///etc/passwd')).toBe(false);
    expect(isValidUrl('mailto:test@example.com')).toBe(false);
  });

  it('should return false for malformed URLs and random strings', () => {
    expect(isValidUrl('not a url')).toBe(false);
    expect(isValidUrl('example.com')).toBe(false); // Missing protocol
    expect(isValidUrl('www.example.com')).toBe(false); // Missing protocol
    expect(isValidUrl('https://')).toBe(false);
  });

  it('should return false for empty strings', () => {
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('   ')).toBe(false);
  });
});
