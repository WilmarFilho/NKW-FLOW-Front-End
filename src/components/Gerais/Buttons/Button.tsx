//Css
import './button.css';

interface ButtonProps {
  label: string;
  onClick?: () => void | null;
}

export default function Button({ label, onClick }: ButtonProps) {
  return (
    <button onClick={onClick} className="add-button">
      {label}
    </button>
  );
}