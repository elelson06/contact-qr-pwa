import type { Card, Result } from "@core/types/card.types";
import { buildVCard, buildProfessionalVCard } from "@core/vcard/buildVCard";
import { buildInstagramUrl } from "@core/instagram/buildInstagramUrl";

/** Devuelve el contenido exacto a codificar en el QR según el tipo de tarjeta. */
export function buildQrPayload(card: Card): Result<string> {
  switch (card.type) {
    case "personal":
      return buildVCard(card);
    case "professional":
      return buildProfessionalVCard(card);
    case "instagram":
      return buildInstagramUrl(card);
  }
}
