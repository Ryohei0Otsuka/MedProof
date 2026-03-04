import type { Store } from "../state/store";

export class Toolbar {
  el: HTMLDivElement;

  constructor(private store: Store) {
    this.el = document.createElement("div");
    this.el.style.display = "flex";
    this.el.style.gap = "10px";
    this.el.style.alignItems = "center";

    const brand = document.createElement("div");
    brand.className = "brand";
    brand.textContent = "MedProof";

    const mode = document.createElement("select");
    mode.className = "select";
    mode.innerHTML = `
      <option value="balanced">balanced</option>
      <option value="fast">fast</option>
      <option value="strict">strict</option>
    `;
    mode.value = this.store.getState().mode;
    mode.addEventListener("change", () => this.store.setMode(mode.value as any));

    const analyze = document.createElement("button");
    analyze.className = "btn primary";
    analyze.textContent = "解析（軽）";
    analyze.addEventListener("click", async () => {
      await this.store.analyze();
    });

    const openBefore = document.createElement("button");
    openBefore.className = "btn";
    openBefore.textContent = "Beforeを開く(txt)";
    openBefore.addEventListener("click", async () => {
      const res = await window.medproof.openTextFile();
      if (!("canceled" in res) || res.canceled) return;
      this.store.setBeforeText(res.text);
    });

    const openAfter = document.createElement("button");
    openAfter.className = "btn";
    openAfter.textContent = "Afterを開く(txt)";
    openAfter.addEventListener("click", async () => {
      const res = await window.medproof.openTextFile();
      if (!("canceled" in res) || res.canceled) return;
      this.store.setAfterText(res.text);
    });

    const s1 = document.createElement("span");
    s1.className = "badge";
    const s2 = document.createElement("span");
    s2.className = "badge";
    const s3 = document.createElement("span");
    s3.className = "badge";

    const updateBadges = () => {
      const st = this.store.getState();
      const c = st.counts;
      s1.textContent = `S1: ${c.s1}`;
      s2.textContent = `S2: ${c.s2}`;
      s3.textContent = `S3: ${c.s3}`;
    };

    this.store.subscribe(updateBadges);
    updateBadges();

    this.el.appendChild(brand);
    this.el.appendChild(mode);
    this.el.appendChild(analyze);
    this.el.appendChild(openBefore);
    this.el.appendChild(openAfter);
    this.el.appendChild(s1);
    this.el.appendChild(s2);
    this.el.appendChild(s3);
  }
}