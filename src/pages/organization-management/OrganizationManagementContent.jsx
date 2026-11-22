/**
 * @file OrganizationManagementContent.jsx
 * @description Główny komponent widoku zarządzania organizacjami dla osoby nadzorującej (superadmin).
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import DataTable from '../../components/ui/DataTable/DataTable.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import SearchBar from '../../components/ui/SearchBar/SearchBar.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import {
  bulkOrganizations,
  deleteOrganization,
  listAllAdministrators,
  listOrganizations,
} from '../../services/organizations.api.js';
import OrganizationFormModal from './OrganizationFormModal.jsx';
import OrganizationAdminsModal from './OrganizationAdminsModal.jsx';
import './OrganizationManagementContent.css';

const COPY = {
  polish: {
    title: 'Zarządzanie organizacjami',
    description: 'Twórz i konfiguruj organizacje w systemie oraz przypisuj osoby odpowiedzialne za administrowanie nimi.',
    addOrganization: 'Dodaj organizację',
    loading: 'Wczytywanie organizacji...',
    empty: 'Brak zarejestrowanych organizacji.',
    searchPlaceholder: 'Szukaj organizacji (nazwa, domena, reprezentant)...',
    name: 'Nazwa',
    domain: 'Domena',
    loginMethod: 'Metoda logowania',
    accountLimit: 'Limit kont',
    representative: 'Reprezentant',
    admins: 'Administratorzy',
    status: 'Status',
    storageQuota: 'Limit dysku',
    actions: 'Akcje',
    active: 'Aktywna',
    inactive: 'Nieaktywna',
    edit: 'Edytuj',
    delete: 'Usuń',
    manageAdmins: 'Administratorzy',
    deletedSuccess: 'Organizacja została usunięta.',
    confirmDelete: 'Czy na pewno chcesz usunąć organizację: ',
    samlLabel: 'SAML 2.0',
    emailLabel: 'E-mail',
    internalLabel: 'Wewnętrzne',
  },
  english: {
    title: 'Organization Management',
    description: 'Create and configure organizations and assign administrators.',
    addOrganization: 'Add organization',
    loading: 'Loading organizations...',
    empty: 'No organizations found.',
    searchPlaceholder: 'Search organizations (name, domain, representative)...',
    name: 'Name',
    domain: 'Domain',
    loginMethod: 'Login method',
    accountLimit: 'Account limit',
    representative: 'Representative',
    admins: 'Administrators',
    status: 'Status',
    storageQuota: 'Disk quota',
    actions: 'Actions',
    active: 'Active',
    inactive: 'Inactive',
    edit: 'Edit',
    delete: 'Delete',
    manageAdmins: 'Admins',
    deletedSuccess: 'Organization has been removed.',
    confirmDelete: 'Are you sure you want to remove the organization: ',
    samlLabel: 'SAML 2.0',
    emailLabel: 'Email',
    internalLabel: 'Internal',
  },
};

export default function OrganizationManagementContent() {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.polish;
  const { showSuccess, showError } = useToast();

  const [organizations, setOrganizations] = useState([]);
  const [adminsByOrg, setAdminsByOrg] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingOrg, setEditingOrg] = useState(null);

  const [adminsModalOpen, setAdminsModalOpen] = useState(false);
  const [selectedOrgForAdmins, setSelectedOrgForAdmins] = useState(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const basicList = await listOrganizations();
      const allAdmins = await listAllAdministrators().catch(() => []);

      const adminMap = new Map();
      if (Array.isArray(allAdmins)) {
        for (const admin of allAdmins) {
          const orgId = admin.organizationId;
          const current = adminMap.get(orgId) ?? [];
          current.push(admin);
          adminMap.set(orgId, current);
        }
      }
      setAdminsByOrg(adminMap);

      if (Array.isArray(basicList) && basicList.length > 0) {
        const ids = basicList.map((o) => o.id);
        const fullDetails = await bulkOrganizations(ids).catch(() => basicList);
        const rawList = Array.isArray(fullDetails) && fullDetails.length > 0 ? fullDetails : basicList;

        // Normalizacja:
        // Organizacja "MyAcademyQuest Internal" (lub ID 1) ma mieć zawsze ID 0, być na samej górze
        // i nie być zliczana w liczbie organizacji.
        // Pozostałe organizacje mają wyświetlać się z kolejnymi numerami 1, 2, 3...
        // oraz bezpiecznie odczytywać domenę (nawet jeśli w bazie była NULL).
        const internalOrg = rawList.find((org) => org.name === 'MyAcademyQuest Internal' || org.id === 1);
        const externalOrgs = rawList.filter((org) => org !== internalOrg);

        // Sortuj zewnętrzne organizacje według oryginalnego ID
        externalOrgs.sort((a, b) => a.id - b.id);

        const normalizedList = [];

        if (internalOrg) {
          normalizedList.push({
            ...internalOrg,
            originalId: internalOrg.id,
            id: 0,
            isInternalOrg: true,
            domain: internalOrg.domain || 'localhost',
          });
        }

        externalOrgs.forEach((org, index) => {
          let resolvedDomain = org.domain;
          if (!resolvedDomain) {
            if (org.ssoLoginUrl) {
              try {
                resolvedDomain = new URL(org.ssoLoginUrl).hostname;
              } catch {
                resolvedDomain = 'localhost';
              }
            } else if (org.metadataUrl) {
              try {
                resolvedDomain = new URL(org.metadataUrl).hostname;
              } catch {
                resolvedDomain = 'localhost';
              }
            } else {
              resolvedDomain = 'localhost';
            }
          }

          normalizedList.push({
            ...org,
            originalId: org.id,
            id: index + 1, // Kolejne numery: 1, 2, 3...
            domain: resolvedDomain,
            isInternalOrg: false,
          });
        });

        setOrganizations(normalizedList);
      } else {
        setOrganizations([]);
      }
      setReady(true);
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się wczytać listy organizacji.');
      setOrganizations([]);
      setReady(true);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  function handleCreate() {
    setEditingOrg(null);
    setFormModalOpen(true);
  }

  function handleEdit(org) {
    // Jeżeli to organizacja wewnętrzna ze zmienionym ID wizualnym na 0, przekaż do formularza właściwy obiekt
    setEditingOrg(org);
    setFormModalOpen(true);
  }

  function handleManageAdmins(org) {
    setSelectedOrgForAdmins(org);
    setAdminsModalOpen(true);
  }

  async function handleDelete(org) {
    if (org.isInternalOrg || org.id === 0) {
      showError('Organizacja wewnętrzna MyAcademyQuest Internal nie może zostać usunięta.');
      return;
    }

    const confirmed = window.confirm(`${copy.confirmDelete}${org.name}?`);
    if (!confirmed) return;

    try {
      await deleteOrganization(org.originalId || org.id);
      showSuccess(copy.deletedSuccess);
      await loadData();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się usunąć organizacji.');
    }
  }

  // Liczba organizacji z wyłączeniem wewnętrznej organizacji "MyAcademyQuest Internal"
  const organizationCount = useMemo(() => {
    return organizations.filter((org) => !org.isInternalOrg && org.id !== 0).length;
  }, [organizations]);

  const columns = useMemo(() => [
    {
      key: 'id',
      label: 'ID',
      width: '8%',
      sort: 'number',
      accessor: (row) => row.id,
      render: (row) => <span className="org-cell-id">{row.id}</span>,
    },
    {
      key: 'name',
      label: copy.name,
      width: '26%',
      sort: 'text',
      accessor: (row) => row.name,
      render: (row) => (
        <div className="org-cell-name">
          <span className="org-cell-name__title">{row.name}</span>
          {row.address?.town ? (
            <span className="org-cell-name__sub">{row.address.town}{row.address.street ? `, ${row.address.street}` : ''}</span>
          ) : null}
        </div>
      ),
    },
    {
      key: 'domain',
      label: copy.domain,
      width: '18%',
      sort: 'text',
      accessor: (row) => row.domain,
      render: (row) => <code className="org-cell-domain">{row.domain || '-'}</code>,
    },
    {
      key: 'accountLimit',
      label: copy.accountLimit,
      width: '10%',
      sort: 'number',
      accessor: (row) => row.accountLimit,
      render: (row) => row.accountLimit ?? '',
    },
    {
      key: 'loginMethod',
      label: copy.loginMethod,
      width: '14%',
      sort: 'text',
      accessor: (row) => row.loginMethod,
      render: (row) => (
        <span className={`org-cell-badge org-cell-badge--${row.loginMethod}`}>
          {row.loginMethod === 'saml'
            ? copy.samlLabel
            : row.loginMethod === 'email'
              ? copy.emailLabel
              : copy.internalLabel}
        </span>
      ),
    },
    {
      key: 'representative',
      label: copy.representative,
      width: '18%',
      sort: 'text',
      accessor: (row) => row.representative?.fullName ?? row.contactEmail ?? '',
      render: (row) => (
        <div className="org-cell-rep">
          <span className="org-cell-rep__name">{row.representative?.fullName || '-'}</span>
          <span className="org-cell-rep__email">{row.representative?.email || row.contactEmail || ''}</span>
        </div>
      ),
    },
    {
      key: 'admins',
      label: copy.admins,
      width: '10%',
      sort: false,
      render: (row) => {
        const actualId = row.originalId || (row.id === 0 ? 1 : row.id);
        const orgAdmins = adminsByOrg.get(actualId) ?? [];
        return (
          <span className="org-cell-admins-count" title={orgAdmins.map((a) => `${a.name} ${a.surname} (${a.email})`).join(', ')}>
            {orgAdmins.length === 1 ? '1 osoba' : `${orgAdmins.length} osób`}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: copy.status,
      width: '10%',
      sort: 'text',
      accessor: (row) => (row.isActive ? copy.active : copy.inactive),
      render: (row) => (
        <span className={`org-cell-status org-cell-status--${row.isActive ? 'active' : 'inactive'}`}>
          {row.isActive ? copy.active : copy.inactive}
        </span>
      ),
    },
    {
      key: 'storageQuota',
      label: copy.storageQuota,
      width: '10%',
      sort: 'number',
      accessor: (row) => row.storageQuotaMb ?? 100,
      render: (row) => (
        <span className="org-cell-quota">
          {row.storageQuotaMb ? `${row.storageQuotaMb} MB` : '100 MB'}
        </span>
      ),
    },
  ], [adminsByOrg, copy]);

  const rowActions = useMemo(() => ({
    onDelete: (org) => handleDelete(org),
    canDelete: (org) => !org.isInternalOrg && org.id !== 0,
    deleteLabel: copy.delete,
    deleteAriaLabel: (org) => `${copy.delete} ${org.name}`,
    menuItems: [
      {
        id: 'manage-admins',
        label: copy.manageAdmins,
        onSelect: (org) => handleManageAdmins(org),
      },
      {
        id: 'edit',
        label: copy.edit,
        onSelect: (org) => handleEdit(org),
      },
    ],
  }), [copy, handleDelete, handleEdit, handleManageAdmins]);

  return (
    <AppSectionPage
      title={copy.title}
      description={copy.description}
      className="org-management-page"
    >
      <div className="org-management">
        <div className="org-management__top-bar">
          <div className="org-management__actions-left">
            <Button variant="primary" onClick={handleCreate}>
              {copy.addOrganization}
            </Button>
          </div>

          <div className="org-management__right-bar">
            {!loading && ready ? (
              <div className="org-management__count">
                Liczba organizacji: <strong>{organizationCount}</strong>
              </div>
            ) : null}

            <SearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={copy.searchPlaceholder}
              name="organizations-search"
              aria-label={copy.searchPlaceholder}
            />
          </div>
        </div>

        {loading && !ready ? (
          <div className="org-management__loading">
            <LoadingSpinner size="md" />
            <span>{copy.loading}</span>
          </div>
        ) : organizations.length === 0 ? (
          <div className="org-management__empty">
            <p>{copy.empty}</p>
            <Button variant="secondary" onClick={handleCreate}>
              {copy.addOrganization}
            </Button>
          </div>
        ) : (
          <div className="org-management__table-container">
            <DataTable
              key="organizations-table"
              columns={columns}
              data={organizations}
              rowKey="id"
              rowActions={rowActions}
              search={{
                value: searchQuery,
                external: true,
                filter: (row, query) =>
                  `${row.name} ${row.domain} ${row.representative?.fullName ?? ''} ${row.representative?.email ?? ''} ${row.address?.town ?? ''}`
                    .toLowerCase()
                    .includes(query),
              }}
              onRowDoubleClick={handleEdit}
            />
          </div>
        )}
      </div>

      <OrganizationFormModal
        isOpen={formModalOpen}
        onClose={() => setFormModalOpen(false)}
        organization={editingOrg ? { ...editingOrg, id: editingOrg.originalId || (editingOrg.isInternalOrg ? 1 : editingOrg.id) } : null}
        onSaved={loadData}
      />

      <OrganizationAdminsModal
        isOpen={adminsModalOpen}
        onClose={() => setAdminsModalOpen(false)}
        organization={selectedOrgForAdmins ? { ...selectedOrgForAdmins, id: selectedOrgForAdmins.originalId || (selectedOrgForAdmins.isInternalOrg ? 1 : selectedOrgForAdmins.id) } : null}
        onAdminListChanged={loadData}
      />
    </AppSectionPage>
  );
}
