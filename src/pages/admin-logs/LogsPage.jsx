import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import OrganizationLogContent from '../organization-log/OrganizationLogContent.jsx';
import SuperadminLogsContent from '../superadmin-logs/SuperadminLogsContent.jsx';

export default function LogsPage() {
  const { role } = useAppRole();
  if (role === APP_ROLE.SUPERADMIN) {
    return <SuperadminLogsContent />;
  }
  return <OrganizationLogContent />;
}
