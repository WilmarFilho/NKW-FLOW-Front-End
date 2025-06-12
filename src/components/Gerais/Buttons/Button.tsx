import "./button.css";

interface ButtonProps {
  label: string;
}

export default function Button({ label }: ButtonProps) {
  return (
    <div className="wrapper-button">
      <button className="add-button"> {label} </button>
    </div>
  );
}
