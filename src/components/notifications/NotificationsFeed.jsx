import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  formatNotificationDate,
} from '../../utils/notifications/formatBacklogNotification.js';
import {
  getNotificationsLastSeen,
  isNotificationAfterLastSeen,
  setNotificationsLastSeen,
} from '../../utils/notifications/notificationsLastSeen.js';
import './NotificationsFeed.css';

/**
 * @typedef {import('../../utils/notifications/formatBacklogNotification.js').ReturnType<typeof import('../../utils/notifications/formatBacklogNotification.js').formatBacklogNotification>} FormattedNotification
 */

/**
 * @param {{
 *   groupId: string | number,
 *   role: string,
 *   notifications: FormattedNotification[],
 *   isLoading?: boolean,
 *   error?: string,
 *   limit?: number | null,
 *   showDivider?: boolean,
 *   linkable?: boolean,
 *   compact?: boolean,
 *   emptyMessage?: string,
 *   onMarkRead?: (id: number) => void | Promise<unknown>,
 *   footerLink?: { label: string, to: string } | null,
 *   persistLastSeenOnLeave?: boolean,
 * }} props
 */
export default function NotificationsFeed({
  groupId,
  role,
  notifications,
  isLoading = false,
  error = '',
  limit = null,
  showDivider = false,
  linkable = false,
  compact = false,
  emptyMessage = 'Brak powiadomień.',
  onMarkRead,
  footerLink = null,
  persistLastSeenOnLeave = true,
}) {
  const navigate = useNavigate();
  const [lastSeenAt, setLastSeenAt] = useState(null);

  useEffect(() => {
    if (!showDivider || !groupId) {
      return undefined;
    }

    setLastSeenAt(getNotificationsLastSeen(groupId, role));

    if (!persistLastSeenOnLeave) {
      return undefined;
    }

    return () => {
      setNotificationsLastSeen(groupId, role);
    };
  }, [groupId, persistLastSeenOnLeave, role, showDivider]);

  const visibleNotifications = useMemo(() => {
    if (limit == null) {
      return notifications;
    }
    return notifications.slice(0, limit);
  }, [limit, notifications]);

  const dividerIndex = useMemo(() => {
    if (!showDivider || !lastSeenAt) {
      return -1;
    }

    const index = visibleNotifications.findIndex(
      (item) => !isNotificationAfterLastSeen(item.date, lastSeenAt),
    );

    if (index <= 0) {
      return -1;
    }

    return index;
  }, [lastSeenAt, showDivider, visibleNotifications]);

  const handleItemActivate = async (notification) => {
    if (!notification.isRead && onMarkRead) {
      await onMarkRead(notification.id);
    }

    if (linkable && notification.href) {
      navigate(notification.href);
    }
  };

  if (isLoading) {
    return <p className="notifications-feed__status">Ładowanie powiadomień…</p>;
  }

  if (error) {
    return (
      <p className="notifications-feed__status notifications-feed__status--error" role="alert">
        {error}
      </p>
    );
  }

  if (visibleNotifications.length === 0) {
    return <p className="notifications-feed__status">{emptyMessage}</p>;
  }

  return (
    <div
      className={[
        'notifications-feed',
        compact ? 'notifications-feed--compact' : '',
      ].filter(Boolean).join(' ')}
    >
      <div className="notifications-feed__list" role="list">
        {visibleNotifications.map((notification, index) => {
          const itemClassName = [
            'notifications-feed__item',
            notification.isRead ? '' : 'notifications-feed__item--unread',
            linkable && notification.href ? 'notifications-feed__item--linkable' : '',
          ].filter(Boolean).join(' ');

          const content = (
            <>
              <p className="notifications-feed__item-title">{notification.title}</p>
              {notification.message && notification.message !== notification.title ? (
                <p className="notifications-feed__item-message">{notification.message}</p>
              ) : null}
              <time className="notifications-feed__item-time" dateTime={notification.date}>
                {formatNotificationDate(notification.date)}
              </time>
            </>
          );

          return (
            <div key={notification.id}>
              {index === dividerIndex ? (
                <div className="notifications-feed__divider" role="separator" aria-label="Starsze powiadomienia">
                  <span className="notifications-feed__divider-line" />
                  <span className="notifications-feed__divider-label">Nowe od ostatniej wizyty</span>
                  <span className="notifications-feed__divider-line" />
                </div>
              ) : null}

              {linkable && notification.href ? (
                <Link
                  to={notification.href}
                  className={itemClassName}
                  role="listitem"
                  onClick={() => {
                    if (!notification.isRead && onMarkRead) {
                      void onMarkRead(notification.id);
                    }
                  }}
                >
                  {content}
                </Link>
              ) : (
                <article
                  className={itemClassName}
                  role="listitem"
                  tabIndex={onMarkRead ? 0 : undefined}
                  onClick={() => {
                    void handleItemActivate(notification);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      void handleItemActivate(notification);
                    }
                  }}
                >
                  {content}
                </article>
              )}
            </div>
          );
        })}
      </div>

      {footerLink ? (
        <div className="notifications-feed__footer">
          <Link to={footerLink.to} className="notifications-feed__footer-link">
            {footerLink.label}
          </Link>
        </div>
      ) : null}
    </div>
  );
}
