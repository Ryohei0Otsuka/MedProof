export async function openTextFile(): Promise<string | null> {
  const res = await window.medproof.openTextFile();
  if ("canceled" in res && res.canceled) return null;
  if ("text" in res) return res.text;
  return null;
}