export type AnalyzeMode = "fast" | "balanced" | "strict";

export type AnalyzeOptions = {
  docId: string;
  mode: AnalyzeMode;
};