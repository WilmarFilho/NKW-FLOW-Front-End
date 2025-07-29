//Css
import './tag.css';

interface TagProps {
  label: string;
  active?: boolean;
}

export default function Tag({ label, active = false } : TagProps) {
  return (
    <span className={`tag ${active ? 'active' : ''}`}>
      {label}
    </span>
  );
};