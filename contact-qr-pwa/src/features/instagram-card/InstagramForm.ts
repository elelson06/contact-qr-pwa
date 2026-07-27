import { createField } from "@shared/ui/input";
import { createButton } from "@shared/ui/button";
import { saveCard } from "@core/storage/cardStore";
import { buildInstagramUrl } from "@core/instagram/buildInstagramUrl";
import { createFooter } from "@shared/ui/footer";
import type { InstagramCard } from "@core/types/card.types";

interface InstagramFormCallbacks {
  onSaved: (card: InstagramCard) => void;
  onBack: () => void;
}

export function renderInstagramForm(
  container: HTMLElement,
  existingCard: InstagramCard | null,
  callbacks: InstagramFormCallbacks
): void {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 max-w-sm mx-auto p-6 pt-16 bg-background min-h-screen text-text-primary";

  const backButton = createButton({ label: "← Volver", variant: "ghost", onClick: callbacks.onBack });
  backButton.className = "w-auto self-start text-primary";

  const heading = document.createElement("h1");
  heading.textContent = existingCard ? "Editar tarjeta Instagram" : "Configura tu tarjeta Instagram";
  heading.className = "text-2xl font-semibold text-text-primary";

  const subheading = document.createElement("p");
  subheading.textContent =
    "El QR abrirá directamente tu perfil de Instagram. Quien lo escanee solo tiene que tocar \"Seguir\".";
  subheading.className = "text-sm text-text-secondary";

  const usernameField = createField({
    id: "ig-username",
    label: "Usuario de Instagram",
    placeholder: "tu_usuario (sin @)",
    value: existingCard?.username ?? "",
  });

  const previewEl = document.createElement("p");
  previewEl.className = "text-xs text-text-secondary break-all";

  function updatePreview(): void {
    const result = buildInstagramUrl({ username: usernameField.input.value });
    previewEl.textContent = result.ok ? `Vista previa: ${result.data}` : "";
  }
  usernameField.input.addEventListener("input", updatePreview);
  updatePreview();

  const errorEl = document.createElement("p");
  errorEl.className = "text-sm text-red-400 hidden";

  const form = document.createElement("form");
  form.className = "flex flex-col gap-4";
  form.append(usernameField.wrapper, previewEl, errorEl);

  const saveButton = createButton({ label: "Guardar", type: "submit", variant: "primary" });
  form.append(saveButton);

  function showError(message: string): void {
    errorEl.textContent = message;
    errorEl.classList.remove("hidden");
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorEl.classList.add("hidden");

    const result = await saveCard("instagram", { username: usernameField.input.value });

    if (!result.ok) {
      showError(result.error);
      return;
    }

    callbacks.onSaved(result.data as InstagramCard);
  });

  wrapper.append(backButton, heading, subheading, form, createFooter());
  container.append(wrapper);
}
