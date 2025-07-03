import React from "react";
import AgentCard from "../../components/Agentes/AgentCard/AgentCard";
import { useAgents } from "../../hooks/useAgents";
import "./agentesPage.css";

const AgentesPage: React.FC = () => {

  /*const { agents, loading, error } = useAgents();

  if (loading) {
    return <div className="feedback-message">Carregando agentes...</div>;
  }

  if (error) {
    return <div className="feedback-message error">Erro ao carregar: {error}</div>;
  }*/

  const agents = [

    {id: 2, 'nome' : 'Wilmar Filho', 'descricao': 'teste'},
    {id: 2, 'nome' : 'Wilmar Filho', 'descricao': 'teste'}

  ]

  return (
    <div className="agents-container">
      <div className="agents-header">
        <h2>Vejas seus agentes disponíveis</h2>
        <h3>
          Para contratar mais agentes entre em contato.
        </h3>
      </div>

      <div className="agents-list">

        {agents.map((agent) => (
          <AgentCard
            key={agent.id} 
            name={agent.nome}
            description={agent.descricao}
            
          />
        ))}

      </div>
    </div>
  );
};

export default AgentesPage;
