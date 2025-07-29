// Libbs
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';
import { useRecoilValue } from 'recoil';
// Hooks
import { useSendHelpMessage } from '../../hooks/help/useSendHelpMessage';
// Components
import ChatInput from '../../components/Gerais/Inputs/ChatInput';
// Atom
import { helpChatState } from '../../state/atom';
// Assets
import InstaIcon from './assets/insta.svg'
import InfoIcon from './assets/info.svg'
// Css
import './ajudaPage.css';

export default function AjudaPage() {
  const messages = useRecoilValue(helpChatState);
  const { sendMessage } = useSendHelpMessage();

  return (
    <div className="help-container">

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="ajuda-header"
      >

        <div>
          <h2>Página de Ajuda</h2>
          <h3>Pergunte qualquer coisa que estiver com dúvidas sobre o NKW FLOW.</h3>
        </div>

        <div className='wrapper-icons-ajuda'>
          <div className='box-icon'>
            <a href='https://google.com' target='_blank'><InstaIcon></InstaIcon></a>
          </div>
          <div className='box-icon'>
            <a href='https://google.com' target='_blank'><InfoIcon></InfoIcon></a>
          </div>
        </div>


      </motion.div>


      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4, ease: 'easeOut' }}
        className="help-chat"


      >

        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`help-message ${msg.from === 'user' ? 'user' : 'bot'}`}
          >
            <ReactMarkdown>
              {msg.content.text}
            </ReactMarkdown>

          </div>
        ))}

      </motion.div>

      <ChatInput placeholder="Pergunte qualquer coisa" onSend={sendMessage} />

    </div>
  );
}
