import { describe, it, expect } from 'vitest';
import { getGoogleCalendarLink } from './calendar';

describe('getGoogleCalendarLink', () => {
  it('should generate a valid Google Calendar link with a provided endTime', () => {
    const event = {
      title: 'Test Event',
      description: 'This is a test event.',
      location: 'Test Location',
      startTime: '2023-10-15T10:00:00Z',
      endTime: '2023-10-15T12:00:00Z',
    };

    const link = getGoogleCalendarLink(event);
    const url = new URL(link);
    const params = new URLSearchParams(url.search);

    expect(url.origin + url.pathname).toBe('https://www.google.com/calendar/render');
    expect(params.get('action')).toBe('TEMPLATE');
    expect(params.get('text')).toBe('Test Event');
    expect(params.get('dates')).toBe('20231015T100000Z/20231015T120000Z');
    expect(params.get('details')).toBe('This is a test event.');
    expect(params.get('location')).toBe('Test Location');
  });

  it('should generate a valid Google Calendar link with a default +1 hour endTime when endTime is missing', () => {
    const event = {
      title: 'Test Event Missing End Time',
      description: 'This is a test event without an end time.',
      location: 'Test Location',
      startTime: '2023-10-15T10:00:00Z',
    };

    const link = getGoogleCalendarLink(event);
    const url = new URL(link);
    const params = new URLSearchParams(url.search);

    expect(url.origin + url.pathname).toBe('https://www.google.com/calendar/render');
    expect(params.get('action')).toBe('TEMPLATE');
    expect(params.get('text')).toBe('Test Event Missing End Time');

    // Default +1 hour from 10:00:00Z is 11:00:00Z
    expect(params.get('dates')).toBe('20231015T100000Z/20231015T110000Z');

    expect(params.get('details')).toBe('This is a test event without an end time.');
    expect(params.get('location')).toBe('Test Location');
  });
});
