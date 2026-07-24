export type ButtonVariant = "primary" | "secondary" | "ghost";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-brand-accent text-brand-bg font-semibold hover:opacity-90 active:scale-[0.98]",
  secondary:
    "bg-white/10 text-white font-medium hover:bg-white/20 active:scale-[0.98]",
  ghost: "text-white/70 hover:text-white underline underline-offset-4",
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
  btn.className = `w-full rounded-xl py-3 px-4 transition-transform ${VARIANT_CLASSES[variant]}`;
  if (onClick) btn.addEventListener("click", onClick);
  return btn;
}
