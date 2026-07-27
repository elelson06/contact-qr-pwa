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
 * Renderiza la pantalla de QR a pantalla completa.
 */
export function renderQrDisplay(
  container: HTMLElement,
  card: Card,
  qrContent: string,
  callbacks: QrDisplayCallbacks
): () => void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  // Fondo oscuro, tarjeta blanca centrada
  wrapper.className =
    "min-h-screen w-full bg-surface text-text-primary flex flex-col items-center justify-center p-6";

  const backButton = document.createElement("button");
  backButton.textContent = "← Volver";
  backButton.className = "absolute top-4 left-4 text-text-secondary hover:text-text-primary";
  backButton.addEventListener("click", callbacks.onBack);

  const gearButton = document.createElement("button");
  gearButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>`;
  gearButton.setAttribute("aria-label", "Editar esta tarjeta");
  gearButton.className = "absolute top-4 right-4 p-2 hover:bg-surface-variant rounded-full text-text-secondary hover:text-text-primary transition-all";
  gearButton.addEventListener("click", callbacks.onEdit);

  // Tarjeta contenedora para el QR
  const cardContainer = document.createElement("div");
  cardContainer.className = "bg-white p-6 rounded-3xl shadow-xl flex flex-col items-center gap-4";

  const canvas = document.createElement("canvas");
  // Aseguramos que el QR se vea bien sobre el blanco
  canvas.className = "rounded-2xl";

  const nameLabel = document.createElement("p");
  nameLabel.textContent = getDisplayLabel(card);
  nameLabel.className = "text-xl font-bold text-black";

  cardContainer.append(canvas, nameLabel);

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-500 mt-4";

  wrapper.append(backButton, gearButton, cardContainer, errorEl);

  container.append(wrapper);

  QRCode.toCanvas(canvas, qrContent, { width: 250, margin: 1 }, (err) => {
    if (err) errorEl.textContent = "No se pudo generar el código QR.";
  });

  requestWakeLock();

  return () => {
    releaseWakeLock();
  };
}
