import "./button.css"

interface ButtonProps {
    label: string;
}

export default function Button( {label} : ButtonProps ) {
  return (
    <button className="add-button"> {label} </button>
  );
}
