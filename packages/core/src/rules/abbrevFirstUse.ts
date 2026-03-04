import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";

export function abbrevFirstUse(text: string, opts: AnalyzeOptions): Issue[] {
  if (opts.mode === "fast") return [];

  const issues: Issue[] = [];
  const len = text.length;

  const abbrRe = /\b[A-Za-z]{2,6}[A-Za-z0-9]{0,4}\b/g;
  const definedRe = /[^\n]{2,30}（[A-Za-z]{2,6}[A-Za-z0-9]{0,4}）/g;

  const defined = new Set<string>();
  let dm: RegExpExecArray | null;
  while ((dm = definedRe.exec(text)) !== null) {
    const inside = dm[0].match(/（([A-Za-z]{2,6}[A-Za-z0-9]{0,4})）/);
    if (inside?.[1]) defined.add(inside[1]);
  }

  let idx = 0;
  let m: RegExpExecArray | null;
  while ((m = abbrRe.exec(text)) !== null) {
    const abbr = m[0];
    if (defined.has(abbr)) continue;

    const range = clampRange({ start: m.index, end: m.index + abbr.length }, len);
    issues.push({
      id: `AB-${opts.docId}-${idx++}`,
      docId: opts.docId,
      type: "ABBREV_FIRST_USE",
      severity: "S2",
      message: "略語の初出か確認（正式名称（略語）の形式を検討）",
      textPreview: previewAt(text, range),
      range,
      meta: { abbr }
    });
  }

  return issues;
}