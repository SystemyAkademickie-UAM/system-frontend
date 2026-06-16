import { Link } from 'react-router-dom';
import './SuperBarBreadcrumb.css';

/**
 * @param {Object} props
 * @param {string | null} props.groupName
 * @param {string | null} props.groupPath
 * @param {{ label: string, to?: string }[]} props.segments
 */
export default function SuperBarBreadcrumb({ groupName, groupPath, segments }) {
  if (!groupName && segments.length === 0) {
    return null;
  }

  const items = [];

  if (groupName) {
    items.push({
      key: 'group',
      label: groupName,
      to: groupPath,
      isGroup: true,
    });
  }

  segments.forEach((segment, index) => {
    items.push({
      key: `segment-${index}-${segment.label}`,
      label: segment.label,
      to: segment.to,
      isGroup: false,
    });
  });

  return (
    <nav className="super-bar-breadcrumb" aria-label="Gdzie jesteś">
      <ol className="super-bar-breadcrumb__list">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const content =
            item.to && !isLast ? (
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
