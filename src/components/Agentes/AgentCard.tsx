import React from "react";
import "./agentCard.css";

interface AgentCardProps {
  name: string;
  description: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, description }) => {
  return (
    <div className="agent-card">
      <h3>{name}</h3>
      <p className="description">{description}</p>
    </div>
  );
};

export default AgentCard;
