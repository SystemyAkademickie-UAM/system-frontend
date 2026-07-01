import { useEffect, useMemo, useState } from 'react';
import { Button, Pagination, TexturedSurface } from '../ui/index.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { useGroupBacklogNotifications } from '../../hooks/notifications/useGroupBacklogNotifications.js';
import NotificationsFeed from './NotificationsFeed.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './PaginatedNotificationsSection.css';

export const NOTIFICATIONS_PAGE_SIZE = 10;

const MARKALLREAD__TEXTLABEL = {
  polish: 'Oznacz wszystkie jako przeczytane',
  english: 'Mark all as read',
};

const PAG__TEXTLABEL = {
  polish: 'Paginacja powiadomień',
  english: 'Notifications pagination',
};

/**
 * @param {{
 *   groupId: string | number,
 *   isStudentView: boolean,
 *   title: string,
 *   linkable?: boolean,
 *   showDivider?: boolean,
 *   footerLink?: { label: string, to: string } | null,
 *   surfaceClassName?: string,
 *   sectionId?: string,
 *   pageSize?: number,
 *   pollMs?: number,
 * }} props
 */
export default function PaginatedNotificationsSection({
  groupId,
  isStudentView,
  title,
  linkable = false,
  showDivider = true,
  footerLink = null,
  surfaceClassName = '',
  sectionId,
  pageSize = NOTIFICATIONS_PAGE_SIZE,
  pollMs = 60000,
}) {
  const { role } = useAppRole();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [page, setPage] = useState(1);
  const skip = (page - 1) * pageSize;

  const {
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    error,
    markRead,
    markAllRead,
  } = useGroupBacklogNotifications(groupId, {
    isStudentView,
    take: pageSize,
    skip,
    pollMs,
  });

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalCount / pageSize)),
    [pageSize, totalCount],
  );

  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  return (
    <TexturedSurface
      className={['paginated-notifications__surface', surfaceClassName].filter(Boolean).join(' ')}
    >
      <section
        id={sectionId}
        className="paginated-notifications__section"
        aria-label={title}
      >
        <div className="paginated-notifications__header">
          <h2 className="paginated-notifications__title">{title}</h2>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isLoading || unreadCount === 0}
            onClick={() => {
              void handleMarkAllRead();
            }}
          >
            {MARKALLREAD__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>

        <NotificationsFeed
          groupId={groupId}
          role={role}
          notifications={notifications}
          isLoading={isLoading}
          error={error}
          showDivider={showDivider}
          linkable={linkable}
          onMarkRead={(id) => markRead(id)}
          footerLink={footerLink}
        />

        {totalCount > pageSize ? (
          <div className="paginated-notifications__pagination">
            <Pagination
              totalPages={totalPages}
              page={safePage}
              onPageChange={setPage}
              ariaLabel={PAG__TEXTLABEL[LANGUAGE]}
            />
          </div>
        ) : null}
      </section>
    </TexturedSurface>
  );
}
