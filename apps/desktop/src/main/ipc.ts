import { ipcMain, dialog } from "electron";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { analyzeText, type AnalyzeMode } from "@medproof/core";

type AnalyzeRequest = {
  beforeText: string;
  afterText: string;
  mode: AnalyzeMode;
};

type OpenTextFileResult =
  | { canceled: true }
  | { canceled: false; filePath: string; baseName: string; text: string };

ipcMain.handle("medproof:analyze", async (_evt, req: AnalyzeRequest) => {
  const before = analyzeText(req.beforeText ?? "", { docId: "before", mode: req.mode });
  const after = analyzeText(req.afterText ?? "", { docId: "after", mode: req.mode });
  return { before, after };
});

ipcMain.handle("medproof:openTextFile", async (): Promise<OpenTextFileResult> => {
  const result = await dialog.showOpenDialog({
    title: "Open text file",
    properties: ["openFile"],
    filters: [
      { name: "Text", extensions: ["txt", "md", "csv"] },
      { name: "All Files", extensions: ["*"] }
    ]
  });

  if (result.canceled || result.filePaths.length === 0) return { canceled: true };

  const filePath = result.filePaths[0];
  const buf = await fs.readFile(filePath);
  const text = buf.toString("utf-8");

  return {
    canceled: false,
    filePath,
    baseName: path.basename(filePath),
    text
  };
});