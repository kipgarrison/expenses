export function elipsis(text: string, maxChars: number) {
  if (!text || !maxChars) return "";
  if (text.length > maxChars) {
    const sliced = text.slice(0, maxChars)
    const index = sliced.lastIndexOf(' ', maxChars)
    return sliced.slice(0, index) + "...";
  } else {
    return text;
  }
}