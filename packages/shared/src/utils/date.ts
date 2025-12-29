/**
 * Format a date for display
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-BM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

/**
 * Format a date and time for display
 */
export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-BM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(date);
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 */
export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = date.getTime() - now.getTime();
  const diffInMinutes = Math.floor(diffInMs / 60000);
  const diffInHours = Math.floor(diffInMs / 3600000);
  const diffInDays = Math.floor(diffInMs / 86400000);

  if (Math.abs(diffInMinutes) < 60) {
    return diffInMinutes === 0
      ? 'just now'
      : diffInMinutes > 0
        ? `in ${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'}`
        : `${Math.abs(diffInMinutes)} minute${Math.abs(diffInMinutes) === 1 ? '' : 's'} ago`;
  }

  if (Math.abs(diffInHours) < 24) {
    return diffInHours > 0
      ? `in ${diffInHours} hour${diffInHours === 1 ? '' : 's'}`
      : `${Math.abs(diffInHours)} hour${Math.abs(diffInHours) === 1 ? '' : 's'} ago`;
  }

  return diffInDays > 0
    ? `in ${diffInDays} day${diffInDays === 1 ? '' : 's'}`
    : `${Math.abs(diffInDays)} day${Math.abs(diffInDays) === 1 ? '' : 's'} ago`;
}

/**
 * Check if a date is in the past
 */
export function isPast(date: Date): boolean {
  return date.getTime() < Date.now();
}

/**
 * Check if a date is in the future
 */
export function isFuture(date: Date): boolean {
  return date.getTime() > Date.now();
}
