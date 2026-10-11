import { describe, it, expect } from 'vitest';
import { isSafeString } from './validation';

describe('isSafeString', () => {
  it('should return true for safe strings', () => {
    expect(isSafeString('hello world')).toBe(true);
    expect(isSafeString('12345')).toBe(true);
    expect(isSafeString('a safe string with punctuation!.,?')).toBe(true);
    expect(isSafeString('')).toBe(true);
  });

  it('should return false for strings containing unsafe characters', () => {
    expect(isSafeString('bad$string')).toBe(false);
    expect(isSafeString('bad{string')).toBe(false);
    expect(isSafeString('bad}string')).toBe(false);
    expect(isSafeString('${bad}')).toBe(false);
  });

  it('should return false for non-string types', () => {
    // @ts-expect-error Testing invalid input
    expect(isSafeString(null)).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(isSafeString(undefined)).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(isSafeString(123)).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(isSafeString({})).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(isSafeString([])).toBe(false);
    // @ts-expect-error Testing invalid input
    expect(isSafeString(true)).toBe(false);
  });
});
