//Libs
import { motion } from 'framer-motion';
//Css
import './chatListItem.css';
//Assets
import defaultAvatar from '../assets/default.webp'; 

interface ContactListItemProps {
  name: string;
  classname: string;
  message: string;
  avatar: string | undefined;
  onClick: () => void;
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

export default function ChatListItem({ name, message, classname, avatar, onClick } : ContactListItemProps)  {
  console.log('Imagem: ', avatar)
  return (
    <motion.div
      variants={itemVariants}
      className={classname}
      onClick={onClick}
    >
      <img src={avatar ? avatar : defaultAvatar} alt={name} className="avatar" />
      <div className="contact-texts">
        <strong>{name}</strong>
        <p>{message}</p>
      </div>
    </motion.div>
  );
};




