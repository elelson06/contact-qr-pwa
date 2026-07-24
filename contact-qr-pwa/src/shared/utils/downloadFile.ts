/**
 * Dispara la descarga de un archivo de texto en el navegador.
 * Función genérica y reutilizable: no sabe nada de contactos ni vCards,
 * solo recibe un nombre de archivo y un contenido.
 */
export function downloadTextFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);

  URL.revokeObjectURL(url);
}
