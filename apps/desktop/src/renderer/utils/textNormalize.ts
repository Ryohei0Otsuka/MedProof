export function normalizeForView(text: string): string {
  // renderer側で軽い整形。core側にも正規化があるので、ここは最小。
  return (text ?? "").replace(/\r\n/g, "\n");
}