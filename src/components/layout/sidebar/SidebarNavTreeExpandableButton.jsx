import { useId, useState } from 'react';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import NavGlyph from '../NavGlyph.jsx';
import { isAnyNavItemActive, useNavPathname } from './sidebarNavUtils.js';
import '../navigation-shell.css';

/**
 * Rozwijane drzewko — klik zwija/rozwija elementy potomne (bez nawigacji).
 *
 * @param {Object} props
 * @param {string} props.label
 * @param {string} [props.iconId]
 * @param {boolean} [props.defaultExpanded=false]
 * @param {{ to?: string, matchEnd?: boolean, children?: unknown[] }[]} [props.childItems]
 * @param {import('react').ReactNode} props.children
 */
export default function SidebarNavTreeExpandableButton({
  label,
  iconId,
  defaultExpanded = false,
  childItems = [],
  children,
}) {
  const pathname = useNavPathname();
  const panelId = useId();
  const [expanded, setExpanded] = useState(defaultExpanded);
  const hasActiveChild = isAnyNavItemActive(pathname, childItems);

  const className = [
    'sidebar-nav__link',
    'sidebar-nav__link--tree-expandable',
    hasActiveChild ? 'sidebar-nav__link--active' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className="sidebar-nav__item sidebar-nav__item--tree-expandable">
      <button
        type="button"
        className={className}
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={() => setExpanded((current) => !current)}
      >
        {iconId ? <NavGlyph id={iconId} /> : null}
        <span className="sidebar-nav__label">{label}</span>
        <AssetSvg
          name={`${SVG_ICONS.controls.chevronRight}.svg`}
          className={[
            'sidebar-nav__chevron',
            expanded ? 'sidebar-nav__chevron--expanded' : '',
          ].join(' ')}
          width={14}
          height={14}
          alt=""
          aria-hidden="true"
        />
      </button>

      <ul
        id={panelId}
        className={[
          'sidebar-nav',
          'sidebar-nav--tree-children',
          expanded ? 'sidebar-nav--tree-children-expanded' : 'sidebar-nav--tree-children-collapsed',
        ].join(' ')}
        hidden={!expanded}
      >
        {children}
      </ul>
    </li>
  );
}
