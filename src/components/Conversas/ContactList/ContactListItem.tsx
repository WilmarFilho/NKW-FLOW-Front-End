import React from 'react';
import './contactListItem.css';

interface ContactListItemProps {
  name: string;
  message: string;
  avatar: string;
  onClick: () => void;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ name, message, avatar, onClick }) => {
  return (
    <div onClick={onClick} className="contact-item">
      <img src={avatar} alt={name} className="avatar" />
      <div className="contact-texts">
        <strong>{name}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ContactListItem;
