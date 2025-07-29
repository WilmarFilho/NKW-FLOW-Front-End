//Css
import './agentCard.css';

interface AgentCardProps {
  name: string;
  tipo: string;
  description: string;
  connections?: string[];
}

export default function AgentCard({ name, description, tipo, connections }: AgentCardProps) {
  return (
    <div className="agent-card">
      <img src='https://avatars.githubusercontent.com/u/103720085?v=4' alt={name} className="avatar" />
      <h4>{name} - {tipo}</h4>
      <p className="description">{description}</p>
      {connections && connections.length > 0 && (
          <ul>
            {connections.map((connName, index) => (
              <li className='agent-bullet' key={index}>{connName}</li>
            ))}
          </ul>   
      )}
    </div>
  );
};
