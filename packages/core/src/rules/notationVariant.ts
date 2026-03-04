import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";
import { normalizeKeyForVariant } from "../utils/normalize";

export function notationVariant(text: string, opts: AnalyzeOptions): Issue[] {
  if (opts.mode !== "strict") return [];

  const issues: Issue[] = [];
  const len = text.length;

  const re = /[A-Za-z0-9%℃μµ\-]+/g;
  const map = new Map<string, { start: number; end: number; variants: Set<string> }>();

  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const raw = m[0];
    if (raw.length < 3) continue;

    const key = normalizeKeyForVariant(raw);
    const e = map.get(key) ?? { start: m.index, end: m.index + raw.length, variants: new Set<string>() };
    e.variants.add(raw);
    map.set(key, e);
  }

  let idx = 0;
  for (const [key, v] of map.entries()) {
    if (v.variants.size <= 1) continue;
    const range = clampRange({ start: v.start, end: v.end }, len);

    issues.push({
      id: `NV-${opts.docId}-${idx++}`,
      docId: opts.docId,
      type: "NOTATION_VARIANT",
      severity: "S2",
      message: `表記ゆれ候補: ${Array.from(v.variants).slice(0, 6).join(" / ")}（統一を検討）`,
      textPreview: previewAt(text, range),
      range,
      meta: { key, variants: Array.from(v.variants) }
    });
  }

  return issues;
}