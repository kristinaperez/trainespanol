export function speakSpanish(text: string) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = "es-ES"
    u.rate = 0.95
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch {
    /* no-op */
  }
}
