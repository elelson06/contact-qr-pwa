import { createField } from "@shared/ui/input";
import { createButton } from "@shared/ui/button";
import { saveContact } from "@core/storage/contactStore";
import { exportContactAsVcf } from "@shared/utils/exportVcf";
import type { Contact } from "@core/types/contact.types";

interface ContactFormCallbacks {
  onSaved: (contact: Contact) => void;
}

/**
 * Renderiza la pantalla de configuración dentro de `container`.
 * Si `existingContact` no es null, precarga los campos (modo edición
 * vía el botón ⚙️ desde la pantalla de QR).
 */
export function renderContactForm(
  container: HTMLElement,
  existingContact: Contact | null,
  callbacks: ContactFormCallbacks
): void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 max-w-sm mx-auto p-6 pt-16";

  const heading = document.createElement("h1");
  heading.textContent = existingContact ? "Editar mi contacto" : "Configura tu contacto";
  heading.className = "text-xl font-semibold";

  const subheading = document.createElement("p");
  subheading.textContent =
    "Estos datos se generan como QR para que otros los escaneen. Se guardan solo en tu dispositivo.";
  subheading.className = "text-sm text-white/60";

  const nameField = createField({
    id: "name",
    label: "Nombre",
    placeholder: "Ej. Ana Pérez",
    value: existingContact?.name ?? "",
  });

  const phoneField = createField({
    id: "phone",
    label: "Teléfono",
    placeholder: "Ej. +34 600 111 222",
    type: "tel",
    value: existingContact?.phone ?? "",
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
    const result = await saveContact(input);

    if (!result.ok) {
      showError(result.error);
      return;
    }

    callbacks.onSaved(result.data);
  });

  const backupButton = createButton({
    label: "Descargar respaldo (.vcf)",
    variant: "secondary",
    onClick: () => {
      clearError();
      const input = { name: nameField.input.value, phone: phoneField.input.value };
      const result = exportContactAsVcf(input);
      if (!result.ok) showError(result.error);
    },
  });

  const backupHint = document.createElement("p");
  backupHint.textContent =
    "Recomendado: algunos navegadores pueden borrar los datos guardados si no abres la app por varios días. Este archivo te permite restaurar tu contacto.";
  backupHint.className = "text-xs text-white/40";

  wrapper.append(heading, subheading, form, backupButton, backupHint);
  container.append(wrapper);
}
