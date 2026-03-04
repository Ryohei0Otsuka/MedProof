"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notationVariant = notationVariant;
const range_1 = require("../utils/range");
const normalize_1 = require("../utils/normalize");
function notationVariant(text, opts) {
    if (opts.mode !== "strict")
        return [];
    const issues = [];
    const len = text.length;
    const re = /[A-Za-z0-9%℃μµ\-]+/g;
    const map = new Map();
    let m;
    while ((m = re.exec(text)) !== null) {
        const raw = m[0];
        if (raw.length < 3)
            continue;
        const key = (0, normalize_1.normalizeKeyForVariant)(raw);
        const e = map.get(key) ?? { start: m.index, end: m.index + raw.length, variants: new Set() };
        e.variants.add(raw);
        map.set(key, e);
    }
    let idx = 0;
    for (const [key, v] of map.entries()) {
        if (v.variants.size <= 1)
            continue;
        const range = (0, range_1.clampRange)({ start: v.start, end: v.end }, len);
        issues.push({
            id: `NV-${opts.docId}-${idx++}`,
            docId: opts.docId,
            type: "NOTATION_VARIANT",
            severity: "S2",
            message: `表記ゆれ候補: ${Array.from(v.variants).slice(0, 6).join(" / ")}（統一を検討）`,
            textPreview: (0, range_1.previewAt)(text, range),
            range,
            meta: { key, variants: Array.from(v.variants) }
        });
    }
    return issues;
}
