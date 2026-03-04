import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";

const patterns: Array<{ re: RegExp; label: string; severity: "S1" | "S2" }> = [
  { re: /1日\s*\d+\s*回/g, label: "1日◯回", severity: "S1" },
  { re: /週\s*\d+\s*回/g, label: "週◯回", severity: "S2" },
  { re: /毎日/g, label: "毎日", severity: "S2" },
  { re: /隔日/g, label: "隔日", severity: "S2" }
];

export function frequency(text: string, opts: AnalyzeOptions): Issue[] {
  const issues: Issue[] = [];
  const len = text.length;
  let idx = 0;

  for (const p of patterns) {
    let m: RegExpExecArray | null;
    while ((m = p.re.exec(text)) !== null) {
      const start = m.index;
      const end = start + m[0].length;
      const range = clampRange({ start, end }, len);

      issues.push({
        id: `FR-${opts.docId}-${idx++}`,
        docId: opts.docId,
        type: "FREQUENCY",
        severity: p.severity,
        message: `頻度表現の確認（${p.label}）`,
        textPreview: previewAt(text, range),
        range,
        meta: { match: m[0] }
      });
    }
  }
  return issues;
}