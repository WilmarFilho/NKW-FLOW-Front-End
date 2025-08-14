import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';

// Components
import Button from '../components/Gerais/Buttons/Button';
import Modal from '../components/Gerais/Modal/Modal';
import AgentList from '../components/Agentes/AgentList/AgentList';
import KnowledgeBaseInfo from '../components/Agentes/KnowledgeBaseInfo/KnowledgeBaseInfo';
import KnowledgeBaseProgress from '../components/Agentes/KnowledgeBaseProgress/KnowledgeBaseProgress';

// Recoil
import { agentsState, connectionsState } from '../state/atom';

// Css
import GlobalStyles from '../../global.module.css';
import ModalStyles from '../../components/Gerais/Modal/Modal.module.css';

export default function AgentesPage() {
  const connections = useRecoilValue(connectionsState);
  const agents = useRecoilValue(agentsState);

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

  const status: 'Boa' | 'Média' | 'Ruim' = 'Ruim';

  return (
    <div className={GlobalStyles.pageContainer}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={GlobalStyles.pageHeader}
      >
        <div className={GlobalStyles.pageHeaderTitles}>
          <h2>Vejas seus agentes disponíveis</h2>
          <h3>
            Ao adicionar uma nova conexão você seleciona um desses para responder por você. Para contratar mais agentes entre em contato.
          </h3>
        </div>
        <Button label="Entre em Contato" />
      </motion.div>

      {/* Lista de Agentes */}
      <AgentList agents={agents} onSelectAgent={openModal} />

      {/* Rodapé */}
      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
          backgroundColor: 'var(--color-background-dark)',
          flex: 1,
          borderRadius: '16px',
          padding: '50px 40px'
        }}
      >
        <KnowledgeBaseInfo />
        <KnowledgeBaseProgress status={status} />
      </motion.div>

      {/* Modal de Detalhes */}
      {selectedAgent && (
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={`Detalhes do Agente - ${selectedAgent.tipo_de_agente}`}
          onSave={closeModal}
        >
          <div className={ModalStyles.agentModal}>
            <p>{selectedAgent.descricao}</p>
            <h3>Conexões vinculadas:</h3>
            {connections.filter(conn => conn.agente_id === selectedAgent.id).length > 0 ? (
              <ul>
                {connections
                  .filter(conn => conn.agente_id === selectedAgent.id)
                  .map((conn) => (
                    <li className={ModalStyles.liConnection} key={conn.id}>{conn.nome}</li>
                  ))}
              </ul>
            ) : (
              <span>Nenhuma conexão vinculada.</span>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}