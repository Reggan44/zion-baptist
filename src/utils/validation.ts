/**
 * Input validation and sanitization utilities.
 * Used across all forms to prevent XSS, injection, and bad data.
 */

/** 
 * Advanced sanitization to prevent XSS via text inputs.
 * Strips script tags, event handlers (on*), and evaluates standard harmless HTML.
 */
export const sanitizeText = (value: string): string => {
  if (!value) return '';
  // Convert to string in case it's not
  let sanitized = String(value);
  // Basic HTML tag stripping
  sanitized = sanitized.replace(/<[^>]*>/g, '');
  // Remove dangerous keywords often used in injection
  sanitized = sanitized.replace(/javascript:/gi, '');
  sanitized = sanitized.replace(/onsubmit=|onclick=|onmouseover=|onerror=|onload=/gi, '');
  return sanitized.trim();
};

/** Checks a value is non-empty after sanitizing */
export const isNonEmpty = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  return sanitizeText(value).length > 0;
};

/** 
 * Protects against basic NoSQL injection by ensuring the value is a pure string
 * and doesn't contain MongoDB-style operators like $where or $ne.
 */
export const isSafeString = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  // Reject strings containing common injection parameters
  if (value.includes('$') || value.includes('{') || value.includes('}')) {
    return false;
  }
  return true;
};

/** Validates an email address format strictly */
export const isValidEmail = (value: string): boolean => {
  if (typeof value !== 'string') return false;
  return /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(value.trim());
};

/**
 * Validates a URL only allows safe https:// scheme.
 * Rejects javascript:, data:, blob: and other dangerous protocols.
 */
export const isValidUrl = (value: string): boolean => {
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:';
  } catch {
    return false;
  }
};

/** Validates a string does not exceed a given max length */
export const isWithinMaxLength = (value: string, max: number): boolean =>
  sanitizeText(value).length <= max;

/** Validates a string is at least a given min length */
export const isAtLeastLength = (value: string, min: number): boolean =>
  sanitizeText(value).length >= min;

/**
 * Simple rate-limit check using localStorage.
 * Returns true if the user is allowed to submit.
 * Stores the timestamp of the last submission under `key`.
 */
export const checkRateLimit = (key: string, cooldownMs: number): boolean => {
  const last = localStorage.getItem(key);
  if (!last) return true;
  return Date.now() - parseInt(last, 10) > cooldownMs;
};

/** Records the current time as the last submission for a rate-limit key */
export const recordSubmission = (key: string): void => {
  localStorage.setItem(key, String(Date.now()));
};
