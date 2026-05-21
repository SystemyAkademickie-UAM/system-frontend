import { NavLink } from 'react-router-dom';
import './SubNav.css';

function itemClassName(isActive) {
  return ['maq-sub-nav__item', isActive ? 'maq-sub-nav__item--active' : ''].filter(Boolean).join(' ');
}

/**
 * Podrzędny pasek nawigacji (zakładki).
 *
 * @param {Object} props
 * @param {string} props.ariaLabel
 * @param {{ id: string, label: string, to?: string, onClick?: () => void }[]} props.items
 * @param {string} [props.activeId] — tryb przycisków (bez routera)
 * @param {(id: string) => void} [props.onSelect]
 * @param {string} [props.className]
 */
export default function SubNav({ ariaLabel, items, activeId, onSelect, className = '' }) {
  return (
    <nav className={['maq-sub-nav', className].filter(Boolean).join(' ')} aria-label={ariaLabel}>
      {items.map((item) => {
        if (item.to !== undefined && activeId === undefined) {
          return (
            <NavLink
              key={item.id}
              to={item.to}
              end={item.end}
              className={({ isActive }) => itemClassName(isActive)}
            >
              {item.label}
            </NavLink>
          );
        }

        const isActive = activeId === item.id;
        return (
          <button
            key={item.id}
            type="button"
            className={itemClassName(isActive)}
            onClick={() => {
              item.onClick?.();
              onSelect?.(item.id);
            }}
          >
            {item.label}
          </button>
        );
      })}
    </nav>
  );
}
