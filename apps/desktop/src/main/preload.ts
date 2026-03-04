import { contextBridge, ipcRenderer } from "electron";
import type { AnalyzeMode } from "@medproof/core";

contextBridge.exposeInMainWorld("medproof", {
  analyze: (params: { beforeText: string; afterText: string; mode: AnalyzeMode }) =>
    ipcRenderer.invoke("medproof:analyze", params),
  openTextFile: () => ipcRenderer.invoke("medproof:openTextFile")
});

export type MedProofApi = typeof window.medproof;