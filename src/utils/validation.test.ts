import { describe, it, expect } from 'vitest';
import { sanitizeText } from './validation';

describe('sanitizeText', () => {
  it('should return empty string for empty input', () => {
    expect(sanitizeText('')).toBe('');
  });

  it('should handle falsy values gracefully', () => {
    // @ts-ignore: Testing bypass of TS types
    expect(sanitizeText(null)).toBe('');
    // @ts-ignore: Testing bypass of TS types
    expect(sanitizeText(undefined)).toBe('');
  });

  it('should return normal text unchanged', () => {
    expect(sanitizeText('Hello world')).toBe('Hello world');
  });

  it('should trim leading and trailing spaces', () => {
    expect(sanitizeText('  Hello world  ')).toBe('Hello world');
  });

  it('should remove HTML tags', () => {
    expect(sanitizeText('<h1>Title</h1>')).toBe('Title');
    expect(sanitizeText('<p>Some text <br> and more</p>')).toBe('Some text  and more');
  });

  it('should remove malicious HTML (XSS)', () => {
    expect(sanitizeText("<script>alert('xss')</script>")).toBe("alert('xss')");
  });

  it('should remove javascript: protocol', () => {
    expect(sanitizeText('javascript:alert(1)')).toBe('alert(1)');
    expect(sanitizeText('JAVASCRIPT:alert(1)')).toBe('alert(1)');
  });

  it('should remove inline event handlers', () => {
    // The `<[^>]*>` regex usually strips the whole tag, but if event handlers exist in plain text
    expect(sanitizeText('onclick=alert(1)')).toBe('alert(1)');
    expect(sanitizeText('onerror=alert(1)')).toBe('alert(1)');
    expect(sanitizeText('ONLOAD=alert(1)')).toBe('alert(1)');
    expect(sanitizeText('onsubmit=alert(1)')).toBe('alert(1)');
    expect(sanitizeText('onmouseover=alert(1)')).toBe('alert(1)');
  });

  it('should handle complex mixed inputs', () => {
    expect(sanitizeText('  <a href="javascript:alert(1)" onclick=alert(2)>Click me</a>  '))
      .toBe('Click me');
  });
});
