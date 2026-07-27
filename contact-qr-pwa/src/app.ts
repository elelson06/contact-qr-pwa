import { renderCardSelector } from "@features/card-selector/CardSelector";
import { renderPersonalForm } from "@features/personal-card/PersonalForm";
import { renderProfessionalForm } from "@features/professional-card/ProfessionalForm";
import { renderInstagramForm } from "@features/instagram-card/InstagramForm";
import { renderQrDisplay } from "@features/qr-display/QrDisplay";
import { getCard } from "@core/storage/cardStore";
import { buildQrPayload } from "@core/qr-payload/buildQrPayload";
import type {
  Card,
  CardType,
  PersonalCard,
  ProfessionalCard,
  InstagramCard,
} from "@core/types/card.types";

/**
 * Router de la app. Siempre abre en la pantalla de selección (según se
 * definió con el usuario): con 3 tipos de tarjeta ya no tiene sentido
 * "abrir directo al QR" como en la v1 de una sola tarjeta.
 */
export async function startApp(root: HTMLElement): Promise<void> {
  let cleanupCurrentScreen: (() => void) | null = null;

  function teardown(): void {
    if (cleanupCurrentScreen) {
      cleanupCurrentScreen();
      cleanupCurrentScreen = null;
    }
  }

  async function showHome(): Promise<void> {
    teardown();
    await renderCardSelector(root, { onSelect: (type) => showCard(type) });
  }

  async function showCard(type: CardType): Promise<void> {
    const result = await getCard(type);
    const card = result.ok ? result.data : null;

    if (card) {
      showQr(card);
    } else {
      showForm(type, null);
    }
  }

  function showQr(card: Card): void {
    teardown();

    const payload = buildQrPayload(card);
    if (!payload.ok) {
      // No debería ocurrir con datos ya guardados y validados, pero si
      // pasa, es más seguro mandar de vuelta al formulario que mostrar
      // una pantalla de QR rota.
      showForm(card.type, card);
      return;
    }

    cleanupCurrentScreen = renderQrDisplay(root, card, payload.data, {
      onEdit: () => showForm(card.type, card),
      onBack: () => void showHome(),
    });
  }

  function showForm(type: CardType, existingCard: Card | null): void {
    teardown();

    if (type === "personal") {
      renderPersonalForm(root, existingCard as PersonalCard | null, {
        onSaved: (card) => showQr(card),
        onBack: () => void showHome(),
      });
    } else if (type === "professional") {
      renderProfessionalForm(root, existingCard as ProfessionalCard | null, {
        onSaved: (card) => showQr(card),
        onBack: () => void showHome(),
      });
    } else {
      renderInstagramForm(root, existingCard as InstagramCard | null, {
        onSaved: (card) => showQr(card),
        onBack: () => void showHome(),
      });
    }
  }

  await showHome();
}
