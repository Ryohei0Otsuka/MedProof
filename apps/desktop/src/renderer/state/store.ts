import type { AnalyzeMode, AnalyzeResult } from "@medproof/core";

export type StoreState = {
  beforeText: string;
  afterText: string;
  mode: AnalyzeMode;
  lastResult: null | { before: AnalyzeResult; after: AnalyzeResult };
  counts: { s1: number; s2: number; s3: number };
  // 任意：UIに出したいなら使える
  lastError?: string | null;
};

export type Store = {
  getState: () => StoreState;
  subscribe: (fn: () => void) => () => void;

  setTexts: (beforeText: string, afterText: string) => void;
  setBeforeText: (t: string) => void;
  setAfterText: (t: string) => void;
  setMode: (m: AnalyzeMode) => void;

  analyze: () => Promise<void>;

  // ★追加：自動解析（debounce）
  requestAnalyze: () => void;
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
    counts: { s1: 0, s2: 0, s3: 0 },
    lastError: null
  };

  private subs = new Set<() => void>();

  // debounce & 実行制御
  private analyzeTimer: ReturnType<typeof setTimeout> | null = null;
  private analyzing = false;
  private analyzeQueued = false;

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
    this.requestAnalyze(); // ★初期サンプル設定時も自動解析
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
    this.requestAnalyze(); // ★モード変更したら再解析
  };

  requestAnalyze = () => {
    if (this.analyzeTimer) clearTimeout(this.analyzeTimer);

    // 入力が落ち着いた頃に解析（体感良い）
    this.analyzeTimer = setTimeout(async () => {
      // 解析中なら、終わった直後にもう一回だけ回す
      if (this.analyzing) {
        this.analyzeQueued = true;
        return;
      }
      await this.analyze();
    }, 250);
  };

  analyze = async () => {
    // 多重呼び出しガード
    if (this.analyzing) {
      this.analyzeQueued = true;
      return;
    }

    this.analyzing = true;
    this.state = { ...this.state, lastError: null };
    this.emit();

    try {
      const { beforeText, afterText, mode } = this.state;

      const result = await window.medproof.analyze({
        beforeText: beforeText ?? "",
        afterText: afterText ?? "",
        mode
      });

      const cBefore = countSeverities(result.before);
      const cAfter = countSeverities(result.after);

      this.state = {
        ...this.state,
        lastResult: result,
        counts: {
          s1: cBefore.s1 + cAfter.s1,
          s2: cBefore.s2 + cAfter.s2,
          s3: cBefore.s3 + cAfter.s3
        },
        lastError: null
      };
      this.emit();
    } catch (e: any) {
      this.state = {
        ...this.state,
        lastError: e?.message ?? String(e)
      };
      this.emit();
    } finally {
      this.analyzing = false;

      // 解析中に変更が入っていたら、もう一回だけ回す（最新状態に追いつく）
      if (this.analyzeQueued) {
        this.analyzeQueued = false;
        this.requestAnalyze();
      }
    }
  };
}

export const store = new SimpleStore();