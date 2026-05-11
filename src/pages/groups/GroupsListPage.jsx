import { Link } from 'react-router-dom';
import { useAppRole } from '../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import {
  courseManagementPath,
  DEMO_GROUP_ID,
  groupMainPath,
  organizationManagementPath,
  statisticsPath,
  userManagementPath,
} from '../../routes/pathRegistry.js';
import './GroupsListPage.css';

export default function GroupsListPage() {
  const { role, setRole } = useAppRole();

  return (
    <section className="groups-list" aria-labelledby="groups-list-title">
      <h1 id="groups-list-title" className="groups-list__title">
        Twoje grupy
      </h1>
      <p className="groups-list__hint">Wybierz grupę, aby przejść do widoku kursu.</p>
      <ul className="groups-list__ul">
        <li>
          <Link className="groups-list__link" to={groupMainPath(DEMO_GROUP_ID)}>
            Przykładowa grupa ({DEMO_GROUP_ID})
          </Link>
        </li>
      </ul>

      <div className="groups-list__dev" aria-label="Tymczasowe przełączanie roli i stron głównych">
        <h2 className="groups-list__dev-title">Tymczasowo: widok roli</h2>
        <p className="groups-list__dev-hint">Docelowo rola przyjdzie z API po zalogowaniu.</p>
        <div className="groups-list__dev-roles">
          <button
            type="button"
            className={`groups-list__dev-btn${role === APP_ROLE.STUDENT ? ' groups-list__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.STUDENT)}
          >
            Student
          </button>
          <button
            type="button"
            className={`groups-list__dev-btn${role === APP_ROLE.INSTRUCTOR ? ' groups-list__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.INSTRUCTOR)}
          >
            Prowadzący
          </button>
          <button
            type="button"
            className={`groups-list__dev-btn${role === APP_ROLE.ADMIN ? ' groups-list__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.ADMIN)}
          >
            Administrator
          </button>
          <button
            type="button"
            className={`groups-list__dev-btn${role === APP_ROLE.SUPERADMIN ? ' groups-list__dev-btn--active' : ''}`}
            onClick={() => setRole(APP_ROLE.SUPERADMIN)}
          >
            Superadministrator
          </button>
        </div>

        <h2 className="groups-list__dev-title">Strony główne innych ról</h2>
        <ul className="groups-list__dev-links">
          <li>
            <Link className="groups-list__dev-link" to={userManagementPath()}>
              Zarządzanie dostępem (admin)
            </Link>
          </li>
          <li>
            <Link className="groups-list__dev-link" to={courseManagementPath()}>
              Zarządzanie kursami (admin)
            </Link>
          </li>
          <li>
            <Link className="groups-list__dev-link" to={statisticsPath()}>
              Statystyki
            </Link>
          </li>
          <li>
            <Link className="groups-list__dev-link" to={organizationManagementPath()}>
              Zarządzanie organizacjami (superadmin)
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
