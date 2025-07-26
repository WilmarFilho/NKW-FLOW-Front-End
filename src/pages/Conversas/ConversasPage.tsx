import React from 'react';
// Hooks
import useChats from '../../hooks/useChats';
import useMessages from '../../hooks/useMessages';
//Components
import ChatSidebar from '../../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../../components/Conversas/ChatWindow/ChatWindow';
// Types
import { Chat } from '../../types/chats';
// Css
import './conversas.css'

const ConversasPage: React.FC = () => {
  const [activeChat, setActiveChat] = React.useState<Chat | null>(null);
  const { chats } = useChats('0523e7bd-314c-43c1-abaa-98b789c644e6');
  const { messages } = useMessages(activeChat?.id || null);
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="conversations-container">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        setActiveChat={setActiveChat}
        onSendMessage={() => console.log('oi')}
      />
    </div>
  );
};

export default ConversasPage;
