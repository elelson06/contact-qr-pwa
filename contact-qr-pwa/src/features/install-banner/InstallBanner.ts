import { detectPlatform, isRunningStandalone } from "@shared/utils/platform";
import {
  isInstallPromptAvailable,
  onInstallPromptAvailable,
  triggerInstallPrompt,
} from "@shared/utils/installPrompt";
import { getSettings, saveSettings } from "@core/storage/settingsStore";
import { createButton } from "@shared/ui/button";

/**
 * Monta (o no) un banner fijo en la parte inferior de la pantalla,
 * invitando a instalar la PWA. Se llama una sola vez desde main.ts,
 * independiente del router de pantallas (form/QR).
 */
export async function renderInstallBanner(): Promise<void> {
  // Ya instalada: no tiene sentido pedirle al usuario que instale de nuevo.
  if (isRunningStandalone()) return;

  const settingsResult = await getSettings();
  const settings = settingsResult.ok ? settingsResult.data : null;
  if (settings?.installBannerDismissed) return;

  const platform = detectPlatform();
  if (platform === "other" && !isInstallPromptAvailable()) {
    // Escritorio sin soporte de instalación disponible todavía: no molestamos.
    // Si el navegador SÍ soporta instalación (Chrome/Edge desktop), el
    // listener de abajo mostrará el banner en cuanto el evento llegue.
  }

  let dismissed = false;
  let container: HTMLDivElement | null = null;

  async function dismiss(): Promise<void> {
    dismissed = true;
    container?.remove();
    container = null;

    const current = settingsResult.ok
      ? settingsResult.data
      : { id: "current" as const, locale: "es" as const, onboardingDone: false };
    await saveSettings({ ...current, installBannerDismissed: true });
  }

  function buildContainer(): HTMLDivElement {
    const el = document.createElement("div");
    el.className =
      "fixed bottom-0 left-0 right-0 bg-white text-slate-950 p-4 flex flex-col gap-3 shadow-[0_-8px_24px_rgba(15,23,42,0.16)] z-50 sm:flex-row sm:items-center sm:justify-between";
    return el;
  }

  function renderAndroidBanner(): void {
    if (dismissed || container) return;

    container = buildContainer();

    const text = document.createElement("p");
    text.className = "flex-1 min-w-0 text-sm leading-6 text-slate-900";
    text.textContent = "Instala esta app para abrir tu QR al instante, incluso sin conexión.";

    const installBtn = createButton({
      label: "Instalar",
      variant: "primary",
      onClick: async () => {
        const outcome = await triggerInstallPrompt();
        if (outcome !== "unavailable") {
          await dismiss();
        }
      },
    });
    installBtn.className +=
      " w-full sm:w-auto min-w-[9rem] rounded-[999px] px-4 py-2.5 text-sm font-semibold shadow-lg hover:shadow-xl";

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Cerrar");
    closeBtn.className =
      "text-slate-500 hover:text-slate-700 px-2 py-1 rounded-full flex-shrink-0";
    closeBtn.addEventListener("click", () => void dismiss());

    container.append(text, installBtn, closeBtn);
    document.body.append(container);
  }

  function renderIosBanner(): void {
    if (dismissed || container) return;

    container = buildContainer();

    const text = document.createElement("p");
    text.className = "flex-1 text-sm";
    text.innerHTML =
      'Para instalarla: toca <strong>Compartir</strong> (el ícono □↑) y luego <strong>"Agregar a inicio"</strong>.';

    const closeBtn = document.createElement("button");
    closeBtn.textContent = "✕";
    closeBtn.setAttribute("aria-label", "Cerrar");
    closeBtn.className = "text-black/40 px-2 flex-shrink-0";
    closeBtn.addEventListener("click", () => void dismiss());

    container.append(text, closeBtn);
    document.body.append(container);
  }

  if (platform === "ios") {
    renderIosBanner();
    return;
  }

  // Android y desktop dependen del evento real del navegador: puede ya
  // estar disponible, o llegar un instante después de cargar la página.
  if (isInstallPromptAvailable()) {
    renderAndroidBanner();
  } else {
    onInstallPromptAvailable(() => renderAndroidBanner());
  }
}
