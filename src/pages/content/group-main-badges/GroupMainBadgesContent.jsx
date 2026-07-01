import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  BADGE_RARITY,
  BADGE_RARITY_LABELS,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogFiltersToggle,
  CatalogSortSelect,
  Divider,
  SearchBar,
} from '../../../components/ui/index.js';
import BadgeTreasuryCard from './BadgeTreasuryCard.jsx';
import {
  filterTreasuryBadges,
  LECTURER_SORT_OPTIONS,
  sortTreasuryBadges,
  STUDENT_SORT_OPTIONS,
  TREASURY_SORT,
} from './badgeTreasuryModel.js';
import { useGroupMainBadges } from './useGroupMainBadges.js';
import GroupMainEmptyNotice from '../../../components/group-main/GroupMainEmptyNotice.jsx';
import { useGroupMainEmptyLink } from '../../../hooks/group-main/useGroupMainEmptyLink.js';
import '../group-main/shared/groupMainSubpageHeader.css';
import '../group-main/GroupMainHomeContent.css';
import './GroupMainBadgesContent.css';

const RARITY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: BADGE_RARITY.common, label: BADGE_RARITY_LABELS.common },
  { id: BADGE_RARITY.uncommon, label: BADGE_RARITY_LABELS.uncommon },
  { id: BADGE_RARITY.rare, label: BADGE_RARITY_LABELS.rare },
  { id: BADGE_RARITY.epic, label: BADGE_RARITY_LABELS.epic },
];

const UNLOCK_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'earned', label: 'Odblokowane' },
  { id: 'unearned', label: 'Zablokowane' },
];

/**
 * @param {Object} props
 * @param {boolean} [props.embedded]
 * @param {string} [props.searchQuery]
 * @param {string} [props.rarityFilter]
 * @param {string} [props.sortBy]
 * @param {(value: string) => void} [props.onRarityFilterChange]
 * @param {(value: string) => void} [props.onSortByChange]
 * @param {boolean} [props.showLecturerActions]
 * @param {(badge: import('./badgeTreasuryModel.js').TreasuryBadge) => void} [props.onEditBadge]
 * @param {(badge: import('./badgeTreasuryModel.js').TreasuryBadge) => void} [props.onDeleteBadge]
 */
export default function GroupMainBadgesContent({
  embedded = false,
  searchQuery: externalSearchQuery,
  rarityFilter: externalRarityFilter,
  sortBy: externalSortBy,
  onRarityFilterChange,
  onSortByChange,
  showLecturerActions = false,
  onEditBadge,
  onDeleteBadge,
}) {
  const { groupId } = useParams();
  const {
    badges,
    earnersByBadgeId,
    studentAccountId,
    isLoading,
    error,
    isStudentView,
  } = useGroupMainBadges();
  const emptyLink = useGroupMainEmptyLink('badges', groupId);

  const defaultSort = isStudentView ? TREASURY_SORT.unlockFirst : TREASURY_SORT.qualityDesc;
  const sortOptions = isStudentView ? STUDENT_SORT_OPTIONS : LECTURER_SORT_OPTIONS;

  const [internalSearchQuery, setInternalSearchQuery] = useState('');
  const [internalRarityFilter, setInternalRarityFilter] = useState('all');
  const [unlockFilter, setUnlockFilter] = useState('all');
  const [internalSortBy, setInternalSortBy] = useState(defaultSort);
  const [filtersExpanded, setFiltersExpanded] = useState(false);

  const searchQuery = externalSearchQuery ?? internalSearchQuery;
  const rarityFilter = externalRarityFilter ?? internalRarityFilter;
  const sortBy = externalSortBy ?? internalSortBy;

  const setRarityFilter = onRarityFilterChange ?? setInternalRarityFilter;
  const setSortBy = onSortByChange ?? setInternalSortBy;

  const visibleBadges = useMemo(() => {
    const filtered = filterTreasuryBadges(badges, {
      searchQuery,
      rarityFilter,
      unlockFilter: isStudentView ? unlockFilter : 'all',
    });

    return sortTreasuryBadges(filtered, sortBy);
  }, [badges, searchQuery, rarityFilter, unlockFilter, sortBy, isStudentView]);

  if (isLoading) {
    return <p className="badge-treasury__message" role="status">Ładowanie skarbca odznak…</p>;
  }

  if (error) {
    return (
      <p className="badge-treasury__message badge-treasury__message--error" role="alert">
        {error}
      </p>
    );
  }

  const showStudentToolbar = !embedded && isStudentView;
  const showStudentFiltersPanel = showStudentToolbar && filtersExpanded;

  return (
    <section className="badge-treasury" aria-label="Skarbiec odznak">
      {!embedded ? (
        <>
          <div className="badge-treasury__title-row">
            <header className="badge-treasury__page-header">
              <p className="badge-treasury__eyebrow">Skarbiec</p>
              <h1 className="badge-treasury__title">Odznaki</h1>
            </header>
          </div>
          <Divider className="group-main-subpage__divider" />
        </>
      ) : null}

      {showStudentToolbar ? (
        <div className="badge-treasury__toolbar maq-section-page__toolbar">
          <div className="maq-section-page__toolbar-start">
            <SearchBar
              value={internalSearchQuery}
              onChange={(event) => setInternalSearchQuery(event.target.value)}
              placeholder="Szukaj odznaki…"
              name="badge-treasury-search"
              className="group-shop__search badge-treasury__search"
              aria-label="Szukaj odznaki po nazwie"
            />
          </div>
          <div className="maq-section-page__toolbar-end badge-treasury__toolbar-end">
            <CatalogFiltersToggle
              expanded={filtersExpanded}
              onToggle={() => setFiltersExpanded((expanded) => !expanded)}
            />
          </div>
        </div>
      ) : null}

      {showStudentFiltersPanel ? (
        <CatalogFiltersPanel className="badge-treasury__filters">
          <div className="badge-treasury__filters-layout">
            <div className="badge-treasury__filter-group-wrap badge-treasury__filter-group-wrap--rarity">
              <CatalogFilterGroup
                ariaLabel="Filtr rzadkości"
                filters={RARITY_FILTERS}
                activeId={rarityFilter}
                onSelect={setRarityFilter}
              />
            </div>

            <div
              className="badge-treasury__filters-spacer"
              aria-hidden="true"
            />

            <div className="badge-treasury__filter-group-wrap badge-treasury__filter-group-wrap--unlock">
              <CatalogFilterGroup
                ariaLabel="Filtr odblokowania"
                filters={UNLOCK_FILTERS}
                activeId={unlockFilter}
                onSelect={setUnlockFilter}
              />
            </div>

            <CatalogSortSelect
              selectId="badge-treasury-sort"
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              className="badge-treasury__sort"
            />
          </div>
        </CatalogFiltersPanel>
      ) : null}

      {badges.length === 0 ? (
        <GroupMainEmptyNotice
          message={emptyLink.message}
          linkLabel={emptyLink.linkLabel}
          linkTo={emptyLink.linkTo}
        />
      ) : visibleBadges.length === 0 ? (
        <p className="badge-treasury__empty">Brak odznak spełniających wybrane filtry.</p>
      ) : (
        <div className="badge-treasury__grid">
          {visibleBadges.map((badge) => (
            <BadgeTreasuryCard
              key={badge.id}
              badge={badge}
              earnersByBadgeId={earnersByBadgeId}
              excludeAccountId={isStudentView ? studentAccountId : null}
              isStudentView={isStudentView}
              showLecturerActions={showLecturerActions}
              onEdit={onEditBadge ? () => onEditBadge(badge) : undefined}
              onDelete={onDeleteBadge ? () => onDeleteBadge(badge) : undefined}
            />
          ))}
        </div>
      )}
    </section>
  );
}
