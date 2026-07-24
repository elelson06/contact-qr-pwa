import { buildVCard } from "@core/vcard/buildVCard";
import { downloadTextFile } from "@shared/utils/downloadFile";
import type { ContactInput, Result } from "@core/types/contact.types";

/**
 * Respaldo ante la limpieza automática de almacenamiento de Safari/WebKit
 * (ITP borra IndexedDB/localStorage de PWAs no abiertas en ~7 días).
 * Descarga un .vcf real: el usuario puede reabrirlo para restaurar su
 * contacto aunque el navegador haya borrado los datos locales.
 */
export function exportContactAsVcf(input: ContactInput): Result<void> {
  const vcard = buildVCard(input);
  if (!vcard.ok) return vcard;

  const safeName = input.name.trim().replace(/[^a-zA-Z0-9]+/g, "_") || "contacto";
  downloadTextFile(`${safeName}.vcf`, vcard.data, "text/vcard");

  return { ok: true, data: undefined };
}
