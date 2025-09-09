// Libs
import React, { useState, useMemo, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
// Hooks
import { useDebounce } from '../../../hooks/utils/useDebounce';
// Components
import SearchBar from '../SearchBar/Searchbar';
import Tag from '../Tags/Tag';
import ChatListItem from '../ChatListItem/ChatListItem';
// Types
import { Chat } from '../../../types/chats';
// CSS Modules
import styles from './ChatSideBar.module.css';
// Atom
import { userState } from '../../../state/atom';
// Icons
import Icon from '../../../components/Gerais/Icons/Icons';
import { Attendant } from '../../../types/attendant';

interface ChatSidebarProps {
  chats: Chat[];
  attendants: Attendant[];
  connections: { id: string; nome?: string }[];
  isMobileLayout: boolean;
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  setIsAddChatOpen: (value: boolean) => void;
  fectchImageProfile: (chatId: string) => Promise<Chat | null>;
  selectedConnectionId: string | null;
  setSelectedConnectionId: (id: string | null) => void;
  selectedAttendantId: string | null;
  setSelectedAttendantId: (id: string | null) => void;
  openConnectionsModal: () => void;
  openAttendantsModal: () => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

function filterChats(
  chats: Chat[],
  query: string,
  selectedConnectionId: string | null,
  iaStatusFilter: 'todos' | 'ativa' | 'desativada',
  statusFilter: 'Open' | 'Close',
  ownerFilter: 'all' | 'mine',
  currentUserId: string | null,
  selectedAttendantId: string | null
) {
  const lowerQuery = query.toLowerCase();

  return chats.filter((chat) => {
    const matchesSearch =
      chat.contato_nome?.toLowerCase().includes(lowerQuery) ||
      chat.contato_numero?.includes(lowerQuery);

    const matchesConnection = selectedConnectionId
      ? chat.connection.id === selectedConnectionId
      : true;

    const matchesIAStatus =
      iaStatusFilter === 'todos'
        ? true
        : iaStatusFilter === 'ativa'
          ? chat.ia_ativa
          : !chat.ia_ativa;

    const matchesStatus = chat.status === statusFilter;

    const matchesOwner =
      ownerFilter === 'all'
        ? true
        : chat.user_id === currentUserId;

    const matchesAttendant = selectedAttendantId
      ? chat.user_id === selectedAttendantId
      : true;

    return (
      matchesSearch &&
      matchesConnection &&
      matchesIAStatus &&
      matchesStatus &&
      matchesOwner &&
      matchesAttendant
    );
  });
}

function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  setIsAddChatOpen,
  fectchImageProfile,
  isMobileLayout,
  connections,
  attendants,
  selectedConnectionId,
  setSelectedConnectionId,
  selectedAttendantId,
  setSelectedAttendantId,
  openConnectionsModal,
  openAttendantsModal,
}: ChatSidebarProps) {
  const [iaStatusFilter, setIaStatusFilter] = useState<'todos' | 'ativa' | 'desativada'>('todos');
  const [statusFilter, setStatusFilter] = useState<'Open' | 'Close'>('Open');
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);

  const user = useRecoilValue(userState);
  const currentUserId = user?.id ? user.id : null;

  const filteredChats = useMemo(() => {
    const effectiveIaFilter =
      statusFilter === 'Close' || ownerFilter === 'mine'
        ? 'desativada'
        : iaStatusFilter;

    return filterChats(
      chats,
      debouncedSearch,
      selectedConnectionId,
      effectiveIaFilter,
      statusFilter,
      ownerFilter,
      currentUserId,
      selectedAttendantId
    );
  }, [
    chats,
    debouncedSearch,
    selectedConnectionId,
    iaStatusFilter,
    statusFilter,
    ownerFilter,
    currentUserId,
    selectedAttendantId,
  ]);

  const toggleStatusFilter = useCallback(() => {
    setStatusFilter((prev) => (prev === 'Open' ? 'Close' : 'Open'));
  }, []);

  const toggleOwnerFilter = useCallback(() => {
    setOwnerFilter((prev) => (prev === 'all' ? 'mine' : 'all'));
  }, []);

  const handleConnectionSelect = useCallback((connectionId: string | null) => {
    setSelectedConnectionId(connectionId);
    setSelectedAttendantId(null); // reset se trocar conexão
  }, [setSelectedConnectionId, setSelectedAttendantId]);

  const handleAttendantSelect = useCallback((attendantId: string | null) => {
    setSelectedAttendantId(attendantId);
    setSelectedConnectionId(null); // reset se trocar atendente
  }, [setSelectedAttendantId, setSelectedConnectionId]);

  return (
    <motion.aside
      className={styles.chatSidebar}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className={styles.wrapperSearchBar}>
        <SearchBar onSearch={setSearchQuery} />
        <button onClick={() => setIsAddChatOpen(true)} className={styles.buttonAddChat}>
          <Icon nome="addchat" />
        </button>
      </div>

      {/* Filtro IA */}
      <div className={styles.iaFilterContainer}>
        {statusFilter === 'Open' && ownerFilter === 'all' ? (
          ['ativa', 'desativada'].map((status) => (
            <button
              key={status}
              type="button"
              data-label={status === 'ativa' ? 'Agente Ativado' : 'Agente Desativado'}
              data-label-short={status === 'ativa' ? 'IA Ligada' : 'IA Desligada'}
              className={`${styles.ChatFilterButton} ${iaStatusFilter === status ? styles.active : ''}`}
              onClick={() =>
                setIaStatusFilter((prev) =>
                  prev === status ? 'todos' : (status as 'ativa' | 'desativada')
                )
              }
            >
            </button>
          ))
        ) : (
          <button
            type="button"
            data-label={'Agente Desativado'}
            data-label-short={'IA Desligada'}
            className={`${styles.ChatFilterButton} ${styles.active}`}
            onClick={() => setIaStatusFilter('desativada')}
          >
          </button>
        )}
      </div>

      {/* Conexões */}
      {!isMobileLayout && !selectedAttendantId && (
        (() => {
          // Se for atendente → só mostra a conexão fixa dele
          if (user?.tipo_de_usuario === 'atendente' && user?.connection_id) {
           
            const connectionNome = user?.connection_nome

            return (
              <div
                className={`${styles.ChatFilterButton} ${styles.active}`}
                data-label={connectionNome}
              />
            );
          }

          // Se for admin → pode abrir modal de conexões
          const connectionLabel = selectedConnectionId
            ? connections.find(c => c.id === selectedConnectionId)?.nome || 'Conexão selecionada'
            : 'Escolha uma conexão';

          return (
            <button
              className={`${styles.ChatFilterButton} ${selectedConnectionId ? styles.active : ''}`}
              data-label={connectionLabel}
              onClick={() => {
                if (selectedConnectionId) {
                  handleConnectionSelect(null);
                } else {
                  openConnectionsModal();
                }
              }}
            >
              {selectedConnectionId && <Icon nome="close" />}
            </button>
          );
        })()
      )}

      {/* Tags mobile */}
      {isMobileLayout && (
        <div className={styles.tagsContainer}>
          <Tag
            label="Todas"
            active={selectedConnectionId === null && selectedAttendantId === null}
            onClick={() => {
              setSelectedConnectionId(null);
              setSelectedAttendantId(null);
            }}
          />
          {connections.map((connection) => (
            <Tag
              key={connection.id}
              label={connection.nome}
              active={selectedConnectionId === connection.id}
              onClick={() => handleConnectionSelect(connection.id)}
            />
          ))}
        </div>
      )}

      {/* Lista chats */}
      <div className={styles.chatList}>
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            unreadCount={chat.unread_count}
            mensagemData={chat.mensagem_data}
            chatId={chat.id}
            isActive={activeChat?.id === chat.id}
            name={chat.contato_nome}
            message={chat.ultima_mensagem}
            avatar={chat.foto_perfil}
            fectchImageProfile={fectchImageProfile}
            onClick={() => setActiveChat(chat)}
          />
        ))}
      </div>

      {/* Toggles */}
      <div className={styles.statusToggleContainer}>
        <button
          className={styles.ChatFilterButton}
          onClick={toggleStatusFilter}
          data-label={statusFilter === 'Open' ? 'Exibindo: Chats Abertos' : 'Exibindo: Chats Fechados'}
          data-label-short={statusFilter === 'Open' ? 'Abertos' : 'Fechados'}
        />
        
          <button
            className={styles.ChatFilterButton}
            onClick={toggleOwnerFilter}
            data-label={ownerFilter === 'all' ? 'Exibindo: Todos Chats' : 'Exibindo: Meus Chats'}
            data-label-short={ownerFilter === 'all' ? 'Todos' : 'Meus'}
          />
      
      </div>

      {/* Atendentes (desktop, admin) */}
      {!isMobileLayout && !selectedConnectionId && user?.tipo_de_usuario === 'admin' && attendants.length > 0 && (
        (() => {
      
          const attendantLabel = selectedAttendantId
            ? attendants.find(a => a.user_id === selectedAttendantId)?.user.nome || 'Atendente selecionado'
            : 'Escolha um atendente';

          return (
            <button
              className={`${styles.ChatFilterButton} ${selectedAttendantId ? styles.active : ''}`}
              data-label={attendantLabel}
              onClick={() => {
                if (selectedAttendantId) {
                  handleAttendantSelect(null);
                } else {
                  openAttendantsModal();
                }
              }}
            >
              {selectedAttendantId && (
                <>
                  <Icon nome="close" />
                </>
              )
              }
            </button>
          );
        })()
      )}

      {/* Atendentes tags (mobile, admin) */}
      {isMobileLayout && user?.tipo_de_usuario === 'admin' && attendants.length > 0 && (
        <div className={styles.tagsContainer}>
          <Tag
            label="Todos"
            active={selectedAttendantId === null && selectedConnectionId === null}
            onClick={() => {
              setSelectedAttendantId(null);
              setSelectedConnectionId(null);
            }}
          />
          {attendants.map((att) => (
            <Tag
              key={att.id}
              label={att.user.nome}
              active={selectedAttendantId === att.id}
              onClick={() => handleAttendantSelect(att.id)}
            />
          ))}
        </div>
      )}
    </motion.aside>
  );
}

export default React.memo(ChatSidebar);
