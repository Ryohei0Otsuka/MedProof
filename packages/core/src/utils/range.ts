import type { TextRange } from "../types/issue";

export function clampRange(r: TextRange, len: number): TextRange {
  const s = Math.max(0, Math.min(len, r.start));
  const e = Math.max(s, Math.min(len, r.end));
  return { start: s, end: e };
}

export function previewAt(text: string, r: TextRange, max = 28): string {
  const raw = text.slice(r.start, r.end);
  const oneLine = raw.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return oneLine.slice(0, max - 1) + "…";
}