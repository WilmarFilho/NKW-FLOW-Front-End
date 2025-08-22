import { useEffect, useState } from 'react';
import Modal from '../components/Gerais/Modal/Modal';
import ChatSidebar from '../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../components/Conversas/ChatWindow/ChatWindow';
import NewChatForm from '../components/Conversas/NewChatForm/NewChatForm';
import { useConversasPage } from '../hooks/pages/useConversasPage';
import { DropdownMenuProvider } from '../components/Gerais/Dropdown/DropdownMenuContext';
import GlobalStyles from '../global.module.css';

export default function ConversasPage() {
  const state = useConversasPage();

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  useEffect(() => {
    const querySmall = window.matchMedia('(max-width: 991.98px)');
    const queryMobile = window.matchMedia('(max-width: 599.98px)');

    const setFlags = () => {
      setIsSmallScreen(querySmall.matches);
      setIsMobileLayout(queryMobile.matches);
    };

    setFlags();

    const handleSmall = (e: MediaQueryListEvent) => setIsSmallScreen(e.matches);
    const handleMobile = (e: MediaQueryListEvent) => setIsMobileLayout(e.matches);

    if ('addEventListener' in querySmall) {
      querySmall.addEventListener('change', handleSmall);
      queryMobile.addEventListener('change', handleMobile);
    } else {
      (querySmall as MediaQueryList).addListener(handleSmall);
      (queryMobile as MediaQueryList).addListener(handleMobile);
    }

    return () => {
      if ('removeEventListener' in querySmall) {
        querySmall.removeEventListener('change', handleSmall);
        queryMobile.removeEventListener('change', handleMobile);
      } else {
        (querySmall as MediaQueryList).removeListener(handleSmall);
        (queryMobile as MediaQueryList).removeListener(handleMobile);
      }
    };
  }, []);

  const handleBackToSidebar = () => state.setActiveChat(null);

  return (
    <div className={GlobalStyles.conversasContainer}>
      {isMobileLayout ? (
        state.activeChat ? (
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
              isSmallScreen={isSmallScreen}
              isMobileLayout={isMobileLayout}
              onBack={handleBackToSidebar}
              onReleaseChatOwner={state.handleReleaseChatOwner }
            />
          </DropdownMenuProvider>
        ) : (
          <ChatSidebar
            chats={state.chats}
            activeChat={state.activeChat}
            setActiveChat={state.setActiveChat}
            setIsAddChatOpen={state.openNewChatModal}
            fectchImageProfile={state.fectchImageProfile}
            connections={state.connections}
          />
        )
      ) : (
        <>
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
              isSmallScreen={isSmallScreen}
              isMobileLayout={isMobileLayout}
              onReleaseChatOwner={state.handleReleaseChatOwner }
            />
          </DropdownMenuProvider>
        </>
      )}

      {state.isAddChatOpen && (
        <Modal
          isOpen={state.isAddChatOpen}
          labelSubmit='Enviar'
          onSave={state.handleSendMessage}
          onClose={() => state.setIsAddChatOpen(false)}
          title='Começar nova conversa.'
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