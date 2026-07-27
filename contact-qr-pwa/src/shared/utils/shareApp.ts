export type ShareResult = "shared" | "copied" | "cancelled" | "unavailable";

const APP_TITLE = "Mi Contacto QR";
const APP_DESCRIPTION =
  "Compartí tu contacto al instante con un código QR, sin dictar números y sin internet.";

/**
 * Comparte el link de la propia app (no una tarjeta de contacto).
 *
 * - Si el navegador soporta la Web Share API (la mayoría de navegadores
 *   móviles), abre el menú nativo de compartir del sistema operativo
 *   (WhatsApp, Mensajes, Email, etc.) con el link precargado.
 * - Si no la soporta (típicamente en desktop), copia el link al
 *   portapapeles como alternativa funcional.
 */
export async function shareApp(): Promise<ShareResult> {
  const url = window.location.origin;

  if (navigator.share) {
    try {
      await navigator.share({ title: APP_TITLE, text: APP_DESCRIPTION, url });
      return "shared";
    } catch (err) {
      // El usuario cierra el menú de compartir sin elegir nada: no es un error real.
      if ((err as Error).name === "AbortError") return "cancelled";
      // Cualquier otro fallo (poco común): degradamos a copiar el link.
    }
  }

  if (navigator.clipboard) {
    await navigator.clipboard.writeText(url);
    return "copied";
  }

  return "unavailable";
}
