import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AssetSvg, Button, Pagination, TexturedSurface, useToast } from '../ui/index.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { useGroupBacklogNotifications } from '../../hooks/notifications/useGroupBacklogNotifications.js';
import NotificationsFeed from './NotificationsFeed.jsx';
import ClearNotificationsConfirmModal from './ClearNotificationsConfirmModal.jsx';
import { SVG_ICONS } from '../../constants/svgIcons.js';
import { BACKLOG_LIST_POLL_MS } from '../../constants/backlogNotifications.constants.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './PaginatedNotificationsSection.css';

export const NOTIFICATIONS_PAGE_SIZE = 10;

const MARKALLREAD__TEXTLABEL = {
  polish: 'Oznacz wszystkie jako przeczytane',
  english: 'Mark all as read',
};

const CLEARALL__TEXTLABEL = {
  polish: 'Wyczyść powiadomienia',
  english: 'Clear notifications',
};

const CLEARPART__TEXTLABEL = {
  polish: 'Wyczyść (oprócz użyć przedmiotów)',
  english: 'Clear (except item uses)',
};

const PAGINATION__TEXTLABEL = {
  polish: 'Paginacja powiadomień',
  english: 'Notifications pagination',
};

const UNABLETOCLEAR__TEXTLABEL = {
  polish: 'Nie udało się wyczyścić powiadomień.',
  english: 'Failed to clear notifications.',
};

const NONOTIFICATIONSCLEAR__TEXTLABEL = {
  polish: 'Brak powiadomień do wyczyszczenia.',
  english: 'No notifications to clear.',
};

const CLEAREXCEPT__TEXTLABEL = {
  polish: 'Usunięto powiadomienia oprócz użyć przedmiotów.',
  english: 'Deleted notifications except item uses.',
};

const CLEARSUCCESS__TEXTLABEL = {
  polish: 'Powiadomienia zostały wyczyszczone.',
  english: 'Notifications have been cleared.',
};

const MOREOPTIONSLABEL__TEXTLABEL = {
  polish: 'Więcej opcji',
  english: 'More options',
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

  pollMs = BACKLOG_LIST_POLL_MS,

}) {

  const { role } = useAppRole();

  const { showSuccess, showError } = useToast();

  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchParams, setSearchParams] = useSearchParams();

  const rawPageParam = searchParams.get('page');
  const parsedPage = rawPageParam ? parseInt(rawPageParam, 10) : 1;
  const initialPage = !Number.isNaN(parsedPage) && parsedPage >= 1 ? parsedPage : 1;
  const [page, setPage] = useState(initialPage);
  const [confirmClearMode, setConfirmClearMode] = useState(null);
  const [isClearing, setIsClearing] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const raw = searchParams.get('page');
    const p = raw ? parseInt(raw, 10) : 1;
    const valid = !Number.isNaN(p) && p >= 1 ? p : 1;
    setPage(valid);
  }, [searchParams]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (newPage > 1) {
          next.set('page', String(newPage));
        } else {
          next.delete('page');
        }
        return next;
      },
      { replace: false },
    );
  };

  const skip = (page - 1) * pageSize;

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.paginated-notifications__menu-container')) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const {
    notifications,
    totalCount,
    unreadCount,
    isLoading,
    error,
    markRead,
    markAllRead,
    clearNotifications,
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
    if (totalCount > 0 && page > totalPages) {
      handlePageChange(totalPages);
    }
  }, [page, totalPages, totalCount]);

  const handleMarkAllRead = async () => {
    await markAllRead();
  };

  const handleConfirmClear = async () => {
    if (!confirmClearMode) {
      return;
    }

    setIsClearing(true);
    const result = await clearNotifications({
      excludeItemUses: confirmClearMode === 'exceptItemUses',
    });
    setIsClearing(false);

    if (!result.ok) {
      showError(result.error ?? UNABLETOCLEAR__TEXTLABEL[LANGUAGE]);
      return;
    }

    if (result.deleted === 0) {
      showSuccess(NONOTIFICATIONSCLEAR__TEXTLABEL[LANGUAGE]);
    } else if (confirmClearMode === 'exceptItemUses') {
      showSuccess(CLEAREXCEPT__TEXTLABEL[LANGUAGE]);
    } else {
      showSuccess(CLEARSUCCESS__TEXTLABEL[LANGUAGE]);
    }

    setConfirmClearMode(null);
    handlePageChange(1);
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

          <div className="paginated-notifications__actions">

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

            <div className="paginated-notifications__menu-container">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="paginated-notifications__more-btn"
                aria-label={MOREOPTIONSLABEL__TEXTLABEL[LANGUAGE]}
                title={MOREOPTIONSLABEL__TEXTLABEL[LANGUAGE]}
                disabled={isLoading || totalCount === 0}
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                <AssetSvg
                  name={SVG_ICONS.controls.more}
                  width={16}
                  height={16}
                  alt=""
                />
              </Button>

              {isMenuOpen ? (
                <div className="paginated-notifications__menu" role="menu">
                  {!isStudentView ? (
                    <button
                      type="button"
                      className="paginated-notifications__menu-item"
                      role="menuitem"
                      disabled={isLoading || isClearing || totalCount === 0}
                      onClick={() => {
                        setIsMenuOpen(false);
                        setConfirmClearMode('exceptItemUses');
                      }}
                    >
                      {CLEARPART__TEXTLABEL[LANGUAGE]}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className="paginated-notifications__menu-item paginated-notifications__menu-item--danger"
                    role="menuitem"
                    disabled={isLoading || isClearing || totalCount === 0}
                    onClick={() => {
                      setIsMenuOpen(false);
                      setConfirmClearMode('all');
                    }}
                  >
                    {CLEARALL__TEXTLABEL[LANGUAGE]}
                  </button>
                </div>
              ) : null}
            </div>
          </div>
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

              onPageChange={handlePageChange}

              ariaLabel={PAGINATION__TEXTLABEL[LANGUAGE]}

            />

          </div>

        ) : null}

      </section>



      <ClearNotificationsConfirmModal

        isOpen={confirmClearMode != null}

        mode={confirmClearMode}

        isLoading={isClearing}

        onClose={() => {

          if (!isClearing) {

            setConfirmClearMode(null);

          }

        }}

        onConfirm={handleConfirmClear}

      />

    </TexturedSurface>

  );

}


