"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.frequency = frequency;
const range_1 = require("../utils/range");
const patterns = [
    { re: /1日\s*\d+\s*回/g, label: "1日◯回", severity: "S1" },
    { re: /週\s*\d+\s*回/g, label: "週◯回", severity: "S2" },
    { re: /毎日/g, label: "毎日", severity: "S2" },
    { re: /隔日/g, label: "隔日", severity: "S2" }
];
function frequency(text, opts) {
    const issues = [];
    const len = text.length;
    let idx = 0;
    for (const p of patterns) {
        let m;
        while ((m = p.re.exec(text)) !== null) {
            const start = m.index;
            const end = start + m[0].length;
            const range = (0, range_1.clampRange)({ start, end }, len);
            issues.push({
                id: `FR-${opts.docId}-${idx++}`,
                docId: opts.docId,
                type: "FREQUENCY",
                severity: p.severity,
                message: `頻度表現の確認（${p.label}）`,
                textPreview: (0, range_1.previewAt)(text, range),
                range,
                meta: { match: m[0] }
            });
        }
    }
    return issues;
}
