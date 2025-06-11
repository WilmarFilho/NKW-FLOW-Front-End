import React from 'react';
import './searchbar.css';

const SearchBar: React.FC = () => {
  return (
    <input
      type="text"
      className="search-bar"
      placeholder="Pesquisa por nome ou telefone"
    />
  );
};

export default SearchBar;
