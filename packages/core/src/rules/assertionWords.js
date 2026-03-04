"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertionWords = assertionWords;
const range_1 = require("../utils/range");
const WORDS = ["必ず", "絶対", "100%", "確実", "治る", "完治", "副作用はない"];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function assertionWords(text, opts) {
    const issues = [];
    const len = text.length;
    let idx = 0;
    for (const w of WORDS) {
        const re = new RegExp(esc(w), "g");
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index;
            const end = start + m[0].length;
            const range = (0, range_1.clampRange)({ start, end }, len);
            issues.push({
                id: `AW-${opts.docId}-${idx++}`,
                docId: opts.docId,
                type: "ASSERTION_WORD",
                severity: "S1",
                message: "断定・誇大表現の可能性（根拠/注意書き/表現弱化を検討）",
                textPreview: (0, range_1.previewAt)(text, range),
                range,
                meta: { word: w }
            });
        }
    }
    return issues;
}
