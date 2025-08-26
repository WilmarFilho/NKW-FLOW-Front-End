// Libs
import { motion } from 'framer-motion';
// Components
import Button from '../components/Gerais/Buttons/Button';
import Modal from '../components/Gerais/Modal/Modal';
import AgentList from '../components/Agentes/AgentList/AgentList';
import KnowledgeBaseInfo from '../components/Agentes/KnowledgeBaseInfo/KnowledgeBaseInfo';
// Hooks
import { useAgentesPage } from '../hooks/pages/useAgentesPage';
// Css
import GlobalStyles from '../global.module.css';
import ModalStyles from '../components/Gerais/Modal/Modal.module.css';
// Type
import { Connection } from '@/types/connection';

export default function AgentesPage() {

  const state = useAgentesPage();

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

        <Button
          onClick={() => window.open('https://www.instagram.com/nkw_tech/', '_blank')}
          label='Entre em Contato'
        />

      </motion.div>

      {/* Lista de Agentes */}
      <AgentList agents={state.agents} onSelectAgent={state.openModal} />

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
          padding: '26px 20px',
        }}
      >

        <KnowledgeBaseInfo status={state.status} />

      </motion.div>

      {/* Modal de Detalhes */}
      {state.selectedAgent && (
        <Modal
          isOpen={state.isModalOpen}
          onClose={state.closeModal}
          title={`Detalhes do Agente - ${state.selectedAgent.tipo_de_agente}`}
          onSave={state.closeModal}
        >
          <div className={ModalStyles.agentModal}>
            <p>{state.selectedAgent.descricao}</p>
            <h3>Conexões vinculadas:</h3>
            {state.connections.filter((conn: Connection) => conn.agente_id === state.selectedAgent!.id).length > 0 ? (
              <ul>
                {state.connections
                  .filter((conn: Connection) => conn.agente_id === state.selectedAgent!.id)
                  .map((conn: Connection) => (
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
