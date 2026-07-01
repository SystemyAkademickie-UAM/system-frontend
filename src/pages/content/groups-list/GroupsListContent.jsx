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
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './GroupsListContent.css';

const SECTIONTITLE__TEXTLABEL = {
  polish: 'Twoje grupy',
  english: 'Your Groups',
};
const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj kampanii...',
  english: 'Search campaigns...',
};
const SEARCH__TEXTLABEL = {
  polish: 'Szukaj kampanii po nazwie, przedmiocie lub prowadzącym',
  english: 'Search campaigns by name, subject or lecturer',
};
const TEMPLATESGALLERYBUTTON__TEXTLABEL = {
  polish: 'Galeria szablonów',
  english: 'Templates Gallery',
};
const CREATEGROUPBUTTON__TEXTLABEL = {
  polish: 'Stwórz grupę',
  english: 'Create Group',
};
const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie grup...',
  english: 'Loading groups...',
};
const NOSEARCHRESULTS__TEXTLABEL = {
  polish: 'Nie znaleziono grup pasujących do wyszukiwania.',
  english: 'No groups matching the search.',
};
const NOSYSTEMGROUPS__TEXTLABEL = {
  polish: 'Brak grup w systemie.',
  english: 'No groups in the system.',
};
const NOMYGROUPSSEARCH__TEXTLABEL = {
  polish: 'Brak przypisanych grup pasujących do wyszukiwania.',
  english: 'No assigned groups matching the search.',
};
const NOTINANYGROUP__TEXTLABEL = {
  polish: 'Nie należysz jeszcze do żadnej grupy.',
  english: 'You are not in any group yet.',
};
const OTHERGROUPS__TEXTLABEL = {
  polish: 'Pozostałe grupy',
  english: 'Other Groups',
};
const NOOTHERGROUPSSEARCH__TEXTLABEL = {
  polish: 'Brak pozostałych grup pasujących do wyszukiwania.',
  english: 'No other groups matching the search.',
};
const NOOTHERGROUPS__TEXTLABEL = {
  polish: 'Brak innych grup w systemie.',
  english: 'No other groups in the system.',
};

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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
          {SECTIONTITLE__TEXTLABEL[LANGUAGE]}
        </h2>
        <div className="groups-list__actions">
          <SearchBar
            className="groups-list__search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            aria-label={SEARCH__TEXTLABEL[LANGUAGE]}
          />
          <RoleVisibility allowedRoles={[APP_ROLE.LECTURER, APP_ROLE.ADMIN, APP_ROLE.SUPERADMIN]}>
            <Button
              type="button"
              variant="secondary"
              className="groups-list__templates-btn"
              to={templatesPath()}
            >
              {TEMPLATESGALLERYBUTTON__TEXTLABEL[LANGUAGE]}
            </Button>
            <Button
              type="button"
              variant="primary"
              className="groups-list__create-btn"
              onClick={() => setIsCreatorOpen(true)}
            >
              {CREATEGROUPBUTTON__TEXTLABEL[LANGUAGE]}
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
          {LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>
      ) : !hasAnyGroups ? (
        <p className="groups-list__message" aria-live="polite">
          {isFiltering
            ? NOSEARCHRESULTS__TEXTLABEL[LANGUAGE]
            : NOSYSTEMGROUPS__TEXTLABEL[LANGUAGE]}
        </p>
      ) : (
        <>
          <div className="groups-list__section">
            <GroupsGrid
              groups={myGroups}
              emptyMessage={
                isFiltering
                  ? NOMYGROUPSSEARCH__TEXTLABEL[LANGUAGE]
                  : NOTINANYGROUP__TEXTLABEL[LANGUAGE]
              }
            />
          </div>

          {showOtherGroups ? (
            <>
              <hr className="groups-list__divider" aria-hidden="true" />

              <div className="groups-list__section">
                <h3 className="groups-list__subsection-title">{OTHERGROUPS__TEXTLABEL[LANGUAGE]}</h3>
                <GroupsGrid
                  groups={otherGroups}
                  emptyMessage={
                    isFiltering
                      ? NOOTHERGROUPSSEARCH__TEXTLABEL[LANGUAGE]
                      : NOOTHERGROUPS__TEXTLABEL[LANGUAGE]
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
