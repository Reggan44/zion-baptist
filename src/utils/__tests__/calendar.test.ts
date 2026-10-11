import { describe, it, expect } from 'vitest';
import { getGoogleCalendarLink } from '../calendar';
import { format } from 'date-fns';

describe('getGoogleCalendarLink', () => {
  it('should generate a valid Google Calendar link with default end time (+1 hour) when end time is not provided', () => {
    const event = {
      title: 'Sunday Service',
      description: 'Join us for Sunday Service',
      location: '123 Main St',
      startTime: '2023-10-22T10:00:00Z',
    };

    const link = getGoogleCalendarLink(event);
    const url = new URL(link);
    const params = url.searchParams;

    expect(url.origin).toBe('https://www.google.com');
    expect(url.pathname).toBe('/calendar/render');
    expect(params.get('action')).toBe('TEMPLATE');
    expect(params.get('text')).toBe('Sunday Service');
    expect(params.get('details')).toBe('Join us for Sunday Service');
    expect(params.get('location')).toBe('123 Main St');

    // Start time: 2023-10-22T10:00:00Z -> format: 20231022T100000Z
    // End time (default + 1h): 2023-10-22T11:00:00Z -> format: 20231022T110000Z
    const expectedStart = format(new Date('2023-10-22T10:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");
    const expectedEnd = format(new Date('2023-10-22T11:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");

    expect(params.get('dates')).toBe(`${expectedStart}/${expectedEnd}`);
  });

  it('should generate a valid Google Calendar link with provided end time', () => {
    const event = {
      title: 'Bible Study',
      description: 'Weekly Bible Study',
      location: 'Room 101',
      startTime: '2023-10-25T18:00:00Z',
      endTime: '2023-10-25T20:00:00Z',
    };

    const link = getGoogleCalendarLink(event);
    const url = new URL(link);
    const params = url.searchParams;

    const expectedStart = format(new Date('2023-10-25T18:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");
    const expectedEnd = format(new Date('2023-10-25T20:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");

    expect(params.get('dates')).toBe(`${expectedStart}/${expectedEnd}`);
  });
});
