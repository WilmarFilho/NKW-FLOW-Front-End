import React from 'react';
import AgentCard from '../../components/Agentes/AgentCard/AgentCard';
import { useAgents } from '../../hooks/useAgents';
import './agentesPage.css';
import Button from '../../components/Gerais/Buttons/Button';
import { motion } from 'framer-motion';

const AgentesPage: React.FC = () => {

  const { agents, loading, error } = useAgents();



  if (loading) {
    return '';
  }

  if (error) {
    return <div className="feedback-message error">Erro ao carregar: {error}</div>;
  }

  return (
    <div className="agents-container">

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="agents-header"


      >


        <div>
          <h2>Vejas seus agentes disponíveis</h2>
          <h3>
            Para contratar mais agentes entre em contato.
          </h3>
        </div>

        <Button label='Entre em Contato' />



      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="agents-list"


      >
        {agents.map((agent) => (

          <AgentCard
            tipo={agent.tipo_de_agente}
            key={agent.id}
            name={agent.nome}
            description={agent.descricao}

          />

        ))}


      </motion.div>

    </div>
  );
};

export default AgentesPage;
