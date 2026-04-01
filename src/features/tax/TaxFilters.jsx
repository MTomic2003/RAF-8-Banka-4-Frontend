import styles from './TaxFilters.module.css';

const TEAM_OPTIONS = [
  { value: '',        label: 'Svi timovi' },
  { value: 'Klijent', label: 'Klijent'    },
  { value: 'Aktuar',  label: 'Aktuar'     },
];

const STATUS_OPTIONS = [
  { value: '',           label: 'Svi statusi' },
  { value: 'Neplaćen',   label: 'Neplaćen'   },
  { value: 'Plaćen',     label: 'Plaćen'     },
  { value: 'Bez duga',   label: 'Bez duga'   },
  { value: 'Delimično',  label: 'Delimično'  },
];

export default function TaxFilters({ filters, onFilterChange }) {
  function set(key, value) {
    onFilterChange({ ...filters, [key]: value });
  }

  function reset() {
    onFilterChange({
      first_name: '',
      last_name:  '',
      team:       '',
      status:     '',
    });
  }

  const hasActive =
    filters.first_name ||
    filters.last_name  ||
    filters.team       ||
    filters.status;

  return (
    <div className={styles.wrap}>
      <input
        className={styles.input}
        type="text"
        placeholder="Ime..."
        value={filters.first_name}
        onChange={e => set('first_name', e.target.value)}
      />
      <input
        className={styles.input}
        type="text"
        placeholder="Prezime..."
        value={filters.last_name}
        onChange={e => set('last_name', e.target.value)}
      />
      <select
        className={styles.select}
        value={filters.team}
        onChange={e => set('team', e.target.value)}
      >
        {TEAM_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      <select
        className={styles.select}
        value={filters.status}
        onChange={e => set('status', e.target.value)}
      >
        {STATUS_OPTIONS.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {hasActive && (
        <button className={styles.btnReset} onClick={reset}>
          × Resetuj filtere
        </button>
      )}
    </div>
  );
}
