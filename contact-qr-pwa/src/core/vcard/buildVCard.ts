import type { PersonalCardInput, ProfessionalCardInput, Result } from "@core/types/card.types";
import { validatePersonalCard, validateProfessionalCard } from "@core/vcard/validateContact";

/**
 * El spec de vCard (RFC 2426 / vCard 3.0) requiere escapar coma, punto y coma,
 * backslash y saltos de línea dentro de los valores de campo.
 */
function escapeVCardValue(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function buildLines(data: {
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  title?: string;
  website?: string;
}): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(data.name)}`,
    `N:;${escapeVCardValue(data.name)};;;`,
    `TEL;TYPE=CELL:${escapeVCardValue(data.phone)}`,
  ];

  if (data.email) lines.push(`EMAIL:${escapeVCardValue(data.email)}`);
  if (data.organization) lines.push(`ORG:${escapeVCardValue(data.organization)}`);
  if (data.title) lines.push(`TITLE:${escapeVCardValue(data.title)}`);
  if (data.website) lines.push(`URL:${escapeVCardValue(data.website)}`);

  lines.push("END:VCARD");

  // vCard requiere terminadores de línea CRLF
  return lines.join("\r\n");
}

/**
 * Construye el string vCard 3.0 para la tarjeta Personal (solo nombre y teléfono).
 * Elegimos 3.0 (no 4.0) por su compatibilidad más amplia y probada con los
 * lectores nativos de cámara de iOS y Android.
 */
export function buildVCard(input: PersonalCardInput): Result<string> {
  const validation = validatePersonalCard(input);
  if (!validation.ok) return validation;
  return { ok: true, data: buildLines(validation.data) };
}

/** Construye el vCard 3.0 para la tarjeta Profesional, incluyendo los campos opcionales presentes. */
export function buildProfessionalVCard(input: ProfessionalCardInput): Result<string> {
  const validation = validateProfessionalCard(input);
  if (!validation.ok) return validation;
  return { ok: true, data: buildLines(validation.data) };
}
