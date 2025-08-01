//Utils
import { motion } from 'framer-motion';
//Components
import SearchBar from '../SearchBar/Searchbar';
import Tag from '../Tags/Tag';
import ContactListItem from '../ChatListItem/ChatListItem';
//Types
import { Chat } from '../../../types/chats';
//Css
import './chatSideBar.css'
import { useState } from 'react';
import { useAgents } from '../../../hooks/agents/useAgents';

interface Props {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  setSelectedAgentId: (id: string | null) => void;
  selectedAgentId: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const ChatSidebar = ({ chats, activeChat, setActiveChat, searchQuery, setSearchQuery, setSelectedAgentId, selectedAgentId }: Props) => {

  const { agents } = useAgents();

  console.log(chats)
  console.log('AAAAA', selectedAgentId)


  const filteredChats = chats.filter((chat) => {
    const q = searchQuery.toLowerCase();
    const matchSearch = chat.contato_nome?.toLowerCase().includes(q) || chat.contato_numero?.includes(q);


    const matchAgent = selectedAgentId
      ? chat.connection?.agente_id === selectedAgentId
      : true;

    return matchSearch && matchAgent;
  });


  return (
    <motion.div
      className="left-panel"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <SearchBar onSearch={setSearchQuery} />

      <div className="tags">

        <Tag
          key={'todos'}
          label={'Todos'}
          active={selectedAgentId === null}
          onClick={() => setSelectedAgentId(null)}
        />

        {agents.map((agent) => {
          return (
            <Tag
              key={agent.id}
              label={agent.tipo_de_agente}
              active={selectedAgentId === agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
            />

          )
        })}

      </div>
      <div className='list-contacts'>
        {filteredChats.map((chat) => {
          const isActive = activeChat?.id === chat.id;
          return (
            <ContactListItem
              key={chat.id}
              classname={isActive ? 'contact-item active-contact' : 'contact-item'}
              name={chat.contato_nome}
              message={chat.ultima_mensagem}
              avatar={chat.foto_perfil}
              onClick={() => setActiveChat(chat)}
            />
          );
        })}
      </div>

    </motion.div>
  );
};

export default ChatSidebar;
