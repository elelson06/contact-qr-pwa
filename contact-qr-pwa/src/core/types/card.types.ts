export type CardType = "personal" | "professional" | "instagram";

interface BaseCard {
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

/** Tarjeta Personal: exactamente lo que ya existía (Nombre + Teléfono). */
export interface PersonalCard extends BaseCard {
  type: "personal";
  name: string;
  phone: string;
}

/**
 * Tarjeta Profesional: mismo núcleo que la personal, más campos opcionales.
 * Diseño abierto a propósito — se pueden sumar más campos opcionales a
 * futuro (ej. dirección, redes) sin romper tarjetas ya guardadas, porque
 * simplemente no tendrán esas claves.
 */
export interface ProfessionalCard extends BaseCard {
  type: "professional";
  name: string;
  phone: string;
  email?: string;
  organization?: string;
  title?: string;
  website?: string;
  // Nota: sin foto en v1 (ver decisión de arquitectura) — embeber una
  // imagen en el vCard densifica demasiado el QR y lo vuelve lento/frágil
  // de escanear, justo lo opuesto al valor central del producto.
}

/**
 * Tarjeta Instagram: el QR no es un vCard, es la URL del perfil.
 * `username` es el único dato necesario para generar el QR.
 */
export interface InstagramCard extends BaseCard {
  type: "instagram";
  username: string; // sin el "@", normalizado al guardar
}

export type Card = PersonalCard | ProfessionalCard | InstagramCard;

/** Datos que cada formulario recolecta, sin id/timestamps (los agrega el store). */
export type PersonalCardInput = Pick<PersonalCard, "name" | "phone">;
export type ProfessionalCardInput = Pick<ProfessionalCard, "name" | "phone"> &
  Partial<Pick<ProfessionalCard, "email" | "organization" | "title" | "website">>;
export type InstagramCardInput = Pick<InstagramCard, "username">;

export interface AppSettings {
  id: "current";
  locale: "es" | "en";
  onboardingDone: boolean;
  installBannerDismissed?: boolean;
}

/**
 * Patrón Result: toda función de `core/` devuelve esto en vez de lanzar
 * excepciones. Obliga a la capa de UI a manejar explícitamente el caso de error.
 */
export type Result<T> = { ok: true; data: T } | { ok: false; error: string };
