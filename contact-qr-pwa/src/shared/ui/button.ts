export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-on font-medium shadow-md hover:shadow-lg active:scale-[0.98] transition-all",
  secondary:
    "bg-transparent border border-outline text-text-primary hover:bg-surface-variant active:scale-[0.98] transition-all",
  ghost: "text-text-secondary hover:text-text-primary underline underline-offset-4",
};

interface ButtonOptions {
  label: string;
  variant?: ButtonVariant;
  type?: "button" | "submit";
  onClick?: () => void;
}

/** Crea un <button> con estilos consistentes. Componente puramente visual. */
export function createButton({ label, variant = "primary", type = "button", onClick }: ButtonOptions): HTMLButtonElement {
  const btn = document.createElement("button");
  btn.type = type;
  btn.textContent = label;
  btn.className = `w-full rounded-full py-3 px-6 text-center transition-transform ${VARIANT_CLASSES[variant]}`;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}
