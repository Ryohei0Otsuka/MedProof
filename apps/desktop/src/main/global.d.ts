import type { AnalyzeMode, AnalyzeResult } from "@medproof/core";

declare global {
  interface Window {
    medproof: {
      analyze: (params: { beforeText: string; afterText: string; mode: AnalyzeMode }) => Promise<{
        before: AnalyzeResult;
        after: AnalyzeResult;
      }>;
      openTextFile: () => Promise<
        | { canceled: true }
        | { canceled: false; filePath: string; baseName: string; text: string }
      >;
    };
  }
}

export {};