import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import DataTable from '../../components/ui/DataTable/DataTable.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import {
  ACCOUNT_COLUMN_WIDTH_CHANGE,
  ACCOUNT_COLUMN_WIDTH_EMAIL,
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
    add: 'Dodaj osobę',
    export: 'Eksport',
    import: 'Importuj',
    more: 'Kolejne konta',
    save: 'Zapisz',
    saveAnother: 'Zapisz i dodaj kolejną',
    exit: 'Wyjdź',
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
    all: 'Wszystkie role',
    student: 'Osoba studiująca',
    lecturer: 'Osoba prowadząca',
    administrator: 'Osoba administrująca',
    superadmin: 'Osoba nadzorująca',
    search: 'Szukaj osoby',
    saved: 'Zapisano.',
    removed: 'Rola została usunięta.',
    imported: 'Import zakończony.',
    sent: 'Łącze logowania zostało wysłane.',
    emailInvalid: 'Podaj adres e-mail.',
    nameRequired: 'Podaj imię i nazwisko.',
    roleInvalid: 'Wybierz prawidłową rolę użytkownika.',
    importInvalid: 'Plik musi zawierać kolumny email, name, surname i role.',
    selectOrg: 'Organizacja',
  },
  english: {
    title: 'People in the organization',
    empty: 'This organization has no accounts yet.',
    loading: 'Loading people...',
    add: 'Add a person',
    export: 'Export',
    import: 'Import',
    more: 'More accounts',
    save: 'Save',
    saveAnother: 'Save and add another',
    exit: 'Exit',
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
    all: 'All roles',
    student: 'Studying person',
    lecturer: 'Leading person',
    administrator: 'Administering person',
    superadmin: 'Supervisor',
    search: 'Find a person',
    saved: 'Saved.',
    removed: 'The role was removed.',
    imported: 'Import finished.',
    sent: 'The login link was sent.',
    emailInvalid: 'Enter an email address.',
    nameRequired: 'Enter a name and a surname.',
    roleInvalid: 'Choose a valid user role.',
    importInvalid: 'The file needs the columns email, name, surname, and role.',
    selectOrg: 'Organization',
  },
};

const EMPTY_FORM = { email: '', name: '', surname: '', nickname: '', role: ACCOUNT_ROLE_STUDENT };
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

function validatePerson(form, needsEmail, copy) {
  if (needsEmail && !form.email.trim().includes('@')) return copy.emailInvalid;
  if (!form.name.trim() || !form.surname.trim()) return copy.nameRequired;
  const allowed = [ACCOUNT_ROLE_STUDENT, ACCOUNT_ROLE_LECTURER, ACCOUNT_ROLE_ADMINISTRATOR, ACCOUNT_ROLE_SUPER];
  if (!allowed.includes(form.role)) return copy.roleInvalid;
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

  const [organizations, setOrganizations] = useState([]);
  const [activeOrgId, setActiveOrgId] = useState(session.user?.organizationId ?? null);

  const fileInputRef = useRef(null);
  const openedLinkedAccount = useRef(false);
  const [loginMethod, setLoginMethod] = useState('');
  const [items, setItems] = useState([]);
  const [afterAccountId, setAfterAccountId] = useState(null);
  const [roleFilter, setRoleFilter] = useState(ACCOUNT_ROLE_ALL);
  const [mode, setMode] = useState('list');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const emailOrganization = loginMethod === LOGIN_METHOD_EMAIL;

  const openEdit = useCallback((item) => {
    setEditing(item);
    setForm({
      email: item.email ?? '',
      name: item.name ?? '',
      surname: item.surname ?? '',
      nickname: item.nickname ?? '',
      role: item.role,
    });
    setMode('edit');
  }, []);

  const loadPage = useCallback(
    async (appendAfter, targetOrgId = activeOrgId) => {
      setLoading(true);
      try {
        const orgList = await listManageableOrganizations().catch(() => []);
        const validOrgs = Array.isArray(orgList) ? orgList : [];
        setOrganizations(validOrgs);

        let orgId = targetOrgId;
        if (!orgId && validOrgs.length > 0) {
          orgId = validOrgs[0].id;
          setActiveOrgId(orgId);
        }

        if (!orgId) {
          setLoading(false);
          setItems([]);
          setReady(true);
          return;
        }

        const current = validOrgs.find((item) => item.id === orgId);
        setLoginMethod(current?.loginMethod ?? '');

        const page = await listOrganizationAccounts(orgId, appendAfter);
        const rows = Array.isArray(page?.items) ? page.items : [];
        setItems((currentItems) => (appendAfter ? [...currentItems, ...rows] : rows));
        setAfterAccountId(page?.nextAfterAccountId ?? null);

        const requestedId = Number(searchParams.get('accountId'));
        const linked = rows.find((item) => Number(item.accountId) === requestedId);
        if (!appendAfter && linked && !openedLinkedAccount.current) {
          openedLinkedAccount.current = true;
          openEdit(linked);
        }
        setReady(true);
      } catch (err) {
        if (!appendAfter) {
          setItems([]);
          setAfterAccountId(null);
        }
        setReady(true);
        showError(err instanceof Error ? err.message : copy.empty);
      } finally {
        setLoading(false);
      }
    },
    [activeOrgId, copy.empty, openEdit, searchParams, showError]
  );

  useEffect(() => {
    loadPage(null, activeOrgId);
  }, [activeOrgId]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOrgChange(newOrgId) {
    setActiveOrgId(newOrgId);
    setItems([]);
    setAfterAccountId(null);
  }

  const visibleItems =
    roleFilter === ACCOUNT_ROLE_ALL
      ? items
      : items.filter((item) => item.role === roleFilter);

  const columns = useMemo(
    () => [
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
        accessor: (row) => roleLabel(row.role, copy),
        render: (row) => roleLabel(row.role, copy),
      },
    ],
    [copy]
  );

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
    const problem = validatePerson(form, true, copy);
    if (problem) {
      showError(problem);
      return;
    }
    try {
      await createOrganizationAccount(activeOrgId, {
        email: form.email.trim(),
        name: form.name.trim(),
        surname: form.surname.trim(),
        nickname: form.nickname.trim(),
        role: form.role,
      });
      showSuccess(copy.saved);
      setForm(EMPTY_FORM);
      if (!addAnother) setMode('list');
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    const problem = validatePerson(form, false, copy);
    if (problem) {
      showError(problem);
      return;
    }
    try {
      await updateOrganizationAccount(activeOrgId, editing.accountId, {
        name: form.name.trim(),
        surname: form.surname.trim(),
        nickname: form.nickname.trim(),
      });
      showSuccess(copy.saved);
      setMode('list');
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function handleGrantRole(targetRole) {
    if (!editing) return;
    try {
      await createOrganizationAccount(activeOrgId, {
        email: editing.email,
        name: form.name.trim(),
        surname: form.surname.trim(),
        nickname: form.nickname.trim(),
        role: targetRole,
      });
      showSuccess(copy.saved);
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function removeRole() {
    if (!editing) return;
    try {
      await deleteOrganizationAccount(activeOrgId, editing.accountId);
      showSuccess(copy.removed);
      setMode('list');
      setEditing(null);
      await loadPage(null);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function sendLink() {
    if (!editing) return;
    try {
      await sendOrganizationLoginLink(activeOrgId, editing.accountId);
      showSuccess(copy.sent);
    } catch (err) {
      showError(err instanceof Error ? err.message : copy.empty);
    }
  }

  async function exportAccounts() {
    try {
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
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
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
    [ACCOUNT_ROLE_ALL]: copy.all,
    [ACCOUNT_ROLE_STUDENT]: copy.student,
    [ACCOUNT_ROLE_LECTURER]: copy.lecturer,
    [ACCOUNT_ROLE_ADMINISTRATOR]: copy.administrator,
    [ACCOUNT_ROLE_SUPER]: copy.superadmin,
  };

  return (
    <AppSectionPage title={copy.title}>
      <div className="user-management">
        {organizations.length > 1 ? (
          <div className="user-management__org-selector">
            <label htmlFor="user-org-select">
              <strong>{copy.selectOrg}:</strong>
            </label>
            <select
              id="user-org-select"
              value={activeOrgId ?? ''}
              onChange={(e) => handleOrgChange(Number(e.target.value))}
            >
              {organizations.map((org) => (
                <option key={org.id} value={org.id}>
                  {org.name} (ID: {org.id})
                </option>
              ))}
            </select>
          </div>
        ) : null}

        {mode === 'list' ? (
          <>
            <div className="user-management__toolbar">
              <Button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setMode('create');
                }}
              >
                {copy.add}
              </Button>
              <Button variant="secondary" onClick={exportAccounts}>
                {copy.export}
              </Button>
              <Button variant="secondary" onClick={() => fileInputRef.current?.click()}>
                {copy.import}
              </Button>
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
            <div className="user-management__toolbar">
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
            {loading && items.length === 0 ? <LoadingSpinner label={copy.loading} /> : null}
            {!loading && ready && visibleItems.length === 0 ? <p>{copy.empty}</p> : null}
            {visibleItems.length > 0 ? (
              <DataTable
                key="people"
                columns={columns}
                data={visibleItems}
                rowKey="accountId"
                rowActions={rowActions}
                search={{
                  placeholder: copy.search,
                  filter: (row, query) =>
                    `${row.name} ${row.surname} ${row.email} ${row.nickname ?? ''}`
                      .toLowerCase()
                      .includes(query),
                }}
                onRowDoubleClick={openEdit}
              />
            ) : null}
            {afterAccountId ? (
              <Button variant="secondary" onClick={() => loadPage(afterAccountId)}>
                {copy.more}
              </Button>
            ) : null}
          </>
        ) : (
          <UserAccountForm
            mode={mode}
            form={form}
            copy={{ ...copy, roleLabel: roleLabel(editing?.role, copy) }}
            emailOrganization={emailOrganization}
            isSuperAdmin={isSuperAdmin}
            onChange={updateField}
            onSave={mode === 'create' ? () => saveNew(false) : saveEdit}
            onSaveAnother={() => saveNew(true)}
            onGrantRole={handleGrantRole}
            onRemove={removeRole}
            onSendLink={sendLink}
            onExit={() => setMode('list')}
          />
        )}
      </div>
    </AppSectionPage>
  );
}
