import { Toolbar } from "./components/Toolbar.js";
import { EditorPane } from "./components/EditorPane.js";
import { IssueList } from "./components/IssueList.js";
import { store } from "./state/store.js";

function mount() {
  const app = document.getElementById("app");
  if (!app) throw new Error("#app not found");

  const header = document.createElement("div");
  header.className = "header";

  const main = document.createElement("div");
  main.className = "main";

  const panes = document.createElement("div");
  panes.className = "panes";

  const sidebar = document.createElement("div");
  sidebar.className = "sidebar";

  const toolbar = new Toolbar(store);
  header.appendChild(toolbar.el);

  const beforePane = new EditorPane("Before（原稿）", store, "before");
  const afterPane = new EditorPane("After（修正後）", store, "after");

  panes.appendChild(beforePane.el);
  panes.appendChild(afterPane.el);

  const issueList = new IssueList(store, beforePane, afterPane);
  sidebar.appendChild(issueList.el);

  main.appendChild(panes);
  main.appendChild(sidebar);

  app.appendChild(header);
  app.appendChild(main);

  // 初期サンプル
  store.setTexts(
    "HbA1cは6.5%を超えると糖尿病と診断されます。1日3回 10mg 投与する。\n必ず治ります。",
    "HbA1cは6.5%を超えると糖尿病と診断されることがあります。1日3回10 mg投与する。\n治療効果は個人差があります。"
  );
}

mount();