import { app, BrowserWindow } from "electron";
import path from "node:path";

// ★ IPCハンドラ登録（必ず実行）
import "./ipc";

let win: BrowserWindow | null = null;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  const indexHtml = path.join(__dirname, "..", "renderer", "index.html");
  win.loadFile(indexHtml);

  // 開発中はDevTools（不要なら消してOK）
  win.webContents.openDevTools({ mode: "detach" });

  win.on("closed", () => {
    win = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});