import React from "react";
import AgentCard from "../../components/AgentCard/AgentCard";
import "./agentesPage.css";

const AgentesPage: React.FC = () => {
  const handleAccessAgent = () => {
    alert("Agente acessado!");
  };

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h2>Gerencie os seus agentes</h2>
        <p>
          Seus agentes são inteligência artificial capaz de atender de forma automatizada os seus clientes.
        </p>
      </div>

      <div className="agents-list">
        <AgentCard
          name="Wilmar Bot"
          status="em teste"
          description="O Wilmar Bot é um agente de atendimento automatizado desenvolvido para responder dúvidas frequentes e otimizar o tempo da sua equipe."
          onAccess={handleAccessAgent}
        />
      </div>
    </div>
  );
};

export default AgentesPage;
