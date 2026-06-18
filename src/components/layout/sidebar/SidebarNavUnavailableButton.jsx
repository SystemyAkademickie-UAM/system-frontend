import { NavLink } from 'react-router-dom';
import NavGlyph from '../NavGlyph.jsx';
import '../navigation-shell.css';

/**
 * Niedostępna pozycja nawigacji — wyblakła, z podpowiedzią po najechaniu.
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.iconId]
 * @param {string} [props.hint] — tekst po najechaniu
 * @param {boolean} [props.clickable=false] — włącza nawigację (np. tymczasowo)
 * @param {string} [props.to]
 * @param {() => void} [props.onNavigate]
 */
export default function SidebarNavUnavailableButton({
  label,
  iconId,
  hint = 'Ta sekcja jest obecnie niedostępna.',
  clickable = false,
  to,
  onNavigate,
}) {
  const className = [
    'sidebar-nav__link',
    'sidebar-nav__link--unavailable',
    clickable ? 'sidebar-nav__link--unavailable-clickable' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      {iconId ? <NavGlyph id={iconId} /> : null}
      <span className="sidebar-nav__label">{label}</span>
    </>
  );

  return (
    <li className="sidebar-nav__item">
      {clickable && to ? (
        <NavLink
          to={to}
          className={className}
          onClick={onNavigate}
          title={hint}
          aria-label={`${label}. ${hint}`}
        >
          {content}
        </NavLink>
      ) : (
        <span
          className={className}
          title={hint}
          aria-disabled="true"
          aria-label={`${label}. ${hint}`}
        >
          {content}
        </span>
      )}
    </li>
  );
}
