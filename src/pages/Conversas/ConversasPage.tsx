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
import PageStyles from '../PageStyles.module.css'
import { userState } from '../../state/atom';
import Modal from '../../components/Gerais/ModalForm/Modal';
import useSendMessage from '../../hooks/chats/useSendMessage';
import { useConnections } from '../../hooks/connections/useConnections';

export default function ConversasPage() {
  const [user] = useRecoilState(userState);
  const { connections } = useConnections();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const { chats } = useChats(user?.id);
  const { sendMessage } = useSendMessage();
  const { messages } = useMessages(activeChat?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  const [isAddChatOpen, setIsAddChatOpen] = useState(false);
  const [newChatNumber, setNewChatNumber] = useState('');
  const [newChatMessage, setNewChatMessage] = useState('');
  const [selectedConnectionId, setSelectedConnectionId] = useState('');


  const handleSendMessage = async (text: string, numero: string, connectionId: string) => {
    const result = await sendMessage({
      mensagem: text,
      number: numero,
      connection_id: connectionId,
    });
    if (result) {
      console.log(result);
      setIsAddChatOpen(false);
      setNewChatNumber('');
      setNewChatMessage('');
      setSelectedConnectionId('');
    }
  };



  return (
    <div className={PageStyles.conversationsContainer}>
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedAgentId={selectedAgentId}
        setSelectedAgentId={setSelectedAgentId}
        setIsAddChatOpen={setIsAddChatOpen}
      />
      <ChatWindow
        activeChat={activeChat}
        messages={messages}
        setActiveChat={setActiveChat}
      />

      {isAddChatOpen && (

        <Modal isOpen={isAddChatOpen} onClose={() => setIsAddChatOpen(false)} title='Começar nova conversa.'>


          <div className={PageStyles.modalContent}>
           
            <div className={PageStyles.formGroup}>
               <label htmlFor="numero">Conexão para disparar mensagem</label>
              <select
                value={selectedConnectionId}
                className={PageStyles.formSelect}
                onChange={(e) => setSelectedConnectionId(e.target.value)}
              >
                <option value="">Selecione a conexão</option>
                {connections.map((conn) => (
                  <option key={conn.id} value={conn.id}>
                    {conn.nome || conn.id}
                  </option>
                ))}
              </select>
            </div>
            <div className={PageStyles.formGroup}>
              <label htmlFor="numero">Número de Telefone</label>
              <input
                type="text"
                placeholder="Número com DDD (ex: 11999999999)"
                value={newChatNumber}
                className={PageStyles.formInput}
                onChange={(e) => setNewChatNumber(e.target.value)}
              />

            </div>

            <div className={PageStyles.formGroup}>
              <label htmlFor="numero">Primeira Mensagem</label>
              <input
                placeholder="Primeira mensagem"
                className={PageStyles.formInput}
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
              />
            </div>
            <div className={PageStyles.modalActions}>

              <button
                className={PageStyles.submitButton}
                onClick={() =>
                  handleSendMessage(newChatMessage, newChatNumber, selectedConnectionId)
                }
                disabled={!newChatNumber || !newChatMessage || !selectedConnectionId}
              >
                Enviar
              </button>
            </div>

          </div>


        </Modal>

      )}

    </div>
  );
}



