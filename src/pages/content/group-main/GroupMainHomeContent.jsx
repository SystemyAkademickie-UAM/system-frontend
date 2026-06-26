import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { TexturedSurface, Divider } from '../../../components/ui/index.js';
import ContentWithMeasuredDivider from '../../../components/ui/ContentWithMeasuredDivider/ContentWithMeasuredDivider.jsx';
import NotificationsFeed from '../../../components/notifications/NotificationsFeed.jsx';
import PaginatedNotificationsSection from '../../../components/notifications/PaginatedNotificationsSection.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useGroupDetails } from '../../../hooks/groups/useGroupDetails.js';
import { useGroupBacklogNotifications } from '../../../hooks/notifications/useGroupBacklogNotifications.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupMembersLogPath } from '../../../routes/pathRegistry.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import './GroupMainHomeContent.css';
import './shared/groupMainSubpageHeader.css';

function InfoRow({ label, value }) {
  if (!value) {
    return null;
  }

  return (
    <div className="group-main-home__row">
      <span className="group-main-home__label">{label}</span>
      <span className="group-main-home__value">{value}</span>
    </div>
  );
}

const LECTURER_PREVIEW_LIMIT = 5;

export default function GroupMainHomeContent() {
  const { groupId } = useParams();
  const location = useLocation();
  const { role } = useAppRole();
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);
  const isStudentView = role === APP_ROLE.STUDENT;

  const {
    notifications: lecturerPreviewNotifications,
    isLoading: lecturerPreviewLoading,
    error: lecturerPreviewError,
    markRead: lecturerMarkRead,
  } = useGroupBacklogNotifications(groupId, {
    isStudentView: false,
    take: LECTURER_PREVIEW_LIMIT,
    pollMs: 60000,
  });

  useEffect(() => {
    if (!isStudentView || location.hash !== '#group-notifications') {
      return;
    }

    const target = document.getElementById('group-notifications');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isStudentView, location.hash]);

  if (isLoading) {
    return <p className="group-main-home__message">Ładowanie danych grupy…</p>;
  }

  if (errorMessage) {
    return (
      <p className="group-main-home__message group-main-home__message--error" role="alert">
        {errorMessage}
      </p>
    );
  }

  return (
    <div className="group-main-home">
      <GroupMainSubpageHeader eyebrow="Witamy" title="Strona główna" />

      {!isStudentView ? (
        <TexturedSurface className="group-main-home__surface group-main-home__surface--notifications">
          <section className="group-main-home__section" aria-label="Najnowsze powiadomienia">
            <h2 className="group-main-home__section-title">Najnowsze powiadomienia</h2>
            <NotificationsFeed
              groupId={groupId}
              role={role}
              notifications={lecturerPreviewNotifications}
              isLoading={lecturerPreviewLoading}
              error={lecturerPreviewError}
              limit={LECTURER_PREVIEW_LIMIT}
              showDivider
              onMarkRead={(id) => lecturerMarkRead(id)}
              footerLink={{
                label: 'Zobacz więcej',
                to: groupMembersLogPath(groupId),
              }}
            />
          </section>
        </TexturedSurface>
      ) : null}

      <TexturedSurface className="group-main-home__surface group-main-home__surface--overview">
        <section className="group-main-home__section group-main-home__section--description" aria-label="Opis grupy">
          <ContentWithMeasuredDivider
            className="group-main-home__description"
            dividerClassName="group-main-home__description-divider"
          >
            {group?.description?.trim() || 'Brak opisu fabularnego grupy.'}
          </ContentWithMeasuredDivider>
        </section>

        <Divider className="group-main-home__overview-divider" />

        <section className="group-main-home__section" aria-label="Dane grupy">
          <h2 className="group-main-home__section-title">Dane grupy</h2>
          <InfoRow label="Nazwa fabularna" value={group?.storyName} />
          <InfoRow label="Przedmiot" value={group?.subject} />
          <InfoRow label="Prowadzący" value={group?.lecturer} />
          <InfoRow label="Waluta" value={group?.currencyName || group?.currency} />
          <InfoRow label="System żyć" value={group?.lives != null ? String(group.lives) : null} />
        </section>
      </TexturedSurface>

      {isStudentView ? (
        <PaginatedNotificationsSection
          groupId={groupId}
          isStudentView
          title="Powiadomienia"
          sectionId="group-notifications"
          linkable
          surfaceClassName="group-main-home__surface--notifications"
        />
      ) : null}
    </div>
  );
}
