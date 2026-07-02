import { useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useSubNavFitFontSize } from './useSubNavFitFontSize.js';
import './SubNav.css';

function itemClassName(isActive) {
  return ['maq-sub-nav__item', isActive ? 'maq-sub-nav__item--active' : ''].filter(Boolean).join(' ');
}

/**
 * Podrzędny pasek nawigacji (zakładki).
 *
 * @param {Object} props
 * @param {string} props.ariaLabel
 * @param {{ id: string, label: string, to?: string, end?: boolean, onClick?: () => void }[]} props.items
 * @param {string} [props.activeId] — tryb przycisków (bez routera)
 * @param {(id: string) => void} [props.onSelect]
 * @param {string} [props.className]
 */
export default function SubNav({ ariaLabel, items, activeId, onSelect, className = '' }) {
  const navRef = useRef(null);
  const location = useLocation();
  const fitDeps = [...items.map((item) => `${item.id}:${item.label}`), location.pathname, activeId];

  useSubNavFitFontSize(navRef, fitDeps);

  return (
    <nav
      ref={navRef}
      className={['maq-sub-nav', className].filter(Boolean).join(' ')}
      aria-label={ariaLabel}
    >
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
