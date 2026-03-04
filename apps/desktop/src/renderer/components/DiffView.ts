export class DiffView {
  el: HTMLDivElement;

  constructor() {
    this.el = document.createElement("div");
    this.el.textContent = "DiffView (v0.1では未使用。将来：差分ハイライト表示)";
  }
}