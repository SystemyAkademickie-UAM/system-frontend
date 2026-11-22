/**
 * @file DiskSpaceContent.jsx
 * @description Moduł i ekran zarządzania przestrzenią dyskową dla osoby administrującej.
 */

import { useCallback, useEffect, useMemo, useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useSession } from '../../context/SessionContext.jsx';
import {
  getOrganizationStorage,
  listManageableOrganizations,
} from '../../services/organizationAdmin.api.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './DiskSpaceContent.css';

const TEXTS = {
  polish: {
    pageTitle: 'Zarządzanie przestrzenią dyskową',
    pageDescription:
      'Monitoruj zużycie miejsca na dysku, limity przestrzeni oraz pliki i banery grup w organizacji.',
    loadingOrganizations: 'Wczytywanie listy organizacji...',
    loadingStorage: 'Pobieranie statystyk przestrzeni dyskowej...',
    errorLoading: 'Nie udało się pobrać danych przestrzeni dyskowej.',
    retry: 'Spróbuj ponownie',
    refresh: 'Odśwież',
    orgSelectorLabel: 'Zarządzana organizacja',
    // KPI Cards
    kpiUsedTitle: 'Wykorzystane miejsce',
    kpiQuotaTitle: 'Przydzielony limit',
    kpiAvailableTitle: 'Wolna przestrzeń',
    kpiBannersTitle: 'Wgrane banery i pliki',
    kpiQuotaSub: 'Pula współdzielona serwera: 5 GB',
    kpiMaxFileSize: 'Maksymalny rozmiar pliku: 4 MB',
    // Technical panel
    techPanelTitle: 'Parametry techniczne folderu i alokacji',
    assignedFolderLabel: 'Przypisany folder na serwerze',
    modeBadgeLabel: 'Tryb wglądowy (monitoring limitów)',
    usagePercentageLabel: 'Stopień wykorzystania limitu',
    rulesTitle: 'Zasady alokacji przestrzeni dyskowej:',
    ruleOne:
      'Zasada 1 baner na 1 grupę: Każda osoba prowadząca może przypisać dokładnie jeden baner graficzny do utworzonej przez siebie grupy zajęciowej.',
    ruleTwo:
      'Optymalizacja rozmiaru: Ze względu na łączną pulę 5 GB na maszynie serwera, zalecane jest stosowanie grafik WebP, JPEG lub PNG o rozmiarze poniżej 2 MB.',
    ruleThree:
      'Bezpieczeństwo danych: Pliki przechowywane są w dedykowanym katalogu danej organizacji i serwowane przez zabezpieczony punkt dostępowy z weryfikacją MIME.',
    // Files Inventory
    filesSectionTitle: 'Wykaz wgranych banerów i plików',
    searchPlaceholder: 'Szukaj po nazwie grupy, przedmiocie, osobie prowadzącej lub UUID...',
    sortByLabel: 'Sortuj według',
    sortDateDesc: 'Data wgrania (od najnowszych)',
    sortDateAsc: 'Data wgrania (od najstarszych)',
    sortSizeDesc: 'Rozmiar pliku (od największych)',
    sortSizeAsc: 'Rozmiar pliku (od najmniejszych)',
    sortGroupAsc: 'Nazwa grupy (A-Z)',
    sortGroupDesc: 'Nazwa grupy (Z-A)',
    colPreview: 'Podgląd',
    colGroup: 'Grupa dydaktyczna',
    colLecturer: 'Osoba prowadząca',
    colFileRef: 'Identyfikator pliku (UUID)',
    colSize: 'Rozmiar',
    colMime: 'Format',
    colDate: 'Data wgrania',
    colAction: 'Akcje',
    unassignedGroup: 'Baner w zasobach (brak aktywnej grupy)',
    unassignedLecturer: 'Brak przypisania',
    previewAction: 'Otwórz podgląd',
    emptyFiles: 'W tej organizacji nie wgrano jeszcze żadnych banerów grup.',
    noMatchingFiles: 'Brak plików spełniających kryteria wyszukiwania.',
    totalFilesCount: 'Łącznie plików',
  },
  english: {
    pageTitle: 'Disk Space Management',
    pageDescription:
      'Monitor disk space utilization, quotas, and group files and banners within your organization.',
    loadingOrganizations: 'Loading organizations...',
    loadingStorage: 'Fetching storage statistics...',
    errorLoading: 'Failed to fetch storage data.',
    retry: 'Retry',
    refresh: 'Refresh',
    orgSelectorLabel: 'Managed organization',
    // KPI Cards
    kpiUsedTitle: 'Used space',
    kpiQuotaTitle: 'Allocated quota',
    kpiAvailableTitle: 'Available space',
    kpiBannersTitle: 'Uploaded banners & files',
    kpiQuotaSub: 'Shared server host pool: 5 GB',
    kpiMaxFileSize: 'Max single file size: 4 MB',
    // Technical panel
    techPanelTitle: 'Technical folder and allocation parameters',
    assignedFolderLabel: 'Assigned server folder',
    modeBadgeLabel: 'Inspection mode (quota monitoring)',
    usagePercentageLabel: 'Quota utilization level',
    rulesTitle: 'Storage allocation policies:',
    ruleOne:
      '1 banner per group policy: Each leading person may upload exactly one custom graphic banner per course group.',
    ruleTwo:
      'Size optimization: Due to the shared 5 GB host machine capacity, using compressed WebP, JPEG, or PNG images under 2 MB is strongly recommended.',
    ruleThree:
      'Data isolation: Files are isolated inside the organization folder and served through an authenticated endpoint with MIME detection.',
    // Files Inventory
    filesSectionTitle: 'Stored banners and files inventory',
    searchPlaceholder: 'Search by group name, subject, leading person, or UUID...',
    sortByLabel: 'Sort by',
    sortDateDesc: 'Upload date (newest first)',
    sortDateAsc: 'Upload date (oldest first)',
    sortSizeDesc: 'File size (largest first)',
    sortSizeAsc: 'File size (smallest first)',
    sortGroupAsc: 'Group name (A-Z)',
    sortGroupDesc: 'Group name (Z-A)',
    colPreview: 'Preview',
    colGroup: 'Course group',
    colLecturer: 'Leading person',
    colFileRef: 'File identifier (UUID)',
    colSize: 'Size',
    colMime: 'Format',
    colDate: 'Upload date',
    colAction: 'Actions',
    unassignedGroup: 'Resource file (no active group link)',
    unassignedLecturer: 'Unassigned',
    previewAction: 'Open preview',
    emptyFiles: 'This organization does not have any group banners uploaded yet.',
    noMatchingFiles: 'No files match the specified search query.',
    totalFilesCount: 'Total files',
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

export default function DiskSpaceContent() {
  const language = READLANGUAGECOOKIE();
  const copy = TEXTS[language] ?? TEXTS.english;
  const session = useSession();

  const isSuperAdmin =
    session.user?.roles?.includes('super') ||
    session.user?.activeRole === 'super' ||
    session.user?.role === 'super';

  const [organizations, setOrganizations] = useState([]);
  const [selectedOrgId, setSelectedOrgId] = useState(null);
  const [storageData, setStorageData] = useState(null);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Search & Sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('dateDesc');

  // 1. Load manageable organizations
  useEffect(() => {
    let active = true;
    setLoadingOrgs(true);
    setErrorMessage(null);

    listManageableOrganizations()
      .then((orgs) => {
        if (!active) return;
        const filteredOrgs = isSuperAdmin
          ? orgs
          : orgs.filter((org) => org.name !== 'MyAcademyQuest Internal');
        setOrganizations(filteredOrgs);
        if (filteredOrgs.length > 0) {
          const userOrg = filteredOrgs.find((o) => o.id === session.user?.organizationId);
          setSelectedOrgId(userOrg ? userOrg.id : filteredOrgs[0].id);
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

  // 2. Load storage data for selected organization
  const fetchStorage = useCallback(
    async (orgId) => {
      if (!orgId) return;
      setLoadingStorage(true);
      setErrorMessage(null);
      try {
        const data = await getOrganizationStorage(orgId);
        setStorageData(data);
      } catch (err) {
        setErrorMessage(err instanceof Error ? err.message : copy.errorLoading);
      } finally {
        setLoadingStorage(false);
      }
    },
    [copy.errorLoading],
  );

  useEffect(() => {
    if (selectedOrgId) {
      fetchStorage(selectedOrgId);
    }
  }, [selectedOrgId, fetchStorage]);

  // 3. Filter and sort file inventory
  const filteredAndSortedFiles = useMemo(() => {
    if (!storageData?.files) {
      return [];
    }

    let result = [...storageData.files];

    // Filter
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      result = result.filter((file) => {
        const groupName = (file.groupName || '').toLowerCase();
        const subjectName = (file.subjectName || '').toLowerCase();
        const lecturerName = (file.lecturerName || '').toLowerCase();
        const lecturerEmail = (file.lecturerEmail || '').toLowerCase();
        const ref = (file.ref || '').toLowerCase();
        return (
          groupName.includes(query) ||
          subjectName.includes(query) ||
          lecturerName.includes(query) ||
          lecturerEmail.includes(query) ||
          ref.includes(query)
        );
      });
    }

    // Sort
    result.sort((a, b) => {
      switch (sortOption) {
        case 'dateAsc':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'sizeDesc':
          return b.size - a.size;
        case 'sizeAsc':
          return a.size - b.size;
        case 'groupAsc':
          return (a.groupName || '').localeCompare(b.groupName || '');
        case 'groupDesc':
          return (b.groupName || '').localeCompare(a.groupName || '');
        case 'dateDesc':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return result;
  }, [storageData?.files, searchQuery, sortOption]);

  if (loadingOrgs) {
    return (
      <AppSectionPage title={copy.pageTitle} description={copy.pageDescription}>
        <div className="disk-space-loading-wrapper">
          <LoadingSpinner />
          <p className="disk-space-loading-text">{copy.loadingOrganizations}</p>
        </div>
      </AppSectionPage>
    );
  }

  const usagePercent = storageData?.usagePercent ?? 0;

  return (
    <AppSectionPage title={copy.pageTitle} description={copy.pageDescription}>
      <div className="disk-space-container">
        {/* Top Control Bar */}
        <div className="disk-space-top-bar">
          {isSuperAdmin && organizations.length > 1 && (
            <div className="disk-space-org-picker">
              <label htmlFor="disk-space-org-select" className="disk-space-picker-label">
                {copy.orgSelectorLabel}:
              </label>
              <select
                id="disk-space-org-select"
                className="disk-space-org-select"
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

          <div className="disk-space-actions-row">
            <Button
              variant="secondary"
              onClick={() => fetchStorage(selectedOrgId)}
              disabled={loadingStorage}
            >
              {copy.refresh}
            </Button>
          </div>
        </div>

        {errorMessage && (
          <div className="disk-space-error-banner" role="alert">
            <span>{errorMessage}</span>
            <Button variant="secondary" onClick={() => fetchStorage(selectedOrgId)}>
              {copy.retry}
            </Button>
          </div>
        )}

        {loadingStorage ? (
          <div className="disk-space-loading-wrapper">
            <LoadingSpinner />
            <p className="disk-space-loading-text">{copy.loadingStorage}</p>
          </div>
        ) : storageData ? (
          <>
            {/* 4 KPI Cards */}
            <div className="disk-space-kpi-grid">
              <div className="disk-space-kpi-card">
                <span className="disk-space-kpi-label">{copy.kpiUsedTitle}</span>
                <div className="disk-space-kpi-value-row">
                  <span className="disk-space-kpi-number">
                    {formatBytes(storageData.usedBytes)}
                  </span>
                  <span
                    className={`disk-space-usage-badge ${
                      usagePercent > 90
                        ? 'disk-space-badge-critical'
                        : usagePercent > 75
                        ? 'disk-space-badge-warning'
                        : 'disk-space-badge-normal'
                    }`}
                  >
                    {usagePercent}%
                  </span>
                </div>
              </div>

              <div className="disk-space-kpi-card">
                <span className="disk-space-kpi-label">{copy.kpiQuotaTitle}</span>
                <span className="disk-space-kpi-number">
                  {formatBytes(storageData.quotaBytes)}
                </span>
                <span className="disk-space-kpi-sub">{copy.kpiQuotaSub}</span>
              </div>

              <div className="disk-space-kpi-card">
                <span className="disk-space-kpi-label">{copy.kpiAvailableTitle}</span>
                <span className="disk-space-kpi-number">
                  {formatBytes(storageData.availableBytes)}
                </span>
                <span className="disk-space-kpi-sub">
                  {(100 - usagePercent).toFixed(1)}% {copy.kpiAvailableTitle.toLowerCase()}
                </span>
              </div>

              <div className="disk-space-kpi-card">
                <span className="disk-space-kpi-label">{copy.kpiBannersTitle}</span>
                <span className="disk-space-kpi-number">{storageData.fileCount}</span>
                <span className="disk-space-kpi-sub">{copy.kpiMaxFileSize}</span>
              </div>
            </div>

            {/* Technical Parameters & Folder Info Card */}
            <section className="disk-space-card disk-space-tech-card">
              <div className="disk-space-tech-header">
                <h2 className="disk-space-card-title">{copy.techPanelTitle}</h2>
                <span className="disk-space-mode-pill">{copy.modeBadgeLabel}</span>
              </div>

              <div className="disk-space-progress-section">
                <div className="disk-space-progress-meta">
                  <span className="disk-space-progress-label">
                    {copy.usagePercentageLabel}: <strong>{usagePercent}%</strong>
                  </span>
                  <span className="disk-space-progress-bytes">
                    {formatBytes(storageData.usedBytes)} / {formatBytes(storageData.quotaBytes)}
                  </span>
                </div>
                <div className="disk-space-bar-wrapper">
                  <div
                    className={`disk-space-bar-fill ${
                      usagePercent > 90
                        ? 'disk-space-bar-critical'
                        : usagePercent > 75
                        ? 'disk-space-bar-warning'
                        : 'disk-space-bar-normal'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(2, usagePercent))}%` }}
                  />
                </div>
              </div>

              <div className="disk-space-folder-box">
                <span className="disk-space-folder-label">{copy.assignedFolderLabel}:</span>
                <code className="disk-space-folder-code">{storageData.folderPath}</code>
              </div>

              <div className="disk-space-rules-box">
                <h3 className="disk-space-rules-title">{copy.rulesTitle}</h3>
                <ul className="disk-space-rules-list">
                  <li>{copy.ruleOne}</li>
                  <li>{copy.ruleTwo}</li>
                  <li>{copy.ruleThree}</li>
                </ul>
              </div>
            </section>

            {/* Stored Banners and Files Inventory */}
            <section className="disk-space-card disk-space-files-card">
              <div className="disk-space-files-header">
                <div className="disk-space-files-title-box">
                  <h2 className="disk-space-card-title">{copy.filesSectionTitle}</h2>
                  <span className="disk-space-files-count">
                    ({copy.totalFilesCount}: {filteredAndSortedFiles.length})
                  </span>
                </div>

                <div className="disk-space-filters-row">
                  <input
                    type="text"
                    className="disk-space-search-input"
                    placeholder={copy.searchPlaceholder}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />

                  <div className="disk-space-sort-picker">
                    <label htmlFor="disk-space-sort-select" className="disk-space-sort-label">
                      {copy.sortByLabel}:
                    </label>
                    <select
                      id="disk-space-sort-select"
                      className="disk-space-sort-select"
                      value={sortOption}
                      onChange={(e) => setSortOption(e.target.value)}
                    >
                      <option value="dateDesc">{copy.sortDateDesc}</option>
                      <option value="dateAsc">{copy.sortDateAsc}</option>
                      <option value="sizeDesc">{copy.sortSizeDesc}</option>
                      <option value="sizeAsc">{copy.sortSizeAsc}</option>
                      <option value="groupAsc">{copy.sortGroupAsc}</option>
                      <option value="groupDesc">{copy.sortGroupDesc}</option>
                    </select>
                  </div>
                </div>
              </div>

              {storageData.files.length === 0 ? (
                <div className="disk-space-empty-box">
                  <p className="disk-space-empty-text">{copy.emptyFiles}</p>
                </div>
              ) : filteredAndSortedFiles.length === 0 ? (
                <div className="disk-space-empty-box">
                  <p className="disk-space-empty-text">{copy.noMatchingFiles}</p>
                </div>
              ) : (
                <div className="disk-space-table-wrapper">
                  <table className="disk-space-table">
                    <thead>
                      <tr>
                        <th>{copy.colPreview}</th>
                        <th>{copy.colGroup}</th>
                        <th>{copy.colLecturer}</th>
                        <th>{copy.colFileRef}</th>
                        <th>{copy.colSize}</th>
                        <th>{copy.colMime}</th>
                        <th>{copy.colDate}</th>
                        <th>{copy.colAction}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedFiles.map((file) => (
                        <tr key={file.ref}>
                          <td className="disk-space-td-preview">
                            <div className="disk-space-thumbnail-box">
                              <img
                                src={file.downloadUrl}
                                alt={file.groupName || file.ref}
                                className="disk-space-thumbnail-img"
                                loading="lazy"
                                onError={(e) => {
                                  e.currentTarget.style.display = 'none';
                                }}
                              />
                            </div>
                          </td>
                          <td className="disk-space-td-group">
                            {file.groupName ? (
                              <div className="disk-space-group-meta">
                                <span className="disk-space-group-name">{file.groupName}</span>
                                {file.subjectName && (
                                  <span className="disk-space-subject-name">
                                    {file.subjectName}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="disk-space-unassigned">
                                {copy.unassignedGroup}
                              </span>
                            )}
                          </td>
                          <td className="disk-space-td-lecturer">
                            {file.lecturerName ? (
                              <div className="disk-space-lecturer-meta">
                                <span className="disk-space-lecturer-name">
                                  {file.lecturerName}
                                </span>
                                {file.lecturerEmail && (
                                  <span className="disk-space-lecturer-email">
                                    {file.lecturerEmail}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="disk-space-unassigned">
                                {copy.unassignedLecturer}
                              </span>
                            )}
                          </td>
                          <td className="disk-space-td-ref">
                            <code className="disk-space-ref-code">{file.ref}</code>
                          </td>
                          <td className="disk-space-td-size">
                            <strong>{formatBytes(file.size)}</strong>
                          </td>
                          <td className="disk-space-td-mime">
                            <span className="disk-space-mime-tag">{file.mimeType}</span>
                          </td>
                          <td className="disk-space-td-date">
                            {new Date(file.createdAt).toLocaleDateString(
                              language === 'polish' ? 'pl-PL' : 'en-US',
                            )}
                          </td>
                          <td className="disk-space-td-action">
                            <a
                              href={file.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="disk-space-link-btn"
                            >
                              {copy.previewAction}
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </>
        ) : null}
      </div>
    </AppSectionPage>
  );
}
