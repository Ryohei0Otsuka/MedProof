/* copy-static.cjs
   Copies renderer static files to dist/renderer.
   Usage:
     node copy-static.cjs
     node copy-static.cjs --watch
*/
const fs = require("fs");
const path = require("path");

const isWatch = process.argv.includes("--watch");

const SRC_DIR = __dirname; // .../src/renderer
const OUT_DIR = path.join(__dirname, "..", "..", "dist", "renderer"); // .../dist/renderer

const FILES = ["index.html", "styles.css"];

function ensureDir(p) {
  fs.mkdirSync(p, { recursive: true });
}

function copyOne(name) {
  const src = path.join(SRC_DIR, name);
  const dst = path.join(OUT_DIR, name);
  if (!fs.existsSync(src)) {
    console.warn(`[copy-static] missing: ${src}`);
    return;
  }
  ensureDir(OUT_DIR);
  fs.copyFileSync(src, dst);
}

function copyAll() {
  for (const f of FILES) copyOne(f);
}

copyAll();

if (isWatch) {
  for (const f of FILES) {
    const src = path.join(SRC_DIR, f);
    if (!fs.existsSync(src)) continue;
    fs.watch(src, { persistent: true }, () => {
      try {
        copyOne(f);
      } catch (e) {
        console.error("[copy-static] watch copy failed:", e);
      }
    });
  }
  console.log("[copy-static] watching static files…");
}