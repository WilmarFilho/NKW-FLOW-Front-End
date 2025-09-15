// Libs
import { motion } from 'framer-motion';
// CSS Modules
import styles from './ChatListItem.module.css';
// Assets
import defaultAvatar from '../assets/default.webp';
import { useState } from 'react';
import React from 'react';
// Types
import { Chat } from '../../../types/chats';
// Utils
import { useFormatDate } from '../../../hooks/utils/useFormatDate';

interface ChatListItemProps {
  name: string;
  message: string;
  avatar?: string;
  chatId: string;
  isActive: boolean;
  onClick: () => void;
  unreadCount: number;
  mensagemData?: string | null;
  fetchImageProfile: (chatId: string) => Promise<Chat | null>;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

function ChatListItem({
  name,
  message,
  avatar,
  isActive,
  onClick,
  chatId,
  fetchImageProfile,
  mensagemData,
  unreadCount,
}: ChatListItemProps) {
  const [avatarUrl, setAvatarUrl] = useState(avatar || defaultAvatar);
  const [hasError, setHasError] = useState(false);

  const handleImageError = async () => {
    if (!hasError) {
      setHasError(true);

      const data = await fetchImageProfile(chatId);
      if (data?.foto_perfil) {
        setAvatarUrl(data.foto_perfil);
      } else {
        setAvatarUrl(defaultAvatar);
      }
    }
  };

  const nameInMessageRegex = /^\*.*?\*\s?/;
  const cleanedMessage = message
    ? message.replace(nameInMessageRegex, '').trim()
    : 'Arquivo de mídia 📎';

  const containerClasses = `${styles.chatListItem} ${isActive ? styles.active : ''}`;

  return (
    <motion.button
      variants={itemVariants}
      className={containerClasses}
      onClick={onClick}
      type="button"
    >
      <img
        src={avatarUrl}
        onError={handleImageError}
        alt={`Avatar de ${name}`}
        className={styles.avatar}
        loading="lazy"
      />

      <div className={styles.textContainer}>
        {/* Linha superior: nome + data */}
        <div className={styles.columnLeft}>
          <strong>{name}</strong>
          <p className={styles.message}>{cleanedMessage}</p>

        </div>

        {/* Linha inferior: última mensagem + badge de não lido */}
        <div className={styles.columnRight}>
          {mensagemData && (
            <span
              className={
                unreadCount > 0
                  ? styles.headerActiveCount
                  : styles.headerCount
              }
            >
              {useFormatDate(mensagemData)}
            </span>
          )}
          {unreadCount > 0 && (
            <span className={styles.countUnread}>{unreadCount}</span>
          )}
        </div>

      </div>
    </motion.button>
  );
}

export default React.memo(ChatListItem);