import { describe, it, expect } from 'vitest';
import { getGoogleCalendarLink } from '../calendar';

describe('getGoogleCalendarLink', () => {
  it('should generate a link with correct dates and event details when endTime is provided', () => {
    const event = {
      title: 'Sunday Service',
      description: 'Weekly Sunday worship service',
      location: 'Main Sanctuary',
      startTime: '2024-01-01T10:00:00Z',
      endTime: '2024-01-01T12:00:00Z',
    };

    const link = getGoogleCalendarLink(event);

    expect(link).toContain('https://www.google.com/calendar/render?');
    expect(link).toContain('action=TEMPLATE');
    expect(link).toContain('text=Sunday+Service');
    expect(link).toContain('details=Weekly+Sunday+worship+service');
    expect(link).toContain('location=Main+Sanctuary');
    expect(link).toContain('dates=20240101T100000Z%2F20240101T120000Z');
  });

  it('should generate a link with an end time 1 hour after start time when endTime is not provided', () => {
    const event = {
      title: 'Quick Meetup',
      description: 'A brief meeting',
      location: 'Fellowship Hall',
      startTime: '2024-01-01T10:00:00Z',
    };

    const link = getGoogleCalendarLink(event);

    expect(link).toContain('https://www.google.com/calendar/render?');
    expect(link).toContain('action=TEMPLATE');
    expect(link).toContain('text=Quick+Meetup');
    expect(link).toContain('details=A+brief+meeting');
    expect(link).toContain('location=Fellowship+Hall');
    // Start is 10:00:00Z, so end should be 11:00:00Z
    expect(link).toContain('dates=20240101T100000Z%2F20240101T110000Z');
  });
});
