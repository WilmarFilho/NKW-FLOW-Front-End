//Utils
import { motion } from 'framer-motion';
//Components
import SearchBar from '../SearchBar/Searchbar';
import Tag from '../Tags/Tag';
import ContactListItem from '../ChatListItem/ChatListItem';
//Types
import { Chat } from '../../../types/chats';

interface Props {
  chats: Chat[];
  activeChat: Chat | null;
  setActiveChat: (chat: Chat) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const ChatSidebar = ({ chats, activeChat, setActiveChat, searchQuery, setSearchQuery }: Props) => {
  const filteredChats = chats.filter((chat) => {
    const q = searchQuery.toLowerCase();
    return chat.contato_nome?.toLowerCase().includes(q) || chat.connection?.numero?.includes(q);
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
        <Tag key={'AA'} label={'Advogado'} active={true} />
        {['Vendedor', 'Recepcionista', 'Comercial', 'Juridico'].map((t, i) => (
          <Tag key={i} label={t} active={false} />
        ))}
      </div>

      {filteredChats.map((chat) => {
        const isActive = activeChat?.id === chat.id;
        return (
          <ContactListItem
            key={chat.id}
            classname={isActive ? 'contact-item active-contact' : 'contact-item'}
            name={chat.contato_nome}
            message="oi"
            avatar="https://avatars.githubusercontent.com/u/103720085?v=4"
            onClick={() => setActiveChat(chat)}
          />
        );
      })}
    </motion.div>
  );
};

export default ChatSidebar;
