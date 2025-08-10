// Libs
import { motion } from 'framer-motion';
// CSS Modules
import styles from './ChatListItem.module.css';
// Assets
import defaultAvatar from '../assets/default.webp';
import { useState } from 'react';
import useChats from '../../../hooks/chats/useChats';
import { userState } from '../../../state/atom';
import { useRecoilState } from 'recoil';
import React from 'react';

interface ChatListItemProps {
  name: string;
  message: string;
  avatar?: string;
  chatId: string;
  isActive: boolean;
  onClick: () => void;
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
}: ChatListItemProps) {

  const [avatarUrl, setAvatarUrl] = useState(avatar || defaultAvatar);
  const [hasError, setHasError] = useState(false);
  const [user] = useRecoilState(userState);

  const { fectchImageProfile } = useChats(user?.id);

  const handleImageError = async () => {
  if (!hasError) {
    setHasError(true);

    const data = await fectchImageProfile(chatId);
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
      />
      <div className={styles.textContainer}>
        <strong>{name}</strong>
        <p>{cleanedMessage}</p>
      </div>
    </motion.button>
  );
}

export default React.memo(ChatListItem);



