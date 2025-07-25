import React from 'react';
import './agentCard.css';

interface AgentCardProps {
  name: string;
  tipo: string;
  description: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, description, tipo }) => {
  return (
    <div className="agent-card">
      <img src='https://avatars.githubusercontent.com/u/103720085?v=4' alt={name} className="avatar" />
      <h4>{name} - {tipo}</h4>
      <p className="description">{description}</p>
    </div>
  );
};

export default AgentCard;
