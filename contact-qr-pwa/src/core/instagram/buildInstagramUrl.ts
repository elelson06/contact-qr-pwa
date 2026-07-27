import type { InstagramCardInput, Result } from "@core/types/card.types";
import { validateInstagramUsername } from "@core/instagram/validateInstagramUsername";

/**
 * Construye la URL del perfil de Instagram. Se usa la URL https estándar
 * (no un esquema instagram://) porque es un "universal link": si el
 * dispositivo que escanea el QR tiene la app instalada, el sistema
 * operativo redirige automáticamente a la app y abre el perfil ahí mismo;
 * si no la tiene, abre el perfil en el navegador igual. Es el mecanismo
 * más confiable y no depende de que la app esté instalada para funcionar.
 */
export function buildInstagramUrl(input: InstagramCardInput): Result<string> {
  const validation = validateInstagramUsername(input);
  if (!validation.ok) return validation;

  return { ok: true, data: `https://www.instagram.com/${validation.data.username}` };
}
