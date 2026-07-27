interface FieldOptions {
  id: string;
  label: string;
  placeholder?: string;
  type?: string;
  value?: string;
}

/**
 * Crea un contenedor <div> con <label> + <input>.
 * Devuelve tanto el wrapper (para insertar en el DOM) como el propio
 * <input> (para leer su valor sin tener que hacer querySelector después).
 */
export function createField({ id, label, placeholder, type = "text", value = "" }: FieldOptions): {
  wrapper: HTMLDivElement;
  input: HTMLInputElement;
} {
  const wrapper = document.createElement("div");
  wrapper.className = "flex flex-col gap-1.5";

  const labelEl = document.createElement("label");
  labelEl.htmlFor = id;
  labelEl.textContent = label;
  labelEl.className = "text-sm font-medium text-text-secondary ml-1";

  const input = document.createElement("input");
  input.id = id;
  input.name = id;
  input.type = type;
  input.placeholder = placeholder ?? "";
  input.value = value;
  input.autocomplete = "off";
  input.className =
    "rounded-xl bg-transparent border border-outline px-4 py-3 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all";

  wrapper.append(labelEl, input);
  return { wrapper, input };
}
