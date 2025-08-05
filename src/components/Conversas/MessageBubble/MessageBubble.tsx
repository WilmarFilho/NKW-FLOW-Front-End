import { motion } from 'framer-motion';
// CSS Modules
import styles from './MessageBubble.module.css';

interface MessageBubbleProps {
  text?: string | null;
  sender: 'me' | 'other';
  mimetype?: string;
  base64?: string;
}

const renderMessageContent = ({ mimetype, base64, text }: MessageBubbleProps) => {
 
  const type = mimetype || 'text';

  switch (true) {
    case type === 'image' && !!base64:
      return (
        <>
          <img
            src={`data:image/jpeg;base64,${base64}`}
            alt="Imagem enviada na conversa"
            className={styles.messageImage}
          />
         
          {text && <p>{text}</p>}
        </>
      );

    case type === 'sticker' && !!base64:
      return (
        <img
          src={`data:image/webp;base64,${base64}`}
          alt="Figurinha (sticker) enviada na conversa"
          className={styles.stickerImage}
        />
      );
      
    case type.startsWith('audio') && !!base64:
      return (
        <audio controls className={styles.messageAudio}>
          <source src={`data:audio/ogg;base64,${base64}`} type="audio/ogg" />
          Seu navegador não suporta o elemento de áudio.
        </audio>
      );

    default:
      return <p>{text}</p>;
  }
};

export default function MessageBubble(props: MessageBubbleProps) {
  const { sender, mimetype } = props;

  const bubbleClasses = [
    styles.messageBubble,
    sender === 'me' ? styles.isMe : styles.isOther,
    mimetype === 'sticker' ? styles.stickerBubble : '',
  ].join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.3, ease: 'easeOut' }}
      className={bubbleClasses}
    >
      {renderMessageContent(props)}
    </motion.div>
  );
}


