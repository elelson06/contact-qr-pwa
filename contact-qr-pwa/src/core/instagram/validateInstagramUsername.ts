import type { InstagramCardInput, Result } from "@core/types/card.types";

// Instagram permite letras, números, puntos y guiones bajos, máximo 30 caracteres.
const USERNAME_PATTERN = /^[a-zA-Z0-9._]{1,30}$/;

/**
 * Normaliza el username (quita "@" y espacios si el usuario los escribió)
 * y valida el formato antes de construir la URL del perfil.
 */
export function validateInstagramUsername(input: InstagramCardInput): Result<InstagramCardInput> {
  const normalized = input.username.trim().replace(/^@/, "");

  if (normalized.length === 0) {
    return { ok: false, error: "El usuario de Instagram no puede estar vacío." };
  }
  if (!USERNAME_PATTERN.test(normalized)) {
    return {
      ok: false,
      error: "El usuario solo puede tener letras, números, puntos y guiones bajos.",
    };
  }

  return { ok: true, data: { username: normalized } };
}
