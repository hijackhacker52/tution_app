/**
 * Safely extracts YouTube Video ID from various YouTube URL formats.
 * Supported formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;

  const cleanUrl = url.trim();

  // Standard regex matching YouTube IDs (11 chars)
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = cleanUrl.match(regExp);

  if (match && match[2].length === 11) {
    return match[2];
  }

  return null;
}

/**
 * Returns standard YouTube high-quality thumbnail URL for a video ID or URL.
 */
export function getYouTubeThumbnailUrl(youtubeUrlOrId) {
  const videoId = extractYouTubeVideoId(youtubeUrlOrId) || youtubeUrlOrId;
  if (!videoId || videoId.length !== 11) {
    return 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80';
  }
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
}

/**
 * Validates whether a given URL is a valid YouTube link.
 */
export function isValidYouTubeUrl(url) {
  return extractYouTubeVideoId(url) !== null;
}
