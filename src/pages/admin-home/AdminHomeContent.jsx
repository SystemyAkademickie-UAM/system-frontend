/**
 * @file AdminHomeContent.jsx
 * @description Główny pulpit nawigacyjny i centrum zarządzania organizacją dla osoby administrującej.
 */

import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import {
  getOrganizationDashboard,
  listManageableOrganizations,
} from '../../services/organizationAdmin.api.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './AdminHomeContent.css';

const TEXTS = {
  polish: {
    pageTitle: 'Zarządzanie organizacją',
    pageDescription:
      'Przeglądaj parametry instytucji, strukturę kont, podsumowanie grup oraz wykorzystanie przestrzeni dyskowej.',
    loadingOrganizations: 'Wczytywanie listy organizacji...',
    loadingDashboard: 'Pobieranie parametrów organizacji...',
    errorLoading: 'Nie udało się pobrać danych organizacji.',
    retry: 'Spróbuj ponownie',
    refresh: 'Odśwież dane',
    orgSelectorLabel: 'Zarządzana organizacja',
    activeStatus: 'Aktywna',
    inactiveStatus: 'Nieaktywna',
    institutionDetailsTitle: 'Dane i konfiguracja instytucji',
    domainLabel: 'Domena instytucji',
    loginMethodLabel: 'Metoda uwierzytelniania',
    loginMethodSaml: 'SAML 2.0 (PIONIER.id / UAM)',
    loginMethodEmail: 'Jednorazowe łącza e-mail (Magic Link)',
    contactEmailLabel: 'Adres kontaktowy',
    contactPhoneLabel: 'Telefon kontaktowy',
    representativeLabel: 'Osoba reprezentująca',
    addressLabel: 'Adres siedziby',
    notSpecified: 'Nie podano',
    // Card 1: Users
    usersCardTitle: 'Osoby w organizacji',
    usersCardDesc: 'Zarządzaj kontami użytkowników, twórz nowe konta oraz importuj listy z plików CSV.',
    totalAccountsLabel: 'Wszystkie konta',
    studentsRoleLabel: 'Osoby studiujące',
    lecturersRoleLabel: 'Osoby prowadzące',
    adminsRoleLabel: 'Osoby administrujące',
    manageUsersAction: 'Zarządzaj kontami',
    // Card 2: Groups
    groupsCardTitle: 'Grupy zajęciowe',
    groupsCardDesc: 'Monitoruj utworzone grupy dydaktyczne i wdrożone elementy grywalizacji.',
    totalGroupsLabel: 'Grupy dydaktyczne',
    groupsWithBannerLabel: 'Z dedykowanym banerem',
    viewGroupsAction: 'Przeglądaj grupy',
    // Card 3: Disk Space
    storageCardTitle: 'Przestrzeń dyskowa organizacji',
    storageCardDesc: 'Monitoruj wolumen zajęty przez banery grup w przypisanym katalogu serwera.',
    assignedFolderLabel: 'Folder na serwerze',
    usedOfQuotaLabel: 'Wykorzystano',
    ofQuota: 'z limitu',
    bannersCountLabel: 'Banery grup',
    serverPoolNote: 'Zabezpieczona pula w ramach 5 GB przestrzeni maszyny serwera.',
    manageStorageAction: 'Zarządzaj przestrzenią dyskową',
    // Recent activity
    recentActivityTitle: 'Ostatnie zdarzenia w organizacji',
    recentActivityEmpty: 'Brak zarejestrowanych zdarzeń w dzienniku organizacji.',
    viewLogsAction: 'Przejdź do pełnego dziennika logów',
  },
  english: {
    pageTitle: 'Organization Management',
    pageDescription:
      'Review institution parameters, account roster, course group summary, and disk storage utilization.',
    loadingOrganizations: 'Loading organizations...',
    loadingDashboard: 'Fetching organization parameters...',
    errorLoading: 'Failed to fetch organization data.',
    retry: 'Retry',
    refresh: 'Refresh data',
    orgSelectorLabel: 'Managed organization',
    activeStatus: 'Active',
    inactiveStatus: 'Inactive',
    institutionDetailsTitle: 'Institution details and configuration',
    domainLabel: 'Institution domain',
    loginMethodLabel: 'Authentication method',
    loginMethodSaml: 'SAML 2.0 (PIONIER.id / UAM)',
    loginMethodEmail: 'Single-use email links (Magic Link)',
    contactEmailLabel: 'Contact email',
    contactPhoneLabel: 'Contact phone',
    representativeLabel: 'Representative',
    addressLabel: 'Registered address',
    notSpecified: 'Not specified',
    // Card 1: Users
    usersCardTitle: 'People in organization',
    usersCardDesc: 'Manage user accounts, create new accounts, and import rosters from CSV files.',
    totalAccountsLabel: 'Total accounts',
    studentsRoleLabel: 'Studying persons',
    lecturersRoleLabel: 'Leading persons',
    adminsRoleLabel: 'Administering persons',
    manageUsersAction: 'Manage accounts',
    // Card 2: Groups
    groupsCardTitle: 'Course groups',
    groupsCardDesc: 'Monitor created didactic groups and gamification tracks.',
    totalGroupsLabel: 'Course groups',
    groupsWithBannerLabel: 'With custom banner',
    viewGroupsAction: 'View groups',
    // Card 3: Disk Space
    storageCardTitle: 'Organization disk storage',
    storageCardDesc: 'Track disk space occupied by group banners within the assigned server folder.',
    assignedFolderLabel: 'Server folder',
    usedOfQuotaLabel: 'Used',
    ofQuota: 'of quota',
    bannersCountLabel: 'Group banners',
    serverPoolNote: 'Protected allocation within the 5 GB server pool.',
    manageStorageAction: 'Manage disk space',
    // Recent activity
    recentActivityTitle: 'Recent organization events',
    recentActivityEmpty: 'No recorded events in the organization activity backlog yet.',
    viewLogsAction: 'Go to system logs',
  },
};

function formatBytes(bytes) {
  if (typeof bytes !== 'number' || !Number.isFinite(bytes) || bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let val = bytes;
  let idx = 0;
  while (val >= 1024 && idx < units.length - 1) {
    val /= 1024;
    idx++;
  }
  return `${val.toFixed(idx === 0 ? 0 : 2)} ${units[idx]}`;
}

function formatAddress(addr) {
  if (!addr) return null;
  const parts = [
    addr.street && addr.building ? `${addr.street} ${addr.building}` : addr.street || addr.building,
    addr.postalCode && addr.town ? `${addr.postalCode} ${addr.town}` : addr.town || addr.postalCode,
    addr.country?.toUpperCase(),
  ].filter(Boolean);
  return parts.length > 0 ? parts.join(', ') : null;
}

export default function AdminHomeContent() {
  const language = READLANGUAGECOOKIE();
  const copy = TEXTS[language] ?? TEXTS.english;
  const navigate = useNavigate();
  const session = useSession();

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // 1. Load manageable organizations
  useEffect(() => {
    let active = true;
    setLoadingOrgs(true);
    setErrorMessage(null);

    listManageableOrganizations()
      .then((orgs) => {
        if (!active) return;
        setOrganizations(orgs);
        if (orgs.length > 0) {
          const userOrg = orgs.find((o) => o.id === session.user?.organizationId);
          setSelectedOrgId(userOrg ? userOrg.id : orgs[0].id);
        }
      })
      .catch((err) => {
        if (!active) return;
        setErrorMessage(err instanceof Error ? err.message : copy.errorLoading);
      })
      .finally(() => {
        if (active) setLoadingOrgs(false);
      });

    return () => {
      active = false;
    };
  }, [session.user?.organizationId, copy.errorLoading]);

  // 2. Load dashboard data for selected organization
  const fetchDashboard = useCallback(
    async (orgId) => {
      if (!orgId) return;
      setLoadingDashboard(true);
      setErrorMessage(null);
      try {
        const data = await getOrganizationDashboard(orgId);
        setDashboard(data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : copy.errorLoading);
      } finally {
        setLoadingDashboard(false);
      }
    },
    [copy.errorLoading],
  );

  useEffect(() => {
    if (selectedOrgId) {
      fetchDashboard(selectedOrgId);
    }
  }, [selectedOrgId, fetchDashboard]);

  if (loadingOrgs) {
    return (
      <AppSectionPage title={copy.pageTitle} description={copy.pageDescription}>
        <div className="admin-home-loading-wrapper">
          <LoadingSpinner />
          <p className="admin-home-loading-text">{copy.loadingOrganizations}</p>
        </div>
      </AppSectionPage>
    );
  }

  const org = dashboard?.organization;
  const summary = dashboard?.summary;
  const addressFormatted = org ? formatAddress(org.address) : null;
  const storageUsagePercent = summary?.storage?.usagePercent ?? 0;

  return (
    <AppSectionPage title={copy.pageTitle} description={copy.pageDescription}>
      <div className="admin-home-container">
        {/* Top Control Bar */}
        <div className="admin-home-top-bar">
          {organizations.length > 1 && (
            <div className="admin-home-org-picker">
              <label htmlFor="admin-home-org-select" className="admin-home-picker-label">
                {copy.orgSelectorLabel}:
              </label>
              <select
                id="admin-home-org-select"
                className="admin-home-org-select"
                value={selectedOrgId ?? ''}
                onChange={(e) => setSelectedOrgId(Number(e.target.value))}
              >
                {organizations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="admin-home-actions-row">
            <Button
              variant="secondary"
              onClick={() => fetchDashboard(selectedOrgId)}
              disabled={loadingDashboard}
            >
              {copy.refresh}
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="admin-home-error-banner" role="alert">
            <span>{errorMessage}</span>
            <Button variant="secondary" onClick={() => fetchDashboard(selectedOrgId)}>
              {copy.retry}
            </Button>
          </div>
        )}

        {loadingDashboard ? (
          <div className="admin-home-loading-wrapper">
            <LoadingSpinner />
            <p className="admin-home-loading-text">{copy.loadingDashboard}</p>
          </div>
        ) : org && summary ? (
          <>
            {/* Institution Profile Card */}
            <section className="admin-home-card admin-home-profile-card">
              <div className="admin-home-card-header">
                <div className="admin-home-header-left">
                  <h2 className="admin-home-card-title">{org.name}</h2>
                  <span
                    className={`admin-home-status-badge ${
                      org.isActive ? 'admin-home-status-active' : 'admin-home-status-inactive'
                    }`}
                  >
                    {org.isActive ? copy.activeStatus : copy.inactiveStatus}
                  </span>
                </div>
                <div className="admin-home-login-tag">
                  {org.loginMethod === 'email' ? copy.loginMethodEmail : copy.loginMethodSaml}
                </div>
              </div>

              <div className="admin-home-info-grid">
                <div className="admin-home-info-item">
                  <span className="admin-home-info-label">{copy.domainLabel}</span>
                  <span className="admin-home-info-value">{org.domain || copy.notSpecified}</span>
                </div>
                <div className="admin-home-info-item">
                  <span className="admin-home-info-label">{copy.contactEmailLabel}</span>
                  <span className="admin-home-info-value">
                    {org.contactEmail || copy.notSpecified}
                  </span>
                </div>
                <div className="admin-home-info-item">
                  <span className="admin-home-info-label">{copy.contactPhoneLabel}</span>
                  <span className="admin-home-info-value">
                    {org.contactPhone || copy.notSpecified}
                  </span>
                </div>
                <div className="admin-home-info-item">
                  <span className="admin-home-info-label">{copy.representativeLabel}</span>
                  <span className="admin-home-info-value">
                    {org.representative.fullName
                      ? `${org.representative.fullName} (${org.representative.email || ''})`
                      : copy.notSpecified}
                  </span>
                </div>
                <div className="admin-home-info-item admin-home-info-full">
                  <span className="admin-home-info-label">{copy.addressLabel}</span>
                  <span className="admin-home-info-value">
                    {addressFormatted || copy.notSpecified}
                  </span>
                </div>
              </div>
            </section>

            {/* 3 Core Administrative Pillars */}
            <div className="admin-home-modules-grid">
              {/* Pillar 1: User Management */}
              <section className="admin-home-card admin-home-module-card">
                <div className="admin-home-module-header">
                  <h3 className="admin-home-module-title">{copy.usersCardTitle}</h3>
                  <p className="admin-home-module-desc">{copy.usersCardDesc}</p>
                </div>

                <div className="admin-home-kpi-main">
                  <span className="admin-home-kpi-number">{summary.accounts.total}</span>
                  <span className="admin-home-kpi-caption">{copy.totalAccountsLabel}</span>
                </div>

                <div className="admin-home-breakdown-list">
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">{copy.studentsRoleLabel}</span>
                    <span className="admin-home-breakdown-badge">{summary.accounts.students}</span>
                  </div>
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">{copy.lecturersRoleLabel}</span>
                    <span className="admin-home-breakdown-badge">{summary.accounts.lecturers}</span>
                  </div>
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">{copy.adminsRoleLabel}</span>
                    <span className="admin-home-breakdown-badge">
                      {summary.accounts.administrators}
                    </span>
                  </div>
                </div>

                <div className="admin-home-module-footer">
                  <Button variant="primary" onClick={() => navigate('/users')}>
                    {copy.manageUsersAction}
                  </Button>
                </div>
              </section>

              {/* Pillar 2: Groups */}
              <section className="admin-home-card admin-home-module-card">
                <div className="admin-home-module-header">
                  <h3 className="admin-home-module-title">{copy.groupsCardTitle}</h3>
                  <p className="admin-home-module-desc">{copy.groupsCardDesc}</p>
                </div>

                <div className="admin-home-kpi-main">
                  <span className="admin-home-kpi-number">{summary.groups.total}</span>
                  <span className="admin-home-kpi-caption">{copy.totalGroupsLabel}</span>
                </div>

                <div className="admin-home-breakdown-list">
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">
                      {copy.groupsWithBannerLabel}
                    </span>
                    <span className="admin-home-breakdown-badge">
                      {summary.groups.withBanner} / {summary.groups.total}
                    </span>
                  </div>
                </div>

                <div className="admin-home-module-footer">
                  <Button variant="secondary" onClick={() => navigate('/groups')}>
                    {copy.viewGroupsAction}
                  </Button>
                </div>
              </section>

              {/* Pillar 3: Disk Storage */}
              <section className="admin-home-card admin-home-module-card">
                <div className="admin-home-module-header">
                  <h3 className="admin-home-module-title">{copy.storageCardTitle}</h3>
                  <p className="admin-home-module-desc">{copy.storageCardDesc}</p>
                </div>

                <div className="admin-home-kpi-main">
                  <span className="admin-home-kpi-number">
                    {formatBytes(summary.storage.usedBytes)}
                  </span>
                  <span className="admin-home-kpi-caption">
                    {copy.usedOfQuotaLabel} {formatBytes(summary.storage.quotaBytes)} (
                    {storageUsagePercent}%)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="admin-home-storage-bar-wrapper">
                  <div
                    className={`admin-home-storage-bar-fill ${
                      storageUsagePercent > 90
                        ? 'admin-home-bar-critical'
                        : storageUsagePercent > 75
                        ? 'admin-home-bar-warning'
                        : 'admin-home-bar-normal'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(2, storageUsagePercent))}%` }}
                  />
                </div>

                <div className="admin-home-breakdown-list">
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">
                      {copy.assignedFolderLabel}
                    </span>
                    <span className="admin-home-folder-tag">{summary.storage.folderPath}</span>
                  </div>
                  <div className="admin-home-breakdown-row">
                    <span className="admin-home-breakdown-label">{copy.bannersCountLabel}</span>
                    <span className="admin-home-breakdown-badge">
                      {summary.storage.bannersCount}
                    </span>
                  </div>
                </div>

                <p className="admin-home-storage-note">{copy.serverPoolNote}</p>

                <div className="admin-home-module-footer">
                  <Button variant="primary" onClick={() => navigate('/disk-space')}>
                    {copy.manageStorageAction}
                  </Button>
                </div>
              </section>
            </div>

            {/* Recent Activity Section */}
            <section className="admin-home-card admin-home-activity-card">
              <div className="admin-home-card-header">
                <h3 className="admin-home-card-title">{copy.recentActivityTitle}</h3>
                <Button variant="ghost" onClick={() => navigate('/logs')}>
                  {copy.viewLogsAction}
                </Button>
              </div>

              {summary.recentActivity.length === 0 ? (
                <p className="admin-home-empty-activity">{copy.recentActivityEmpty}</p>
              ) : (
                <div className="admin-home-activity-list">
                  {summary.recentActivity.map((log) => (
                    <div key={log.id} className="admin-home-activity-row">
                      <div className="admin-home-activity-meta">
                        <span className="admin-home-activity-kind">{log.kind}</span>
                        <span className="admin-home-activity-time">
                          {new Date(log.occurredAt).toLocaleString(
                            language === 'polish' ? 'pl-PL' : 'en-US',
                          )}
                        </span>
                      </div>
                      <div className="admin-home-activity-body">
                        <span className="admin-home-activity-actor">{log.actorName}</span>
                        {log.groupName && (
                          <span className="admin-home-activity-target">
                            {' '}
                            • {log.groupName}
                          </span>
                        )}
                        {log.fileName && (
                          <span className="admin-home-activity-file">
                            {' '}
                            [{log.fileName}
                            {log.fileSizeBytes ? ` • ${formatBytes(log.fileSizeBytes)}` : ''}]
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AppSectionPage>
  );
}
