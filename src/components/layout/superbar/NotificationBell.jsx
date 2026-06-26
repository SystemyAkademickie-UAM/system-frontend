import { useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import NotificationsFeed from '../../notifications/NotificationsFeed.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useGroupBacklogNotifications } from '../../../hooks/notifications/useGroupBacklogNotifications.js';
import { useOptionalGroupId } from '../../../hooks/useOptionalGroupId.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupMainPath, groupMembersLogPath } from '../../../routes/pathRegistry.js';
import AssetSvg from '../../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import './NotificationBell.css';

const BELL_LIMIT = 10;

/**
 * Dzwonek powiadomień w SuperBar — ostatnie 10 wpisów z API backlogu.
 */
export default function NotificationBell() {
  const panelId = useId();
  const rootRef = useRef(null);
  const { role } = useAppRole();
  const groupId = useOptionalGroupId();
  const [isOpen, setIsOpen] = useState(false);
  const isStudentView = role === APP_ROLE.STUDENT;

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    markRead,
  } = useGroupBacklogNotifications(groupId, {
    isStudentView,
    take: BELL_LIMIT,
    pollMs: isOpen ? 30000 : 60000,
  });

  const viewAllTarget = isStudentView && groupId
    ? `${groupMainPath(groupId)}#group-notifications`
    : groupId
      ? groupMembersLogPath(groupId)
      : null;

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

  if (!groupId) {
    return null;
  }

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
          <span className="notification-bell__badge" aria-hidden="true">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div id={panelId} className="notification-bell__panel" role="dialog" aria-label="Powiadomienia">
          <div className="notification-bell__panel-head">
            <p className="notification-bell__panel-title">Powiadomienia</p>
          </div>

          <div className="notification-bell__list">
            <NotificationsFeed
              groupId={groupId}
              role={role}
              notifications={notifications}
              isLoading={isLoading}
              error={error}
              limit={BELL_LIMIT}
              showDivider
              linkable={isStudentView}
              compact
              emptyMessage="Brak nowych powiadomień."
              onMarkRead={(id) => markRead(id)}
              persistLastSeenOnLeave={false}
            />
          </div>

          {viewAllTarget ? (
            <div className="notification-bell__footer">
              <Link
                to={viewAllTarget}
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
