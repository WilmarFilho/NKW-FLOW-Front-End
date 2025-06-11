import React from "react";
import "./agentCard.css";

interface AgentCardProps {
  name: string;
  status: string;
  description: string;
  onAccess: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, status, description, onAccess }) => {
  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <h3>{name}</h3>
        <span className="status">{status}</span>
      </div>
      <p className="description">{description}</p>
      <button className="access-btn" onClick={onAccess}>
        Acessar agente
      </button>
    </div>
  );
};

export default AgentCard;
