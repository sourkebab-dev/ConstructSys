export function generateRandString(len: number) {
  const bytes = new Uint8Array((len || 40) / 2)
  window.crypto.getRandomValues(bytes)
  return Array.from(bytes, (num) => num.toString(16).padStart(2, "0")).join('')
}
