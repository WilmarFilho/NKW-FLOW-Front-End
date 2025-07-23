import React from 'react';
import AgentCard from '../../components/Agentes/AgentCard/AgentCard';
import { useAgents } from '../../hooks/useAgents';
import './agentesPage.css';
import Button from '../../components/Gerais/Buttons/Button';

const AgentesPage: React.FC = () => {

  const { agents, loading, error } = useAgents();



  if (loading) {
    return <div className="feedback-message">Carregando agentes...</div>;
  }

  if (error) {
    return <div className="feedback-message error">Erro ao carregar: {error}</div>;
  }

  return (
    <div className="agents-container">
      <div className="agents-header">
        <div>
          <h2>Vejas seus agentes disponíveis</h2>
          <h3>
            Para contratar mais agentes entre em contato.
          </h3>
        </div>

        <Button label='Entre em Contato' />

      </div>

      <div className="agents-list">

        {agents.map((agent) => (

          <AgentCard
            tipo={agent.tipo_de_agente}
            key={agent.id}
            name='Carlos'
            description={agent.descricao}

          />

        ))}

        <AgentCard
          key='30'
          name='Daniel'
          description='Agente para responde sobre juridico'
          tipo='Vendedor'

        />


        <AgentCard
          key='31'
          name='Fernanda'
          description='Agente para responde sobre marketing'
          tipo='Recepcionista'

        />

        <AgentCard
          key='32'
          name='Vitor'
          description='Agente para responde sobre vendas'
          tipo='Vendedor'

        />

        <AgentCard
          key='33'
          name='Max'
          description='Agente para responde sobre juridico'
          tipo='Recepcionista'

        />

        <AgentCard
          key='34'
          name='Daniel'
          description='Agente para responde sobre juridico'
          tipo='Vendedor'

        />

        <AgentCard
          key='32'
          name='Vitor'
          description='Agente para responde sobre vendas'
          tipo='Vendedor'

        />

        <AgentCard
          key='33'
          name='Max'
          description='Agente para responde sobre juridico'
          tipo='Recepcionista'

        />

        <AgentCard
          key='34'
          name='Daniel'
          description='Agente para responde sobre juridico'
          tipo='Vendedor'

        />



      </div>
    </div>
  );
};

export default AgentesPage;
