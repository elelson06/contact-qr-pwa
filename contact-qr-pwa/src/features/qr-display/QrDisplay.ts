import QRCode from "qrcode";
import { buildVCard } from "@core/vcard/buildVCard";
import { requestWakeLock, releaseWakeLock } from "@shared/utils/wakeLock";
import type { Contact } from "@core/types/contact.types";

interface QrDisplayCallbacks {
  onEdit: () => void;
}

/**
 * Renderiza la pantalla de QR. Devuelve una función de limpieza que
 * DEBE llamarse al navegar fuera de esta pantalla (libera el Wake Lock).
 */
export function renderQrDisplay(
  container: HTMLElement,
  contact: Contact,
  callbacks: QrDisplayCallbacks
): () => void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  // Fondo blanco puro: no podemos forzar el brillo físico de la pantalla
  // desde el navegador, pero el máximo contraste posible (blanco puro +
  // QR negro) es lo que más ayuda a que la cámara receptora lo lea rápido.
  wrapper.className =
    "min-h-screen w-full bg-white text-black flex flex-col items-center justify-center gap-6 relative";

  const gearButton = document.createElement("button");
  gearButton.textContent = "⚙️";
  gearButton.setAttribute("aria-label", "Editar mi contacto");
  gearButton.className = "absolute top-4 right-4 text-2xl p-2";
  gearButton.addEventListener("click", callbacks.onEdit);

  const nameLabel = document.createElement("p");
  nameLabel.textContent = contact.name;
  nameLabel.className = "text-lg font-semibold text-black/80";

  const canvas = document.createElement("canvas");
  canvas.className = "rounded-lg";

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-600";

  wrapper.append(gearButton, canvas, nameLabel, errorEl);

  // Placeholder del banner sticky de AdSense (Fase 4 del plan de monetización).
  // Se implementa cuando el sitio esté en producción y la cuenta de AdSense
  // esté aprobada; no bloquea el uso del QR mientras tanto.
  const adSlot = document.createElement("div");
  adSlot.id = "ad-slot-qr-screen";
  adSlot.className = "fixed bottom-0 left-0 right-0 h-0"; // altura 0 hasta que se integre el ad real
  wrapper.append(adSlot);

  container.append(wrapper);

  const vcard = buildVCard(contact);
  if (!vcard.ok) {
    errorEl.textContent = vcard.error;
  } else {
    QRCode.toCanvas(canvas, vcard.data, { width: 280, margin: 2 }, (err) => {
      if (err) errorEl.textContent = "No se pudo generar el código QR.";
    });
  }

  requestWakeLock();

  return () => {
    releaseWakeLock();
  };
}
