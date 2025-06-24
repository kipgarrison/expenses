export function elipsis(text: string, maxChars: number) {
  if (!text || !maxChars) return "";
  if (text.length > maxChars) {
    return text.slice(0, maxChars) + "...";
  } else {
    return text;
  }
}