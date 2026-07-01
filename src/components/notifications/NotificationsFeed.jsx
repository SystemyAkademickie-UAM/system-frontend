import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AssetSvg from '../ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../constants/svgIcons.js';
import { formatRelativeTimePl } from '../../utils/notifications/formatRelativeTimePl.js';
import {
  getNotificationsLastSeen,
  isNotificationAfterLastSeen,
  setNotificationsLastSeen,
} from '../../utils/notifications/notificationsLastSeen.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './NotificationsFeed.css';

const EMPTYMESSAGE__TEXTLABEL = {
  polish: 'Brak powiadomień.',
  english: 'No notifications.',
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie powiadomień...',
  english: 'Loading notifications...',
};

const NEWFROMLASTVISIT__TEXTLABEL = {
  polish: 'Nowe od ostatniej wizyty',
  english: 'New since last visit',
};

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
  emptyMessage,
  onMarkRead,
  footerLink = null,
  persistLastSeenOnLeave = true,
}) {
  const navigate = useNavigate();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const resolvedEmptyMessage = emptyMessage ?? EMPTYMESSAGE__TEXTLABEL[LANGUAGE];
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

  const handleNavigate = (notification) => {
    if (!notification.href) {
      return;
    }
    navigate(notification.href);
  };

  const handleTileActivate = (notification) => {
    if (!notification.isRead && onMarkRead) {
      void onMarkRead(notification.id);
    }
    handleNavigate(notification);
  };

  const handleMarkReadClick = (event, notification) => {
    event.preventDefault();
    event.stopPropagation();
    if (!notification.isRead && onMarkRead) {
      void onMarkRead(notification.id);
    }
  };

  if (isLoading) {
    return <p className="notifications-feed__status">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>;
  }

  if (error) {
    return (
      <p className="notifications-feed__status notifications-feed__status--error" role="alert">
        {error}
      </p>
    );
  }

  if (visibleNotifications.length === 0) {
    return <p className="notifications-feed__status">{resolvedEmptyMessage}</p>;
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
          const isNavigable = Boolean(notification.href);
          const itemClassName = [
            'notifications-feed__item',
            notification.isRead ? '' : 'notifications-feed__item--unread',
            isNavigable || linkable ? 'notifications-feed__item--linkable' : '',
          ].filter(Boolean).join(' ');

          const content = (
            <>
              <p className="notifications-feed__item-type">{notification.typeLabel}</p>
              <p className="notifications-feed__item-title">{notification.title}</p>
              {notification.message && notification.message !== notification.title ? (
                <p className="notifications-feed__item-message">{notification.message}</p>
              ) : null}
              <time className="notifications-feed__item-time" dateTime={notification.date}>
                {formatRelativeTimePl(notification.date)}
              </time>
            </>
          );

          return (
            <div key={notification.id}>
              {index === dividerIndex ? (
                <div className="notifications-feed__divider" role="separator" aria-label="Starsze powiadomienia">
                  <span className="notifications-feed__divider-line" />
                  <span className="notifications-feed__divider-label">{NEWFROMLASTVISIT__TEXTLABEL[LANGUAGE]}</span>
                  <span className="notifications-feed__divider-line" />
                </div>
              ) : null}

              <div
                className={[
                  'notifications-feed__row',
                  notification.isRead ? '' : 'notifications-feed__row--unread',
                ].filter(Boolean).join(' ')}
                role="listitem"
              >
                <div
                  className={itemClassName}
                  tabIndex={isNavigable ? 0 : undefined}
                  onClick={() => {
                    if (isNavigable) {
                      handleTileActivate(notification);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (!isNavigable) {
                      return;
                    }
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      handleTileActivate(notification);
                    }
                  }}
                >
                  {content}
                </div>

                {onMarkRead && !notification.isRead ? (
                  <button
                    type="button"
                    className="notifications-feed__mark-read"
                    aria-label="Oznacz jako przeczytane"
                    title="Oznacz jako przeczytane"
                    onClick={(event) => handleMarkReadClick(event, notification)}
                  >
                    <AssetSvg
                      name={SVG_ICONS.status.checkCircle}
                      className="notifications-feed__mark-read-icon"
                      width={20}
                      height={20}
                      alt=""
                    />
                  </button>
                ) : null}
              </div>
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
