import { describe, it, expect } from 'vitest';
import { isValidUrl } from '../validation';

describe('isValidUrl', () => {
  it('returns true for a valid https URL', () => {
    expect(isValidUrl('https://example.com')).toBe(true);
  });

  it('returns false for an http URL', () => {
    expect(isValidUrl('http://example.com')).toBe(false);
  });

  it('returns false for invalid URL formats causing an error in URL constructor', () => {
    expect(isValidUrl('not-a-url')).toBe(false);
    expect(isValidUrl('')).toBe(false);
    expect(isValidUrl('://bad-format')).toBe(false);
  });

  it('returns false for other dangerous protocols', () => {
    expect(isValidUrl('javascript:alert(1)')).toBe(false);
    expect(isValidUrl('data:text/html,<html></html>')).toBe(false);
    expect(isValidUrl('blob:https://example.com/xyz')).toBe(false);
  });
});
