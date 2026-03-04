"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.abbrevFirstUse = abbrevFirstUse;
const range_1 = require("../utils/range");
function abbrevFirstUse(text, opts) {
    if (opts.mode === "fast")
        return [];
    const issues = [];
    const len = text.length;
    const abbrRe = /\b[A-Za-z]{2,6}[A-Za-z0-9]{0,4}\b/g;
    const definedRe = /[^\n]{2,30}（[A-Za-z]{2,6}[A-Za-z0-9]{0,4}）/g;
    const defined = new Set();
    let dm;
    while ((dm = definedRe.exec(text)) !== null) {
        const inside = dm[0].match(/（([A-Za-z]{2,6}[A-Za-z0-9]{0,4})）/);
        if (inside?.[1])
            defined.add(inside[1]);
    }
    let idx = 0;
    let m;
    while ((m = abbrRe.exec(text)) !== null) {
        const abbr = m[0];
        if (defined.has(abbr))
            continue;
        const range = (0, range_1.clampRange)({ start: m.index, end: m.index + abbr.length }, len);
        issues.push({
            id: `AB-${opts.docId}-${idx++}`,
            docId: opts.docId,
            type: "ABBREV_FIRST_USE",
            severity: "S2",
            message: "略語の初出か確認（正式名称（略語）の形式を検討）",
            textPreview: (0, range_1.previewAt)(text, range),
            range,
            meta: { abbr }
        });
    }
    return issues;
}
