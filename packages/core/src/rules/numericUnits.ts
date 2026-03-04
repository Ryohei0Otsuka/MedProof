import type { Issue } from "../types/issue";
import type { AnalyzeOptions } from "../types/config";
import { clampRange, previewAt } from "../utils/range";

const DEFAULT_UNITS = [
  "mg", "g", "kg", "μg", "µg",
  "mL", "ml", "L",
  "%", "℃", "°C",
  "mmHg", "bpm",
  "IU", "U",
  "mEq",
  "mmol/L", "mg/dL",
  "μL", "µL"
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const UNIT_PATTERN = DEFAULT_UNITS.map(esc).sort((a, b) => b.length - a.length).join("|");

const re = new RegExp(`\\b\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?\\s*(?:${UNIT_PATTERN})\\b`, "g");

export function numericUnits(text: string, opts: AnalyzeOptions): Issue[] {
  const issues: Issue[] = [];
  const len = text.length;
  let m: RegExpExecArray | null;
  let idx = 0;

  while ((m = re.exec(text)) !== null) {
    const start = m.index;
    const end = start + m[0].length;
    const range = clampRange({ start, end }, len);

    issues.push({
      id: `NU-${opts.docId}-${idx++}`,
      docId: opts.docId,
      type: "NUMERIC_UNIT",
      severity: "S1",
      message: "数値と単位の確認（桁・単位・表記ゆれ）",
      textPreview: previewAt(text, range),
      range,
      meta: { match: m[0] }
    });
  }
  return issues;
}