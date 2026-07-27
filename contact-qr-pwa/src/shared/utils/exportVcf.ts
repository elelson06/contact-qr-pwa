import { buildVCard, buildProfessionalVCard } from "@core/vcard/buildVCard";
import { downloadTextFile } from "@shared/utils/downloadFile";
import type { PersonalCardInput, ProfessionalCardInput, Result } from "@core/types/card.types";

/**
 * Respaldo ante la limpieza automática de almacenamiento de Safari/WebKit
 * (ITP borra IndexedDB/localStorage de PWAs no abiertas en ~7 días).
 * Descarga un .vcf real: el usuario puede reabrirlo para restaurar su
 * tarjeta aunque el navegador haya borrado los datos locales.
 *
 * Disponible solo para tarjetas Personal y Profesional (ambas son vCards);
 * la tarjeta Instagram no lo necesita, perder el username es trivial de
 * volver a escribir.
 */
export function exportContactAsVcf(
  input: PersonalCardInput | ProfessionalCardInput,
  isProfessional: boolean
): Result<void> {
  const vcard = isProfessional
    ? buildProfessionalVCard(input as ProfessionalCardInput)
    : buildVCard(input as PersonalCardInput);
  if (!vcard.ok) return vcard;

  const safeName = input.name.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "contacto";
  downloadTextFile(`${safeName}.vcf`, vcard.data, "text/vcard");

  return { ok: true, data: undefined };
}
