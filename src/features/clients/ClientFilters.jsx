import styles from './ClientFilters.module.css';

export default function ClientFilters({ filters, onFilterChange }) {
  function update(key, value) {
    onFilterChange({ ...filters, [key]: value });
  }

  return (
    <div className={styles.filters}>
      <input
        type="text"
        placeholder="Email..."
        value={filters.email}
        onChange={e => update('email', e.target.value)}
        className={styles.searchInput}
      />
      <input
        type="text"
        placeholder="Ime..."
        value={filters.first_name}
        onChange={e => update('first_name', e.target.value)}
      />
      <input
        type="text"
        placeholder="Prezime..."
        value={filters.last_name}
        onChange={e => update('last_name', e.target.value)}
      />
      <input
        type="text"
        placeholder="JMBG..."
        value={filters.jmbg ?? ''}
        onChange={e => update('jmbg', e.target.value)}
      />
    </div>
  );
}
