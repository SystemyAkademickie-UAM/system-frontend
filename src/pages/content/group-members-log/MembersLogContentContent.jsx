import { useParams } from 'react-router-dom';
import PaginatedNotificationsSection from '../../../components/notifications/PaginatedNotificationsSection.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './MembersLogContentContent.css';

export default function MembersLogContentContent() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <div className="members-log">
      <PaginatedNotificationsSection
        groupId={groupId}
        isStudentView={isStudentView}
        title="Dziennik aktywności"
        surfaceClassName="members-log__surface"
      />
    </div>
  );
}
