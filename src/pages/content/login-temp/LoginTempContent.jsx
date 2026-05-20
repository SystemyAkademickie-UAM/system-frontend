import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { DEMO_GROUP_ID } from '../../../constants/demo.constants.js';
import {
  courseManagementPath,
  groupMainPath,
  organizationsPath,
  statisticsPath,
  userManagementPath,
} from '../../../routes/pathRegistry.js';
import { Button, PageHeader } from '../../../components/ui/index.js';
import './LoginTempContent.css';

export default function LoginTempContent() {
  const { role, setRole } = useAppRole();

  return (
    <section className="login-temp" aria-labelledby="login-temp-title">
      <PageHeader
        title="Twoje grupy"
        description="Wybierz grupę, aby przejść do widoku kursu."
      />

      <div className="login-temp__actions">
        <Button to={groupMainPath(DEMO_GROUP_ID)} variant="primary">
          Przykładowa grupa ({DEMO_GROUP_ID})
        </Button>
      </div>

      <div className="login-temp__dev" aria-label="Tymczasowe przełączanie roli i stron głównych">
        <h2 className="login-temp__dev-title">Tymczasowo: widok roli</h2>
        <p className="login-temp__dev-hint">Docelowo rola przyjdzie z API po zalogowaniu.</p>
        <div className="login-temp__dev-roles">
          <Button
            size="sm"
            variant={role === APP_ROLE.STUDENT ? 'primary' : 'secondary'}
            onClick={() => setRole(APP_ROLE.STUDENT)}
          >
            Student
          </Button>
          <Button
            size="sm"
            variant={role === APP_ROLE.LECTURER ? 'primary' : 'secondary'}
            onClick={() => setRole(APP_ROLE.LECTURER)}
          >
            Prowadzący
          </Button>
          <Button
            size="sm"
            variant={role === APP_ROLE.ADMIN ? 'primary' : 'secondary'}
            onClick={() => setRole(APP_ROLE.ADMIN)}
          >
            Administrator
          </Button>
          <Button
            size="sm"
            variant={role === APP_ROLE.SUPERADMIN ? 'primary' : 'secondary'}
            onClick={() => setRole(APP_ROLE.SUPERADMIN)}
          >
            Superadministrator
          </Button>
        </div>

        <h2 className="login-temp__dev-title">Strony główne innych ról</h2>
        <ul className="login-temp__dev-links">
          <li>
            <Button to={userManagementPath()} variant="ghost" size="sm">
              Zarządzanie dostępem (admin)
            </Button>
          </li>
          <li>
            <Button to={courseManagementPath()} variant="ghost" size="sm">
              Zarządzanie kursami (admin)
            </Button>
          </li>
          <li>
            <Button to={statisticsPath()} variant="ghost" size="sm">
              Statystyki
            </Button>
          </li>
          <li>
            <Button to={organizationsPath()} variant="ghost" size="sm">
              Zarządzanie organizacjami (superadmin)
            </Button>
          </li>
        </ul>
      </div>
    </section>
  );
}
