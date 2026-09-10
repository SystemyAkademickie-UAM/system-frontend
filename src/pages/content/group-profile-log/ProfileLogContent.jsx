import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ProfilePageLayout from '../group-profile/ProfilePageLayout.jsx';
import PaginatedNotificationsSection from '../../../components/notifications/PaginatedNotificationsSection.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './ProfileLogContent.css';

const PROFILE_LOG_PAGE_TITLE = {
  polish: 'Dziennik aktywności',
  english: 'Activity Log',
};

const NOTIFICATIONS_SECTION_TITLE = {
  polish: 'Powiadomienia',
  english: 'Notifications',
};

export default function ProfileLogContent() {
  const { groupId } = useParams();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <ProfilePageLayout>
      <div className="profile-log-content">
        <div className="profile-log-content__header">
          <h2 className="profile-log-content__title">{PROFILE_LOG_PAGE_TITLE[LANGUAGE]}</h2>
        </div>
        <PaginatedNotificationsSection
          groupId={groupId}
          isStudentView
          title={NOTIFICATIONS_SECTION_TITLE[LANGUAGE]}
          surfaceClassName="profile-log-content__surface"
          linkable
        />
      </div>
    </ProfilePageLayout>
  );
}
