import { useCallback, useEffect, useMemo, useState } from 'react';
import AppSectionPage from '../../components/page/AppSectionPage.jsx';
import Button from '../../components/ui/Button/Button.jsx';
import LoadingSpinner from '../../components/ui/LoadingSpinner/LoadingSpinner.jsx';
import { useToast } from '../../components/ui/Toast/Toast.jsx';
import {
  ORGANIZATION_ADMIN_PAGE_SIZE,
  ORGANIZATION_LOG_CATEGORY_ALL,
  ORGANIZATION_LOG_CATEGORY_GROUP,
  ORGANIZATION_LOG_CATEGORY_ORGANIZATION,
} from '../../constants/organizationAdmin.constants.js';
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';
import { listOrganizationLog } from '../../services/organizationAdmin.api.js';
import { organizationLogSentence, safeOrganizationLogLink } from './organizationLogSentence.js';
import './OrganizationLogContent.css';

const COPY = {
  polish: {
    title: 'Dziennik aktywności organizacji',
    subtitle: 'Kompleksowy rejestr zdarzeń, uprawnień użytkowników oraz zmian w grupach i zasobach organizacji.',
    roleNotice: 'Widok audytowy przeznaczony dla osoby administrującej organizacją.',
    all: 'Wszystko',
    organization: 'Organizacja',
    group: 'Grupy dydaktyczne',
    empty: 'Brak wpisów dla tego filtra.',
    noMatching: 'Brak wpisów spełniających kryteria wyszukiwania.',
    more: 'Starsze wpisy',
    loading: 'Wczytywanie logów…',
    open: 'Otwórz',

    // KPI Cards
    statTotal: 'Wszystkie zdarzenia',
    statOrg: 'Zdarzenia organizacji',
    statGroup: 'Zdarzenia grup',
    statFiles: 'Pliki i banery',
    statActors: 'Zaangażowane osoby',

    // Akcje i widoki
    searchPlaceholder: 'Szukaj w zdarzeniach (osoba, grupa, rola, plik, działanie)…',
    clearFilters: 'Wyczyść',
    downloadButton: 'Pobierz logi (.log)',
    copyButton: 'Kopiuj logi',
    copiedNotice: 'Skopiowano do schowka',
    viewStructured: 'Widok tabelaryczny',
    viewRaw: 'Widok terminala',

    // Kolumny tabeli
    colTime: 'Czas zdarzenia',
    colCategory: 'Kategoria',
    colEvent: 'Opis zdarzenia i wykonane działanie',
    colAction: 'Powiązany zasób',
    colDetails: 'Szczegóły',
    expand: 'Rozwiń',
    collapse: 'Zwiń',
    detailKind: 'Typ zdarzenia:',
    detailActor: 'Osoba wykonująca:',
    detailSubject: 'Osoba docelowa:',
    detailGroup: 'Grupa:',
    detailFile: 'Nazwa pliku:',
    detailRaw: 'Surowy identyfikator:',
  },
  english: {
    title: 'Organization Activity Log',
    subtitle: 'Comprehensive audit log of events, role changes, and course group activities in your organization.',
    roleNotice: 'Audit view designated for the organization administrator.',
    all: 'All',
    organization: 'Organization',
    group: 'Course Groups',
    empty: 'No entries for this filter.',
    noMatching: 'No log entries match your search criteria.',
    more: 'Older entries',
    loading: 'Loading logs…',
    open: 'Open',

    // KPI Cards
    statTotal: 'Total Events',
    statOrg: 'Organization Events',
    statGroup: 'Course Group Events',
    statFiles: 'Files & Banners',
    statActors: 'Active Persons',

    // Actions and views
    searchPlaceholder: 'Search events (person, group, role, file, action)…',
    clearFilters: 'Clear',
    downloadButton: 'Download logs (.log)',
    copyButton: 'Copy logs',
    copiedNotice: 'Copied to clipboard',
    viewStructured: 'Structured View',
    viewRaw: 'Terminal View',

    // Table columns
    colTime: 'Timestamp',
    colCategory: 'Category',
    colEvent: 'Event Description & Action',
    colAction: 'Linked Resource',
    colDetails: 'Details',
    expand: 'Expand',
    collapse: 'Collapse',
    detailKind: 'Event kind:',
    detailActor: 'Actor person:',
    detailSubject: 'Subject person:',
    detailGroup: 'Group:',
    detailFile: 'File name:',
    detailRaw: 'Raw entry ID:',
  },
};

const FILTERS = [
  ORGANIZATION_LOG_CATEGORY_ALL,
  ORGANIZATION_LOG_CATEGORY_ORGANIZATION,
  ORGANIZATION_LOG_CATEGORY_GROUP,
];

function formatWhen(value, language) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return new Intl.DateTimeFormat(language === 'polish' ? 'pl-PL' : 'en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date);
}

function formatIsoTime(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toISOString().replace('T', ' ').slice(0, 19);
}

export default function OrganizationLogContent() {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.english;
  const sentenceLanguage = language === 'polish' ? 'pl' : 'en';
  const { showSuccess, showError } = useToast();

  const [category, setCategory] = useState(ORGANIZATION_LOG_CATEGORY_ALL);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

  // Search & view mode
  const [searchPhrase, setSearchPhrase] = useState('');
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'raw'
  const [expandedId, setExpandedId] = useState(null);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const load = useCallback(async (nextCategory, nextCursor, append) => {
    setLoading(true);
    try {
      const page = await listOrganizationLog({
        category: nextCategory,
        limit: ORGANIZATION_ADMIN_PAGE_SIZE,
        before: nextCursor?.before,
        beforeId: nextCursor?.beforeId,
        beforeSource: nextCursor?.beforeSource,
      });
      const rows = Array.isArray(page?.items) ? page.items : [];
      setItems((current) => (append ? [...current, ...rows] : rows));
      setCursor(
        page?.nextBefore && page?.nextBeforeId && page?.nextBeforeSource
          ? { before: page.nextBefore, beforeId: page.nextBeforeId, beforeSource: page.nextBeforeSource }
          : null,
      );
      setReady(true);
    } catch (err) {
      if (!append) {
        setItems([]);
        setCursor(null);
      }
      setReady(true);
      showError(err instanceof Error ? err.message : copy.empty);
    } finally {
      setLoading(false);
    }
  }, [copy.empty, showError]);

  useEffect(() => {
    load(category, null, false);
  }, [category, load]);

  const filterLabel = {
    [ORGANIZATION_LOG_CATEGORY_ALL]: copy.all,
    [ORGANIZATION_LOG_CATEGORY_ORGANIZATION]: copy.organization,
    [ORGANIZATION_LOG_CATEGORY_GROUP]: copy.group,
  };

  // KPI Metrics Calculation
  const stats = useMemo(() => {
    let orgCount = 0;
    let groupCount = 0;
    let fileCount = 0;
    const actors = new Set();

    for (const item of items) {
      if (item.category === 'organization') orgCount++;
      if (item.category === 'group') groupCount++;
      if (item.fileKind || item.kind?.startsWith('file_')) fileCount++;
      if (item.actorName) actors.add(item.actorName);
      if (item.subjectName) actors.add(item.subjectName);
    }

    return {
      total: items.length,
      orgCount,
      groupCount,
      fileCount,
      actorsCount: actors.size,
    };
  }, [items]);

  // Filter items by search phrase
  const filteredItems = useMemo(() => {
    if (!searchPhrase.trim()) {
      return items;
    }
    const query = searchPhrase.trim().toLowerCase();
    return items.filter((item) => {
      const sentence = organizationLogSentence(item, sentenceLanguage).toLowerCase();
      const actor = (item.actorName || '').toLowerCase();
      const subject = (item.subjectName || '').toLowerCase();
      const group = (item.groupName || '').toLowerCase();
      const file = (item.fileName || '').toLowerCase();
      const kind = (item.kind || '').toLowerCase();
      return (
        sentence.includes(query) ||
        actor.includes(query) ||
        subject.includes(query) ||
        group.includes(query) ||
        file.includes(query) ||
        kind.includes(query)
      );
    });
  }, [items, searchPhrase, sentenceLanguage]);

  // Formatted raw log lines for terminal and download
  const rawLogLines = useMemo(() => {
    return filteredItems
      .map((item) => {
        const time = formatIsoTime(item.occurredAt);
        const cat = (item.category || 'ORGANIZATION').toUpperCase();
        const sentence = organizationLogSentence(item, sentenceLanguage);
        return `[${time}] [${cat}] [${item.kind}] ${sentence}`;
      })
      .join('\n');
  }, [filteredItems, sentenceLanguage]);

  // Download log file (.log)
  function handleDownloadLog() {
    if (!rawLogLines) return;
    const blob = new Blob([rawLogLines], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `organization-activity-log-${category}.log`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // Copy logs to clipboard
  async function handleCopyLog() {
    if (!rawLogLines) return;
    try {
      await navigator.clipboard.writeText(rawLogLines);
      setCopyFeedback(true);
      showSuccess(copy.copiedNotice);
      setTimeout(() => setCopyFeedback(false), 2500);
    } catch {
      // Fallback
    }
  }

  function toggleExpandRow(id) {
    setExpandedId((prev) => (prev === id ? null : id));
  }

  return (
    <AppSectionPage title={copy.title} description={copy.subtitle}>
      <div className="org-log">
        {/* Role notice banner */}
        <div className="org-log__notice-banner">
          <span className="org-log__notice-icon" aria-hidden="true">🛡️</span>
          <p className="org-log__notice-text">{copy.roleNotice}</p>
        </div>

        {/* KPI Summary Cards */}
        <div className="org-log__kpi-grid">
          <div className="org-log__kpi-card">
            <span className="org-log__kpi-label">{copy.statTotal}</span>
            <span className="org-log__kpi-value">{stats.total}</span>
          </div>
          <div className="org-log__kpi-card">
            <span className="org-log__kpi-label">{copy.statOrg}</span>
            <span className="org-log__kpi-value">{stats.orgCount}</span>
          </div>
          <div className="org-log__kpi-card">
            <span className="org-log__kpi-label">{copy.statGroup}</span>
            <span className="org-log__kpi-value">{stats.groupCount}</span>
          </div>
          <div className="org-log__kpi-card">
            <span className="org-log__kpi-label">{copy.statFiles}</span>
            <span className="org-log__kpi-value">{stats.fileCount}</span>
          </div>
          <div className="org-log__kpi-card">
            <span className="org-log__kpi-label">{copy.statActors}</span>
            <span className="org-log__kpi-value">{stats.actorsCount}</span>
          </div>
        </div>

        {/* Action and Control Bar */}
        <div className="org-log__controls-card">
          <div className="org-log__filters-group">
            {FILTERS.map((value) => {
              const isActive = value === category;
              return (
                <button
                  key={value}
                  type="button"
                  className={`org-log__filter-chip ${isActive ? 'is-active' : ''}`}
                  onClick={() => setCategory(value)}
                >
                  <span>{filterLabel[value]}</span>
                  {value === ORGANIZATION_LOG_CATEGORY_ORGANIZATION ? (
                    <span className="org-log__chip-badge">{stats.orgCount}</span>
                  ) : value === ORGANIZATION_LOG_CATEGORY_GROUP ? (
                    <span className="org-log__chip-badge">{stats.groupCount}</span>
                  ) : (
                    <span className="org-log__chip-badge">{stats.total}</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="org-log__actions-group">
            <Button
              type="button"
              variant="secondary"
              onClick={handleDownloadLog}
              disabled={items.length === 0}
            >
              {copy.downloadButton}
            </Button>

            <Button
              type="button"
              variant="ghost"
              onClick={handleCopyLog}
              disabled={items.length === 0}
            >
              {copyFeedback ? copy.copiedNotice : copy.copyButton}
            </Button>

            <div className="org-log__view-toggle">
              <button
                type="button"
                className={`org-log__toggle-btn ${viewMode === 'table' ? 'is-active' : ''}`}
                onClick={() => setViewMode('table')}
              >
                {copy.viewStructured}
              </button>
              <button
                type="button"
                className={`org-log__toggle-btn ${viewMode === 'raw' ? 'is-active' : ''}`}
                onClick={() => setViewMode('raw')}
              >
                {copy.viewRaw}
              </button>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="org-log__search-card">
          <div className="org-log__search-wrapper">
            <input
              type="text"
              className="org-log__search-input"
              placeholder={copy.searchPlaceholder}
              value={searchPhrase}
              onChange={(e) => setSearchPhrase(e.target.value)}
            />
            {searchPhrase ? (
              <button
                type="button"
                className="org-log__clear-btn"
                onClick={() => setSearchPhrase('')}
              >
                {copy.clearFilters}
              </button>
            ) : null}
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && items.length === 0 ? <LoadingSpinner label={copy.loading} /> : null}

        {/* Empty States */}
        {!loading && ready && items.length === 0 ? (
          <div className="org-log__empty-card">
            <p className="org-log__empty-text">{copy.empty}</p>
          </div>
        ) : null}

        {!loading && ready && items.length > 0 && filteredItems.length === 0 ? (
          <div className="org-log__empty-card">
            <p className="org-log__empty-text">{copy.noMatching}</p>
          </div>
        ) : null}

        {/* Content based on View Mode */}
        {filteredItems.length > 0 && viewMode === 'table' ? (
          <div className="org-log__table-card">
            <table className="org-log__table">
              <thead>
                <tr>
                  <th className="org-log__th org-log__th--time">{copy.colTime}</th>
                  <th className="org-log__th org-log__th--cat">{copy.colCategory}</th>
                  <th className="org-log__th org-log__th--event">{copy.colEvent}</th>
                  <th className="org-log__th org-log__th--action">{copy.colAction}</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => {
                  const href =
                    safeOrganizationLogLink(item.links?.group) ??
                    safeOrganizationLogLink(item.links?.account) ??
                    safeOrganizationLogLink(item.links?.profile);
                  const isExpanded = expandedId === item.id;
                  const isGroupCat = item.category === 'group';

                  return (
                    <tr
                      key={`${item.source}-${item.id}`}
                      className={`org-log__table-row ${isExpanded ? 'is-expanded' : ''}`}
                    >
                      <td className="org-log__td org-log__td--time">
                        <time dateTime={item.occurredAt}>{formatWhen(item.occurredAt, language)}</time>
                      </td>
                      <td className="org-log__td org-log__td--cat">
                        <span
                          className={`org-log__cat-badge ${
                            isGroupCat ? 'org-log__cat-badge--group' : 'org-log__cat-badge--org'
                          }`}
                        >
                          {isGroupCat ? copy.group : copy.organization}
                        </span>
                      </td>
                      <td className="org-log__td org-log__td--event">
                        <p className="org-log__sentence">
                          {organizationLogSentence(item, sentenceLanguage)}
                        </p>
                        {isExpanded ? (
                          <div className="org-log__expanded-box">
                            {item.kind ? (
                              <div className="org-log__expanded-item">
                                <strong>{copy.detailKind}</strong> <code>{item.kind}</code>
                              </div>
                            ) : null}
                            {item.actorName ? (
                              <div className="org-log__expanded-item">
                                <strong>{copy.detailActor}</strong> {item.actorName}
                              </div>
                            ) : null}
                            {item.subjectName ? (
                              <div className="org-log__expanded-item">
                                <strong>{copy.detailSubject}</strong> {item.subjectName}
                              </div>
                            ) : null}
                            {item.groupName ? (
                              <div className="org-log__expanded-item">
                                <strong>{copy.detailGroup}</strong> {item.groupName}
                              </div>
                            ) : null}
                            {item.fileName ? (
                              <div className="org-log__expanded-item">
                                <strong>{copy.detailFile}</strong> {item.fileName}
                              </div>
                            ) : null}
                            <div className="org-log__expanded-item">
                              <strong>{copy.detailRaw}</strong> <code>{item.id}</code>
                            </div>
                          </div>
                        ) : null}
                      </td>
                      <td className="org-log__td org-log__td--action">
                        <div className="org-log__action-cell">
                          {href ? (
                            <Button variant="secondary" size="sm" to={href}>
                              {copy.open}
                            </Button>
                          ) : null}
                          <button
                            type="button"
                            className="org-log__expand-toggle"
                            onClick={() => toggleExpandRow(item.id)}
                          >
                            {isExpanded ? copy.collapse : copy.expand}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}

        {/* View Mode: Raw Terminal Output */}
        {filteredItems.length > 0 && viewMode === 'raw' ? (
          <div className="org-log__raw-container">
            <pre className="org-log__raw-output">{rawLogLines}</pre>
          </div>
        ) : null}

        {/* Load More Pagination */}
        {cursor ? (
          <div className="org-log__pagination">
            <Button
              variant="secondary"
              disabled={loading}
              onClick={() => load(category, cursor, true)}
            >
              {loading ? copy.loading : copy.more}
            </Button>
          </div>
        ) : null}
      </div>
    </AppSectionPage>
  );
}
