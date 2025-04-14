export default function searchWeb(query) {
  const searchURL = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(searchURL, '_blank');
}
