import React from 'react';
import SearchBar from '../../components/Conversas/SearchBar/Searchbar';
import Tag from '../../components/Conversas/Tags/Tag';
import ContactListItem from '../../components/Conversas/ContactList/ContactListItem';
import MessageBubble from '../../components/Conversas/MessageBubble/MessageBubble';
import ChatInput from '../../components/Gerais/Inputs/ChatInput';
import useChats from '../../hooks/useChats';
import useMessages from '../../hooks/useMessages';
import './conversas.css';
import { Chat } from '../../types/chats';
import { Message } from '../../types/message';
import { apiConfig } from '../../config/api';
import axios from 'axios';

const ConversasPage: React.FC = () => {

  const handleUserSend = async (text: string) => {
    if (!activeChat) return;

    try {
      await axios.post('/api/messages/send', {
        chat_id: activeChat.id,
        connection_id: activeChat.connection.id,
        numero_destino: activeChat.connection.numero,
        mensagem: text
      });
    } catch (err) {
      console.error('Erro ao enviar', err);
    }
  };

  const [activeChat, setActiveChat] = React.useState<Chat | null>(null);
  const { chats } = useChats('b9fc3360-78d3-43fd-b819-fce3173d1fc8');
  const { messages } = useMessages(activeChat?.id || null);

  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChats = chats.filter((chat) => {
    const lowerQuery = searchQuery.toLowerCase();
    return (
      chat.contato_nome?.toLowerCase().includes(lowerQuery) ||
      chat.connection?.numero?.includes(lowerQuery)
    );
  });


  return (
    <div className="conversations-container">
      <div className="left-panel">
        <SearchBar onSearch={setSearchQuery} />
        <div className="tags">
          {[
            'Vendedor',
            'Recepcionista',
            'Comercial',
            'Juridico',

          ].map((t, i) => (
            <Tag key={i} label={t} active={false} />
          ))}
        </div>
        <div className="contacts-list">

          {filteredChats.map((chat) => {
            const isActive = activeChat?.id === chat.id;
            return (
              <ContactListItem
                classname={isActive ? 'contact-item active-contact' : 'contact-item'}
                key={chat.id}
                name={chat.contato_nome}
                message='oi'
                avatar="https://i.pravatar.cc/150"
                onClick={() => setActiveChat(chat)}
              />
            );
          })}




        </div>
      </div>

      <div className="right-panel">
        <div className="messages">
          {activeChat ? (
            messages.map((msg: Message, index: number) => (
              <MessageBubble
                key={index}
                text={msg.mensagem}
                sender={msg.remetente === 'cliente' ? 'me' : 'other'}
              />
            ))
          ) : (
            <p style={{ padding: '1rem' }}>Selecione uma conversa</p>
          )}
        </div>


        <div className='box-chat-input'>

          <ChatInput
            placeholder="Digite uma mensagem"
            onSend={handleUserSend}
          />

          {activeChat && (
            <button
              onClick={async () => {
                try {
                  const response = await axios.put(`${apiConfig.node}/chats/${activeChat.id}`, {
                    ...activeChat,
                    ia_ativa: !activeChat.ia_ativa,
                  });
                  setActiveChat(response.data[0]); // supabase retorna array
                } catch (err) {
                  console.error('Erro ao alternar IA:', err);
                }
              }}
              className="toggle-ia-btn"
            >
              {activeChat.ia_ativa ? 'Desativar IA' : 'Ativar IA'}
            </button>
          )}

        </div>

      </div>
    </div>
  );
};

export default ConversasPage;
