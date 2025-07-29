//Assets 
import SearchIcon from '../assets/search.svg';
import './searchbar.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar ({ onSearch } : SearchBarProps)  {
  return (
    <div className="search-container">

      <div className="search-icon">
        <SearchIcon />
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Pesquisa por nome ou telefone"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};