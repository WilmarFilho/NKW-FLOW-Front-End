// Css
import ConversasStyles from './ConversasPage.module.css'
import FormStyles from '../../components/Gerais/Form/form.module.css'
// Components
import ChatSidebar from '../../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../../components/Conversas/ChatWindow/ChatWindow';
import Modal from '../../components/Gerais/Modal/Modal';
// Hook da Página
import { useConversasPage } from '../../hooks/chats/useConversasPage';

export default function ConversasPage() {
  const state = useConversasPage();

  return (
    <div className={ConversasStyles.conversationsContainer}>
      <ChatSidebar
        chats={state.chats}
        activeChat={state.activeChat}
        setActiveChat={state.setActiveChat}
        setIsAddChatOpen={state.openNewChatModal}
        fectchImageProfile={state.fectchImageProfile}
      />

      <ChatWindow
        activeChat={state.activeChat}
        messages={state.messages}
        setActiveChat={state.setActiveChat}
      />

      {state.isAddChatOpen && (
        <Modal
          isOpen={state.isAddChatOpen}
          labelSubmit="Enviar"
          onSave={state.handleSendMessage}
          onClose={() => state.setIsAddChatOpen(false)}
          title="Começar nova conversa."
        >
          <div className={FormStyles.formContainer}>
            <div className={FormStyles.formGroup}>
              <label>Conexão para disparar mensagem</label>
              <select
                value={state.selectedConnectionId}
                onChange={(e) => state.setSelectedConnectionId(e.target.value)}
              >
                <option value="">Selecione a conexão</option>
                {state.connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.nome || conn.id}
                  </option>
                ))}
              </select>
              {state.showErrors && state.errors.selectedConnectionId && (
                <span className={FormStyles.errorText}>{state.errors.selectedConnectionId}</span>
              )}
            </div>

            <div className={FormStyles.formRow}>
              <div className={FormStyles.formGroup}>
                <label>Número de Telefone</label>
                <input
                  type="text"
                  placeholder="Número com DDD (ex: 11999999999)"
                  value={state.newChatNumber}
                  onChange={(e) => state.setNewChatNumber(e.target.value)}
                />
                {state.showErrors && state.errors.newChatNumber && (
                  <span className={FormStyles.errorText}>{state.errors.newChatNumber}</span>
                )}
              </div>

              <div className={FormStyles.formGroup}>
                <label>Primeira Mensagem</label>
                <input
                  placeholder="Primeira mensagem"
                  value={state.newChatMessage}
                  onChange={(e) => state.setNewChatMessage(e.target.value)}
                />
                {state.showErrors && state.errors.newChatMessage && (
                  <span className={FormStyles.errorText}>{state.errors.newChatMessage}</span>
                )}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}