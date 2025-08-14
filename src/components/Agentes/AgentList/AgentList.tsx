// Libs
import { motion } from 'framer-motion';
// Component
import AgentCard from '../AgentCard/AgentCard';
// Css
import Style from './AgentList.module.css';
// Type
import type { Agent } from '../../../types/agent';

interface AgentListProps {
  agents: Agent[];
  onSelectAgent: (agent: Agent) => void;
}

export default function AgentList({ agents, onSelectAgent }: AgentListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
      className={Style.agentsList}
    >
      {agents.map((agent) => (
        <AgentCard
          key={agent.id}
          tipo={agent.tipo_de_agente}
          description={agent.descricao}
          onViewDetails={() => onSelectAgent(agent)}
        />
      ))}
    </motion.div>
  );
}