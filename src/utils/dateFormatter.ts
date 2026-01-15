/**
 * Format date to a readable string
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g., "January 15, 2026 at 5:22 PM")
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
    timeZoneName: 'short'
  }).format(dateObj);
};

/**
 * Format date to ISO string
 * @param date - Date object
 * @returns ISO string format
 */
export const toISOString = (date: Date): string => {
  return date.toISOString();
};
