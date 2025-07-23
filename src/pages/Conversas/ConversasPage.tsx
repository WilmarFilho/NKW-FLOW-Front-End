import React from 'react';
import SearchBar from '../../components/Conversas/SearchBar/Searchbar';
import Tag from '../../components/Conversas/Tags/Tag';
import ContactListItem from '../../components/Conversas/ContactList/ContactListItem';
import MessageBubble from '../../components/Conversas/MessageBubble/MessageBubble';
import ChatInput from '../../components/Gerais/Inputs/ChatInput';
import useConversations from '../../hooks/useConversations';
import './conversas.css';
import { Chat } from '../../types/chats';
import { Message } from '../../types/message';
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

  const { conversations } = useConversations('b9fc3360-78d3-43fd-b819-fce3173d1fc8');



  return (
    <div className="conversations-container">
      <div className="left-panel">
        <SearchBar />
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

          {conversations.map((chat) => {
            const isActive = activeChat?.id === chat.id;

            return (
              <ContactListItem
                classname={isActive ? 'contact-item active-contact' : 'contact-item'}
                key={chat.id}
                name={chat.contato_nome}
                message={chat.messages[chat.messages.length - 1]?.mensagem}
                avatar="https://i.pravatar.cc/150"
                onClick={() => setActiveChat(chat)}
              />
            );
          })}

          <ContactListItem
            classname='contact-item'
            key='A'
            name='Daniel Valadares'
            message='Vocês vende oque?'
            avatar="https://i.pravatar.cc/150"
            onClick={() => console.log('oi')}
          />

          <ContactListItem
            classname='contact-item'
            key='A'
            name='Daniel Valadares'
            message='Vocês vende oque?'
            avatar="https://i.pravatar.cc/150"
            onClick={() => console.log('oi')}
          />

          <ContactListItem
            classname='contact-item'
            key='A'
            name='Daniel Valadares'
            message='Vocês vende oque?'
            avatar="https://i.pravatar.cc/150"
            onClick={() => console.log('oi')}
          />

          <ContactListItem
            classname='contact-item'
            key='A'
            name='Daniel Valadares'
            message='Vocês vende oque?'
            avatar="https://i.pravatar.cc/150"
            onClick={() => console.log('oi')}
          />



        </div>
      </div>

      <div className="right-panel">
        <div className="messages">
          {activeChat ? (
            activeChat.messages.map((msg: Message, index: number) => (
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
        <ChatInput
          placeholder="Digite uma mensagem"
          onSend={handleUserSend}
        />
      </div>
    </div>
  );
};

export default ConversasPage;
