// Icon
import Icon from '../../../components/Gerais/Icons/Icons';
// CSS Modules
import styles from './Searchbar.module.css';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  return (
    <div className={styles.searchContainer} role="search">
      <div className={styles.iconWrapper}>
        <Icon nome='search' />
      </div>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Pesquisar por nome ou telefone..."
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}