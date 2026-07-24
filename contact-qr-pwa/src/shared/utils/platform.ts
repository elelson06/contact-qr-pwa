export type Platform = "ios" | "android" | "other";

/**
 * Detección basada en userAgent. No es 100% infalible (userAgent se puede
 * falsear), pero es la práctica estándar para este caso de uso: solo decide
 * qué instrucciones de instalación mostrar, no una decisión de seguridad.
 */
export function detectPlatform(): Platform {
  const ua = navigator.userAgent;

  // iPadOS 13+ se identifica como Mac en el userAgent; se distingue por
  // tener soporte táctil, que un Mac de escritorio no tiene.
  const isIOS =
    /iPhone|iPad|iPod/.test(ua) ||
    (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);

  if (isIOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

/** True si la PWA ya está instalada y corriendo en modo pantalla completa. */
export function isRunningStandalone(): boolean {
  const displayModeStandalone = window.matchMedia("(display-mode: standalone)").matches;
  // Safari/iOS expone esta propiedad no estándar en vez de display-mode.
  const iosStandalone = (window.navigator as any).standalone === true;
  return displayModeStandalone || iosStandalone;
}
