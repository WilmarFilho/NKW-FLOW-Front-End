import React from "react";
import AgentCard from "../../components/Agentes/AgentCard";
import "./agentesPage.css";

const AgentesPage: React.FC = () => {

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h2>Vejas seus agentes disponíveis</h2>
        <p>
          Para contratar mais agentes entre em contato.
        </p>
      </div>

      <div className="agents-list">
        <AgentCard
          name="Wilmar Bot"
          description="O Wilmar Bot é um agente de atendimento automatizado desenvolvido para responder dúvidas frequentes e otimizar o tempo da sua equipe."
        />

        <AgentCard
          name="Wilmar Bot"
          description="O Wilmar Bot é um agente de atendimento automatizado desenvolvido para responder dúvidas frequentes e otimizar o tempo da sua equipe."
        />

        <AgentCard
          name="Wilmar Bot"
          description="O Wilmar Bot é um agente de atendimento automatizado desenvolvido para responder dúvidas frequentes e otimizar o tempo da sua equipe."
        />
      </div>
    </div>
  );
};

export default AgentesPage;
