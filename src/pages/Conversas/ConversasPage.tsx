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
  const { chats } = useChats('b9fc3360-78d3-43fd-b819-fce3173d1fc8');
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
