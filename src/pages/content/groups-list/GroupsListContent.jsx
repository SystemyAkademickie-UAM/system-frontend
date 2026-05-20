import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button,
  PageHeader,
  SearchBar,
  SubNav,
} from '../../../components/ui/index.js';
import { RoleVisibility } from '../../../components/guards/index.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { DEMO_GROUP_ID } from '../../../constants/demo.constants.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import './GroupsListContent.css';

const SUB_NAV_ITEMS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'active', label: 'Aktywne' },
  { id: 'archived', label: 'Archiwum' },
];

export default function GroupsListContent() {
  const [activeSection, setActiveSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <section className="groups-list" aria-labelledby="groups-list-page-title">
      <PageHeader
        title="Twoje grupy"
        description="Wybierz grupę, aby przejść do widoku kursu."
      />

      <SubNav
        ariaLabel="Filtry listy grup"
        items={SUB_NAV_ITEMS}
        activeId={activeSection}
        onSelect={setActiveSection}
      />

      <div className="groups-list__toolbar">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj grup..."
        />

        <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
          <Button onClick={() => {}}>Utwórz nową grupę</Button>
        </RoleVisibility>
      </div>

      <div className="groups-list__demo-link">
        <h2 className="groups-list__demo-heading">Dostępne grupy</h2>
        <ul className="groups-list__ul">
          <li>
            <Link className="groups-list__link" to={groupMainPath(DEMO_GROUP_ID)}>
              Przykładowa grupa ({DEMO_GROUP_ID})
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
