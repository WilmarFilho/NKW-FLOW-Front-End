import './toggleSwitch.css';

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: () => void;
};

export default function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <div className={`toggle-switch ${isOn ? 'on' : 'off'}`} onClick={onToggle}>
      <div className="switch-knob" />
    </div>
  );
}
