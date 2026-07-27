import "./styles.css";
// Debe importarse ANTES de cualquier otra cosa: registra el listener de
// "beforeinstallprompt" apenas carga el script, para no perder el evento
// si el navegador lo dispara muy temprano.
import "@shared/utils/installPrompt";
import { registerSW } from "virtual:pwa-register";
import { startApp } from "./app";
import { renderInstallBanner } from "@features/install-banner/InstallBanner";
import { renderUpdateBanner } from "@features/update-banner/UpdateBanner";

const root = document.getElementById("app");

if (!root) {
  throw new Error("No se encontró el elemento #app en index.html");
}

startApp(root);
renderInstallBanner();

/**
 * Registro del Service Worker con confirmación explícita del usuario:
 * cuando hay una versión nueva lista (`onNeedRefresh`), se muestra un
 * banner con "Actualizar" / "Cancelar" en vez de aplicarla sola. Solo
 * si el usuario confirma, `updateSW(true)` activa la nueva versión y
 * recarga la página.
 */
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    renderUpdateBanner({
      onConfirm: () => {
        void updateSW(true);
      },
      onDismiss: () => {
        // No hace falta guardar nada: si la app vuelve a detectar la
        // misma actualización pendiente (por el chequeo periódico de
        // abajo, o en la próxima visita), se le vuelve a preguntar.
      },
    });
  },
  onRegisteredSW(_url, registration) {
    // Revisa si hay una versión nueva cada 60 minutos. Cubre el caso de
    // alguien que deja la PWA abierta en modo pantalla completa durante
    // mucho tiempo sin volver a "navegar" (que es normalmente cuándo el
    // navegador chequea actualizaciones del Service Worker por su cuenta).
    if (registration) {
      setInterval(() => {
        registration.update();
      }, 60 * 60 * 1000);
    }
  },
});
