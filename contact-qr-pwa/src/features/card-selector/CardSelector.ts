import { getAllCards } from "@core/storage/cardStore";
import { shareApp } from "@shared/utils/shareApp";
import { createButton } from "@shared/ui/button";
import type { CardType } from "@core/types/card.types";

interface CardSelectorCallbacks {
  onSelect: (type: CardType) => void;
}

const CARD_META: Record<CardType, { label: string; hint: string }> = {
  personal: { label: "Tarjeta Personal", hint: "Nombre y teléfono" },
  professional: { label: "Tarjeta Profesional", hint: "Contacto de trabajo" },
  instagram: { label: "Instagram", hint: "Compartí tu perfil" },
};

/** Renderiza la pantalla de inicio: elegir qué tarjeta mostrar/configurar. */
export async function renderCardSelector(
  container: HTMLElement,
  callbacks: CardSelectorCallbacks
): Promise<void> {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-4 max-w-sm mx-auto p-6 pt-20";

  const heading = document.createElement("h1");
  heading.textContent = "¿Qué querés compartir?";
  heading.className = "text-xl font-semibold mb-2";

  wrapper.append(heading);

  const cardsResult = await getAllCards();
  const cards = cardsResult.ok
    ? cardsResult.data
    : { personal: null, professional: null, instagram: null };

  (["personal", "professional", "instagram"] as CardType[]).forEach((type) => {
    const meta = CARD_META[type];
    const isConfigured = cards[type] !== null;

    const button = document.createElement("button");
    button.className =
      "w-full rounded-xl bg-white/5 border border-white/10 hover:border-brand-accent px-4 py-4 text-left flex flex-col gap-1 transition-colors";
    button.addEventListener("click", () => callbacks.onSelect(type));

    const title = document.createElement("span");
    title.className = "font-semibold";
    title.textContent = meta.label;

    const status = document.createElement("span");
    status.className = "text-xs text-white/50";
    status.textContent = isConfigured ? `✓ Configurada · ${meta.hint}` : `Configurar · ${meta.hint}`;

    button.append(title, status);
    wrapper.append(button);
  });

  const shareFeedback = document.createElement("p");
  shareFeedback.className = "text-xs text-center text-white/50 h-4";

  const shareButton = createButton({
    label: "Compartir esta app",
    variant: "ghost",
    onClick: async () => {
      const result = await shareApp();
      const messages: Record<typeof result, string> = {
        shared: "¡Gracias por compartir!",
        copied: "Link copiado al portapapeles",
        cancelled: "",
        unavailable: "No se pudo compartir en este navegador",
      };
      shareFeedback.textContent = messages[result];
      if (messages[result]) {
        setTimeout(() => (shareFeedback.textContent = ""), 3000);
      }
    },
  });

  wrapper.append(shareButton, shareFeedback);
  container.append(wrapper);
}
