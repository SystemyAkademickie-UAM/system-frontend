import { Link } from 'react-router-dom';
import { DEMO_GROUP_ID, groupMainPath } from '../../../routes/pathRegistry.js';
import './GroupsListContent.css';

export default function GroupsListContent() {
  return (
    <section className="groups-list" aria-labelledby="groups-list-title">
      <h1 id="groups-list-title" className="groups-list__title">
        Lista grup
      </h1>
      <p className="groups-list__hint">Wybierz grupę, aby przejść do widoku kursu.</p>
      <ul className="groups-list__ul">
        <li>
          <Link className="groups-list__link" to={groupMainPath(DEMO_GROUP_ID)}>
            Przykładowa grupa ({DEMO_GROUP_ID})
          </Link>
        </li>
      </ul>
    </section>
  );
}
