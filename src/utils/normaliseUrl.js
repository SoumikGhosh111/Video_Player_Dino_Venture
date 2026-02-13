/**
 * Converts YouTube embed links to standard watch links
 * to avoid Error 153 and improve react-player compatibility.
 */
export const normalizeYoutubeUrl = (url) => {
  if (!url) return "";
  
  // If it's already an embed link, extract the ID and return standard watch URL
  if (url.includes("/embed/")) {
    const videoId = url.split("/embed/")[1]?.split("?")[0];
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  
  return url;
};