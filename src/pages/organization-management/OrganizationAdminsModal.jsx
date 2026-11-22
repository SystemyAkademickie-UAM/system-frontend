/**
 * @file OrganizationAdminsModal.jsx
 * @description Wybór osoby z organizacji i nadanie jej roli osoby administrującej.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import Modal from '../../components/ui/Modal/Modal.jsx';
import TextField from '../../components/ui/TextField/TextField.jsx';
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { useSessionOptional } from '../../context/SessionContext.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import {
  createFirstOrganizationAdministrator,
  grantOrganizationAdministrator,
  listOrganizationAdministratorCandidates,
  listOrganizationAdministrators,
  revokeOrganizationAdministrator,
} from '../../services/organizations.api.js';

const COPY = {
  polish: {
    title: 'Osoby administrujące',
    search: 'Szukaj osoby (imię, nazwisko, e-mail)',
    people: 'Osoby w organizacji',
    assigned: 'Już administrują',
    grant: 'Nadaj rolę',
    granting: 'Nadawanie...',
    revoke: 'Odbierz rolę',
    revoking: 'Odbieranie...',
    close: 'Zamknij',
    loading: 'Wczytywanie osób...',
    emptyPeople: 'Nikt w tej organizacji nie czeka na tę rolę.',
    emptyAssigned: 'Nikt jeszcze nie administruje tą organizacją.',
    noMatch: 'Brak osób pasujących do wyszukiwania.',
    samlEmpty: 'Osoby pojawią się tutaj po pierwszym logowaniu przez instytucję.',
    firstTitle: 'Pierwsza osoba administrująca',
    firstHint: 'W tej organizacji nie ma jeszcze nikogo. Podaj dane osoby. Dostanie konto i będzie mogła wejść łączem z wiadomości e-mail.',
    firstName: 'Imię',
    firstSurname: 'Nazwisko',
    firstEmail: 'Adres e-mail',
    firstSave: 'Dodaj osobę administrującą',
    firstSaving: 'Dodawanie...',
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
    people: 'People in the organization',
    assigned: 'Already administering',
    grant: 'Grant role',
    granting: 'Granting...',
    revoke: 'Remove role',
    revoking: 'Removing...',
    close: 'Close',
    loading: 'Loading people...',
    emptyPeople: 'Nobody in this organization is waiting for this role.',
    emptyAssigned: 'Nobody administers this organization yet.',
    noMatch: 'No people match this search.',
    samlEmpty: 'People appear here after they sign in through their institution.',
    firstTitle: 'First administering person',
    firstHint: 'This organization has nobody yet. Enter the person. They receive an account and can sign in with an email link.',
    firstName: 'Name',
    firstSurname: 'Surname',
    firstEmail: 'Email address',
    firstSave: 'Add administering person',
    firstSaving: 'Adding...',
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
  const [firstPerson, setFirstPerson] = useState({ name: '', surname: '', email: '' });
  const [creatingFirst, setCreatingFirst] = useState(false);

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
      setFirstPerson({ name: '', surname: '', email: '' });
      loadPeople();
    }
  }, [isOpen, organization, loadPeople]);

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

  const organizationIsEmpty = admins.length === 0 && candidates.length === 0;
  const canCreateFirstPerson = organizationIsEmpty && organization?.loginMethod === 'email';

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

  async function handleCreateFirst(event) {
    event.preventDefault();
    if (!firstPerson.name.trim() || !firstPerson.surname.trim()) {
      showError(copy.nameRequired);
      return;
    }
    if (!firstPerson.email.includes('@')) {
      showError(copy.emailRequired);
      return;
    }
    setCreatingFirst(true);
    try {
      await createFirstOrganizationAdministrator(organization.id, {
        email: firstPerson.email.trim(),
        name: firstPerson.name.trim(),
        surname: firstPerson.surname.trim(),
      });
      showSuccess(copy.created);
      setFirstPerson({ name: '', surname: '', email: '' });
      await loadPeople();
      if (onAdminListChanged) {
        onAdminListChanged();
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.grantError);
    } finally {
      setCreatingFirst(false);
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
            {canCreateFirstPerson ? (
              <form className="org-admins-modal__form" onSubmit={handleCreateFirst}>
                <h4 className="org-admins-modal__list-title">{copy.firstTitle}</h4>
                <p className="org-admins-modal__hint">{copy.firstHint}</p>
                <TextField
                  id="first-admin-name"
                  label={copy.firstName}
                  value={firstPerson.name}
                  onChange={(event) => setFirstPerson((current) => ({ ...current, name: event.target.value }))}
                  disabled={creatingFirst}
                />
                <TextField
                  id="first-admin-surname"
                  label={copy.firstSurname}
                  value={firstPerson.surname}
                  onChange={(event) => setFirstPerson((current) => ({ ...current, surname: event.target.value }))}
                  disabled={creatingFirst}
                />
                <TextField
                  id="first-admin-email"
                  label={copy.firstEmail}
                  value={firstPerson.email}
                  onChange={(event) => setFirstPerson((current) => ({ ...current, email: event.target.value }))}
                  disabled={creatingFirst}
                />
                <Button type="submit" disabled={creatingFirst}>
                  {creatingFirst ? copy.firstSaving : copy.firstSave}
                </Button>
              </form>
            ) : null}

            {organizationIsEmpty && organization?.loginMethod !== 'email' ? (
              <p className="org-admins-modal__hint">{copy.samlEmpty}</p>
            ) : null}

            {!organizationIsEmpty ? (
              <div className="org-admins-modal__list-container">
                <h4 className="org-admins-modal__list-title">{copy.people}</h4>
                <SearchBar
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.search}
                  name="administrator-search"
                />
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

            <div className="org-admins-modal__list-container">
              <h4 className="org-admins-modal__list-title">{copy.assigned} ({admins.length})</h4>
              {admins.length === 0 ? (
                <div className="org-admins-modal__empty">{copy.emptyAssigned}</div>
              ) : (
                <ul className="org-admins-modal__list">
                  {admins.map((admin) => (
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
          </>
        )}

        <div className="org-admins-modal__footer">
          <Button variant="ghost" onClick={onClose}>{copy.close}</Button>
        </div>
      </div>
    </Modal>
  );
}

