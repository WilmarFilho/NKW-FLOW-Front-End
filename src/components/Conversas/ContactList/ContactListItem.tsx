import React from 'react';
import './contactListItem.css';

interface ContactListItemProps {
  name: string;
  message: string;
  avatar: string;
}

const ContactListItem: React.FC<ContactListItemProps> = ({ name, message, avatar }) => {
  return (
    <div className="contact-item">
      <img src={avatar} alt={name} className="avatar" />
      <div className="contact-texts">
        <strong>{name}</strong>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default ContactListItem;
