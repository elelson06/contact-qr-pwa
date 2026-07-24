import type { ContactInput, Result } from "@core/types/contact.types";

/**
 * Acepta números con o sin espacios, guiones, paréntesis y prefijo "+".
 * Requiere al menos 6 dígitos para descartar entradas claramente inválidas,
 * sin ser tan estricto como para rechazar formatos internacionales legítimos.
 */
const PHONE_PATTERN = /^\+?[\d\s\-().]{6,20}$/;

export function validateContact(input: ContactInput): Result<ContactInput> {
  const name = input.name.trim();
  const phone = input.phone.trim();

  if (name.length === 0) {
    return { ok: false, error: "El nombre no puede estar vacío." };
  }
  if (name.length > 80) {
    return { ok: false, error: "El nombre es demasiado largo (máx. 80 caracteres)." };
  }
  if (phone.length === 0) {
    return { ok: false, error: "El teléfono no puede estar vacío." };
  }
  if (!PHONE_PATTERN.test(phone)) {
    return { ok: false, error: "El formato del teléfono no es válido." };
  }

  return {
    ok: true,
    data: { ...input, name, phone },
  };
}
