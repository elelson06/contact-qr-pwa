import type { PersonalCardInput, ProfessionalCardInput, Result } from "@core/types/card.types";

/**
 * Acepta números con o sin espacios, guiones, paréntesis y prefijo "+".
 * Requiere al menos 6 dígitos para descartar entradas claramente inválidas,
 * sin ser tan estricto como para rechazar formatos internacionales legítimos.
 */
const PHONE_PATTERN = /^\+?[\d\s\-().]{6,20}$/;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WEBSITE_PATTERN = /^(https?:\/\/)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?#].*)?$/;

function validateNameAndPhone(name: string, phone: string): Result<{ name: string; phone: string }> {
  const trimmedName = name.trim();
  const trimmedPhone = phone.trim();

  if (trimmedName.length === 0) {
    return { ok: false, error: "El nombre no puede estar vacío." };
  }
  if (trimmedName.length > 80) {
    return { ok: false, error: "El nombre es demasiado largo (máx. 80 caracteres)." };
  }
  if (trimmedPhone.length === 0) {
    return { ok: false, error: "El teléfono no puede estar vacío." };
  }
  if (!PHONE_PATTERN.test(trimmedPhone)) {
    return { ok: false, error: "El formato del teléfono no es válido." };
  }

  return { ok: true, data: { name: trimmedName, phone: trimmedPhone } };
}

/** Validación de la tarjeta Personal: solo nombre y teléfono. */
export function validatePersonalCard(input: PersonalCardInput): Result<PersonalCardInput> {
  const base = validateNameAndPhone(input.name, input.phone);
  if (!base.ok) return base;
  return { ok: true, data: base.data };
}

/**
 * Validación de la tarjeta Profesional: nombre y teléfono obligatorios,
 * más validación de formato de los campos opcionales SI el usuario los completó
 * (un campo opcional vacío es válido; uno completado con formato incorrecto no).
 */
export function validateProfessionalCard(input: ProfessionalCardInput): Result<ProfessionalCardInput> {
  const base = validateNameAndPhone(input.name, input.phone);
  if (!base.ok) return base;

  const email = input.email?.trim() || undefined;
  const website = input.website?.trim() || undefined;
  const organization = input.organization?.trim() || undefined;
  const title = input.title?.trim() || undefined;

  if (email && !EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "El formato del email no es válido." };
  }
  if (website && !WEBSITE_PATTERN.test(website)) {
    return { ok: false, error: "El formato del sitio web no es válido." };
  }

  return {
    ok: true,
    data: { ...base.data, email, organization, title, website },
  };
}
