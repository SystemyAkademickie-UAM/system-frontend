import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import PaginatedNotificationsSection from '../../../components/notifications/PaginatedNotificationsSection.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './MembersLogContentContent.css';

const MEMBERSLOGTITLE__TEXTLABEL = {
  polish: 'Dziennik aktywności',
  english: 'Activity Log',
};

export default function MembersLogContentContent() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <div className="members-log">
      <PaginatedNotificationsSection
        groupId={groupId}
        isStudentView={isStudentView}
        title={MEMBERSLOGTITLE__TEXTLABEL[LANGUAGE]}
        surfaceClassName="members-log__surface"
      />
    </div>
  );
}
