//Css
import './messageBubble.css';
//Libbs
import { motion } from 'framer-motion';

interface MessageBubbleProps {
  text?: string | null;
  sender: 'me' | 'other';
  mimetype?: string;
  base64?: string;
}

const MessageBubble = ({ text, sender, mimetype = 'text', base64 }: MessageBubbleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
      className={`bubble ${sender}`}
    >
      {mimetype === 'image' && base64 ? (
        <>
          <img
            src={`data:image/jpeg;base64,${base64}`}
            alt="Imagem enviada"
            className="message-image"
            style={{ maxWidth: '200px', borderRadius: '12px', marginBottom: text ? '0.5rem' : 0 }}
          />
          {text && <p>{text}</p>}
        </>
      ) : mimetype?.startsWith('audio') && base64 ? (
        <audio controls>
          <source src={`data:audio/ogg;base64,${base64}`} type="audio/ogg" />
          Seu navegador não suporta áudio.
        </audio>
      ) : mimetype === 'sticker' && base64 ? (
        <img
          src={`data:image/jpeg;base64,${base64}`}
          alt="Sticker"
          className="message-image"
          style={{ width: '120px', height: '120px' }}
        />
      ) : (
        <p>{text}</p>
      )}

    </motion.div>
  );
};


export default MessageBubble;

