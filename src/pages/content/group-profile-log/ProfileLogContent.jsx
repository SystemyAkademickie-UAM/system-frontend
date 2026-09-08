import { useParams } from 'react-router-dom';
import { useState } from 'react';
import ProfilePageLayout from '../group-profile/ProfilePageLayout.jsx';
import PaginatedNotificationsSection from '../../../components/notifications/PaginatedNotificationsSection.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const PROFILE_LOG_TITLE = {
  polish: 'Dziennik aktywności',
  english: 'Activity Log',
};

export default function ProfileLogContent() {
  const { groupId } = useParams();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  return (
    <ProfilePageLayout>
      <div className="profile-log-content">
        <PaginatedNotificationsSection
          groupId={groupId}
          isStudentView
          title={PROFILE_LOG_TITLE[LANGUAGE]}
          linkable
        />
      </div>
    </ProfilePageLayout>
  );
}
