// Libs
import { useState } from 'react';
import { useRecoilValue } from 'recoil';
// Recoil
import { agentsState, connectionsState } from '../../state/atom';

export function useAgentesPage() {

  // Carrega Conexões e Agentes
  const connections = useRecoilValue(connectionsState);
  const agents = useRecoilValue(agentsState);

  // Controle de modal de detalhes do agente
  const [selectedAgent, setSelectedAgent] = useState<typeof agents[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (agent: typeof agents[0]) => {
    setSelectedAgent(agent);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedAgent(null);
    setIsModalOpen(false);
  };

  const status: 'Boa' | 'Média' | 'Ruim' = 'Boa';

  return {
    connections,
    agents,
    selectedAgent,
    isModalOpen,
    openModal,
    closeModal,
    status,
  };
}