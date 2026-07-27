import { getAllCards } from "@core/storage/cardStore";
import { shareApp } from "@shared/utils/shareApp";
import { createButton } from "@shared/ui/button";
import { createFooter } from "@shared/ui/footer";
import type { CardType } from "@core/types/card.types";

interface CardSelectorCallbacks {
  onSelect: (type: CardType) => void;
}

const CARD_META: Record<CardType, { label: string; hint: string; icon: string }> = {
  personal: {
    label: "Tarjeta Personal",
    hint: "Nombre y teléfono",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
  },
  professional: {
    label: "Tarjeta Profesional",
    hint: "Contacto de trabajo",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-briefcase"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
  },
  instagram: {
    label: "Instagram",
    hint: "Compartí tu perfil",
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  },
};

/** Renderiza la pantalla de inicio: elegir qué tarjeta mostrar/configurar. */
export async function renderCardSelector(
  container: HTMLElement,
  callbacks: CardSelectorCallbacks
): Promise<void> {
  container.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-6 max-w-sm mx-auto p-6 pt-12 bg-background min-h-screen";

  const header = document.createElement("div");
  header.className = "flex flex-col items-center gap-2 mb-6";
  header.innerHTML = `
    <img src="/icons/icon-192.png" alt="App Logo" class="w-16 h-16 rounded-2xl" />
    <span class="text-text-primary font-bold text-lg">QR Contact Share</span>
  `;

  const heading = document.createElement("h1");
  heading.textContent = "¿Qué querés compartir?";
  heading.className = "text-2xl font-semibold text-text-primary text-center mb-2";

  wrapper.append(header, heading);

  const cardsResult = await getAllCards();
  const cards = cardsResult.ok
    ? cardsResult.data
    : { personal: null, professional: null, instagram: null };

  (["personal", "professional", "instagram"] as CardType[]).forEach((type) => {
    const meta = CARD_META[type];
    const isConfigured = cards[type] !== null;

    const button = document.createElement("button");
    button.className =
      "w-full rounded-2xl bg-surface-variant p-4 text-left flex items-center gap-4 border border-transparent hover:border-primary transition-all shadow-sm";
    button.addEventListener("click", () => callbacks.onSelect(type));

    const iconWrapper = document.createElement("div");
    iconWrapper.className = "text-primary";
    iconWrapper.innerHTML = meta.icon;

    const contentWrapper = document.createElement("div");
    contentWrapper.className = "flex flex-col";

    const title = document.createElement("span");
    title.className = "font-semibold text-text-primary";
    title.textContent = meta.label;

    const status = document.createElement("span");
    status.className = "text-sm text-text-secondary";
    status.textContent = isConfigured ? `✓ Configurada · ${meta.hint}` : `Configurar · ${meta.hint}`;

    contentWrapper.append(title, status);
    button.append(iconWrapper, contentWrapper);
    wrapper.append(button);
  });

  const shareFeedback = document.createElement("p");
  shareFeedback.className = "text-sm text-center text-text-secondary h-5";

  // Reemplazar botón de texto por icono
  const shareButton = document.createElement("button");
  shareButton.className = "self-center p-3 rounded-full hover:bg-surface-variant text-text-secondary hover:text-text-primary transition-all";
  shareButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="5.49" y2="10.51"/></svg>`;
  shareButton.onclick = async () => {
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
  };

  wrapper.append(shareButton, shareFeedback);
  wrapper.append(createFooter());
  container.append(wrapper);
}
