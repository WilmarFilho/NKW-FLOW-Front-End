import Modal from '../components/Gerais/Modal/Modal';
import ChatSidebar from '../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../components/Conversas/ChatWindow/ChatWindow';
import NewChatForm from '../components/Conversas/NewChatForm/NewChatForm';
import { useConversasPage } from '../hooks/pages/useConversasPage';
import { DropdownMenuProvider } from '../components/Gerais/Dropdown/DropdownMenuContext';
import GlobalStyles from '../global.module.css'

export default function ConversasPage() {
  const state = useConversasPage();

  return (
    <div className={GlobalStyles.conversasContainer}>
      <ChatSidebar
        chats={state.chats}
        activeChat={state.activeChat}
        setActiveChat={state.setActiveChat}
        setIsAddChatOpen={state.openNewChatModal}
        fectchImageProfile={state.fectchImageProfile}
        connections={state.connections}
      />
      <DropdownMenuProvider>
        <ChatWindow
          activeChat={state.activeChat}
          onDeleteMessage={state.handleDeleteMessage}
          messages={state.messages}
          onSendMessage={state.handleSendMessage}
          onToggleIA={state.handleToggleIA}
          onDeleteChat={state.handleDeleteChat}
          onToggleChatStatus={state.handleToggleChatStatus}
          onRenameChat={state.handleRenameChat}
          onDropFile={state.handleFileDrop}
          onSetReplyingTo={state.setReplyingTo}
          replyingTo={state.replyingTo}
          isExiting={state.isExiting}
          setIsExiting={state.setIsExiting}
          handleCloseReply={state.handleCloseReply}
          fetchMoreMessages={state.fetchMoreMessages}
          hasMore={state.hasMore}
          isLoading={state.isLoading}
        />
      </DropdownMenuProvider>

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