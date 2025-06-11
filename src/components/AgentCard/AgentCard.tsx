import React from "react";
import "./agentCard.css";

interface AgentCardProps {
  name: string;
  description: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, description }) => {
  return (
    <div className="agent-card">
      <div className="agent-card-header">
        <h3>{name}</h3>
      </div>
      <p className="description">{description}</p>
    </div>
  );
};

export default AgentCard;
