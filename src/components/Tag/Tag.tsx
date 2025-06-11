import React from 'react';
import './tag.css';

interface TagProps {
  label: string;
  active?: boolean;
}

const Tag: React.FC<TagProps> = ({ label, active = false }) => {
  return (
    <span className={`tag ${active ? 'active' : ''}`}>
      {label}
    </span>
  );
};

export default Tag;
