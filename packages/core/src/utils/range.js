"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clampRange = clampRange;
exports.previewAt = previewAt;
function clampRange(r, len) {
    const s = Math.max(0, Math.min(len, r.start));
    const e = Math.max(s, Math.min(len, r.end));
    return { start: s, end: e };
}
function previewAt(text, r, max = 28) {
    const raw = text.slice(r.start, r.end);
    const oneLine = raw.replace(/\s+/g, " ").trim();
    if (oneLine.length <= max)
        return oneLine;
    return oneLine.slice(0, max - 1) + "…";
}
