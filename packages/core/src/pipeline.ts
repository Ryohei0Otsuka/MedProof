import type { AnalyzeOptions } from "./types/config";
import type { AnalyzeResult, Issue } from "./types/issue";
import { normalizeText } from "./utils/normalize";

import { numericUnits } from "./rules/numericUnits";
import { frequency } from "./rules/frequency";
import { bannedWords } from "./rules/bannedWords";
import { assertionWords } from "./rules/assertionWords";
import { notationVariant } from "./rules/notationVariant";
import { abbrevFirstUse } from "./rules/abbrevFirstUse";

export function analyzeText(text: string, opts: AnalyzeOptions): AnalyzeResult {
  const normalizedText = normalizeText(text);

  const issues: Issue[] = [];
  issues.push(...numericUnits(normalizedText, opts));
  issues.push(...bannedWords(normalizedText, opts));
  issues.push(...assertionWords(normalizedText, opts));

  if (opts.mode !== "fast") {
    issues.push(...frequency(normalizedText, opts));
    issues.push(...abbrevFirstUse(normalizedText, opts));
  }

  issues.push(...notationVariant(normalizedText, opts));
  issues.sort((a, b) => a.range.start - b.range.start);

  return {
    docId: opts.docId,
    mode: opts.mode,
    normalizedText,
    issues
  };
}