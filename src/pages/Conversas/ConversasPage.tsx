import { useState } from 'react';
import { useRecoilState } from 'recoil';
// Hooks
import useChats from '../../hooks/chats/useChats';
import useMessages from '../../hooks/chats/useMessages';
// Components
import ChatSidebar from '../../components/Conversas/ChatSideBar/ChatSideBar';
import ChatWindow from '../../components/Conversas/ChatWindow/ChatWindow';
// Types
import { Chat } from '../../types/chats';
// Css
import './conversas.css'
import { userState } from '../../state/atom';

export default function ConversasPage() {
  const [user] = useRecoilState(userState);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { chats } = useChats(user?.id, selectedAgentId);
  const { messages } = useMessages(activeChat?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="conversations-container">
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAgentId={selectedAgentId}
        setSelectedAgentId={setSelectedAgentId}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        setActiveChat={setActiveChat}
      />
    </div>
  );
}
