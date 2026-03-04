export type Severity = "S1" | "S2" | "S3";

export type IssueType =
  | "NUMERIC_UNIT"
  | "FREQUENCY"
  | "BANNED_WORD"
  | "ASSERTION_WORD"
  | "NOTATION_VARIANT"
  | "ABBREV_FIRST_USE";

export type TextRange = { start: number; end: number };

export type Issue = {
  id: string;
  docId: string;
  type: IssueType;
  severity: Severity;
  message: string;
  textPreview: string;
  range: TextRange;
  meta?: Record<string, unknown>;
};

export type AnalyzeResult = {
  docId: string;
  mode: string;
  normalizedText: string;
  issues: Issue[];
};