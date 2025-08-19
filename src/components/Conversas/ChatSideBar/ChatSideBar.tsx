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


interface ChatSidebarProps {
  chats: Chat[];
  connections: { id: string; nome?: string }[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  setIsAddChatOpen: (value: boolean) => void;
  fectchImageProfile: (chatId: string) => Promise<Chat | null>;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Função utilitária para filtrar chats
function filterChats(
  chats: Chat[],
  query: string,
  selectedConnectionId: string | null,
  iaStatusFilter: 'todos' | 'ativa' | 'desativada',
  statusFilter: 'Open' | 'Close',
  ownerFilter: 'all' | 'mine',
  currentUserId: string | null
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

    return (
      matchesSearch &&
      matchesConnection &&
      matchesIAStatus &&
      matchesStatus &&
      matchesOwner
    );
  });
}

function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  setIsAddChatOpen,
  fectchImageProfile,
  connections,
}: ChatSidebarProps) {
  const [iaStatusFilter, setIaStatusFilter] = useState<'todos' | 'ativa' | 'desativada'>('todos');
  const [statusFilter, setStatusFilter] = useState<'Open' | 'Close'>('Open');
  const [ownerFilter, setOwnerFilter] = useState<'all' | 'mine'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedConnectionId, setSelectedConnectionId] = useState<string | null>(null);
  const user = useRecoilValue(userState)

  const currentUserId = user?.id ? user.id : null;

  const filteredChats = useMemo(() => {
    // Se status é Close ou ownerFilter é 'mine', força IA desativada
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
      currentUserId
    );
  }, [chats, debouncedSearch, selectedConnectionId, iaStatusFilter, statusFilter, ownerFilter, currentUserId]);

  const toggleStatusFilter = useCallback(() => {
    setStatusFilter((prev) => (prev === 'Open' ? 'Close' : 'Open'));
  }, []);

  const toggleOwnerFilter = useCallback(() => {
    setOwnerFilter((prev) => (prev === 'all' ? 'mine' : 'all'));
  }, []);

  const handleConnectionSelect = useCallback((connectionId: string | null) => {
    setSelectedConnectionId(connectionId);
  }, []);

  return (
    <motion.aside
      className={styles.chatSidebar}
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      {/* Barra de busca + botão novo chat */}
      <div className={styles.wrapperSearchBar}>
        <SearchBar onSearch={setSearchQuery} />
        <button onClick={() => setIsAddChatOpen(true)} className={styles.buttonAddChat}>
          <Icon nome='addchat' />
        </button>
      </div>

      {/* Filtros IA */}
      <div className={styles.iaFilterContainer}>
        {statusFilter === 'Open' && ownerFilter === 'all' ? (
          ['ativa', 'desativada'].map((status) => (
            <button
              key={status}
              type="button"
              className={`${styles.iaFilterButton} ${iaStatusFilter === status ? styles.active : ''}`}
              onClick={() => setIaStatusFilter(status as 'ativa' | 'desativada')}
            >
              {status === 'ativa' ? 'Agente Ativado' : 'Agente Desativado'}
            </button>
          ))
        ) : (
          <button
            type="button"
            className={`${styles.iaFilterButton} ${styles.active}`} // já ativo
            onClick={() => setIaStatusFilter('desativada')}
          >
            Agente Desativado
          </button>
        )}
      </div>



      {/* Tags */}
      <div className={styles.tagsContainer}>
        <Tag
          label="Todos"
          active={selectedConnectionId === null}
          onClick={() => handleConnectionSelect(null)}
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

      {/* Lista de chats */}
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

      {/* Alternar filtros no footer */}
      <div className={styles.statusToggleContainer}>
        <button
          className={styles.buttonAlterActiveChats}
          onClick={toggleStatusFilter}
        >
          {statusFilter === 'Open' ? 'Exibindo:  Chats Abertos' : 'Exibindo:  Chats Fechados'}
        </button>

        <button
          className={styles.buttonAlterActiveChats}
          onClick={toggleOwnerFilter}
        >
          {ownerFilter === 'all' ? 'Exibindo:  Todos Chats' : 'Exibindo:  Meus Chats'}
        </button>
      </div>
    </motion.aside>
  );
}

export default React.memo(ChatSidebar);


