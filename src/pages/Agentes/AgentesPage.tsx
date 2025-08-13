import { motion } from 'framer-motion';
import Button from '../../components/Gerais/Buttons/Button';
import AgentCard from '../../components/Agentes/AgentCard/AgentCard';
import Modal from '../../components/Gerais/Modal/Modal';
import { useRecoilValue } from 'recoil';
import { agentsState, connectionsState } from '../../state/atom';
import { useState } from 'react';
import PageStyles from '../PageStyles.module.css';
import ModalStyles from '../../components/Gerais/Modal/Modal.module.css'
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

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
        <Button label="Entre em Contato" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className={PageStyles.agentsList}
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
        className={PageStyles.agentsWrapper}
      >

        <div className={PageStyles.columnFooterAgent}>
          <h4>Informações da sua base de conhecimento:</h4>
          <p>Veja o resumo do que entendemos do seu negocio ou baixe os seus arquivos anexados que usamos de base para responder seus clientes, caso veja algo divergente do seu negocio entre em contato conosco.</p>
          <div className={PageStyles.contentActionFooter}>
            <button>Texto</button>
            <button>Arquivos</button>
          </div>
        </div>
        <div className={PageStyles.columnFooterAgent}>
          <div className={PageStyles.boxQualidadeConhecimento}> </div>
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
