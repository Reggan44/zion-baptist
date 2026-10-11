import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { checkRateLimit } from '../validation';

describe('checkRateLimit', () => {
  const mockNow = 1000000000000;
  let mockStorage: Record<string, string> = {};

  beforeEach(() => {
    // Mock Date.now
    vi.useFakeTimers();
    vi.setSystemTime(mockNow);

    // Mock localStorage
    mockStorage = {};
    const localStorageMock = {
      getItem: vi.fn((key: string) => mockStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockStorage[key] = value.toString();
      }),
      clear: vi.fn(() => {
        mockStorage = {};
      }),
      removeItem: vi.fn((key: string) => {
        delete mockStorage[key];
      }),
      key: vi.fn(),
      length: 0
    };

    vi.stubGlobal('localStorage', localStorageMock);
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('returns true if there is no previous submission', () => {
    expect(checkRateLimit('testKey', 5000)).toBe(true);
  });

  it('returns true if the previous submission is older than cooldownMs', () => {
    // Previous submission was 6000ms ago, cooldown is 5000ms
    mockStorage['testKey'] = String(mockNow - 6000);
    expect(checkRateLimit('testKey', 5000)).toBe(true);
  });

  it('returns false if the previous submission is more recent than cooldownMs', () => {
    // Previous submission was 4000ms ago, cooldown is 5000ms
    mockStorage['testKey'] = String(mockNow - 4000);
    expect(checkRateLimit('testKey', 5000)).toBe(false);
  });

  it('returns false if the previous submission is exactly cooldownMs old', () => {
    // Previous submission was exactly 5000ms ago, cooldown is 5000ms
    // The code uses `>` so exactly equal should be false
    mockStorage['testKey'] = String(mockNow - 5000);
    expect(checkRateLimit('testKey', 5000)).toBe(false);
  });
});
