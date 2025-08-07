// Libbs
import { motion } from 'framer-motion';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import AgentCard from '../../components/Agentes/AgentCard/AgentCard';
// Hooks
import { useAgents } from '../../hooks/agents/useAgents';
import { useConnections } from '../../hooks/connections/useConnections';

// Css
import PageStyles from '../PageStyles.module.css'

export default function AgentesPage() {

  const { agents } = useAgents();
  const { connections } = useConnections();

  return (
    <div className={PageStyles.container}>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.containerHeader}
      >
        <div className={PageStyles.headerTitles}>
          <h2>Vejas seus agentes disponíveis</h2>
          <h3>
            Ao adicionar uma nova conexão você seleciona um desses para responder por você. Para contratar mais agentes entre em contato.
          </h3>
        </div>
        <Button label='Entre em Contato' />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.agentsList}
      >
        {agents.map((agent) => {
          const connectionsForAgent = connections.filter(conn => conn.agente_id === agent.id);
          const connectionNames = connectionsForAgent.map(conn => conn.nome.split('_')[0]);

          return (
            <AgentCard
              key={agent.id}
              tipo={agent.tipo_de_agente}
              description={agent.descricao}
              connections={connectionNames}
            />
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.agentsWrapper}
      >

        <h2>Informações da base de conhecimento do cliente</h2>
        <h3>
          Mostrar Qualidade do Treinamento, botão para solicitar novos treinamentos ...
        </h3>
      </motion.div>

    </div>
  );
};


