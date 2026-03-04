"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.numericUnits = numericUnits;
const range_1 = require("../utils/range");
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
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const UNIT_PATTERN = DEFAULT_UNITS.map(esc).sort((a, b) => b.length - a.length).join("|");
const re = new RegExp(`\\b\\d{1,3}(?:,\\d{3})*(?:\\.\\d+)?\\s*(?:${UNIT_PATTERN})\\b`, "g");
function numericUnits(text, opts) {
    const issues = [];
    const len = text.length;
    let m;
    let idx = 0;
    while ((m = re.exec(text)) !== null) {
        const start = m.index;
        const end = start + m[0].length;
        const range = (0, range_1.clampRange)({ start, end }, len);
        issues.push({
            id: `NU-${opts.docId}-${idx++}`,
            docId: opts.docId,
            type: "NUMERIC_UNIT",
            severity: "S1",
            message: "数値と単位の確認（桁・単位・表記ゆれ）",
            textPreview: (0, range_1.previewAt)(text, range),
            range,
            meta: { match: m[0] }
        });
    }
    return issues;
}
