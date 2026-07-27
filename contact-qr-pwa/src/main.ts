import "./styles.css";
// Debe importarse ANTES de cualquier otra cosa: registra el listener de
// "beforeinstallprompt" apenas carga el script, para no perder el evento
// si el navegador lo dispara muy temprano.
import "@shared/utils/installPrompt";
import { startApp } from "./app";
import { renderInstallBanner } from "@features/install-banner/InstallBanner";

const root = document.getElementById("app");

if (!root) {
  throw new Error("No se encontró el elemento #app en index.html");
}

startApp(root);
renderInstallBanner();

// Revisa si hay una versión nueva cada 60 minutos. Cubre el caso de
// alguien que deja la PWA abierta en modo pantalla completa durante
// mucho tiempo sin volver a "navegar" (que es normalmente cuándo el
// navegador chequea actualizaciones del Service Worker por su cuenta).
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.ready.then((registration) => {
    setInterval(() => {
      registration.update();
    }, 60 * 60 * 1000);
  });
}
