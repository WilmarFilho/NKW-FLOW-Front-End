// React / Libs
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

// Hooks
import { useAgents } from '../../../hooks/agents/useAgents';

// Components
import SearchBar from '../SearchBar/Searchbar';
import Tag from '../Tags/Tag';
import ChatListItem from '../ChatListItem/ChatListItem';

// Types
import { Chat } from '../../../types/chats';

// CSS Modules
import styles from './ChatSideBar.module.css';

import AddChatIcon from '../assets/addchat.svg'

// Interface com nome mais específico
interface ChatSidebarProps {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSelectedAgentId: (id: string | null) => void;
  selectedAgentId: string | null;
  setIsAddChatOpen: (value: boolean) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function ChatSidebar({
  chats,
  activeChat,
  setActiveChat,
  searchQuery,
  setSearchQuery,
  setSelectedAgentId,
  selectedAgentId,
  setIsAddChatOpen,
}: ChatSidebarProps) {
  const [iaStatusFilter, setIaStatusFilter] = useState<'todos' | 'ativa' | 'desativada'>('todos');
  const { agents } = useAgents();
  const [statusFilter, setStatusFilter] = useState<'Open' | 'Close'>('Open');

  const filteredChats = useMemo(() => {
    return chats.filter((chat) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = chat.contato_nome?.toLowerCase().includes(query) || chat.contato_numero?.includes(query);

      const matchesAgent = selectedAgentId ? chat.connection?.agente_id === selectedAgentId : true;

      const matchesIAStatus = iaStatusFilter === 'todos' ? true : iaStatusFilter === 'ativa' ? chat.ia_ativa === true : chat.ia_ativa === false;

      const matchesStatus = statusFilter === 'Open' ? chat.status === 'Open' : chat.status === 'Close';

      return matchesSearch && matchesAgent && matchesIAStatus && matchesStatus;
    });
  }, [chats, searchQuery, selectedAgentId, iaStatusFilter, statusFilter]);



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
          <AddChatIcon />
        </button>

      </div>

      <div className={styles.iaFilterContainer}>
        <button
          type="button"
          className={`${styles.iaFilterButton} ${iaStatusFilter === 'ativa' ? styles.active : ''}`}
          onClick={() => setIaStatusFilter('ativa')}
        >
          Agente Ativado
        </button>
        <button
          type="button"
          className={`${styles.iaFilterButton} ${iaStatusFilter === 'desativada' ? styles.active : ''}`}
          onClick={() => setIaStatusFilter('desativada')}
        >
          Agente Desativado
        </button>
      </div>

      <div className={styles.tagsContainer}>

        <Tag
          key={'todos'}
          label={'Todos'}
          active={selectedAgentId === null}
          onClick={() => setSelectedAgentId(null)}
        />

        {agents.map((agent) => (
          <Tag
            key={agent.id}
            label={agent.tipo_de_agente}
            active={selectedAgentId === agent.id}
            onClick={() => setSelectedAgentId(agent.id)}
          />
        ))}
      </div>

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

      <div>
        <div className={styles.statusToggleContainer}>
          <button
            className={styles.buttonAlterActiveChats}
            onClick={() =>
              setStatusFilter((prev) => (prev === 'Open' ? 'Close' : 'Open'))
            }
          >
            {statusFilter === 'Open' ? 'Ver Chats Fechados' : 'Ver Chats Abertos'}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}