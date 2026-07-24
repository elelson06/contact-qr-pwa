/**
 * Schema del contacto guardado en el dispositivo.
 *
 * Diseño intencional: solo `name` y `phone` son obligatorios para el MVP
 * (lo único que pide el formulario hoy). El resto queda como opcional
 * para poder agregar campos a futuro (email, empresa, sitio web) SIN
 * necesitar una migración de datos, ya que los registros viejos
 * simplemente no tendrán esas claves.
 */
export interface Contact {
  id: "current"; // registro único por dispositivo, no hay multi-contacto en el MVP
  name: string;
  phone: string;

  // Opcionales, listos para cuando el vCard crezca más allá de 3.0 mínimo
  email?: string;
  organization?: string;
  title?: string;
  website?: string;

  createdAt: string; // ISO date
  updatedAt: string; // ISO date
}

/** Datos que el formulario recolecta hoy. Se amplía cuando se agreguen más campos a la UI. */
export type ContactInput = Pick<Contact, "name" | "phone"> &
  Partial<Pick<Contact, "email" | "organization" | "title" | "website">>;

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
