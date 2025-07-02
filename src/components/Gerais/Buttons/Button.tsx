import type { JSX } from "react";
import "./button.css";

// Interface para as propriedades do botão
interface ButtonProps {
  label: string;
  onClick: () => void;
}

export default function Button({ label, onClick }: ButtonProps): JSX.Element {
  return (
    <button onClick={onClick} className="add-button">
      {label}
    </button>
  );
}