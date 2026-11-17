import { useCallback, useEffect, useState } from 'react';
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
    title: 'Logi',
    all: 'Wszystko',
    organization: 'Organizacja',
    group: 'Grupa',
    empty: 'Brak wpisów dla tego filtra.',
    more: 'Starsze wpisy',
    loading: 'Wczytywanie logów',
    open: 'Otwórz',
  },
  english: {
    title: 'Logs',
    all: 'All',
    organization: 'Organization',
    group: 'Group',
    empty: 'No entries for this filter.',
    more: 'Older entries',
    loading: 'Loading logs',
    open: 'Open',
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

export default function OrganizationLogContent() {
  const language = READLANGUAGECOOKIE();
  const copy = COPY[language] ?? COPY.english;
  const { showError } = useToast();
  const [category, setCategory] = useState(ORGANIZATION_LOG_CATEGORY_ALL);
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);

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
      setCursor(page?.nextBefore && page?.nextBeforeId && page?.nextBeforeSource
        ? { before: page.nextBefore, beforeId: page.nextBeforeId, beforeSource: page.nextBeforeSource }
        : null);
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
  const sentenceLanguage = language === 'polish' ? 'pl' : 'en';

  return (
    <AppSectionPage title={copy.title}>
      <div className="org-log">
        <div className="org-log__filters">
          {FILTERS.map((value) => (
            <Button
              key={value}
              variant={value === category ? 'primary' : 'secondary'}
              onClick={() => setCategory(value)}
            >
              {filterLabel[value]}
            </Button>
          ))}
        </div>
        {loading && items.length === 0 ? <LoadingSpinner label={copy.loading} /> : null}
        {!loading && ready && items.length === 0 ? <p>{copy.empty}</p> : null}
        {items.length > 0 ? (
          <ul className="org-log__list">
            {items.map((item) => {
              const href = safeOrganizationLogLink(item.links?.group)
                ?? safeOrganizationLogLink(item.links?.account)
                ?? safeOrganizationLogLink(item.links?.profile);
              return (
                <li key={`${item.source}-${item.id}`} className="org-log__row">
                  <time dateTime={item.occurredAt}>{formatWhen(item.occurredAt, language)}</time>
                  <p>{organizationLogSentence(item, sentenceLanguage)}</p>
                  {href ? <Button variant="secondary" size="sm" to={href}>{copy.open}</Button> : null}
                </li>
              );
            })}
          </ul>
        ) : null}
        {cursor ? (
          <Button variant="secondary" disabled={loading} onClick={() => load(category, cursor, true)}>
            {copy.more}
          </Button>
        ) : null}
      </div>
    </AppSectionPage>
  );
}
