/**
 * @file OrganizationAdminsModal.jsx
 * @description Wybór osoby z organizacji i nadanie jej roli osoby administrującej.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { useSessionOptional } from '../../context/SessionContext.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import {
  grantOrganizationAdministratorByEmail,
  grantOrganizationAdministrator,
  listOrganizationAdministratorCandidates,
  listOrganizationAdministrators,
  revokeOrganizationAdministrator,
} from '../../services/organizations.api.js';

const COPY = {
  polish: {
    title: 'Osoby administrujące',
    search: 'Szukaj osoby (imię, nazwisko, e-mail)',
    peopleWithoutAdmin: 'Pozostałe osoby bez uprawnień administratora',
    assigned: 'Osoby z uprawnieniami administratora',
    grant: 'Nadaj rolę',
    granting: 'Nadawanie...',
    revoke: 'Odbierz rolę',
    revoking: 'Odbieranie...',
    close: 'Zamknij',
    loading: 'Wczytywanie osób...',
    emptyPeople: 'Wszyscy użytkownicy w tej organizacji posiadają uprawnienia administratora.',
    emptyAssigned: 'Nikt jeszcze nie administruje tą organizacją.',
    noMatch: 'Brak osób pasujących do wyszukiwania.',
    samlEmpty: 'Logowanie przez instytucję nie nadaje tej roli. Gdy osoba ma już konto w tej organizacji, wybierz ją na liście.',
    addTitle: 'Dodaj osobę administrującą',
    addHint: 'W organizacji z logowaniem e-mail nikt nie dołącza sam. Podaj imię, nazwisko i adres. Osoba dostanie konto i wejdzie łączem z wiadomości.',
    personName: 'Imię',
    personSurname: 'Nazwisko',
    personEmail: 'Adres e-mail',
    addPerson: 'Dodaj i nadaj rolę',
    addingPerson: 'Dodawanie...',
    granted: 'Rola osoby administrującej została nadana.',
    created: 'Konto zostało utworzone. Ta osoba może poprosić o łącze logowania.',
    revoked: 'Rola osoby administrującej została odebrana.',
    confirmRevoke: 'Odebrać rolę osoby administrującej użytkownikowi',
    nameRequired: 'Podaj imię i nazwisko.',
    emailRequired: 'Podaj adres e-mail.',
    loadError: 'Nie udało się wczytać osób.',
    grantError: 'Nie udało się nadać roli.',
    revokeError: 'Nie udało się odebrać roli.',
  },
  english: {
    title: 'Administering people',
    search: 'Search for a person (name, surname, email)',
    peopleWithoutAdmin: 'Other people without administrator role',
    assigned: 'People with administrator role',
    grant: 'Grant role',
    granting: 'Granting...',
    revoke: 'Remove role',
    revoking: 'Removing...',
    close: 'Close',
    loading: 'Loading people...',
    emptyPeople: 'All users in this organization already have the administrator role.',
    emptyAssigned: 'Nobody administers this organization yet.',
    noMatch: 'No people match this search.',
    samlEmpty: 'Institutional sign-in does not grant this role. When a person already has an account in this organization, choose them in the list.',
    addTitle: 'Add an administering person',
    addHint: 'Nobody joins an email organization on their own. Enter the name, surname, and address. They receive an account and sign in with an email link.',
    personName: 'Name',
    personSurname: 'Surname',
    personEmail: 'Email address',
    addPerson: 'Add and grant the role',
    addingPerson: 'Adding...',
    granted: 'The administering role was granted.',
    created: 'The account was created. This person can request a login link.',
    revoked: 'The administering role was removed.',
    confirmRevoke: 'Remove the administering role from',
    nameRequired: 'Enter a name and surname.',
    emailRequired: 'Enter an email address.',
    loadError: 'People could not be loaded.',
    grantError: 'The role could not be granted.',
    revokeError: 'The role could not be removed.',
  },
};

function personLabel(person) {
  const nickname = person.nickname ? ` (${person.nickname})` : '';
  return `${person.name} ${person.surname}${nickname}`;
}

export default function OrganizationAdminsModal({ isOpen, onClose, organization, onAdminListChanged }) {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.polish;
  const session = useSessionOptional();
  const callerUserId = Number(session?.user?.sub);
  const { showSuccess, showError } = useToast();
  const [admins, setAdmins] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [grantingId, setGrantingId] = useState(null);
  const [revokingId, setRevokingId] = useState(null);
  const [emailPerson, setEmailPerson] = useState({ name: '', surname: '', email: '' });
  const [grantingByEmail, setGrantingByEmail] = useState(false);

  const loadPeople = useCallback(async () => {
    if (!organization) {
      return;
    }
    setLoading(true);
    try {
      const [adminRows, candidateRows] = await Promise.all([
        listOrganizationAdministrators(organization.id),
        listOrganizationAdministratorCandidates(organization.id),
      ]);
      setAdmins(Array.isArray(adminRows) ? adminRows : []);
      setCandidates(Array.isArray(candidateRows) ? candidateRows : []);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [organization, showError, copy.loadError]);

  useEffect(() => {
    if (isOpen && organization) {
      setQuery('');
      setEmailPerson({ name: '', surname: '', email: '' });
      loadPeople();
    }
  }, [isOpen, organization, loadPeople]);

  const visibleAdmins = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle === '') {
      return admins;
    }
    return admins.filter((person) =>
      `${person.name} ${person.surname} ${person.nickname ?? ''} ${person.email}`.toLowerCase().includes(needle)
    );
  }, [admins, query]);

  const visibleCandidates = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return candidates.filter((person) => {
      if (Number.isInteger(callerUserId) && person.userId === callerUserId) {
        return false;
      }
      if (needle === '') {
        return true;
      }
      return `${person.name} ${person.surname} ${person.nickname ?? ''} ${person.email}`.toLowerCase().includes(needle);
    });
  }, [candidates, query, callerUserId]);

  const waitingListEmpty = admins.length === 0 && candidates.length === 0;
  const canAddByEmail = organization?.loginMethod === 'email';

  async function handleGrant(person) {
    setGrantingId(person.userId);
    try {
      await grantOrganizationAdministrator(organization.id, person.userId);
      showSuccess(copy.granted);
      await loadPeople();
      if (onAdminListChanged) {
        onAdminListChanged();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.grantError);
    } finally {
      setGrantingId(null);
    }
  }

  async function handleGrantByEmail(event) {
    event.preventDefault();
    if (!emailPerson.name.trim() || !emailPerson.surname.trim()) {
      showError(copy.nameRequired);
      return;
    }
    if (!emailPerson.email.includes('@')) {
      showError(copy.emailRequired);
      return;
    }
    setGrantingByEmail(true);
    try {
      await grantOrganizationAdministratorByEmail(organization.id, {
        email: emailPerson.email.trim(),
        name: emailPerson.name.trim(),
        surname: emailPerson.surname.trim(),
      });
      showSuccess(copy.created);
      setEmailPerson({ name: '', surname: '', email: '' });
      await loadPeople();
      if (onAdminListChanged) {
        onAdminListChanged();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.grantError);
    } finally {
      setGrantingByEmail(false);
    }
  }

  async function handleRevoke(admin) {
    const confirmed = window.confirm(`${copy.confirmRevoke} ${personLabel(admin)} (${admin.email})?`);
    if (!confirmed) {
      return;
    }
    setRevokingId(admin.accountId);
    try {
      await revokeOrganizationAdministrator(organization.id, admin.accountId);
      showSuccess(copy.revoked);
      await loadPeople();
      if (onAdminListChanged) {
        onAdminListChanged();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.revokeError);
    } finally {
      setRevokingId(null);
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.title}
      subtitle={organization ? organization.name : ''}
      size="md"
      showFooter={false}
    >
      <div className="org-admins-modal">
        {loading ? (
          <div className="org-admins-modal__loading">
            <LoadingSpinner size="sm" />
            <span>{copy.loading}</span>
          </div>
        ) : (
          <>
            {canAddByEmail ? (
              <form className="org-admins-modal__form" onSubmit={handleGrantByEmail}>
                <h4 className="org-admins-modal__list-title">{copy.addTitle}</h4>
                <p className="org-admins-modal__hint">{copy.addHint}</p>
                <TextField
                  id="admin-email-name"
                  label={copy.personName}
                  value={emailPerson.name}
                  onChange={(event) => setEmailPerson((current) => ({ ...current, name: event.target.value }))}
                  disabled={grantingByEmail}
                />
                <TextField
                  id="admin-email-surname"
                  label={copy.personSurname}
                  value={emailPerson.surname}
                  onChange={(event) => setEmailPerson((current) => ({ ...current, surname: event.target.value }))}
                  disabled={grantingByEmail}
                />
                <TextField
                  id="admin-email-address"
                  label={copy.personEmail}
                  value={emailPerson.email}
                  onChange={(event) => setEmailPerson((current) => ({ ...current, email: event.target.value }))}
                  disabled={grantingByEmail}
                />
                <Button type="submit" disabled={grantingByEmail}>
                  {grantingByEmail ? copy.addingPerson : copy.addPerson}
                </Button>
              </form>
            ) : null}

            {!canAddByEmail && waitingListEmpty ? (
              <p className="org-admins-modal__hint">{copy.samlEmpty}</p>
            ) : null}

            {!waitingListEmpty ? (
              <div className="org-admins-modal__search-wrapper">
                <SearchBar
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.search}
                  name="administrator-search"
                />
              </div>
            ) : null}

            {!waitingListEmpty ? (
              <div className="org-admins-modal__list-container">
                <h4 className="org-admins-modal__list-title">{copy.assigned} ({admins.length})</h4>
                {visibleAdmins.length === 0 ? (
                  <div className="org-admins-modal__empty">
                    {admins.length === 0 ? copy.emptyAssigned : copy.noMatch}
                  </div>
                ) : (
                  <ul className="org-admins-modal__list">
                    {visibleAdmins.map((admin) => (
                      <li key={admin.accountId} className="org-admins-modal__item">
                        <div className="org-admins-modal__item-info">
                          <span className="org-admins-modal__item-name">{personLabel(admin)}</span>
                          <span className="org-admins-modal__item-email">{admin.email}</span>
                        </div>
                        <Button
                          size="sm"
                          variant="danger"
                          disabled={revokingId === admin.accountId || admin.userId === callerUserId}
                          onClick={() => handleRevoke(admin)}
                        >
                          {revokingId === admin.accountId ? copy.revoking : copy.revoke}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}

            {!waitingListEmpty ? (
              <div className="org-admins-modal__list-container">
                <h4 className="org-admins-modal__list-title">{copy.peopleWithoutAdmin} ({candidates.length})</h4>
                {visibleCandidates.length === 0 ? (
                  <div className="org-admins-modal__empty">
                    {candidates.length === 0 ? copy.emptyPeople : copy.noMatch}
                  </div>
                ) : (
                  <ul className="org-admins-modal__list">
                    {visibleCandidates.map((person) => (
                      <li key={person.userId} className="org-admins-modal__item">
                        <div className="org-admins-modal__item-info">
                          <span className="org-admins-modal__item-name">{personLabel(person)}</span>
                          <span className="org-admins-modal__item-email">{person.email}</span>
                        </div>
                        <Button
                          size="sm"
                          disabled={grantingId === person.userId}
                          onClick={() => handleGrant(person)}
                        >
                          {grantingId === person.userId ? copy.granting : copy.grant}
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </>
        )}

        <div className="org-admins-modal__footer">
          <Button variant="ghost" onClick={onClose}>{copy.close}</Button>
        </div>
      </div>
    </Modal>
  );
}
