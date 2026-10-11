import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateICSFile } from './calendar';
import { format } from 'date-fns';

describe('generateICSFile', () => {
  beforeEach(() => {
    // We want deterministic test execution since `Date.now()` is used
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-03-10T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('generates correct ICS file with start time and default +1 hour end time', () => {
    const event = {
      title: 'Sunday Service',
      description: 'Join us for worship.',
      location: '123 Main St, Anytown',
      startTime: '2024-03-17T10:00:00Z',
    };

    const expectedStart = format(new Date('2024-03-17T10:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");
    const expectedEnd = format(new Date(new Date('2024-03-17T10:00:00Z').getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'");
    const expectedNow = format(new Date('2024-03-10T12:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");

    const icsContent = generateICSFile(event);

    expect(icsContent).toContain(`DTSTAMP:${expectedNow}`);
    expect(icsContent).toContain(`DTSTART:${expectedStart}`);
    expect(icsContent).toContain(`DTEND:${expectedEnd}`);
    expect(icsContent).toContain(`SUMMARY:Sunday Service`);
    expect(icsContent).toContain(`DESCRIPTION:Join us for worship.`);
    expect(icsContent).toContain(`LOCATION:123 Main St, Anytown`);
    expect(icsContent).toContain(`UID:${Date.now()}@aichappyvalley.org`);
  });

  it('generates correct ICS file with explicit end time', () => {
    const event = {
      title: 'Bible Study',
      description: 'Weekly study',
      location: 'Room 1',
      startTime: '2024-03-17T18:00:00Z',
      endTime: '2024-03-17T20:30:00Z',
    };

    const expectedStart = format(new Date('2024-03-17T18:00:00Z'), "yyyyMMdd'T'HHmmss'Z'");
    const expectedEnd = format(new Date('2024-03-17T20:30:00Z'), "yyyyMMdd'T'HHmmss'Z'");

    const icsContent = generateICSFile(event);

    expect(icsContent).toContain(`DTSTART:${expectedStart}`);
    expect(icsContent).toContain(`DTEND:${expectedEnd}`);
  });

  it('properly escapes multiline descriptions', () => {
    const event = {
      title: 'Youth Group',
      description: 'Come join us!\nFood provided.\nBring a friend!',
      location: 'Gym',
      startTime: '2024-03-15T19:00:00Z',
    };

    const icsContent = generateICSFile(event);

    // Verify all newlines are replaced with literal \n
    expect(icsContent).toContain(`DESCRIPTION:Come join us!\\nFood provided.\\nBring a friend!`);
  });
});
