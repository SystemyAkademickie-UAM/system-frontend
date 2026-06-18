import { Link } from 'react-router-dom';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { groupsListPath } from '../../../routes/pathRegistry.js';
import './SuperBarBreadcrumb.css';

/**
 * @param {Object} props
 * @param {string} [props.homePath]
 * @param {string | null} props.groupName
 * @param {string | null} props.groupPath
 * @param {{ label: string, to?: string }[]} props.segments
 */
export default function SuperBarBreadcrumb({
  homePath = groupsListPath(),
  groupName,
  groupPath,
  segments,
}) {
  const items = [
    {
      key: 'home',
      type: 'home',
      to: homePath,
      label: 'Lista grup',
    },
  ];

  if (groupName) {
    items.push({
      key: 'group',
      type: 'text',
      label: groupName,
      to: groupPath,
      isGroup: true,
    });
  }

  segments.forEach((segment, index) => {
    items.push({
      key: `segment-${index}-${segment.label}`,
      type: 'text',
      label: segment.label,
      to: segment.to,
      isGroup: false,
    });
  });

  if (items.length === 1 && segments.length === 0 && !groupName) {
    return null;
  }

  return (
    <nav className="super-bar-breadcrumb" aria-label="Gdzie jesteś">
      <ol className="super-bar-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content =
            item.type === 'home' ? (
              item.to && !isLast ? (
                <Link to={item.to} className="super-bar-breadcrumb__home-link" aria-label={item.label}>
                  <AssetSvg
                    name={SVG_ICONS.nav.home}
                    className="super-bar-breadcrumb__home-icon"
                    width={18}
                    height={18}
                    alt=""
                  />
                </Link>
              ) : (
                <span className="super-bar-breadcrumb__home-current" aria-current="page">
                  <AssetSvg
                    name={SVG_ICONS.nav.home}
                    className="super-bar-breadcrumb__home-icon"
                    width={18}
                    height={18}
                    alt=""
                  />
                </span>
              )
            ) : item.to && !isLast ? (
              <Link to={item.to} className="super-bar-breadcrumb__link">
                {item.label}
              </Link>
            ) : (
              <span
                className={[
                  'super-bar-breadcrumb__current',
                  item.isGroup ? 'super-bar-breadcrumb__current--group' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            );

          return (
            <li key={item.key} className="super-bar-breadcrumb__item">
              {index > 0 ? (
                <span className="super-bar-breadcrumb__sep" aria-hidden="true">
                  /
                </span>
              ) : null}
              {content}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
