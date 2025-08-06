// Libs
import { motion } from 'framer-motion';
// CSS Modules
import styles from './ChatListItem.module.css';
// Assets
import defaultAvatar from '../assets/default.webp';

interface ChatListItemProps {
  name: string;
  message: string;
  avatar?: string;
  isActive: boolean;
  onClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ChatListItem({
  name,
  message,
  avatar,
  isActive,
  onClick,
}: ChatListItemProps) {

  const containerClasses = `${styles.chatListItem} ${isActive ? styles.active : ''}`;

  const nameInMessageRegex = /^\*.*?\*\s?/;

  const cleanedMessage = message
    ? message.replace(nameInMessageRegex, '').trim()
    : 'Arquivo de mídia 📎';

  return (
    <motion.button
      variants={itemVariants}
      className={containerClasses}
      onClick={onClick}
      type="button"
    >
      <img
        src={avatar || defaultAvatar}
        alt={`Avatar de ${name}`}
        className={styles.avatar}
      />
      <div className={styles.textContainer}>
        <strong>{name}</strong>
        <p>{cleanedMessage}</p>
      </div>
    </motion.button>
  );
}