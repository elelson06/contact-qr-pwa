import { createField } from "@shared/ui/input";
import { createButton } from "@shared/ui/button";
import { saveCard } from "@core/storage/cardStore";
import { exportContactAsVcf } from "@shared/utils/exportVcf";
import type { PersonalCard } from "@core/types/card.types";

interface PersonalFormCallbacks {
  onSaved: (card: PersonalCard) => void;
  onBack: () => void;
}

/**
 * Renderiza la pantalla de configuración de la tarjeta Personal.
 * Si `existingCard` no es null, precarga los campos (modo edición).
 */
export function renderPersonalForm(
  container: HTMLElement,
  existingCard: PersonalCard | null,
  callbacks: PersonalFormCallbacks
): void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 max-w-sm mx-auto p-6 pt-16 text-text-primary bg-surface min-h-screen";

  const backButton = createButton({ label: "← Volver", variant: "ghost", onClick: callbacks.onBack });
  backButton.className = "w-auto self-start text-primary";

  const heading = document.createElement("h1");
  heading.textContent = existingCard ? "Editar tarjeta Personal" : "Configura tu tarjeta Personal";
  heading.className = "text-2xl font-semibold text-text-primary";

  const subheading = document.createElement("p");
  subheading.textContent =
    "Estos datos se generan como QR para que otros los escaneen. Se guardan solo en tu dispositivo.";
  subheading.className = "text-sm text-text-secondary";

  const nameField = createField({
    id: "personal-name",
    label: "Nombre",
    placeholder: "Ej. Ana Pérez",
    value: existingCard?.name ?? "",
  });

  const phoneField = createField({
    id: "personal-phone",
    label: "Teléfono",
    placeholder: "Ej. +34 600 111 222",
    type: "tel",
    value: existingCard?.phone ?? "",
  });

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-400 hidden";

  const form = document.createElement("form");
  form.className = "flex flex-col gap-4";
  form.append(nameField.wrapper, phoneField.wrapper, errorEl);

  const saveButton = createButton({ label: "Guardar", type: "submit", variant: "primary" });
  form.append(saveButton);

  function showError(message: string): void {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearError(): void {
    errorEl.classList.add("hidden");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const input = { name: nameField.input.value, phone: phoneField.input.value };
    const result = await saveCard("personal", input);

    if (!result.ok) {
      showError(result.error);
      return;
    }

    callbacks.onSaved(result.data as PersonalCard);
  });

  const backupButton = createButton({
    label: "Descargar respaldo (.vcf)",
    variant: "secondary",
    onClick: () => {
      clearError();
      const input = { name: nameField.input.value, phone: phoneField.input.value };
      const result = exportContactAsVcf(input, false);
      if (!result.ok) showError(result.error);
    },
  });

  const backupHint = document.createElement("p");
  backupHint.textContent =
    "Recomendado: algunos navegadores pueden borrar los datos guardados si no abres la app por varios días. Este archivo te permite restaurar tu tarjeta.";
  backupHint.className = "text-xs text-text-secondary";

  wrapper.append(backButton, heading, subheading, form, backupButton, backupHint);
  container.append(wrapper);
}
