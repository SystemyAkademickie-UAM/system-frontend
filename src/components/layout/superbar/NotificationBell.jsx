import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useNotifications } from '../../../context/NotificationsContext.jsx';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupMembersLogPath } from '../../../routes/pathRegistry.js';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './NotificationBell.css';

/**
 * Dzwonek powiadomień w SuperBar — łatwe dokładanie elementów przez `useNotifications().addNotification`.
 */
export default function NotificationBell() {
  const panelId = useId();
  const rootRef = useRef(null);
  const { items } = useNotifications();
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const [isOpen, setIsOpen] = useState(false);

  const unreadCount = items.filter((item) => !item.read).length;
  const showViewAll = role === APP_ROLE.LECTURER && groupId !== null;

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen]);

  return (
    <div className="notification-bell" ref={rootRef}>
      <button
        type="button"
        className="notification-bell__trigger"
        aria-expanded={isOpen}
        aria-controls={panelId}
        aria-label={unreadCount > 0 ? `Powiadomienia (${unreadCount} nieprzeczytanych)` : 'Powiadomienia'}
        onClick={() => setIsOpen((open) => !open)}
      >
        <AssetSvg
          name={SVG_ICONS.nav.notifications}
          className="notification-bell__icon"
          width={30}
          height={30}
          alt=""
        />
        {unreadCount > 0 ? (
          <span className="notification-bell__badge" aria-hidden="true">{unreadCount}</span>
        ) : null}
      </button>

      {isOpen ? (
        <div id={panelId} className="notification-bell__panel" role="dialog" aria-label="Powiadomienia">
          <div className="notification-bell__panel-head">
            <p className="notification-bell__panel-title">Powiadomienia</p>
          </div>

          <div className="notification-bell__list" role="list">
            {items.length === 0 ? (
              <p className="notification-bell__empty" role="status">Brak nowych powiadomień.</p>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className={[
                    'notification-bell__item',
                    item.read ? '' : 'notification-bell__item--unread',
                  ].filter(Boolean).join(' ')}
                  role="listitem"
                >
                  <p className="notification-bell__item-title">{item.title}</p>
                  {item.message ? (
                    <p className="notification-bell__item-message">{item.message}</p>
                  ) : null}
                  {item.createdAt ? (
                    <time className="notification-bell__item-time" dateTime={item.createdAt}>
                      {item.createdAt}
                    </time>
                  ) : null}
                </article>
              ))
            )}
          </div>

          {showViewAll ? (
            <div className="notification-bell__footer">
              <Link
                to={groupMembersLogPath(groupId)}
                className="notification-bell__view-all"
                onClick={() => setIsOpen(false)}
              >
                Zobacz wszystkie
              </Link>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
