import SearchIcon from "../assets/search.svg";
import "./searchbar.css";

const SearchBar: React.FC = () => {
  return (
    <div className="search-container">

      <div className="search-icon">
        <SearchIcon />
      </div>

      <input
        type="text"
        className="search-bar"
        placeholder="Pesquisa por nome ou telefone"
      />
    </div>
  );
};

export default SearchBar;
