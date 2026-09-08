import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { TexturedSurface, Divider } from '../../../components/ui/index.js';
import ContentWithMeasuredDivider from '../../../components/ui/ContentWithMeasuredDivider/ContentWithMeasuredDivider.jsx';
import NotificationsFeed from '../../../components/notifications/NotificationsFeed.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useGroupDetails } from '../../../hooks/groups/useGroupDetails.js';
import { useGroupBacklogNotifications } from '../../../hooks/notifications/useGroupBacklogNotifications.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { BACKLOG_LIST_POLL_MS } from '../../../constants/backlogNotifications.constants.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import { groupMembersLogPath, groupProfileActivityPath } from '../../../routes/pathRegistry.js';
import GroupMainSubpageHeader from './shared/GroupMainSubpageHeader.jsx';
import GroupMainHomeContentWindow from './GroupMainHomeContentWindow.jsx';
import './GroupMainHomeContent.css';
import './shared/groupMainSubpageHeader.css';

const WELCOMETITLE__TEXTLABEL = {
  polish: 'Witamy',
  english: 'Welcome',
};

const HOMEPAGETITLE__TEXTLABEL = {
  polish: 'Strona główna',
  english: 'Home Page',
};

const LATESTNOTIFICATIONS__TEXTLABEL = {
  polish: 'Najnowsze powiadomienia',
  english: 'Latest Notifications',
};

const SEE_MORE_BUTTON__TEXTLABEL = {
  polish: 'Zobacz więcej',
  english: 'See More',
};

const GROUPDESCRIPTION__TEXTLABEL = {
  polish: 'Opis grupy',
  english: 'Group Description',
};

const NODESCRIPTION__TEXTLABEL = {
  polish: 'Brak opisu fabularnego grupy.',
  english: 'No group lore description.',
};

const GROUPOVERVIEW__TEXTLABEL = {
  polish: 'Dane grupy',
  english: 'Group Details',
};

const STORYNAME__TEXTLABEL = {
  polish: 'Nazwa fabularna',
  english: 'Story Name',
};

const SUBJECT__TEXTLABEL = {
  polish: 'Przedmiot',
  english: 'Subject',
};

const INSTRUCTOR__TEXTLABEL = {
  polish: 'Prowadzący',
  english: 'Instructor',
};

const CURRENCY__TEXTLABEL = {
  polish: 'Waluta',
  english: 'Currency',
};

const LIVESYSTEM__TEXTLABEL = {
  polish: 'System żyć',
  english: 'Lives System',
};

const NOTIFICATIONSTITLE__TEXTLABEL = {
  polish: 'Powiadomienia',
  english: 'Notifications',
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie danych grupy…',
  english: 'Loading group data…',
};

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

const NOTIFICATIONS_PREVIEW_LIMIT = 5;

export default function GroupMainHomeContent() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { role } = useAppRole();
  const [showTemplatePopup, setShowTemplatePopup] = useState(false);
  const [templatePopupData, setTemplatePopupData] = useState(null);
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);
  const isStudentView = role === APP_ROLE.STUDENT;
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const {
    notifications: previewNotifications,
    isLoading: previewLoading,
    error: previewError,
    markRead,
  } = useGroupBacklogNotifications(groupId, {
    isStudentView,
    take: NOTIFICATIONS_PREVIEW_LIMIT,
    pollMs: BACKLOG_LIST_POLL_MS,
  });

  useEffect(() => {
    if (!isStudentView || location.hash !== '#group-notifications') {
      return;
    }

    const target = document.getElementById('group-notifications');
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [isStudentView, location.hash]);

  useEffect(() => {
    if (location.state?.templateCreatedPopup) {
      setTemplatePopupData(location.state.templateCreatedPopup);
      setShowTemplatePopup(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  if (isLoading) {
    return (
      <>
        <p className="group-main-home__message">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
        {showTemplatePopup && templatePopupData != null ? (
          <GroupMainHomeContentWindow
            popupclose={() => {
              setShowTemplatePopup(false);
              setTemplatePopupData(null);
            }}
            groupname={templatePopupData.groupName}
            subjectname={templatePopupData.subjectName}
          />
        ) : null}
      </>
    );
  }

  if (errorMessage) {
    return (
      <>
        <p className="group-main-home__message group-main-home__message--error" role="alert">
          {errorMessage}
        </p>
        {showTemplatePopup && templatePopupData != null ? (
          <GroupMainHomeContentWindow
            popupclose={() => {
              setShowTemplatePopup(false);
              setTemplatePopupData(null);
            }}
            groupname={templatePopupData.groupName}
            subjectname={templatePopupData.subjectName}
          />
        ) : null}
      </>
    );
  }

  const notificationsSeeMorePath = isStudentView
    ? groupProfileActivityPath(groupId)
    : groupMembersLogPath(groupId);

  const sectionTitle = isStudentView
    ? NOTIFICATIONSTITLE__TEXTLABEL[LANGUAGE]
    : LATESTNOTIFICATIONS__TEXTLABEL[LANGUAGE];

  return (
    <div className="group-main-home">
      <GroupMainSubpageHeader eyebrow={WELCOMETITLE__TEXTLABEL[LANGUAGE]} title={HOMEPAGETITLE__TEXTLABEL[LANGUAGE]} />

      <TexturedSurface className="group-main-home__surface group-main-home__surface--notifications">
        <section
          id="group-notifications"
          className="group-main-home__section"
          aria-label={sectionTitle}
        >
          <h2 className="group-main-home__section-title">{sectionTitle}</h2>
          <NotificationsFeed
            groupId={groupId}
            role={role}
            notifications={previewNotifications}
            isLoading={previewLoading}
            error={previewError}
            limit={NOTIFICATIONS_PREVIEW_LIMIT}
            showDivider
            linkable={isStudentView}
            onMarkRead={(id) => markRead(id)}
            footerLink={{
              label: SEE_MORE_BUTTON__TEXTLABEL[LANGUAGE],
              to: notificationsSeeMorePath,
            }}
          />
        </section>
      </TexturedSurface>

      <TexturedSurface className="group-main-home__surface group-main-home__surface--overview">
        <section className="group-main-home__section group-main-home__section--description" aria-label={GROUPDESCRIPTION__TEXTLABEL[LANGUAGE]}>
          <ContentWithMeasuredDivider
            className="group-main-home__description"
            dividerClassName="group-main-home__description-divider"
          >
            {group?.description?.trim() || NODESCRIPTION__TEXTLABEL[LANGUAGE]}
          </ContentWithMeasuredDivider>
        </section>

        <Divider className="group-main-home__overview-divider" />

        <section className="group-main-home__section" aria-label={GROUPOVERVIEW__TEXTLABEL[LANGUAGE]}>
          <h2 className="group-main-home__section-title">{GROUPOVERVIEW__TEXTLABEL[LANGUAGE]}</h2>
          <InfoRow label={STORYNAME__TEXTLABEL[LANGUAGE]} value={group?.storyName} />
          <InfoRow label={SUBJECT__TEXTLABEL[LANGUAGE]} value={group?.subject} />
          <InfoRow label={INSTRUCTOR__TEXTLABEL[LANGUAGE]} value={group?.lecturer} />
          <InfoRow label={CURRENCY__TEXTLABEL[LANGUAGE]} value={group?.currencyName || group?.currency} />
          <InfoRow label={LIVESYSTEM__TEXTLABEL[LANGUAGE]} value={group?.lives != null ? String(group.lives) : null} />
        </section>
      </TexturedSurface>

      {showTemplatePopup && templatePopupData != null ? (
        <GroupMainHomeContentWindow
          popupclose={() => {
            setShowTemplatePopup(false);
            setTemplatePopupData(null);
          }}
          groupname={templatePopupData.groupName}
          subjectname={templatePopupData.subjectName}
        />
      ) : null}
    </div>
  );
}
