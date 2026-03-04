import type { AnalyzeMode, AnalyzeResult } from "@medproof/core";

export type StoreState = {
  beforeText: string;
  afterText: string;
  mode: AnalyzeMode;
  lastResult: null | { before: AnalyzeResult; after: AnalyzeResult };
  counts: { s1: number; s2: number; s3: number };
};

export type Store = {
  getState: () => StoreState;
  subscribe: (fn: () => void) => () => void;
  setTexts: (beforeText: string, afterText: string) => void;
  setBeforeText: (t: string) => void;
  setAfterText: (t: string) => void;
  setMode: (m: AnalyzeMode) => void;
  analyze: () => Promise<void>;
};

function countSeverities(res: AnalyzeResult | null) {
  const c = { s1: 0, s2: 0, s3: 0 };
  if (!res) return c;
  for (const i of res.issues) {
    if (i.severity === "S1") c.s1++;
    if (i.severity === "S2") c.s2++;
    if (i.severity === "S3") c.s3++;
  }
  return c;
}

class SimpleStore implements Store {
  private state: StoreState = {
    beforeText: "",
    afterText: "",
    mode: "balanced",
    lastResult: null,
    counts: { s1: 0, s2: 0, s3: 0 }
  };
  private subs = new Set<() => void>();

  getState = () => this.state;

  subscribe = (fn: () => void) => {
    this.subs.add(fn);
    return () => this.subs.delete(fn);
  };

  private emit() {
    for (const fn of this.subs) fn();
  }

  setTexts = (beforeText: string, afterText: string) => {
    this.state = { ...this.state, beforeText, afterText };
    this.emit();
  };

  setBeforeText = (t: string) => {
    this.state = { ...this.state, beforeText: t };
    this.emit();
  };

  setAfterText = (t: string) => {
    this.state = { ...this.state, afterText: t };
    this.emit();
  };

  setMode = (m: AnalyzeMode) => {
    this.state = { ...this.state, mode: m };
    this.emit();
  };

  analyze = async () => {
    const { beforeText, afterText, mode } = this.state;
    const result = await window.medproof.analyze({ beforeText, afterText, mode });

    const cBefore = countSeverities(result.before);
    const cAfter = countSeverities(result.after);
    this.state = {
      ...this.state,
      lastResult: result,
      counts: {
        s1: cBefore.s1 + cAfter.s1,
        s2: cBefore.s2 + cAfter.s2,
        s3: cBefore.s3 + cAfter.s3
      }
    };
    this.emit();
  };
}

export const store = new SimpleStore();