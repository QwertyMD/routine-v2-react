/**
 * Formats a date string into a human-readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a Unix timestamp into a human-readable format
 * @param {number} unixTimestamp - Unix timestamp in seconds
 * @returns {string} Formatted date string
 */
export const formatUnixTimestamp = (unixTimestamp) => {
  if (!unixTimestamp) return 'N/A';
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formats a date for display with relative time information
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date with relative info
 */
export const formatDateWithRelative = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = Math.abs(now - date) / (1000 * 60 * 60);
  
  if (diffInHours < 24) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  } else if (diffInHours < 168) { // Less than a week
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  } else {
    return formatDate(dateString);
  }
};