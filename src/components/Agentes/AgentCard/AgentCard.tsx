//Css
import './agentCard.css';

interface AgentCardProps {
  name: string;
  tipo: string;
  description: string;
}

export default function AgentCard({ name, description, tipo } : AgentCardProps) {
  return (
    <div className="agent-card">
      <img src='https://avatars.githubusercontent.com/u/103720085?v=4' alt={name} className="avatar" />
      <h4>{name} - {tipo}</h4>
      <p className="description">{description}</p>
    </div>
  );
};
