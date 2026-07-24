import { getDb } from "@core/storage/db";
import type { AppSettings, Result } from "@core/types/contact.types";

const DEFAULT_SETTINGS: AppSettings = {
  id: "current",
  locale: "es",
  onboardingDone: false,
};

export async function getSettings(): Promise<Result<AppSettings>> {
  try {
    const db = await getDb();
    const settings = (await db.get("settings", "current")) ?? DEFAULT_SETTINGS;
    return { ok: true, data: settings };
  } catch (err) {
    return { ok: false, error: `No se pudo leer la configuración: ${(err as Error).message}` };
  }
}

export async function saveSettings(settings: AppSettings): Promise<Result<AppSettings>> {
  try {
    const db = await getDb();
    await db.put("settings", settings);
    return { ok: true, data: settings };
  } catch (err) {
    return { ok: false, error: `No se pudo guardar la configuración: ${(err as Error).message}` };
  }
}
