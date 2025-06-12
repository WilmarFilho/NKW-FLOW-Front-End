import React from 'react';
import SearchBar from '../../components/Conversas/SearchBar/Searchbar';
import Tag from '../../components/Conversas/Tags/Tag';
import ContactListItem from '../../components/Conversas/ContactList/ContactListItem';
import MessageBubble from '../../components/Conversas/MessageBubble/MessageBubble';
import MessageInput from '../../components/Conversas/MessageInput/MessageInput';
import './conversas.css'


const ConversasPage: React.FC = () => {
  return (
    <div className="conversations-container">
      <div className="left-panel">
        <SearchBar />
        <div className="tags">
          {['Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1', 'Tag 1'].map((t, i) => (
            <Tag key={i} label={t} active={i === 0} />
          ))}
        </div>
        <div className="contacts-list">
          {[...Array(8)].map((_, i) => (
            <ContactListItem
              key={i}
              name="Contato Teste"
              message="Última mensagem da conversa"
              avatar="https://i.pravatar.cc/150?img=1"
            />
          ))}
        </div>
      </div>

      <div className="right-panel">
        <div className="messages">
          {[...Array(5)].map((_, i) => (
            <MessageBubble
              key={i}
              text="Última mensagem da conversa"
              sender={i % 2 === 0 ? 'me' : 'other'}
            />
          ))}
        </div>
        <MessageInput />
      </div>
    </div>
  );
};

export default ConversasPage;
