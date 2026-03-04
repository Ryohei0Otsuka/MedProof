"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bannedWords = bannedWords;
const range_1 = require("../utils/range");
const DEFAULT_BANNED = [
    { banned: "御社", preferred: "貴社" },
    { banned: "出来る", preferred: "できる" },
    { banned: "出来ない", preferred: "できない" }
];
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
function bannedWords(text, opts) {
    const issues = [];
    const len = text.length;
    let idx = 0;
    for (const p of DEFAULT_BANNED) {
        const re = new RegExp(esc(p.banned), "g");
        let m;
        while ((m = re.exec(text)) !== null) {
            const start = m.index;
            const end = start + m[0].length;
            const range = (0, range_1.clampRange)({ start, end }, len);
            issues.push({
                id: `BW-${opts.docId}-${idx++}`,
                docId: opts.docId,
                type: "BANNED_WORD",
                severity: "S1",
                message: p.preferred ? `禁止/非推奨表記 → 推奨: ${p.preferred}` : "禁止/非推奨表記の確認",
                textPreview: (0, range_1.previewAt)(text, range),
                range,
                meta: { banned: p.banned, preferred: p.preferred ?? "" }
            });
        }
    }
    return issues;
}
