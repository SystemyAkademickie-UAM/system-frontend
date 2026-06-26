import './CatalogFilters.css';

/**
 * @param {Object} props
 * @param {boolean} props.expanded
 * @param {() => void} props.onToggle
 * @param {string} [props.className]
 */
export function CatalogFiltersToggle({ expanded, onToggle, className = '' }) {
  return (
    <button
      type="button"
      className={[
        'catalog-filters__toggle',
        expanded ? 'catalog-filters__toggle--active' : '',
        className,
      ].filter(Boolean).join(' ')}
      aria-expanded={expanded}
      onClick={onToggle}
    >
      Filtry i sortowanie
    </button>
  );
}

/**
 * @param {Object} props
 * @param {import('react').ReactNode} props.children
 * @param {string} [props.className]
 */
export function CatalogFiltersPanel({ children, className = '' }) {
  return (
    <div className={['catalog-filters__panel', className].filter(Boolean).join(' ')}>
      {children}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.ariaLabel
 * @param {{ id: string, label: string }[]} props.filters
 * @param {string} props.activeId
 * @param {(id: string) => void} props.onSelect
 */
export function CatalogFilterGroup({ ariaLabel, filters, activeId, onSelect }) {
  return (
    <div className="catalog-filters__filter-group" role="group" aria-label={ariaLabel}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          type="button"
          className={[
            'catalog-filters__filter',
            activeId === filter.id ? 'catalog-filters__filter--active' : '',
          ].join(' ')}
          onClick={() => onSelect(filter.id)}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.value
 * @param {(value: string) => void} props.onChange
 * @param {{ id: string, label: string }[]} props.options
 * @param {string} [props.label]
 * @param {string} [props.className]
 * @param {'panel' | 'toolbar'} [props.variant]
 * @param {string} [props.selectId]
 */
export function CatalogSortSelect({
  value,
  onChange,
  options,
  label = 'Sortuj:',
  className = '',
  variant = 'panel',
  selectId,
}) {
  return (
    <label
      className={[
        'catalog-filters__sort',
        variant === 'toolbar' ? 'catalog-filters__sort--toolbar' : 'catalog-filters__sort--panel',
        className,
      ].filter(Boolean).join(' ')}
    >
      <span className="catalog-filters__sort-label">{label}</span>
      <select
        id={selectId}
        className="catalog-filters__sort-select"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
