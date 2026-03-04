"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeText = normalizeText;
exports.normalizeKeyForVariant = normalizeKeyForVariant;
function normalizeText(text) {
    let t = text ?? "";
    t = t.replace(/\r\n/g, "\n");
    t = t.replace(/\u3000/g, " ");
    t = t.replace(/[ \t]+/g, " ");
    return t;
}
function normalizeKeyForVariant(s) {
    return (s ?? "")
        .replace(/\s+/g, "")
        .replace(/[‐-–—−]/g, "-")
        .replace(/[“”]/g, "\"")
        .replace(/[‘’]/g, "'")
        .toLowerCase();
}
