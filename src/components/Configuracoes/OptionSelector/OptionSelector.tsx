import './optionSelector.css';

type OptionSelectorProps = {
  options: string[];
  selected: string;
  onChange: (value: string) => void;
};

export default function OptionSelector({ options, selected, onChange }: OptionSelectorProps) {
  return (
    <div className="option-selector">
      {options.map((opt) => (
        <button
          key={opt}
          className={`option-btn ${selected === opt ? 'active' : ''}`}
          onClick={() => onChange(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
