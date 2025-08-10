import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';

// Hooks
import { useAgents } from '../../../hooks/agents/useAgents';
import { useDebounce } from '../../../hooks/utils/useDebounce';

// Components
import SearchBar from '../SearchBar/Searchbar';
import Tag from '../Tags/Tag';
import ChatListItem from '../ChatListItem/ChatListItem';

// Types
import { Chat } from '../../../types/chats';

// CSS Modules
import styles from './ChatSideBar.module.css';

// Assets
import AddChatIcon from '../assets/addchat.svg';

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  setIsAddChatOpen: (value: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

// Função utilitária para filtrar chats
function filterChats(
  chats: Chat[],
  query: string,
  selectedAgentId: string | null,
  iaStatusFilter: 'todos' | 'ativa' | 'desativada',
  statusFilter: 'Open' | 'Close'
) {
  const lowerQuery = query.toLowerCase();

  return chats.filter((chat) => {
    const matchesSearch =
      chat.contato_nome?.toLowerCase().includes(lowerQuery) ||
      chat.contato_numero?.includes(lowerQuery);

    const matchesAgent = selectedAgentId
      ? chat.connection?.agente_id === selectedAgentId
      : true;

    const matchesIAStatus =
      iaStatusFilter === 'todos'
        ? true
        : iaStatusFilter === 'ativa'
          ? chat.ia_ativa
          : !chat.ia_ativa;

    const matchesStatus = chat.status === statusFilter;

    return matchesSearch && matchesAgent && matchesIAStatus && matchesStatus;
  });
}

function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  setIsAddChatOpen,
}: ChatSidebarProps) {
  // Props de Filtro
  const [iaStatusFilter, setIaStatusFilter] = useState<'todos' | 'ativa' | 'desativada'>('todos');
  const [statusFilter, setStatusFilter] = useState<'Open' | 'Close'>('Open');
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 300);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  // Carregando Agents para as Tags
  const { agents } = useAgents();

  const filteredChats = useMemo(
    () =>
      filterChats(chats, debouncedSearch, selectedAgentId, iaStatusFilter, statusFilter),
    [chats, debouncedSearch, selectedAgentId, iaStatusFilter, statusFilter]
  );

  const toggleStatusFilter = useCallback(() => {
    setStatusFilter((prev) => (prev === 'Open' ? 'Close' : 'Open'));
  }, []);

  const handleAgentSelect = useCallback((agentId: string | null) => {
    setSelectedAgentId(agentId);
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
          <AddChatIcon />
        </button>
      </div>

      {/* Filtros IA */}
      <div className={styles.iaFilterContainer}>
        {['ativa', 'desativada'].map((status) => (
          <button
            key={status}
            type="button"
            className={`${styles.iaFilterButton} ${iaStatusFilter === status ? styles.active : ''}`}
            onClick={() => setIaStatusFilter(status as 'ativa' | 'desativada')}
          >
            {status === 'ativa' ? 'Agente Ativado' : 'Agente Desativado'}
          </button>
        ))}
      </div>

      {/* Tags */}
      <div className={styles.tagsContainer}>
        <Tag
          label="Todos"
          active={selectedAgentId === null}
          onClick={() => handleAgentSelect(null)}
        />
        {agents.map((agent) => (
          <Tag
            key={agent.id}
            label={agent.tipo_de_agente}
            active={selectedAgentId === agent.id}
            onClick={() => handleAgentSelect(agent.id)}
          />
        ))}
      </div>

      {/* Lista de chats */}
      <div className={styles.chatList}>
        {filteredChats.map((chat) => (
          <ChatListItem
            key={chat.id}
            chatId={chat.id}
            isActive={activeChat?.id === chat.id}
            name={chat.contato_nome}
            message={chat.ultima_mensagem}
            avatar={chat.foto_perfil}
            onClick={() => setActiveChat(chat)}
          />
        ))}
      </div>

      {/* Alternar chats abertos/fechados */}
      <div className={styles.statusToggleContainer}>
        <button
          className={styles.buttonAlterActiveChats}
          onClick={toggleStatusFilter}
        >
          {statusFilter === 'Open' ? 'Ver Chats Fechados' : 'Ver Chats Abertos'}
        </button>
      </div>
    </motion.aside>
  );
}

export default React.memo(ChatSidebar);