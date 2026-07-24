import type { ContactInput, Result } from "@core/types/contact.types";
import { validateContact } from "@core/vcard/validateContact";

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

/**
 * Construye el string vCard 3.0 a partir de los datos del contacto.
 * Elegimos 3.0 (no 4.0) porque tiene la compatibilidad más amplia y
 * probada con los lectores nativos de cámara de iOS y Android.
 *
 * Devuelve Result: valida antes de construir, así nunca se genera
 * un vCard con datos vacíos o mal formados.
 */
export function buildVCard(input: ContactInput): Result<string> {
  const validation = validateContact(input);
  if (!validation.ok) return validation;

  const { name, phone, email, organization, title } = validation.data;

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(name)}`,
    // N: Apellidos;Nombre;;; — usamos el nombre completo en el campo "Nombre"
    // porque el MVP no distingue nombre/apellido en el formulario.
    `N:;${escapeVCardValue(name)};;;`,
    `TEL;TYPE=CELL:${escapeVCardValue(phone)}`,
  ];

  if (email) lines.push(`EMAIL:${escapeVCardValue(email)}`);
  if (organization) lines.push(`ORG:${escapeVCardValue(organization)}`);
  if (title) lines.push(`TITLE:${escapeVCardValue(title)}`);

  lines.push("END:VCARD");

  // vCard requiere terminadores de línea CRLF
  return { ok: true, data: lines.join("\r\n") };
}
