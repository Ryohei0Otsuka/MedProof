import type { Store } from "../state/store";
import type { Issue } from "@medproof/core";
import type { EditorPane, DocKey } from "./EditorPane";

export class IssueList {
  el: HTMLDivElement;
  private listEl: HTMLDivElement;
  private tab: DocKey = "before";

  constructor(private store: Store, private beforePane: EditorPane, private afterPane: EditorPane) {
    this.el = document.createElement("div");
    this.el.style.display = "flex";
    this.el.style.flexDirection = "column";
    this.el.style.minHeight = "0";

    const head = document.createElement("div");
    head.className = "sidebarHeader";

    const title = document.createElement("div");
    title.textContent = "指摘（Issues）";

    const right = document.createElement("div");
    right.style.display = "flex";
    right.style.gap = "8px";
    right.style.alignItems = "center";

    const tabBefore = document.createElement("button");
    tabBefore.className = "btn";
    tabBefore.textContent = "Before";
    tabBefore.addEventListener("click", () => {
      this.tab = "before";
      this.render();
    });

    const tabAfter = document.createElement("button");
    tabAfter.className = "btn";
    tabAfter.textContent = "After";
    tabAfter.addEventListener("click", () => {
      this.tab = "after";
      this.render();
    });

    right.appendChild(tabBefore);
    right.appendChild(tabAfter);

    head.appendChild(title);
    head.appendChild(right);

    this.listEl = document.createElement("div");
    this.listEl.className = "issues";

    this.el.appendChild(head);
    this.el.appendChild(this.listEl);

    this.store.subscribe(() => this.render());
    this.render();
  }

  private render() {
    const st = this.store.getState();
    const issues = this.tab === "before" ? st.lastResult?.before.issues ?? [] : st.lastResult?.after.issues ?? [];

    this.listEl.innerHTML = "";

    if (!st.lastResult) {
      const p = document.createElement("div");
      p.className = "small";
      p.textContent = "解析結果がありません。上の「解析（軽）」を押してください。";
      this.listEl.appendChild(p);
      return;
    }

    if (issues.length === 0) {
      const p = document.createElement("div");
      p.className = "small";
      p.textContent = "指摘なし（このモードでは検出されませんでした）";
      this.listEl.appendChild(p);
      return;
    }

    for (const issue of issues) {
      this.listEl.appendChild(this.renderIssue(issue));
    }
  }

  private renderIssue(issue: Issue) {
    const div = document.createElement("div");
    div.className = "issue";

    const top = document.createElement("div");
    top.className = "issueTop";

    const left = document.createElement("div");
    left.textContent = `${issue.type} • ${issue.textPreview}`;

    const tag = document.createElement("span");
    tag.className = `tag ${issue.severity.toLowerCase()}`;
    tag.textContent = issue.severity;

    top.appendChild(left);
    top.appendChild(tag);

    const msg = document.createElement("div");
    msg.className = "issueMsg";
    msg.textContent = issue.message;

    div.appendChild(top);
    div.appendChild(msg);

    div.addEventListener("click", () => {
      const pane = this.tab === "before" ? this.beforePane : this.afterPane;
      pane.jumpToRange(issue.range.start, issue.range.end);
    });

    return div;
  }
}