interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;
const availabilityListeners = new Set<() => void>();

// Este listener se registra apenas se importa el módulo (side effect
// intencional): Chrome/Android dispara "beforeinstallprompt" una sola vez
// por sesión, y si todavía no hay un listener activo en ese momento, el
// evento se pierde. Por eso este archivo se importa desde main.ts, ANTES
// de montar cualquier UI.
window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault(); // evita el mini-banner nativo, lo mostramos con nuestro propio diseño
  deferredPrompt = e as BeforeInstallPromptEvent;
  for (const listener of availabilityListeners) listener();
});

window.addEventListener("appinstalled", () => {
  deferredPrompt = null;
});

/** True si el navegador ya nos dio el evento y podemos disparar el prompt nativo. */
export function isInstallPromptAvailable(): boolean {
  return deferredPrompt !== null;
}

/** Se notifica cuando el prompt pasa de no-disponible a disponible (el evento puede llegar tarde). */
export function onInstallPromptAvailable(listener: () => void): () => void {
  availabilityListeners.add(listener);
  return () => availabilityListeners.delete(listener);
}

/** Dispara el diálogo nativo de instalación de Chrome/Android. Solo funciona una vez por evento capturado. */
export async function triggerInstallPrompt(): Promise<"accepted" | "dismissed" | "unavailable"> {
  if (!deferredPrompt) return "unavailable";

  await deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;
  return choice.outcome;
}
