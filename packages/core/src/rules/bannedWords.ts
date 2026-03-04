import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";

const DEFAULT_BANNED: Array<{ banned: string; preferred?: string }> = [
  { banned: "御社", preferred: "貴社" },
  { banned: "出来る", preferred: "できる" },
  { banned: "出来ない", preferred: "できない" }
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function bannedWords(text: string, opts: AnalyzeOptions): Issue[] {
  const issues: Issue[] = [];
  const len = text.length;
  let idx = 0;

  for (const p of DEFAULT_BANNED) {
    const re = new RegExp(esc(p.banned), "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const range = clampRange({ start, end }, len);

      issues.push({
        id: `BW-${opts.docId}-${idx++}`,
        docId: opts.docId,
        type: "BANNED_WORD",
        severity: "S1",
        message: p.preferred ? `禁止/非推奨表記 → 推奨: ${p.preferred}` : "禁止/非推奨表記の確認",
        textPreview: previewAt(text, range),
        range,
        meta: { banned: p.banned, preferred: p.preferred ?? "" }
      });
    }
  }
  return issues;
}