import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";

const WORDS = ["必ず", "絶対", "100%", "確実", "治る", "完治", "副作用はない"];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export function assertionWords(text: string, opts: AnalyzeOptions): Issue[] {
  const issues: Issue[] = [];
  const len = text.length;
  let idx = 0;

  for (const w of WORDS) {
    const re = new RegExp(esc(w), "g");
    let m: RegExpExecArray | null;
    while ((m = re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const range = clampRange({ start, end }, len);

      issues.push({
        id: `AW-${opts.docId}-${idx++}`,
        docId: opts.docId,
        type: "ASSERTION_WORD",
        severity: "S1",
        message: "断定・誇大表現の可能性（根拠/注意書き/表現弱化を検討）",
        textPreview: previewAt(text, range),
        range,
        meta: { word: w }
      });
    }
  }

  return issues;
}