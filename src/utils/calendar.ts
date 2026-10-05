import { format } from 'date-fns';

interface CalendarEvent {
  title: string;
  description: string;
  location: string;
  startTime: string; // ISO string
  endTime?: string;   // ISO string (optional, defaults to +1 hour)
}

/**
 * Generates a Google Calendar link for an event.
 */
export const getGoogleCalendarLink = (event: CalendarEvent): string => {
  const start = format(new Date(event.startTime), "yyyyMMdd'T'HHmmss'Z'");
  const end = event.endTime 
    ? format(new Date(event.endTime), "yyyyMMdd'T'HHmmss'Z'")
    : format(new Date(new Date(event.startTime).getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'");

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${start}/${end}`,
    details: event.description,
    location: event.location,
  });

  return `https://www.google.com/calendar/render?${params.toString()}`;
};

/**
 * Generates an .ics file content for an event.
 */
export const generateICSFile = (event: CalendarEvent): string => {
  const start = format(new Date(event.startTime), "yyyyMMdd'T'HHmmss'Z'");
  const end = event.endTime 
    ? format(new Date(event.endTime), "yyyyMMdd'T'HHmmss'Z'")
    : format(new Date(new Date(event.startTime).getTime() + 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'");

  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");

  return [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PROID:-//Zion Baptist Church//Events//EN',
    'BEGIN:VEVENT',
    `DTSTAMP:${now}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
    `LOCATION:${event.location}`,
    `UID:${Date.now()}@aichappyvalley.org`,
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');
};

/**
 * Downloads an .ics file.
 */
export const downloadICS = (event: CalendarEvent) => {
  const content = generateICSFile(event);
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `${event.title.toLowerCase().replace(/\s+/g, '-')}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
