import QRCode from "qrcode";
import { requestWakeLock, releaseWakeLock } from "@shared/utils/wakeLock";
import type { Card } from "@core/types/card.types";

interface QrDisplayCallbacks {
  onEdit: () => void;
  onBack: () => void;
}

/** Etiqueta legible debajo del QR, según el tipo de tarjeta. */
function getDisplayLabel(card: Card): string {
  switch (card.type) {
    case "personal":
    case "professional":
      return card.name;
    case "instagram":
      return `@${card.username}`;
  }
}

/**
 * Renderiza la pantalla de QR a pantalla completa. Es agnóstica al tipo
 * de tarjeta: no construye el contenido del QR ella misma, lo recibe ya
 * resuelto (vCard o URL de Instagram) desde `buildQrPayload` en el router.
 * Devuelve una función de limpieza que DEBE llamarse al navegar fuera
 * de esta pantalla (libera el Wake Lock).
 */
export function renderQrDisplay(
  container: HTMLElement,
  card: Card,
  qrContent: string,
  callbacks: QrDisplayCallbacks
): () => void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  // Fondo blanco puro: no podemos forzar el brillo físico de la pantalla
  // desde el navegador, pero el máximo contraste posible (blanco puro +
  // QR negro) es lo que más ayuda a que la cámara receptora lo lea rápido.
  wrapper.className =
    "min-h-screen w-full bg-white text-black flex flex-col items-center justify-center gap-6 relative";

  const backButton = document.createElement("button");
  backButton.textContent = "← Volver";
  backButton.className = "absolute top-4 left-4 text-sm text-black/60";
  backButton.addEventListener("click", callbacks.onBack);

  const gearButton = document.createElement("button");
  gearButton.textContent = "⚙️";
  gearButton.setAttribute("aria-label", "Editar esta tarjeta");
  gearButton.className = "absolute top-4 right-4 text-2xl p-2";
  gearButton.addEventListener("click", callbacks.onEdit);

  const nameLabel = document.createElement("p");
  nameLabel.textContent = getDisplayLabel(card);
  nameLabel.className = "text-lg font-semibold text-black/80";

  const canvas = document.createElement("canvas");
  canvas.className = "rounded-lg";

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-600";

  wrapper.append(backButton, gearButton, canvas, nameLabel, errorEl);

  // Placeholder del banner sticky de AdSense (Fase 4 del plan de monetización).
  const adSlot = document.createElement("div");
  adSlot.id = "ad-slot-qr-screen";
  adSlot.className = "fixed bottom-0 left-0 right-0 h-0"; // altura 0 hasta que se integre el ad real
  wrapper.append(adSlot);

  container.append(wrapper);

  QRCode.toCanvas(canvas, qrContent, { width: 280, margin: 2 }, (err) => {
    if (err) errorEl.textContent = "No se pudo generar el código QR.";
  });

  requestWakeLock();

  return () => {
    releaseWakeLock();
  };
}
