import React from 'react';
import './contactListItem.css';

interface ContactListItemProps {
  name: string;
  classname: string
  message: string;
  avatar: string;
  onClick: () => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ name, message, classname, avatar, onClick }) => {
  return (
    <div onClick={onClick} className={classname}>
      <img src={avatar} alt={name} className="avatar" />
      <div className="contact-texts">
        <strong>{name}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ContactListItem;
