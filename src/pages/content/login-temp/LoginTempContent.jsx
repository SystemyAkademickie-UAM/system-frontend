import { Link } from 'react-router-dom';
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
import './LoginTempContent.css';

export default function LoginTempContent() {
  const { role, setRole } = useAppRole();

  return (
    <section className="login-temp" aria-labelledby="login-temp-title">
      <h1 id="login-temp-title" className="login-temp__title">
        Twoje grupy
      </h1>
      <p className="login-temp__hint">Wybierz grupę, aby przejść do widoku kursu.</p>
      <ul className="login-temp__ul">
        <li>
          <Link className="login-temp__link" to={groupMainPath(DEMO_GROUP_ID)}>
            Przykładowa grupa ({DEMO_GROUP_ID})
          </Link>
        </li>
      </ul>

      <div className="login-temp__dev" aria-label="Tymczasowe przełączanie roli i stron głównych">
        <h2 className="login-temp__dev-title">Tymczasowo: widok roli</h2>
        <p className="login-temp__dev-hint">Docelowo rola przyjdzie z API po zalogowaniu.</p>
        <div className="login-temp__dev-roles">
          <button
            type="button"
            className={`login-temp__dev-btn${role === APP_ROLE.STUDENT ? ' login-temp__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.STUDENT)}
          >
            Student
          </button>
          <button
            type="button"
            className={`login-temp__dev-btn${role === APP_ROLE.LECTURER ? ' login-temp__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.LECTURER)}
          >
            Prowadzący
          </button>
          <button
            type="button"
            className={`login-temp__dev-btn${role === APP_ROLE.ADMIN ? ' login-temp__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.ADMIN)}
          >
            Administrator
          </button>
          <button
            type="button"
            className={`login-temp__dev-btn${role === APP_ROLE.SUPERADMIN ? ' login-temp__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.SUPERADMIN)}
          >
            Superadministrator
          </button>
        </div>

        <h2 className="login-temp__dev-title">Strony główne innych ról</h2>
        <ul className="login-temp__dev-links">
          <li>
            <Link className="login-temp__dev-link" to={userManagementPath()}>
              Zarządzanie dostępem (admin)
            </Link>
          </li>
          <li>
            <Link className="login-temp__dev-link" to={courseManagementPath()}>
              Zarządzanie kursami (admin)
            </Link>
          </li>
          <li>
            <Link className="login-temp__dev-link" to={statisticsPath()}>
              Statystyki
            </Link>
          </li>
          <li>
            <Link className="login-temp__dev-link" to={organizationsPath()}>
              Zarządzanie organizacjami (superadmin)
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
