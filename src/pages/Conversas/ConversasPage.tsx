// Css
import PageStyles from '../PageStyles.module.css';
// Components
import ChatSidebar from '../../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../../components/Conversas/ChatWindow/ChatWindow';
import Modal from '../../components/Gerais/ModalForm/Modal';
// Hook da Página
import { useConversasPage } from '../../hooks/chats/useConversasPage';

export default function ConversasPage() {
  const state = useConversasPage();

  return (
    <div className={PageStyles.conversationsContainer}>
      <ChatSidebar
        chats={state.chats}
        activeChat={state.activeChat}
        setActiveChat={state.setActiveChat}
        setIsAddChatOpen={state.setIsAddChatOpen}
      />

      <ChatWindow
        activeChat={state.activeChat}
        messages={state.messages}
        setActiveChat={state.setActiveChat}
      />

      {state.isAddChatOpen && (
        <Modal
          isOpen={state.isAddChatOpen}
          onClose={() => state.setIsAddChatOpen(false)}
          title="Começar nova conversa."
        >
          <div className={PageStyles.modalContent}>
            <div className={PageStyles.formGroup}>
              <label>Conexão para disparar mensagem</label>
              <select
                value={state.selectedConnectionId}
                className={PageStyles.formSelect}
                onChange={(e) => state.setSelectedConnectionId(e.target.value)}
              >
                <option value="">Selecione a conexão</option>
                {state.connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.nome || conn.id}
                  </option>
                ))}
              </select>
            </div>

            <div className={PageStyles.formGroup}>
              <label>Número de Telefone</label>
              <input
                type="text"
                placeholder="Número com DDD (ex: 11999999999)"
                value={state.newChatNumber}
                className={PageStyles.formInput}
                onChange={(e) => state.setNewChatNumber(e.target.value)}
              />
            </div>

            <div className={PageStyles.formGroup}>
              <label>Primeira Mensagem</label>
              <input
                placeholder="Primeira mensagem"
                className={PageStyles.formInput}
                value={state.newChatMessage}
                onChange={(e) => state.setNewChatMessage(e.target.value)}
              />
            </div>

            <div className={PageStyles.modalActions}>
              <button
                className={PageStyles.submitButton}
                onClick={state.handleSendMessage}
                disabled={
                  !state.newChatNumber ||
                  !state.newChatMessage ||
                  !state.selectedConnectionId
                }
              >
                Enviar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}