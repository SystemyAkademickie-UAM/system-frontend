/**
 * @file UserManagementContent.jsx
 * @description Główny komponent zarządzania użytkownikami / osobami w organizacji.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import DataTable from '../../components/ui/DataTable/DataTable.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import Modal from '../../components/ui/Modal/Modal.jsx';
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import {
  ACCOUNT_COLUMN_WIDTH_EMAIL,
  ACCOUNT_COLUMN_WIDTH_LOGIN_METHOD,
  ACCOUNT_COLUMN_WIDTH_PERSON,
  ACCOUNT_COLUMN_WIDTH_ROLE,
  ACCOUNT_ROLE_ADMINISTRATOR,
  ACCOUNT_ROLE_ALL,
  ACCOUNT_ROLE_LECTURER,
  ACCOUNT_ROLE_STUDENT,
  ACCOUNT_ROLE_SUPER,
  LOGIN_METHOD_EMAIL,
} from '../../constants/organizationAdmin.constants.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import {
  createOrganizationAccount,
  deleteOrganizationAccount,
  downloadOrganizationAccounts,
  importOrganizationAccounts,
  listManageableOrganizations,
  listOrganizationAccounts,
  sendOrganizationLoginLink,
  updateOrganizationAccount,
} from '../../services/organizationAdmin.api.js';
import { parseOrganizationAccountCsv } from './parseOrganizationAccountCsv.js';
import UserAccountForm from './UserAccountForm.jsx';
import './UserManagementContent.css';

const COPY = {
  polish: {
    title: 'Osoby w organizacji',
    empty: 'W tej organizacji nie ma jeszcze kont.',
    loading: 'Wczytywanie osób...',
    add: 'Dodaj osobę (Magic Links)',
    options: 'Opcje',
    export: 'Eksportuj (CSV)',
    import: 'Importuj (CSV)',
    more: 'Kolejne konta',
    save: 'Zapisz',
    saveAnother: 'Zapisz i dodaj kolejną',
    exit: 'Anuluj',
    remove: 'Usuń tę rolę',
    grant: 'Nadaj drugą rolę',
    link: 'Wyślij łącze logowania',
    change: 'Zmień',
    name: 'Imię',
    surname: 'Nazwisko',
    person: 'Osoba',
    nickname: 'Pseudonim',
    email: 'Adres e-mail',
    role: 'Rola',
    allRoles: 'Wszystkie role',
    allUsers: 'Wszyscy użytkownicy',
    allOrganizations: 'Wszyscy',
    organization: 'Organizacja',
    changeOrg: 'Zmień organizację',
    filterRoles: 'Filtruj role',
    student: 'Osoba studiująca',
    lecturer: 'Osoba prowadząca',
    administrator: 'Osoba administrująca',
    superadmin: 'Osoba nadzorująca',
    search: 'Szukaj osoby',
    saved: 'Zapisano.',
    removed: 'Rola została usunięta.',
    atLeastOneRoleRequired: 'Wybierz co najmniej jedną rolę.',
    imported: 'Import zakończony.',
    sent: 'Łącze logowania zostało wysłane.',
    emailInvalid: 'Podaj adres e-mail.',
    nameRequired: 'Podaj imię, nazwisko i pseudonim.',
    roleInvalid: 'Wybierz prawidłową rolę użytkownika.',
    importInvalid: 'Plik musi zawierać kolumny email, name, surname i role.',
    selectOrg: 'Organizacja',
    loginMethod: 'Metoda logowania',
    allMethods: 'Wszystkie metody',
    samlMethod: 'SAML 2.0',
    emailMethod: 'Magic Links',
  },
  english: {
    title: 'People in the organization',
    empty: 'This organization has no accounts yet.',
    loading: 'Loading people...',
    add: 'Add a person (Magic Links)',
    options: 'Options',
    export: 'Export (CSV)',
    import: 'Import (CSV)',
    more: 'More accounts',
    save: 'Save',
    saveAnother: 'Save and add another',
    exit: 'Cancel',
    remove: 'Remove this role',
    grant: 'Grant another role',
    link: 'Send a login link',
    change: 'Change',
    name: 'Name',
    surname: 'Surname',
    person: 'Person',
    nickname: 'Nickname',
    email: 'Email address',
    role: 'Role',
    allRoles: 'All roles',
    allUsers: 'All users',
    allOrganizations: 'All',
    organization: 'Organization',
    changeOrg: 'Change organization',
    filterRoles: 'Filter roles',
    student: 'Studying person',
    lecturer: 'Leading person',
    administrator: 'Administering person',
    superadmin: 'Supervisor',
    search: 'Find a person',
    saved: 'Saved.',
    removed: 'The role was removed.',
    atLeastOneRoleRequired: 'Select at least one role.',
    imported: 'Import finished.',
    sent: 'The login link was sent.',
    emailInvalid: 'Enter an email address.',
    nameRequired: 'Enter a name, surname, and nickname.',
    roleInvalid: 'Choose a valid user role.',
    importInvalid: 'The file needs the columns email, name, surname, and role.',
    selectOrg: 'Organization',
    loginMethod: 'Login method',
    allMethods: 'All methods',
    samlMethod: 'SAML 2.0',
    emailMethod: 'Magic Links',
  },
};

const EMPTY_FORM = {
  email: '',
  name: '',
  surname: '',
  nickname: '',
  role: ACCOUNT_ROLE_STUDENT,
  roles: [ACCOUNT_ROLE_STUDENT],
};
const ROLE_FILTERS = [
  ACCOUNT_ROLE_ALL,
  ACCOUNT_ROLE_STUDENT,
  ACCOUNT_ROLE_LECTURER,
  ACCOUNT_ROLE_ADMINISTRATOR,
  ACCOUNT_ROLE_SUPER,
];

function roleLabel(role, copy) {
  if (role === ACCOUNT_ROLE_LECTURER) return copy.lecturer;
  if (role === ACCOUNT_ROLE_STUDENT) return copy.student;
  if (role === ACCOUNT_ROLE_ADMINISTRATOR) return copy.administrator;
  if (role === ACCOUNT_ROLE_SUPER) return copy.superadmin;
  return role ?? '';
}

function validatePerson(form, needsEmail, copy, canManageAdministrators = false) {
  if (needsEmail && (!form.email || !form.email.trim().includes('@'))) return copy.emailInvalid;
  if (!form.name?.trim() || !form.surname?.trim() || !form.nickname?.trim()) return copy.nameRequired;
  const roles = Array.isArray(form.roles) ? form.roles : (form.role ? [form.role] : []);
  if (roles.length === 0) return copy.atLeastOneRoleRequired;
  if (!canManageAdministrators && roles.includes(ACCOUNT_ROLE_ADMINISTRATOR)) {
    // If user cannot manage administrators and is attempting to add administrator role
    return copy.roleInvalid;
  }
  return '';
}

export default function UserManagementContent() {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.polish;
  const [searchParams] = useSearchParams();
  const session = useSession();
  const { showSuccess, showError } = useToast();

  const isSuperAdmin =
    session.user?.roles?.includes('super') ||
    session.user?.activeRole === 'super' ||
    session.user?.role === 'super';
  const canManageAdministrators =
    session.user?.activeRole === ACCOUNT_ROLE_SUPER || session.user?.role === ACCOUNT_ROLE_SUPER;

  const [organizations, setOrganizations] = useState([]);
  const [activeOrgId, setActiveOrgId] = useState(session.user?.organizationId ?? null);
  const [isAllOrganizations, setIsAllOrganizations] = useState(false);

  // Modale i kontrolki menu
  const [orgPickerOpen, setOrgPickerOpen] = useState(false);
  const [orgSearchQuery, setOrgSearchQuery] = useState('');
  const [orgMethodFilter, setOrgMethodFilter] = useState('all');

  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userModalMode, setUserModalMode] = useState('create'); // 'create' | 'edit'

  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const optionsMenuRef = useRef(null);

  const fileInputRef = useRef(null);
  const openedLinkedAccount = useRef(false);
  const [loginMethod, setLoginMethod] = useState('');
  const [rawItems, setRawItems] = useState([]);
  const [afterAccountId, setAfterAccountId] = useState(null);
  const [roleFilter, setRoleFilter] = useState(ACCOUNT_ROLE_ALL);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Czy wybrana organizacja obsługuje logowanie przez Magic Links
  const isEmailOrganization = !isAllOrganizations && loginMethod === LOGIN_METHOD_EMAIL;

  // Zamykanie menu opcji po kliknięciu poza nim
  useEffect(() => {
    function handleClickOutside(event) {
      if (optionsMenuRef.current && !optionsMenuRef.current.contains(event.target)) {
        setOptionsMenuOpen(false);
      }
    }
    if (optionsMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [optionsMenuOpen]);

  const openEdit = useCallback((personGroup) => {
    const accounts = Array.isArray(personGroup.accounts) && personGroup.accounts.length > 0
      ? personGroup.accounts
      : (personGroup.accountId ? [personGroup] : []);
    const roles = Array.isArray(personGroup.roles) && personGroup.roles.length > 0
      ? personGroup.roles
      : (personGroup.role ? [personGroup.role] : []);
    const primaryAccount = accounts[0] || personGroup;
    const initialRoles = roles.length > 0 ? roles : (primaryAccount.role ? [primaryAccount.role] : [ACCOUNT_ROLE_STUDENT]);

    setEditing({
      ...personGroup,
      accountId: primaryAccount.accountId || primaryAccount.id,
      primaryAccountId: primaryAccount.accountId || primaryAccount.id,
      organizationId: personGroup.organizationId || primaryAccount.organizationId,
      initialRoles: [...initialRoles],
      accounts: [...accounts],
      roles: [...initialRoles],
    });
    setForm({
      email: personGroup.email ?? '',
      name: personGroup.name ?? '',
      surname: personGroup.surname ?? '',
      nickname: personGroup.nickname ?? '',
      role: initialRoles[0] ?? ACCOUNT_ROLE_STUDENT,
      roles: [...initialRoles],
    });
    setUserModalMode('edit');
    setUserModalOpen(true);
  }, []);

  const loadPage = useCallback(
    async (appendAfter, targetOrgId = activeOrgId, isAll = isAllOrganizations) => {
      setLoading(true);
      try {
        const orgList = await listManageableOrganizations().catch(() => []);
        const rawOrgs = Array.isArray(orgList) ? orgList : [];
        // Dla zwykłego administratora ukrywamy wewnętrzną organizację "MyAcademyQuest Internal"
        const validOrgs = isSuperAdmin
          ? rawOrgs
          : rawOrgs.filter((org) => org.name !== 'MyAcademyQuest Internal');
        setOrganizations(validOrgs);

        if (isAll) {
          // Pobierz konta ze wszystkich zarządzalnych organizacji
          const allPromises = validOrgs.map(async (org) => {
            try {
              const res = await listOrganizationAccounts(org.id);
              const orgItems = Array.isArray(res?.items) ? res.items : [];
              return orgItems.map((item) => ({
                ...item,
                organizationId: org.id,
                organizationName: org.name,
                loginMethod: org.loginMethod ?? 'email',
              }));
            } catch {
              return [];
            }
          });
          const allResults = await Promise.all(allPromises);
          const combined = allResults.flat();
          setRawItems(combined);
          setAfterAccountId(null);
          setReady(true);
          setLoading(false);
          return;
        }

        let orgId = targetOrgId;
        if (!orgId && validOrgs.length > 0) {
          orgId = validOrgs[0].id;
          setActiveOrgId(orgId);
        }

        if (!orgId) {
          setLoading(false);
          setRawItems([]);
          setReady(true);
          return;
        }

        const current = validOrgs.find((item) => item.id === orgId);
        setLoginMethod(current?.loginMethod ?? '');

        const page = await listOrganizationAccounts(orgId, appendAfter);
        const rows = Array.isArray(page?.items) ? page.items : [];
        const rowsWithOrg = rows.map((r) => ({
          ...r,
          organizationId: orgId,
          organizationName: current?.name ?? '',
          loginMethod: current?.loginMethod ?? 'email',
        }));

        setRawItems((currentItems) => (appendAfter ? [...currentItems, ...rowsWithOrg] : rowsWithOrg));
        setAfterAccountId(page?.nextAfterAccountId ?? null);

        const requestedId = Number(searchParams.get('accountId'));
        const linked = rowsWithOrg.find((item) => Number(item.accountId) === requestedId);
        if (!appendAfter && linked && !openedLinkedAccount.current) {
          openedLinkedAccount.current = true;
          openEdit(linked);
        }
        setReady(true);
      } catch (err) {
        if (!appendAfter) {
          setRawItems([]);
          setAfterAccountId(null);
        }
        setReady(true);
        showError(err instanceof Error ? err.message : copy.empty);
      } finally {
        setLoading(false);
      }
    },
    [activeOrgId, isAllOrganizations, copy.empty, openEdit, searchParams, showError, isSuperAdmin]
  );

  useEffect(() => {
    loadPage(null, activeOrgId, isAllOrganizations);
  }, [activeOrgId, isAllOrganizations]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelectOrganization(org) {
    setIsAllOrganizations(false);
    setActiveOrgId(org.id);
    setLoginMethod(org.loginMethod ?? '');
    setRawItems([]);
    setAfterAccountId(null);
    setOrgPickerOpen(false);
  }

  function handleSelectAllUsers() {
    setIsAllOrganizations(true);
    setRawItems([]);
    setAfterAccountId(null);
    setOrgPickerOpen(false);
  }

  // Grupowanie kont po osobach (unikalny użytkownik w organizacji lub globalnie)
  const groupedPersons = useMemo(() => {
    const groupsMap = new Map();

    for (const item of rawItems) {
      const groupKey = isAllOrganizations
        ? `${item.userId || item.email}_${item.organizationId}`
        : `${item.userId || item.email}`;

      if (!groupsMap.has(groupKey)) {
        groupsMap.set(groupKey, {
          id: groupKey,
          accountId: item.accountId,
          userId: item.userId,
          email: item.email,
          name: item.name,
          surname: item.surname,
          nickname: item.nickname,
          organizationId: item.organizationId,
          organizationName: item.organizationName,
          loginMethod: item.loginMethod || 'email',
          roles: [item.role],
          accounts: [item],
        });
      } else {
        const existing = groupsMap.get(groupKey);
        if (!existing.roles.includes(item.role)) {
          existing.roles.push(item.role);
        }
        existing.accounts.push(item);
      }
    }

    return Array.from(groupsMap.values()).map((person) => ({
      ...person,
      roleDisplay: person.roles.map((r) => roleLabel(r, copy)).join(', '),
    }));
  }, [rawItems, isAllOrganizations, copy]);

  // Filtrowanie zgrupowanych osób po wybranej roli
  const visibleItems = useMemo(() => {
    if (roleFilter === ACCOUNT_ROLE_ALL) {
      return groupedPersons;
    }
    return groupedPersons.filter((person) => person.roles.includes(roleFilter));
  }, [groupedPersons, roleFilter]);

  // Kolumny tabeli z dynamiczną kolumną "Organizacja" dla widoku "Wszyscy"
  const columns = useMemo(() => {
    const cols = [
      {
        key: 'person',
        label: copy.person,
        width: ACCOUNT_COLUMN_WIDTH_PERSON,
        sort: 'text',
        accessor: (row) => `${row.name} ${row.surname}`,
        render: (row) => `${row.name} ${row.surname}`,
      },
      { key: 'email', label: copy.email, width: ACCOUNT_COLUMN_WIDTH_EMAIL, sort: 'text' },
      {
        key: 'role',
        label: copy.role,
        width: ACCOUNT_COLUMN_WIDTH_ROLE,
        sort: 'text',
        accessor: (row) => row.roleDisplay,
        render: (row) => row.roleDisplay,
      },
      {
        key: 'loginMethod',
        label: copy.loginMethod,
        width: ACCOUNT_COLUMN_WIDTH_LOGIN_METHOD,
        sort: 'text',
        accessor: (row) => row.loginMethod || 'email',
        render: (row) => (
          <span className={`user-management__login-method-badge user-management__login-method-badge--${row.loginMethod || 'email'}`}>
            {row.loginMethod === 'saml' ? copy.samlMethod : copy.emailMethod}
          </span>
        ),
      },
    ];

    if (isAllOrganizations) {
      cols.splice(2, 0, {
        key: 'organization',
        label: copy.organization,
        width: '22%',
        sort: 'text',
        accessor: (row) => row.organizationName || `ID: ${row.organizationId}`,
        render: (row) => (
          <span className="user-management__table-org">{row.organizationName || `ID: ${row.organizationId}`}</span>
        ),
      });
    }

    return cols;
  }, [copy, isAllOrganizations]);

  const rowActions = useMemo(() => ({
    menuItems: [
      {
        id: 'edit',
        label: copy.change,
        onSelect: (row) => openEdit(row),
      },
    ],
  }), [copy.change, openEdit]);

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveNew(addAnother) {
    const problem = validatePerson(form, true, copy, canManageAdministrators);
    if (problem) {
      showError(problem);
      return;
    }
    const selectedRoles = Array.isArray(form.roles) && form.roles.length > 0
      ? form.roles
      : [form.role || ACCOUNT_ROLE_STUDENT];

    try {
      for (const role of selectedRoles) {
        await createOrganizationAccount(activeOrgId, {
          email: form.email.trim(),
          name: form.name.trim(),
          surname: form.surname.trim(),
          nickname: form.nickname.trim(),
          role,
        });
      }
      showSuccess(copy.saved);
      setForm(EMPTY_FORM);
      if (!addAnother) {
        setUserModalOpen(false);
      }
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    const problem = validatePerson(form, false, copy, canManageAdministrators);
    if (problem) {
      showError(problem);
      return;
    }

    const selectedRoles = Array.isArray(form.roles) && form.roles.length > 0
      ? form.roles
      : [form.role || ACCOUNT_ROLE_STUDENT];
    const initialRoles = editing.initialRoles ?? (editing.role ? [editing.role] : []);
    const addedRoles = selectedRoles.filter((r) => !initialRoles.includes(r));
    const removedRoles = initialRoles.filter((r) => !selectedRoles.includes(r));

    try {
      const targetOrg = editing.organizationId || activeOrgId;
      const primaryAccountId = editing.primaryAccountId || editing.accountId || editing.id;
      if (primaryAccountId) {
        await updateOrganizationAccount(targetOrg, primaryAccountId, {
          name: form.name.trim(),
          surname: form.surname.trim(),
          nickname: form.nickname.trim(),
        });
      }

      for (const roleToAdd of addedRoles) {
        await createOrganizationAccount(targetOrg, {
          email: form.email || editing.email,
          name: form.name.trim(),
          surname: form.surname.trim(),
          nickname: form.nickname.trim(),
          role: roleToAdd,
        });
      }

      for (const roleToRemove of removedRoles) {
        const acc = editing.accounts?.find((a) => a.role === roleToRemove);
        const accountIdToDelete = acc?.accountId || (editing.role === roleToRemove ? editing.accountId : null);
        if (accountIdToDelete) {
          await deleteOrganizationAccount(targetOrg, accountIdToDelete);
        }
      }

      showSuccess(copy.saved);
      setUserModalOpen(false);
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function removeRole() {
    if (!editing) return;
    try {
      const targetOrg = editing.organizationId || activeOrgId;
      const accountsToDelete = editing.accounts && editing.accounts.length > 0
        ? editing.accounts
        : [{ accountId: editing.accountId || editing.id }];
      for (const acc of accountsToDelete) {
        if (acc.accountId) {
          await deleteOrganizationAccount(targetOrg, acc.accountId);
        }
      }
      showSuccess(copy.removed);
      setUserModalOpen(false);
      setEditing(null);
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function sendLink() {
    if (!editing) return;
    try {
      const targetOrg = editing.organizationId || activeOrgId;
      await sendOrganizationLoginLink(targetOrg, editing.accountId);
      showSuccess(copy.sent);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function exportAccounts() {
    setOptionsMenuOpen(false);
    try {
      if (isAllOrganizations) {
        showError('Eksport dostępny jest po wybraniu konkretnej organizacji.');
        return;
      }
      const blob = await downloadOrganizationAccounts(activeOrgId);
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'organization-accounts.csv';
      anchor.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function onImportFile(event) {
    setOptionsMenuOpen(false);
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    if (isAllOrganizations) {
      showError('Import dostępny jest po wybraniu konkretnej organizacji.');
      return;
    }
    const users = parseOrganizationAccountCsv(await file.text());
    if (users.length === 0) {
      showError(copy.importInvalid);
      return;
    }
    try {
      const result = await importOrganizationAccounts(activeOrgId, users);
      showSuccess(`${copy.imported} ${result?.created ?? 0}`);
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  const filterLabel = {
    [ACCOUNT_ROLE_ALL]: copy.allRoles,
    [ACCOUNT_ROLE_STUDENT]: copy.student,
    [ACCOUNT_ROLE_LECTURER]: copy.lecturer,
    [ACCOUNT_ROLE_ADMINISTRATOR]: copy.administrator,
    [ACCOUNT_ROLE_SUPER]: copy.superadmin,
  };

  const activeOrgObj = organizations.find((o) => o.id === activeOrgId);
  const activeOrgDisplayName = isAllOrganizations
    ? copy.allOrganizations
    : (activeOrgObj?.name || (activeOrgId ? `ID: ${activeOrgId}` : '-'));

  // Filtrowanie organizacji w modalu wyboru
  const filteredModalOrganizations = useMemo(() => {
    return organizations.filter((org) => {
      const matchesSearch = `${org.name || ''} ${org.id} ${org.domain || ''}`
        .toLowerCase()
        .includes(orgSearchQuery.toLowerCase());
      const matchesMethod =
        orgMethodFilter === 'all' ? true : org.loginMethod === orgMethodFilter;
      return matchesSearch && matchesMethod;
    });
  }, [organizations, orgSearchQuery, orgMethodFilter]);

  return (
    <AppSectionPage title={copy.title}>
      <div className="user-management">
        {/* Karta wyboru organizacji */}
        <div className="user-management__org-card">
          <div className="user-management__org-info">
            <span className="user-management__org-label">{copy.selectOrg}:</span>
            <strong className="user-management__org-name">{activeOrgDisplayName}</strong>
            {!isAllOrganizations && activeOrgObj ? (
              <span className={`user-management__org-badge user-management__org-badge--${activeOrgObj.loginMethod}`}>
                {activeOrgObj.loginMethod === 'saml' ? copy.samlMethod : copy.emailMethod}
              </span>
            ) : null}
          </div>

          <div className="user-management__org-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setOrgSearchQuery('');
                setOrgMethodFilter('all');
                setOrgPickerOpen(true);
              }}
            >
              {copy.changeOrg}
            </Button>
          </div>
        </div>

        {/* Pasek narzędzi z akcjami i opcjami */}
        <div className="user-management__action-bar">
          <div className="user-management__actions-left">
            {/* Przycisk "Dodaj osobę (Magic Links)" widoczny TYLKO dla organizacji z Magic Linkami */}
            {isEmailOrganization ? (
              <Button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setUserModalMode('create');
                  setUserModalOpen(true);
                }}
              >
                {copy.add}
              </Button>
            ) : null}

            <Button
              variant={filtersOpen ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setFiltersOpen((prev) => !prev)}
            >
              {copy.filterRoles} {filtersOpen ? '▲' : '▼'}
            </Button>
          </div>

          <div className="user-management__actions-right">
            {/* Wszyscy użytkownicy */}
            <Button
              variant={isAllOrganizations ? 'primary' : 'secondary'}
              size="sm"
              onClick={handleSelectAllUsers}
            >
              {copy.allUsers}
            </Button>

            {/* Rozwijane menu Opcje */}
            <div className="user-management__options-dropdown" ref={optionsMenuRef}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setOptionsMenuOpen((prev) => !prev)}
                aria-expanded={optionsMenuOpen}
              >
                {copy.options} ▼
              </Button>

              {optionsMenuOpen ? (
                <div className="user-management__options-menu" role="menu">
                  <button
                    type="button"
                    className="user-management__options-item"
                    onClick={exportAccounts}
                    role="menuitem"
                  >
                    {copy.export}
                  </button>
                  <button
                    type="button"
                    className="user-management__options-item"
                    onClick={() => {
                      setOptionsMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    role="menuitem"
                  >
                    {copy.import}
                  </button>
                </div>
              ) : null}
            </div>

            <input
              ref={fileInputRef}
              className="user-management__file"
              type="file"
              accept=".csv,text/csv"
              tabIndex={-1}
              aria-hidden="true"
              onChange={onImportFile}
            />
          </div>
        </div>

        {/* Domyślnie zwinięty panel filtrów po rolach */}
        {filtersOpen ? (
          <div className="user-management__filters-panel">
            <span className="user-management__filters-label">{copy.filterRoles}:</span>
            {ROLE_FILTERS.map((value) => (
              <Button
                key={value}
                variant={value === roleFilter ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => setRoleFilter(value)}
              >
                {filterLabel[value]}
              </Button>
            ))}
          </div>
        ) : null}

        {loading && rawItems.length === 0 ? <LoadingSpinner label={copy.loading} /> : null}
        {!loading && ready && visibleItems.length === 0 ? <p>{copy.empty}</p> : null}

        {visibleItems.length > 0 ? (
          <DataTable
            key={`people-${isAllOrganizations ? 'all' : activeOrgId}`}
            columns={columns}
            data={visibleItems}
            rowKey="id"
            rowActions={rowActions}
            search={{
              placeholder: copy.search,
              filter: (row, query) =>
                `${row.name} ${row.surname} ${row.email} ${row.nickname ?? ''} ${row.organizationName ?? ''} ${row.roleDisplay ?? ''}`
                  .toLowerCase()
                  .includes(query),
            }}
            onRowDoubleClick={openEdit}
          />
        ) : null}

        {afterAccountId && !isAllOrganizations ? (
          <Button variant="secondary" onClick={() => loadPage(afterAccountId)}>
            {copy.more}
          </Button>
        ) : null}
      </div>

      {/* Pop-up tworzenia / edycji osoby */}
      <Modal
        isOpen={userModalOpen}
        onClose={() => setUserModalOpen(false)}
        title={userModalMode === 'create' ? copy.add : 'Edycja osoby'}
        size="md"
        showFooter={false}
      >
        <UserAccountForm
          mode={userModalMode}
          form={form}
          copy={{ ...copy, roleLabel: roleLabel(editing?.role, copy) }}
          emailOrganization={isEmailOrganization}
          allowSuper={isSuperAdmin}
          onChange={updateField}
          onSave={userModalMode === 'create' ? () => saveNew(false) : saveEdit}
          onSaveAnother={() => saveNew(true)}
          onRemove={removeRole}
          onSendLink={sendLink}
          onExit={() => setUserModalOpen(false)}
          canManageAdministrators={canManageAdministrators}
        />
      </Modal>

      {/* Pop-up wyboru organizacji */}
      <Modal
        isOpen={orgPickerOpen}
        onClose={() => setOrgPickerOpen(false)}
        title={copy.changeOrg}
        size="md"
        showFooter={false}
      >
        <div className="org-picker-modal">
          <div className="org-picker-modal__filters">
            <SearchBar
              value={orgSearchQuery}
              onChange={(e) => setOrgSearchQuery(e.target.value)}
              placeholder="Szukaj organizacji..."
              name="org-picker-search"
            />
            <div className="org-picker-modal__method-filter">
              <Button
                size="sm"
                variant={orgMethodFilter === 'all' ? 'primary' : 'secondary'}
                onClick={() => setOrgMethodFilter('all')}
              >
                {copy.allMethods}
              </Button>
              <Button
                size="sm"
                variant={orgMethodFilter === 'email' ? 'primary' : 'secondary'}
                onClick={() => setOrgMethodFilter('email')}
              >
                {copy.emailMethod}
              </Button>
              <Button
                size="sm"
                variant={orgMethodFilter === 'saml' ? 'primary' : 'secondary'}
                onClick={() => setOrgMethodFilter('saml')}
              >
                {copy.samlMethod}
              </Button>
            </div>
          </div>

          <div className="org-picker-modal__table-wrap">
            <table className="org-picker-modal__table">
              <thead>
                <tr>
                  <th style={{ width: '15%' }}>ID</th>
                  <th style={{ width: '55%' }}>{copy.name}</th>
                  <th style={{ width: '30%' }}>{copy.loginMethod}</th>
                </tr>
              </thead>
              <tbody>
                {filteredModalOrganizations.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="org-picker-modal__empty">
                      Brak pasujących organizacji
                    </td>
                  </tr>
                ) : (
                  filteredModalOrganizations.map((org) => {
                    const isSelected = !isAllOrganizations && org.id === activeOrgId;
                    return (
                      <tr
                        key={org.id}
                        className={`org-picker-modal__row ${isSelected ? 'org-picker-modal__row--active' : ''}`}
                        onClick={() => handleSelectOrganization(org)}
                      >
                        <td>
                          <code>{org.id}</code>
                        </td>
                        <td>
                          <strong>{org.name}</strong>
                          {org.domain ? <span style={{ display: 'block', fontSize: '0.8rem', color: '#9ca3af' }}>{org.domain}</span> : null}
                        </td>
                        <td>
                          <span className={`user-management__org-badge user-management__org-badge--${org.loginMethod}`}>
                            {org.loginMethod === 'saml' ? copy.samlMethod : copy.emailMethod}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </AppSectionPage>
  );
}
