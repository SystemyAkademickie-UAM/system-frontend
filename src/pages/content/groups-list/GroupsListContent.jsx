import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { SearchBar, Button } from '../../../components/ui/index.js';
import { RoleVisibility } from '../../../components/guards/index.js';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { templatesPath } from '../../../routes/pathRegistry.js';
import GroupCard from './GroupCard.jsx';
import GroupsListCreator from './GroupsListCreator.jsx';
import GroupsListHero from './GroupsListHero.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { useGroupsList } from './useGroupsList.js';
import './GroupsListContent.css';

function GroupsGrid({ groups, emptyMessage }) {
  if (groups.length === 0) {
    return <p className="groups-list__message groups-list__message--section">{emptyMessage}</p>;
  }

  return (
    <ul className="groups-list__grid">
      {groups.map((group) => (
        <li key={group.id} className="groups-list__grid-item">
          <GroupCard group={group} />
        </li>
      ))}
    </ul>
  );
}

export default function GroupsListContent() {
  const {
    myGroups,
    otherGroups,
    searchQuery,
    setSearchQuery,
    isLoading,
    errorMessage,
    refetch,
  } = useGroupsList();
  const { role } = useAppRole();
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);

  const showOtherGroups = role !== APP_ROLE.LECTURER;
  const hasAnyGroups = myGroups.length > 0 || (showOtherGroups && otherGroups.length > 0);
  const isFiltering = searchQuery.trim().length > 0;

  const handleCreatorClose = () => {
    setIsCreatorOpen(false);
  };

  const handleGroupCreated = async () => {
    await refetch();
    setIsCreatorOpen(false);
  };

  // Portaluj overlay popupa do głównej sekcji treści (#main-content),
  // żeby przykrywał tylko obszar strony, a nie sidebar/superbar.
  const [portalTarget, setPortalTarget] = useState(null);
  useEffect(() => {
    if (typeof document === 'undefined') return;
    setPortalTarget(document.getElementById('main-content'));
  }, []);

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
              variant="secondary"
              className="groups-list__templates-btn"
              to={templatesPath()}
            >
              Galeria szablonów
            </Button>
            <Button
              type="button"
              variant="primary"
              className="groups-list__create-btn"
              onClick={() => setIsCreatorOpen(true)}
            >
              Stwórz grupę
            </Button>
          </RoleVisibility>
        </div>
      </div>

      {isCreatorOpen && portalTarget
        ? createPortal(
            <div
              className="groups-list__creator-overlay"
              role="presentation"
              onClick={(event) => {
                if (event.target === event.currentTarget) {
                  handleCreatorClose();
                }
              }}
            >
              <GroupsListCreator onClose={handleCreatorClose} onCreated={handleGroupCreated} />
            </div>,
            portalTarget,
          )
        : null}

      {errorMessage ? (
        <p className="groups-list__message groups-list__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {isLoading ? (
        <p className="groups-list__message" aria-live="polite">
          Ładowanie grup…
        </p>
      ) : !hasAnyGroups ? (
        <p className="groups-list__message" aria-live="polite">
          {isFiltering
            ? 'Nie znaleziono grup pasujących do wyszukiwania.'
            : 'Brak grup w systemie.'}
        </p>
      ) : (
        <>
          <div className="groups-list__section">
            <GroupsGrid
              groups={myGroups}
              emptyMessage={
                isFiltering
                  ? 'Brak przypisanych grup pasujących do wyszukiwania.'
                  : 'Nie należysz jeszcze do żadnej grupy.'
              }
            />
          </div>

          {showOtherGroups ? (
            <>
              <hr className="groups-list__divider" aria-hidden="true" />

              <div className="groups-list__section">
                <h3 className="groups-list__subsection-title">Pozostałe grupy</h3>
                <GroupsGrid
                  groups={otherGroups}
                  emptyMessage={
                    isFiltering
                      ? 'Brak pozostałych grup pasujących do wyszukiwania.'
                      : 'Brak innych grup w systemie.'
                  }
                />
              </div>
            </>
          ) : null}
        </>
      )}
    </section>
  );
}
