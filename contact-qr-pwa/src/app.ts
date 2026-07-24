import { renderContactForm } from "@features/contact-form/ContactForm";
import { renderQrDisplay } from "@features/qr-display/QrDisplay";
import { getContact, subscribe } from "@core/storage/contactStore";
import type { Contact } from "@core/types/contact.types";

/**
 * Router mínimo de dos pantallas. No usamos una librería de routing
 * porque no hay URLs distintas que navegar: la "ruta" depende
 * exclusivamente de si existe un contacto guardado o no.
 */
export async function startApp(root: HTMLElement): Promise<void> {
  let cleanupCurrentScreen: (() => void) | null = null;

  function teardown(): void {
    if (cleanupCurrentScreen) {
      cleanupCurrentScreen();
      cleanupCurrentScreen = null;
    }
  }

  function showQr(contact: Contact): void {
    teardown();
    cleanupCurrentScreen = renderQrDisplay(root, contact, {
      onEdit: () => showForm(contact),
    });
  }

  function showForm(existingContact: Contact | null): void {
    teardown();
    renderContactForm(root, existingContact, {
      onSaved: (contact) => showQr(contact),
    });
  }

  const initial = await getContact();
  const initialContact = initial.ok ? initial.data : null;

  if (initialContact) {
    showQr(initialContact);
  } else {
    showForm(null);
  }

  // Si el contacto se borra desde otro punto de la app (ej. futura opción
  // "reiniciar" en ajustes), volvemos automáticamente al formulario.
  subscribe((contact) => {
    if (!contact) showForm(null);
  });
}
