// Libs
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
import { useState } from 'react';
// Components
import Button from '../../components/Gerais/Buttons/Button';
import AgentCard from '../../components/Agentes/AgentCard/AgentCard';
import Modal from '../../components/Gerais/Modal/Modal';
// Recoil
import { agentsState, connectionsState } from '../../state/atom';
// Css
import GlobalStyles from '../../global.module.css';
import ModalStyles from '../../components/Gerais/Modal/Modal.module.css'
import AgentsStyles from './AgentsPage.module.css'
// Assets
import DownloadTextIcon from './assets/dowloadtext.svg'
import DownloadIcon from './assets/dowload.svg'

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

  // Dados mockados
  const status = 'Ruim'; // Pode ser 'Boa', 'Média' ou 'Ruim'
  const progressoMap: Record<string, number> = {
    'Boa': 100,
    'Média': 60,
    'Ruim': 42
  };
  const progresso = progressoMap[status];

  return (
    <div className={GlobalStyles.pageContainer}>
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

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={AgentsStyles.agentsList}
      >
        {agents.map((agent) => {
          return (
            <AgentCard
              key={agent.id}
              tipo={agent.tipo_de_agente}
              description={agent.descricao}
              onViewDetails={() => openModal(agent)}
            />
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={AgentsStyles.agentsFooter}
      >
        {/* Coluna Esquerda */}
        <div className={AgentsStyles.columnTitlesConhecimento}>
          <h4>Sua base de conhecimento é o coração da automação</h4>
          <p>
            Aqui reunimos tudo que a nossa IA sabe sobre o seu negócio. É a partir dessas
            informações que ela responde com precisão aos seus clientes. Mantenha-a atualizada
            para garantir que cada interação seja fiel à sua marca.
          </p>
          <div className={AgentsStyles.contentActions}>
            <button><DownloadTextIcon /></button>
            <button><DownloadIcon /></button>
          </div>
        </div>

        {/* Coluna Direita */}
        <div className={AgentsStyles.columnProgressConhecimento}>
          <div className={AgentsStyles.wrapperProgressConhecimento}>

            <h4>Sua base de conhecimento está: <strong>{status}</strong></h4>

            <div className={AgentsStyles.progressBarAgent}>

              <div
                className={`${AgentsStyles.progressFill} ${AgentsStyles[status.toLowerCase()]}`}
                style={{ width: `${progresso}%` }}
              >
                <span className={AgentsStyles.progressPercent}>{progresso}% completa</span>

              </div>

            </div>

          </div>
        </div>
      </motion.div>

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