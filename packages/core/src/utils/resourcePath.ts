import path from "node:path";

export function resolveDictPath(fileName: string): string {
  // Electron packaged: process.resourcesPath が存在する
  const resources = (process as any).resourcesPath as string | undefined;
  if (resources) {
    return path.join(resources, "dictionaries", fileName);
  }
  // Dev: リポジトリ直下想定（packages/core/src/utils から上へ）
  return path.join(__dirname, "..", "..", "..", "dictionaries", fileName);
}