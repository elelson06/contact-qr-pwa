import { createButton } from "@shared/ui/button";

interface UpdateBannerCallbacks {
  onConfirm: () => void;
  onDismiss: () => void;
}

/**
 * Muestra un banner fijo (arriba, para no chocar con el de instalación
 * que vive abajo) avisando que hay una versión nueva de la app lista
 * para aplicarse. No se aplica sola: requiere que el usuario toque
 * "Actualizar".
 */
export function renderUpdateBanner(callbacks: UpdateBannerCallbacks): void {
  const container = document.createElement("div");
  container.className =
    "fixed top-0 left-0 right-0 bg-brand-accent text-brand-bg p-4 flex items-center gap-3 shadow-md z-50";

  const text = document.createElement("p");
  text.className = "flex-1 text-sm font-medium";
  text.textContent = "Hay una nueva versión disponible.";

  const updateBtn = createButton({
    label: "Actualizar",
    variant: "secondary",
    onClick: () => {
      container.remove();
      callbacks.onConfirm();
    },
  });
  updateBtn.className += " w-auto flex-shrink-0 !bg-brand-bg !text-white";

  const dismissBtn = document.createElement("button");
  dismissBtn.textContent = "Cancelar";
  dismissBtn.className = "text-brand-bg/70 text-sm px-2 flex-shrink-0 underline underline-offset-4";
  dismissBtn.addEventListener("click", () => {
    container.remove();
    callbacks.onDismiss();
  });

  container.append(text, updateBtn, dismissBtn);
  document.body.append(container);
}
