import type { Store } from "../state/store";

export type DocKey = "before" | "after";

export class EditorPane {
  el: HTMLDivElement;
  textarea: HTMLTextAreaElement;

  constructor(title: string, private store: Store, private key: DocKey) {
    this.el = document.createElement("div");
    this.el.className = "pane";

    const header = document.createElement("div");
    header.className = "paneHeader";

    const left = document.createElement("div");
    left.textContent = title;

    const right = document.createElement("div");
    right.className = "small";
    right.textContent = "クリックした指摘へジャンプします";

    header.appendChild(left);
    header.appendChild(right);

    this.textarea = document.createElement("textarea");
    this.textarea.spellcheck = false;

    this.textarea.addEventListener("input", () => {
      if (this.key === "before") this.store.setBeforeText(this.textarea.value);
      else this.store.setAfterText(this.textarea.value);
    });

    this.el.appendChild(header);
    this.el.appendChild(this.textarea);

    // store → UI反映
    const sync = () => {
      const st = this.store.getState();
      const v = this.key === "before" ? st.beforeText : st.afterText;
      if (this.textarea.value !== v) this.textarea.value = v;
    };

    this.store.subscribe(sync);
    sync();
  }

  jumpToRange(start: number, end: number) {
    const ta = this.textarea;
    ta.focus();
    ta.setSelectionRange(start, end);
    // ざっくりスクロール（行数推定で十分）
    const before = ta.value.slice(0, start);
    const line = before.split("\n").length;
    ta.scrollTop = Math.max(0, (line - 5) * 20);
  }
}