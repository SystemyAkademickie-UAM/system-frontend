/**
 * @file SuperadminLogsContent.jsx
 * @description Główny komponent widoku strony logów systemowych dla osoby nadzorującej.
 * Umożliwia monitorowanie ruchu HTTP, stabilności aplikacji, zdarzeń systemowych oraz sortowanie i filtrowanie po organizacjach.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect, useState, useMemo } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { PRODUCTION_LOG_TODAY_DAY } from '../../constants/productionLogs.constants.js';
import {
  exportEncryptedProductionLogs,
  fetchOrganizations,
  fetchProductionLogDays,
} from '../../services/productionLogs.api.js';
import {
  decryptProductionLogExport,
  generateLogExportKeyPair,
} from '../../utils/decryptProductionLogExport.js';
import {
  filterAndSortLogs,
  parseLogLines,
} from '../../utils/productionLogsParser.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import './SuperadminLogsContent.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const TEXTS = {
  polish: {
    pageTitle: 'Logi systemowe i operacyjne',
    pageSubtitle: 'Podgląd aktualnego ruchu sieciowego, stabilności działania oraz zdarzeń systemowych w podziale na organizacje.',
    roleNotice: 'Widok audytowy przeznaczony wyłącznie dla osoby nadzorującej.',
    dayLabel: 'Dzień logów:',
    todayOption: 'Dzisiaj (na żywo)',
    refreshButton: 'Wczytaj logi',
    refreshingButton: 'Wczytywanie…',
    downloadButton: 'Zapisz logi (.log)',
    copyButton: 'Kopiuj logi',
    copiedNotice: 'Skopiowano do schowka',
    viewStructured: 'Widok tabelaryczny',
    viewRaw: 'Widok surowy (terminal)',

    // Statystyki / KPI
    statTotalEvents: 'Wszystkie zdarzenia',
    statHttpTraffic: 'Ruch HTTP (żądania)',
    statAvgLatency: 'Śr. czas odpowiedzi',
    statErrors: 'Błędy systemowe',
    statWarnings: 'Ostrzeżenia',
    statOrgsCount: 'Aktywne organizacje',

    // Filtry i sortowanie
    filterOrgLabel: 'Organizacja:',
    filterOrgAll: 'Wszystkie organizacje',
    filterOrgSystem: 'System / Globalne',
    filterOrgPublic: 'Ruch publiczny / Goście',

    sortLabel: 'Sortowanie:',
    sortTimeDesc: 'Czas (najnowsze pierwsze)',
    sortTimeAsc: 'Czas (najstarsze pierwsze)',
    sortOrgAsc: 'Organizacja (A - Z)',
    sortOrgDesc: 'Organizacja (Z - A)',
    sortLevelDesc: 'Ważność (Błędy pierwsze)',
    sortDurationDesc: 'Czas odpowiedzi (Najwolniejsze)',

    filterLevelLabel: 'Poziom:',
    filterLevelAll: 'Wszystkie poziomy',
    filterLevelError: 'Błędy (ERROR / FATAL)',
    filterLevelWarn: 'Ostrzeżenia (WARN)',
    filterLevelLog: 'Informacje (LOG / INFO)',
    filterLevelDebug: 'Debug (DEBUG)',

    filterCategoryLabel: 'Kategoria:',
    filterCategoryAll: 'Wszystkie kategorie',
    filterCategoryHttp: 'Ruch HTTP',
    filterCategoryBackup: 'Kopia zapasowa',
    filterCategoryAuth: 'Autoryzacja i sesje',
    filterCategorySystem: 'Operacje systemowe',

    searchPlaceholder: 'Szukaj w logach (ścieżka, błąd, IP, użytkownik)…',
    clearFilters: 'Wyczyść filtry',

    // Tabela
    colTime: 'Czas',
    colLevel: 'Poziom',
    colOrg: 'Organizacja',
    colContext: 'Kontekst',
    colMessage: 'Wiadomość / Zapytanie',
    colAction: 'Szczegóły',

    // Szczegóły wpisu
    detailsTitle: 'Szczegóły wpisu dziennika',
    detailsClientIp: 'Adres IP klienta:',
    detailsUser: 'Identyfikator użytkownika:',
    detailsRole: 'Rola w sesji:',
    detailsDuration: 'Czas wykonania:',
    detailsRawLine: 'Surowy wpis:',
    detailsStack: 'Zrzut błędu / Wyjątek:',
    collapseRow: 'Zwiń',
    expandRow: 'Rozwiń',

    // Paginacja i stany
    emptyLogs: 'Brak wpisów spełniających wybrane kryteria filtrowania.',
    noLogsLoaded: 'Kliknij przycisk „Wczytaj logi”, aby pobrać i odszyfrować dziennik zdarzeń.',
    pagePrev: 'Poprzednia',
    pageNext: 'Następna',
    pageInfo: (current, total, filteredCount) =>
      `Strona ${current} z ${total} (${filteredCount} wpisów)`,
  },
  english: {
    pageTitle: 'System and Operational Logs',
    pageSubtitle: 'Overview of network traffic, runtime stability, and system events organized by academic organizations.',
    roleNotice: 'Audit view designated exclusively for the supervisor role.',
    dayLabel: 'Log date:',
    todayOption: 'Today (live)',
    refreshButton: 'Load logs',
    refreshingButton: 'Loading…',
    downloadButton: 'Save logs (.log)',
    copyButton: 'Copy logs',
    copiedNotice: 'Copied to clipboard',
    viewStructured: 'Structured table',
    viewRaw: 'Raw view (terminal)',

    // Stats / KPI
    statTotalEvents: 'Total events',
    statHttpTraffic: 'HTTP requests',
    statAvgLatency: 'Avg response time',
    statErrors: 'System errors',
    statWarnings: 'Warnings',
    statOrgsCount: 'Active organizations',

    // Filters and sorting
    filterOrgLabel: 'Organization:',
    filterOrgAll: 'All organizations',
    filterOrgSystem: 'System / Global',
    filterOrgPublic: 'Public traffic / Guests',

    sortLabel: 'Sorting:',
    sortTimeDesc: 'Time (newest first)',
    sortTimeAsc: 'Time (oldest first)',
    sortOrgAsc: 'Organization (A - Z)',
    sortOrgDesc: 'Organization (Z - A)',
    sortLevelDesc: 'Severity (Errors first)',
    sortDurationDesc: 'Response time (Slowest first)',

    filterLevelLabel: 'Level:',
    filterLevelAll: 'All levels',
    filterLevelError: 'Errors (ERROR / FATAL)',
    filterLevelWarn: 'Warnings (WARN)',
    filterLevelLog: 'Info (LOG / INFO)',
    filterLevelDebug: 'Debug (DEBUG)',

    filterCategoryLabel: 'Category:',
    filterCategoryAll: 'All categories',
    filterCategoryHttp: 'HTTP traffic',
    filterCategoryBackup: 'Database backup',
    filterCategoryAuth: 'Auth & sessions',
    filterCategorySystem: 'System operations',

    searchPlaceholder: 'Search in logs (path, error, IP, user)…',
    clearFilters: 'Clear filters',

    // Table
    colTime: 'Time',
    colLevel: 'Level',
    colOrg: 'Organization',
    colContext: 'Context',
    colMessage: 'Message / Request',
    colAction: 'Details',

    // Entry details
    detailsTitle: 'Log entry details',
    detailsClientIp: 'Client IP address:',
    detailsUser: 'User identifier:',
    detailsRole: 'Session role:',
    detailsDuration: 'Execution duration:',
    detailsRawLine: 'Raw log line:',
    detailsStack: 'Error stack / Exception:',
    collapseRow: 'Collapse',
    expandRow: 'Expand',

    // Pagination and states
    emptyLogs: 'No log entries match the selected filter criteria.',
    noLogsLoaded: 'Click "Load logs" to fetch and decrypt the event audit trail.',
    pagePrev: 'Previous',
    pageNext: 'Next',
    pageInfo: (current, total, filteredCount) =>
      `Page ${current} of ${total} (${filteredCount} entries)`,
  },
};

const PAGE_SIZE = 50;

/**
 * Widok audytu logów systemowych dla osoby nadzorującej (/logs).
 */
export default function SuperadminLogsContent() {
  const LANGUAGE = READLANGUAGECOOKIE();
  const t = TEXTS[LANGUAGE] || TEXTS.polish;

  const [days, setDays] = useState([]);
  const [selectedDay, setSelectedDay] = useState(PRODUCTION_LOG_TODAY_DAY);
  const [organizations, setOrganizations] = useState([]);
  const [rawLogText, setRawLogText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Filters & sorting
  const [selectedOrg, setSelectedOrg] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchPhrase, setSearchPhrase] = useState('');
  const [sortBy, setSortBy] = useState('time_desc');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'raw'
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedLogId, setExpandedLogId] = useState(null);

  // 1. Initial fetch of available days & organizations
  useEffect(() => {
    let cancelled = false;

    Promise.all([fetchProductionLogDays(), fetchOrganizations()])
      .then(([daysPayload, orgsPayload]) => {
        if (cancelled) return;
        setDays(daysPayload?.days ?? []);
        setOrganizations(orgsPayload ?? []);
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(error instanceof Error ? error.message : String(error));
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Load and decrypt logs
  async function handleLoadLogs() {
    setIsLoading(true);
    setErrorMessage('');
    setExpandedLogId(null);
    setCurrentPage(1);

    try {
      const keyPair = await generateLogExportKeyPair();
      const encrypted = await exportEncryptedProductionLogs({
        clientPublicKey: keyPair.clientPublicKey,
        day: selectedDay,
      });
      const plaintext = await decryptProductionLogExport(encrypted, keyPair.privateKey);
      setRawLogText(plaintext);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }

  // 3. Parse raw logs into structured records
  const parsedData = useMemo(() => {
    return parseLogLines(rawLogText, organizations);
  }, [rawLogText, organizations]);

  // 4. Filter and sort logs
  const filteredLogs = useMemo(() => {
    return filterAndSortLogs(parsedData.entries, {
      organizationId: selectedOrg,
      level: selectedLevel,
      category: selectedCategory,
      searchPhrase,
      sortBy,
    });
  }, [parsedData.entries, selectedOrg, selectedLevel, selectedCategory, searchPhrase, sortBy]);

  // 5. Pagination
  const totalPages = Math.max(1, Math.ceil(filteredLogs.length / PAGE_SIZE));
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE;
    return filteredLogs.slice(startIndex, startIndex + PAGE_SIZE);
  }, [filteredLogs, currentPage]);

  // Handle download / saving logs to local file
  function handleDownloadLogs() {
    if (!rawLogText) return;
    const blob = new Blob([rawLogText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dayLabel = selectedDay === PRODUCTION_LOG_TODAY_DAY ? 'live' : selectedDay;
    link.href = url;
    link.download = `maq-system-logs-${dayLabel}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Handle copy to clipboard
  async function handleCopyLogs() {
    if (!rawLogText) return;
    try {
      await navigator.clipboard.writeText(rawLogText);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // Fallback if clipboard API is restricted
    }
  }

  function handleResetFilters() {
    setSelectedOrg('all');
    setSelectedLevel('all');
    setSelectedCategory('all');
    setSearchPhrase('');
    setSortBy('time_desc');
    setCurrentPage(1);
  }

  function toggleExpandRow(id) {
    setExpandedLogId((prev) => (prev === id ? null : id));
  }

  return (
    <AppSectionPage title={t.pageTitle} description={t.pageSubtitle}>
      <div className="superadmin-logs">
        {/* KPI / Metric cards */}
        <div className="superadmin-logs__kpi-grid">
          <div className="superadmin-logs__kpi-card">
            <span className="superadmin-logs__kpi-label">{t.statTotalEvents}</span>
            <span className="superadmin-logs__kpi-value">{parsedData.stats.total}</span>
          </div>
          <div className="superadmin-logs__kpi-card">
            <span className="superadmin-logs__kpi-label">{t.statHttpTraffic}</span>
            <span className="superadmin-logs__kpi-value">
              {parsedData.stats.httpCount}
              {parsedData.stats.httpCount > 0 ? (
                <span className="superadmin-logs__kpi-sub">
                  ({t.statAvgLatency}: {parsedData.stats.avgDurationMs}ms)
                </span>
              ) : null}
            </span>
          </div>
          <div className="superadmin-logs__kpi-card">
            <span className="superadmin-logs__kpi-label">{t.statErrors} / {t.statWarnings}</span>
            <span className="superadmin-logs__kpi-value">
              <span className="superadmin-logs__badge superadmin-logs__badge--error">
                {parsedData.stats.errorCount}
              </span>
              {' / '}
              <span className="superadmin-logs__badge superadmin-logs__badge--warn">
                {parsedData.stats.warnCount}
              </span>
            </span>
          </div>
          <div className="superadmin-logs__kpi-card">
            <span className="superadmin-logs__kpi-label">{t.statOrgsCount}</span>
            <span className="superadmin-logs__kpi-value">
              {parsedData.stats.uniqueOrgsCount}
            </span>
          </div>
        </div>

        {/* Primary Controls Bar */}
        <div className="superadmin-logs__controls-bar">
          <div className="superadmin-logs__date-picker">
            <label htmlFor="superadmin-logs-day-select" className="superadmin-logs__control-label">
              {t.dayLabel}
            </label>
            <select
              id="superadmin-logs-day-select"
              className="superadmin-logs__select"
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
            >
              <option value={PRODUCTION_LOG_TODAY_DAY}>{t.todayOption}</option>
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="superadmin-logs__actions-group">
            <Button
              type="button"
              variant="primary"
              onClick={handleLoadLogs}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <LoadingSpinner inline /> {t.refreshingButton}
                </>
              ) : (
                t.refreshButton
              )}
            </Button>

            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadLogs}
              disabled={!rawLogText || isLoading}
            >
              {t.downloadButton}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleCopyLogs}
              disabled={!rawLogText || isLoading}
            >
              {copyFeedback ? t.copiedNotice : t.copyButton}
            </Button>

            <div className="superadmin-logs__view-toggle">
              <button
                type="button"
                className={`superadmin-logs__toggle-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                {t.viewStructured}
              </button>
              <button
                type="button"
                className={`superadmin-logs__toggle-btn ${viewMode === 'raw' ? 'is-active' : ''}`}
                onClick={() => setViewMode('raw')}
              >
                {t.viewRaw}
              </button>
            </div>
          </div>
        </div>

        {/* Filters and sorting bar */}
        <div className="superadmin-logs__filters-card">
          <div className="superadmin-logs__filters-grid">
            {/* Search Input */}
            <div className="superadmin-logs__filter-field superadmin-logs__filter-field--search">
              <input
                type="text"
                className="superadmin-logs__input"
                placeholder={t.searchPlaceholder}
                value={searchPhrase}
                onChange={(e) => {
                  setSearchPhrase(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Organization filter (KLUCZOWY ELEMENT) */}
            <div className="superadmin-logs__filter-field">
              <label htmlFor="filter-org" className="superadmin-logs__filter-label">
                {t.filterOrgLabel}
              </label>
              <select
                id="filter-org"
                className="superadmin-logs__select"
                value={selectedOrg}
                onChange={(e) => {
                  setSelectedOrg(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">{t.filterOrgAll}</option>
                <option value="system">{t.filterOrgSystem}</option>
                <option value="public">{t.filterOrgPublic}</option>
                {organizations.map((org) => (
                  <option key={org.id} value={String(org.id)}>
                    {org.name} (ID: {org.id})
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div className="superadmin-logs__filter-field">
              <label htmlFor="sort-logs" className="superadmin-logs__filter-label">
                {t.sortLabel}
              </label>
              <select
                id="sort-logs"
                className="superadmin-logs__select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="time_desc">{t.sortTimeDesc}</option>
                <option value="time_asc">{t.sortTimeAsc}</option>
                <option value="org_asc">{t.sortOrgAsc}</option>
                <option value="org_desc">{t.sortOrgDesc}</option>
                <option value="level_desc">{t.sortLevelDesc}</option>
                <option value="duration_desc">{t.sortDurationDesc}</option>
              </select>
            </div>

            {/* Level filter */}
            <div className="superadmin-logs__filter-field">
              <label htmlFor="filter-level" className="superadmin-logs__filter-label">
                {t.filterLevelLabel}
              </label>
              <select
                id="filter-level"
                className="superadmin-logs__select"
                value={selectedLevel}
                onChange={(e) => {
                  setSelectedLevel(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">{t.filterLevelAll}</option>
                <option value="error">{t.filterLevelError}</option>
                <option value="warn">{t.filterLevelWarn}</option>
                <option value="log">{t.filterLevelLog}</option>
                <option value="debug">{t.filterLevelDebug}</option>
              </select>
            </div>

            {/* Category filter */}
            <div className="superadmin-logs__filter-field">
              <label htmlFor="filter-category" className="superadmin-logs__filter-label">
                {t.filterCategoryLabel}
              </label>
              <select
                id="filter-category"
                className="superadmin-logs__select"
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
              >
                <option value="all">{t.filterCategoryAll}</option>
                <option value="http">{t.filterCategoryHttp}</option>
                <option value="backup">{t.filterCategoryBackup}</option>
                <option value="auth">{t.filterCategoryAuth}</option>
                <option value="system">{t.filterCategorySystem}</option>
              </select>
            </div>

            {/* Reset button */}
            <div className="superadmin-logs__filter-field superadmin-logs__filter-field--reset">
              <Button type="button" variant="ghost" onClick={handleResetFilters}>
                {t.clearFilters}
              </Button>
            </div>
          </div>
        </div>

        {/* Error message banner */}
        {errorMessage ? (
          <div className="superadmin-logs__error-banner" role="alert">
            {errorMessage}
          </div>
        ) : null}

        {/* View Mode: Structured Table */}
        {viewMode === 'table' ? (
          <div className="superadmin-logs__table-container">
            {paginatedLogs.length === 0 ? (
              <div className="superadmin-logs__empty-state">
                {rawLogText ? t.emptyLogs : t.noLogsLoaded}
              </div>
            ) : (
              <>
                <table className="superadmin-logs__table">
                  <thead>
                    <tr>
                      <th className="superadmin-logs__th-time">{t.colTime}</th>
                      <th className="superadmin-logs__th-level">{t.colLevel}</th>
                      <th className="superadmin-logs__th-org">{t.colOrg}</th>
                      <th className="superadmin-logs__th-context">{t.colContext}</th>
                      <th className="superadmin-logs__th-message">{t.colMessage}</th>
                      <th className="superadmin-logs__th-action">{t.colAction}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedLogs.map((entry) => {
                      const isExpanded = expandedLogId === entry.id;
                      return (
                        <tr
                          key={entry.id}
                          className={`superadmin-logs__row ${isExpanded ? 'is-expanded' : ''}`}
                          onClick={() => toggleExpandRow(entry.id)}
                        >
                          <td className="superadmin-logs__td-time">{entry.timestamp}</td>
                          <td className="superadmin-logs__td-level">
                            <span
                              className={`superadmin-logs__badge superadmin-logs__badge--${entry.level.toLowerCase()}`}
                            >
                              {entry.level}
                            </span>
                          </td>
                          <td className="superadmin-logs__td-org">
                            <span className="superadmin-logs__org-tag">{entry.orgName}</span>
                          </td>
                          <td className="superadmin-logs__td-context">
                            <code className="superadmin-logs__context-tag">{entry.context}</code>
                          </td>
                          <td className="superadmin-logs__td-message">
                            {entry.isHttp && entry.httpMethod ? (
                              <div className="superadmin-logs__http-line">
                                <span className={`superadmin-logs__http-method is-${entry.httpMethod.toLowerCase()}`}>
                                  {entry.httpMethod}
                                </span>
                                <span className="superadmin-logs__http-path">{entry.httpPath}</span>
                                <span
                                  className={`superadmin-logs__http-status ${
                                    entry.httpStatus >= 500
                                      ? 'is-5xx'
                                      : entry.httpStatus >= 400
                                        ? 'is-4xx'
                                        : 'is-2xx'
                                  }`}
                                >
                                  {entry.httpStatus}
                                </span>
                                <span className="superadmin-logs__http-duration">
                                  {entry.httpDurationMs}ms
                                </span>
                              </div>
                            ) : (
                              <span className="superadmin-logs__message-text">{entry.message}</span>
                            )}

                            {/* Expanded details container */}
                            {isExpanded ? (
                              <div
                                className="superadmin-logs__expanded-details"
                                onClick={(e) => e.stopPropagation()}
                              >
                                {entry.ip ? (
                                  <div className="superadmin-logs__detail-row">
                                    <strong>{t.detailsClientIp}</strong> {entry.ip}
                                  </div>
                                ) : null}
                                {entry.user ? (
                                  <div className="superadmin-logs__detail-row">
                                    <strong>{t.detailsUser}</strong> {entry.user}{' '}
                                    {entry.role ? `(${entry.role})` : ''}
                                  </div>
                                ) : null}
                                {entry.details ? (
                                  <div className="superadmin-logs__detail-block">
                                    <strong>{t.detailsStack}</strong>
                                    <pre className="superadmin-logs__stack-trace">
                                      {entry.details}
                                    </pre>
                                  </div>
                                ) : null}
                                <div className="superadmin-logs__detail-block">
                                  <strong>{t.detailsRawLine}</strong>
                                  <pre className="superadmin-logs__raw-line">{entry.raw}</pre>
                                </div>
                              </div>
                            ) : null}
                          </td>
                          <td className="superadmin-logs__td-action">
                            <button
                              type="button"
                              className="superadmin-logs__row-toggle"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpandRow(entry.id);
                              }}
                            >
                              {isExpanded ? t.collapseRow : t.expandRow}
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* Pagination bar */}
                {totalPages > 1 ? (
                  <div className="superadmin-logs__pagination">
                    <span className="superadmin-logs__page-info">
                      {t.pageInfo(currentPage, totalPages, filteredLogs.length)}
                    </span>
                    <div className="superadmin-logs__pagination-buttons">
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage <= 1}
                      >
                        {t.pagePrev}
                      </Button>
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage >= totalPages}
                      >
                        {t.pageNext}
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </div>
        ) : (
          /* View Mode: Raw Console Output */
          <div className="superadmin-logs__raw-container">
            <pre className="superadmin-logs__raw-output">
              {rawLogText || t.noLogsLoaded}
            </pre>
          </div>
        )}
      </div>
    </AppSectionPage>
  );
}
