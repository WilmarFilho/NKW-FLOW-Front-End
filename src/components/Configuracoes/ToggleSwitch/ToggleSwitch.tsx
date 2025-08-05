// CSS Modules
import styles from './ToggleSwitch.module.css';

type ToggleSwitchProps = {
  isOn: boolean;
  onToggle: () => void;
};

export default function ToggleSwitch({ isOn, onToggle }: ToggleSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      className={`${styles.toggleSwitch} ${isOn ? styles.on : styles.off}`}
      onClick={onToggle}
    >
      <div className={styles.switchKnob} />
    </button>
  );
}