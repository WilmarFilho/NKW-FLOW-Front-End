import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import Modal from '../components/Gerais/Modal/Modal';
import ChatSidebar from '../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../components/Conversas/ChatWindow/ChatWindow';
import NewChatForm from '../components/Conversas/NewChatForm/NewChatForm';
import { useConversasPage } from '../hooks/pages/useConversasPage';
import { DropdownMenuProvider } from '../components/Gerais/Dropdown/DropdownMenuContext';
import GlobalStyles from '../global.module.css';
import SearchBar from '../components/Conversas/SearchBar/Searchbar';
import { chatFiltersState } from '../state/atom';

export default function ConversasPage() {
  // Hook da Página
  const state = useConversasPage();

  // Estado para tamanho de tela
  const [isMobileLayout, setIsMobileLayout] = useState(false);

  // Filtro de input (usado nos modais)
  const [searchQuery, setSearchQuery] = useState('');

  // Modais de seleção para filtro (UI local)
  const [isConnectionsModalOpen, setIsConnectionsModalOpen] = useState(false);
  const [isAttendantsModalOpen, setIsAttendantsModalOpen] = useState(false);

  // Recoil setter para filtros centralizados
  const setFilters = useSetRecoilState(chatFiltersState);

  // Detecta tamanho de tela
  useEffect(() => {
    const queryMobile = window.matchMedia('(max-width: 991.98px)');

    const setFlags = () => {
      setIsMobileLayout(queryMobile.matches);
    };

    setFlags();

    const handleMobile = (e: MediaQueryListEvent) => setIsMobileLayout(e.matches);

    if ('addEventListener' in queryMobile) {
      queryMobile.addEventListener('change', handleMobile);
    } else {
      (queryMobile as MediaQueryList).addListener(handleMobile);
    }

    return () => {
      if ('removeEventListener' in queryMobile) {
        queryMobile.removeEventListener('change', handleMobile);
      } else {
        (queryMobile as MediaQueryList).removeListener(handleMobile);
      }
    };
  }, []);

  // Volta para ChatBar
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
              isMobileLayout={isMobileLayout}
              onBack={handleBackToSidebar}
              onReleaseChatOwner={state.handleReleaseChatOwner}
              isDeleteDialogOpen={state.isDeleteDialogOpen}
              setIsDeleteDialogOpen={state.setIsDeleteDialogOpen}
              cancelRef={state.cancelRef}
            />
          </DropdownMenuProvider>
        ) : (
          <ChatSidebar
            fetchChats={state.fetchChats}
            chats={state.chats}
            attendants={state.attendants}
            activeChat={state.activeChat}
            setActiveChat={state.setActiveChat}
            isMobileLayout={isMobileLayout}
            setIsAddChatOpen={state.openNewChatModal}
            fectchImageProfile={state.fetchImageProfile}
            connections={state.connections}
            selectedConnectionId={state.filterConnectionId}
            setSelectedConnectionId={state.setFilterConnectionId}
            selectedAttendantId={state.selectedAttendantId}
            setSelectedAttendantId={state.setSelectedAttendantId}
            openConnectionsModal={() => setIsConnectionsModalOpen(true)}
            openAttendantsModal={() => setIsAttendantsModalOpen(true)}
            // Novos props
            fetchMoreChats={state.fetchMoreChats}
            hasMore={state.hasMoreChats}
            loading={state.isLoadingChats}
          />
        )
      ) : (
        <>
          <ChatSidebar
            fetchChats={state.fetchChats}
            chats={state.chats}
            attendants={state.attendants}
            activeChat={state.activeChat}
            setActiveChat={state.setActiveChat}
            isMobileLayout={isMobileLayout}
            setIsAddChatOpen={state.openNewChatModal}
            fectchImageProfile={state.fetchImageProfile}
            connections={state.connections}
            // manter compatibilidade enquanto refatora ChatSidebar
            selectedConnectionId={state.filterConnectionId}
            setSelectedConnectionId={state.setFilterConnectionId}
            selectedAttendantId={state.selectedAttendantId}
            setSelectedAttendantId={state.setSelectedAttendantId}
            openConnectionsModal={() => setIsConnectionsModalOpen(true)}
            openAttendantsModal={() => setIsAttendantsModalOpen(true)}
            // Novos props
            fetchMoreChats={state.fetchMoreChats}
            hasMore={state.hasMoreChats}
            loading={state.isLoadingChats}
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
              isMobileLayout={isMobileLayout}
              onBack={handleBackToSidebar}
              onReleaseChatOwner={state.handleReleaseChatOwner}
              isDeleteDialogOpen={state.isDeleteDialogOpen}
              setIsDeleteDialogOpen={state.setIsDeleteDialogOpen}
              cancelRef={state.cancelRef}
            />
          </DropdownMenuProvider>
        </>
      )}

      {/* Modal Nova Conversa */}
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
            selectedConnectionId={state.formConnectionId}
            setSelectedConnectionId={state.setFormConnectionId}
            newChatNumber={state.newChatNumber}
            setNewChatNumber={state.setNewChatNumber}
            newChatMessage={state.newChatMessage}
            setNewChatMessage={state.setNewChatMessage}
            showErrors={state.showErrors}
            errors={state.errors}
          />
        </Modal>
      )}

      {/* Modal Seleção de Conexão */}
      <Modal
        isOpen={isConnectionsModalOpen}
        title="Escolha uma conexão"
        onClose={() => setIsConnectionsModalOpen(false)}
      >
        <div className={GlobalStyles.wrapperModalFilter}>
          <SearchBar onSearch={setSearchQuery} placeholder="Buscar conexão..." />
          <div className={GlobalStyles.wrapperFilterItens}>
            {state.connections
              .filter(conn => !searchQuery || conn.nome?.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(conn => (
                <div
                  className={GlobalStyles.filterItens}
                  key={conn.id}
                  onClick={() => {
                    // atualiza filtro centralizado no Recoil
                    setFilters(prev => ({
                      ...prev,
                      connection_id: conn.id,
                      attendant_id: undefined, // zera atendente quando escolhe conexão
                    }));
                    setIsConnectionsModalOpen(false);
                  }}
                >
                  {conn.nome}
                </div>
              ))}
          </div>
        </div>
      </Modal>

      {/* Modal Seleção de Atendente */}
      <Modal
        isOpen={isAttendantsModalOpen}
        title="Escolha um atendente"
        onClose={() => setIsAttendantsModalOpen(false)}
      >
        <div className={GlobalStyles.wrapperModalFilter}>
          <SearchBar onSearch={setSearchQuery} placeholder="Buscar atendente..." />
          <div className={GlobalStyles.wrapperFilterItens}>
            {state.attendants
              .filter(att => !searchQuery || att.user.nome.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(att => (
                <div
                  className={GlobalStyles.filterItens}
                  key={att.id}
                  onClick={() => {
                    // atualiza filtro centralizado no Recoil
                    setFilters(prev => ({
                      ...prev,
                      attendant_id: att.user_id,
                      connection_id: undefined, // zera conexão quando escolhe atendente
                    }));
                    setIsAttendantsModalOpen(false);
                  }}
                >
                  {att.user.nome}
                </div>
              ))}
          </div>
        </div>
      </Modal>
    </div>
  );
}
