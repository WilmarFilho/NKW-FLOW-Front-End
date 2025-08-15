import Modal from '../components/Gerais/Modal/Modal';
import ChatSidebar from '../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../components/Conversas/ChatWindow/ChatWindow';
import NewChatForm from '../components/Conversas/NewChatForm/NewChatForm';
import { useConversasPage } from '../hooks/chats/useConversasPage';

export default function ConversasPage() {
  const state = useConversasPage();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', gap: '12px' }}>
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
          <NewChatForm
            connections={state.connections}
            selectedConnectionId={state.selectedConnectionId}
            setSelectedConnectionId={state.setSelectedConnectionId}
            newChatNumber={state.newChatNumber}
            setNewChatNumber={state.setNewChatNumber}
            newChatMessage={state.newChatMessage}
            setNewChatMessage={state.setNewChatMessage}
            showErrors={state.showErrors}
            errors={state.errors}
          />
        </Modal>
      )}
    </div>
  );
}