import { createField } from "@shared/ui/input";
import { createButton } from "@shared/ui/button";
import { saveCard } from "@core/storage/cardStore";
import { exportContactAsVcf } from "@shared/utils/exportVcf";
import type { ProfessionalCard } from "@core/types/card.types";

interface ProfessionalFormCallbacks {
  onSaved: (card: ProfessionalCard) => void;
  onBack: () => void;
}

/**
 * Renderiza la pantalla de configuración de la tarjeta Profesional.
 * Mismo patrón que PersonalForm, con campos opcionales adicionales.
 * Sin foto en v1: embeber una imagen en el vCard densifica demasiado
 * el QR (ver decisión de arquitectura tomada con el usuario).
 */
export function renderProfessionalForm(
  container: HTMLElement,
  existingCard: ProfessionalCard | null,
  callbacks: ProfessionalFormCallbacks
): void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 max-w-sm mx-auto p-6 pt-16";

  const backButton = createButton({ label: "← Volver", variant: "ghost", onClick: callbacks.onBack });
  backButton.className = "w-auto self-start";

  const heading = document.createElement("h1");
  heading.textContent = existingCard ? "Editar tarjeta Profesional" : "Configura tu tarjeta Profesional";
  heading.className = "text-xl font-semibold";

  const subheading = document.createElement("p");
  subheading.textContent = "Nombre y teléfono son obligatorios. El resto es opcional.";
  subheading.className = "text-sm text-white/60";

  const nameField = createField({
    id: "prof-name",
    label: "Nombre",
    placeholder: "Ej. Ana Pérez",
    value: existingCard?.name ?? "",
  });

  const phoneField = createField({
    id: "prof-phone",
    label: "Teléfono",
    placeholder: "Ej. +34 600 111 222",
    type: "tel",
    value: existingCard?.phone ?? "",
  });

  const emailField = createField({
    id: "prof-email",
    label: "Email (opcional)",
    placeholder: "ana@empresa.com",
    type: "email",
    value: existingCard?.email ?? "",
  });

  const organizationField = createField({
    id: "prof-org",
    label: "Empresa (opcional)",
    placeholder: "Ej. Acme S.A.",
    value: existingCard?.organization ?? "",
  });

  const titleField = createField({
    id: "prof-title",
    label: "Cargo (opcional)",
    placeholder: "Ej. Gerente Comercial",
    value: existingCard?.title ?? "",
  });

  const websiteField = createField({
    id: "prof-website",
    label: "Sitio web (opcional)",
    placeholder: "www.empresa.com",
    value: existingCard?.website ?? "",
  });

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-400 hidden";

  const form = document.createElement("form");
  form.className = "flex flex-col gap-4";
  form.append(
    nameField.wrapper,
    phoneField.wrapper,
    emailField.wrapper,
    organizationField.wrapper,
    titleField.wrapper,
    websiteField.wrapper,
    errorEl
  );

  const saveButton = createButton({ label: "Guardar", type: "submit", variant: "primary" });
  form.append(saveButton);

  function showError(message: string): void {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  function clearError(): void {
    errorEl.classList.add("hidden");
  }

  function collectInput() {
    return {
      name: nameField.input.value,
      phone: phoneField.input.value,
      email: emailField.input.value || undefined,
      organization: organizationField.input.value || undefined,
      title: titleField.input.value || undefined,
      website: websiteField.input.value || undefined,
    };
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearError();

    const result = await saveCard("professional", collectInput());

    if (!result.ok) {
      showError(result.error);
      return;
    }

    callbacks.onSaved(result.data as ProfessionalCard);
  });

  const backupButton = createButton({
    label: "Descargar respaldo (.vcf)",
    variant: "secondary",
    onClick: () => {
      clearError();
      const result = exportContactAsVcf(collectInput(), true);
      if (!result.ok) showError(result.error);
    },
  });

  const backupHint = document.createElement("p");
  backupHint.textContent =
    "Recomendado: algunos navegadores pueden borrar los datos guardados si no abres la app por varios días. Este archivo te permite restaurar tu tarjeta.";
  backupHint.className = "text-xs text-white/40";

  wrapper.append(backButton, heading, subheading, form, backupButton, backupHint);
  container.append(wrapper);
}
