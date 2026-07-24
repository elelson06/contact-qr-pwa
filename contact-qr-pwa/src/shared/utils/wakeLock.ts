let activeLock: WakeLockSentinel | null = null;

/**
 * Evita que la pantalla se apague mientras se muestra el QR.
 * No lanza si el navegador no soporta la API (ej. Safari < 16.4):
 * simplemente no hace nada, degradando con gracia.
 */
export async function requestWakeLock(): Promise<void> {
  if (!("wakeLock" in navigator)) return;

  try {
    activeLock = await (navigator as any).wakeLock.request("screen");
  } catch {
    // Falla silenciosamente (ej. pestaña no visible, permiso denegado).
    // No es crítico: el usuario puede tocar la pantalla manualmente.
    activeLock = null;
  }
}

export async function releaseWakeLock(): Promise<void> {
  if (activeLock) {
    await activeLock.release();
    activeLock = null;
  }
}
