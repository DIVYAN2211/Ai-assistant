export default function searchYoutube(query) {
  const searchURL = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  window.open(searchURL, '_blank');
}
