export function normalizeText(text: string): string {
  let t = text ?? "";
  t = t.replace(/\r\n/g, "\n");
  t = t.replace(/\u3000/g, " ");
  t = t.replace(/[ \t]+/g, " ");
  return t;
}

export function normalizeKeyForVariant(s: string): string {
  return (s ?? "")
    .replace(/\s+/g, "")
    .replace(/[‐-–—−]/g, "-")
    .replace(/[“”]/g, "\"")
    .replace(/[‘’]/g, "'")
    .toLowerCase();
}