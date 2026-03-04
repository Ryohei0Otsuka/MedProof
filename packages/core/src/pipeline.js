"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyzeText = analyzeText;
const normalize_1 = require("./utils/normalize");
const numericUnits_1 = require("./rules/numericUnits");
const frequency_1 = require("./rules/frequency");
const bannedWords_1 = require("./rules/bannedWords");
const assertionWords_1 = require("./rules/assertionWords");
const notationVariant_1 = require("./rules/notationVariant");
const abbrevFirstUse_1 = require("./rules/abbrevFirstUse");
function analyzeText(text, opts) {
    const normalizedText = (0, normalize_1.normalizeText)(text);
    const issues = [];
    issues.push(...(0, numericUnits_1.numericUnits)(normalizedText, opts));
    issues.push(...(0, bannedWords_1.bannedWords)(normalizedText, opts));
    issues.push(...(0, assertionWords_1.assertionWords)(normalizedText, opts));
    if (opts.mode !== "fast") {
        issues.push(...(0, frequency_1.frequency)(normalizedText, opts));
        issues.push(...(0, abbrevFirstUse_1.abbrevFirstUse)(normalizedText, opts));
    }
    issues.push(...(0, notationVariant_1.notationVariant)(normalizedText, opts));
    issues.sort((a, b) => a.range.start - b.range.start);
    return {
        docId: opts.docId,
        mode: opts.mode,
        normalizedText,
        issues
    };
}
