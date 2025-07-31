//Libs
import { motion } from 'framer-motion';
//Css
import './chatListItem.css';

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
  return (
    <motion.div
      variants={itemVariants}
      className={classname}
      onClick={onClick}
    >
      <img src={avatar} alt={name} className="avatar" />
      <div className="contact-texts">
        <strong>{name}</strong>
        <p>{message}</p>
      </div>
    </motion.div>
  );
};




