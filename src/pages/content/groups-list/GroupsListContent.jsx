import { SearchBar, Button } from '../../../components/ui/index.js';
import { RoleVisibility } from '../../../components/guards/index.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import GroupCard from './GroupCard.jsx';
import GroupsListHero from './GroupsListHero.jsx';
import { useGroupsList } from './useGroupsList.js';
import './GroupsListContent.css';

export default function GroupsListContent() {
  const { groups, searchQuery, setSearchQuery, isLoading, errorMessage } = useGroupsList();

  return (
    <section className="groups-list" aria-labelledby="groups-list-section-title">
      <GroupsListHero />

      <div className="groups-list__controls">
        <h2 id="groups-list-section-title" className="groups-list__section-title">
          Twoje grupy
        </h2>
        <div className="groups-list__actions">
          <SearchBar
            className="groups-list__search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj kampanii..."
            aria-label="Szukaj kampanii po nazwie, przedmiocie lub prowadzącym"
          />
          <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
            <Button
              type="button"
              variant="primary"
              className="groups-list__create-btn"
            >
              Stwórz grupę
            </Button>
          </RoleVisibility>
        </div>
      </div>

      {errorMessage ? (
        <p className="groups-list__message groups-list__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <p className="groups-list__message" aria-live="polite">
          Ładowanie grup…
        </p>
      ) : groups.length === 0 ? (
        <p className="groups-list__message" aria-live="polite">
          {searchQuery.trim()
            ? 'Nie znaleziono grup pasujących do wyszukiwania.'
            : 'Brak przypisanych grup.'}
        </p>
      ) : (
        <ul className="groups-list__grid">
          {groups.map((group) => (
            <li key={group.id} className="groups-list__grid-item">
              <GroupCard group={group} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
