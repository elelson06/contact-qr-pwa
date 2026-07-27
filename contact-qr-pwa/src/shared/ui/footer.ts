/**
 * Crea un footer minimalista con la marca.
 */
export function createFooter(): HTMLElement {
  const footer = document.createElement("footer");
  // Espaciado compacto y alineación limpia al fondo
  footer.className = "mt-auto py-4 text-center flex flex-col items-center justify-center";

  const link = document.createElement("a");
  link.href = "https://elsonlabs.com"; // Temporal
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  // Disposición vertical: texto arriba, icono abajo
  link.className = "flex flex-col items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary opacity-80 hover:opacity-100 transition-opacity no-underline";

  const text = document.createElement("span");
  text.className = "font-medium tracking-wide text-[11px] uppercase text-primary";
  text.textContent = "Powered by";

  const logo = document.createElement("img");
  logo.src = "/images/logo.png"; // Usa aquí el archivo que contiene solo la 'E'
  logo.alt = "Elson Labs";
  logo.className = "";
  logo.style.width = "70%";

  link.append(text, logo);
  footer.append(link);
  return footer;
}
