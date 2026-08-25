import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BadgeMini, BADGE_RARITY, BADGE_RARITY_LABELS, Modal, SearchBar, useToast } from '../../../../components/ui/index.js';
import { fetchStudentBadges, toggleStudentBadge } from '../../../../services/students.api.js';
import { normalizeRankBadgeIcon } from '../../../../utils/ranks/rankBadgeIcon.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import './memberModals.css';

const MODAL_TITLE__TEXTLABEL = { polish: 'Przydziel odznakę', english: 'Assign Badge' };
const SEARCH_PLACEHOLDER__TEXTLABEL = { polish: 'Szukaj odznak…', english: 'Search badges…' };
const SEARCH_ARIA_LABEL__TEXTLABEL = { polish: 'Szukaj odznak', english: 'Search badges' };
const SHOW_FILTERS_TOGGLE__TEXTLABEL = { polish: 'Pokaż filtry i sortowanie', english: 'Show filters and sorting' };
const HIDE_FILTERS_TOGGLE__TEXTLABEL = { polish: 'Ukryj filtry i sortowanie', english: 'Hide filters and sorting' };
const FILTERS_SECTION_ARIA__TEXTLABEL = { polish: 'Filtry odznak', english: 'Badge filters' };
const FILTERS_HEADING__TEXTLABEL = { polish: 'Filtry', english: 'Filters' };
const RARITY_SUBLABEL__TEXTLABEL = { polish: 'Rzadkość', english: 'Rarity' };
const RARITY_FILTER_ARIA__TEXTLABEL = { polish: 'Filtr rzadkości', english: 'Rarity filter' };
const STATUS_SUBLABEL__TEXTLABEL = { polish: 'Status', english: 'Status' };
const STATUS_FILTER_ARIA__TEXTLABEL = { polish: 'Filtr statusu zdobycia', english: 'Earned status filter' };
const SORTING_SECTION_ARIA__TEXTLABEL = { polish: 'Sortowanie odznak', english: 'Badge sorting' };
const SORTING_HEADING__TEXTLABEL = { polish: 'Sortowanie', english: 'Sorting' };
const ORDER_SUBLABEL__TEXTLABEL = { polish: 'Kolejność', english: 'Order' };
const LOADING_MESSAGE__TEXTLABEL = { polish: 'Ładowanie odznak...', english: 'Loading badges...' };
const NO_BADGES_EMPTY__TEXTLABEL = { polish: 'Brak odznak w tej grupie.', english: 'No badges in this group.' };
const NO_FILTER_BADGES_EMPTY__TEXTLABEL = { polish: 'Brak odznak spełniających wybrane filtry.', english: 'No badges matching selected filters.' };
const SAVING_ERROR_BADGE__TEXTLABEL = { polish: 'Nie udało się zmienić odznaki.', english: 'Failed to change badge.' };
const SAVED_SUCCESS__TEXTLABEL = { polish: 'Odznaki uczestnika zostały zapisane.', english: 'Participant badges have been saved.' };
const SAVE_ERROR__TEXTLABEL = { polish: 'Nie udało się zapisać odznak.', english: 'Failed to save badges.' };
const SAVING_BUTTON__TEXTLABEL = { polish: 'Zapisywanie…', english: 'Saving…' };
const SAVE_BUTTON__TEXTLABEL = { polish: 'Zapisz', english: 'Save' };

const RARITY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: BADGE_RARITY.common, label: BADGE_RARITY_LABELS.common },
  { id: BADGE_RARITY.uncommon, label: BADGE_RARITY_LABELS.uncommon },
  { id: BADGE_RARITY.rare, label: BADGE_RARITY_LABELS.rare },
  { id: BADGE_RARITY.epic, label: BADGE_RARITY_LABELS.epic },
];

const EARNED_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: 'earned', label: 'Zdobyte' },
  { id: 'unearned', label: 'Niezdobyte' },
];

const BADGE_SORT_OPTIONS = [
  { id: 'earned-first', label: 'Zdobyte → niezdobyte' },
  { id: 'unearned-first', label: 'Niezdobyte → zdobyte' },
  { id: 'name-asc', label: 'Nazwa A–Z' },
  { id: 'name-desc', label: 'Nazwa Z–A' },
  { id: 'rarity-asc', label: 'Rzadkość rosnąco' },
  { id: 'rarity-desc', label: 'Rzadkość malejąco' },
];

const BADGE_RARITY_ORDER = {
  [BADGE_RARITY.common]: 0,
  [BADGE_RARITY.uncommon]: 1,
  [BADGE_RARITY.rare]: 2,
  [BADGE_RARITY.epic]: 3,
};

function filterBadges(badges, { searchQuery, rarityFilter, earnedFilter, selectedIds }) {
  const query = searchQuery.trim().toLowerCase();
  const selectedSet = new Set(selectedIds);

  return badges.filter((badge) => {
    const isEarned = selectedSet.has(badge.id);

    if (rarityFilter !== 'all' && badge.rarity !== rarityFilter) {
      return false;
    }

    if (earnedFilter === 'earned' && !isEarned) {
      return false;
    }

    if (earnedFilter === 'unearned' && isEarned) {
      return false;
    }

    if (query && !badge.name.toLowerCase().includes(query)) {
      return false;
    }

    return true;
  });
}

function sortBadges(badges, sortBy, selectedIds = []) {
  const selectedSet = new Set(selectedIds);
  const sorted = [...badges];

  switch (sortBy) {
    case 'earned-first':
      return sorted.sort((a, b) => {
        const aEarned = selectedSet.has(a.id);
        const bEarned = selectedSet.has(b.id);
        if (aEarned === bEarned) return a.name.localeCompare(b.name, 'pl');
        return aEarned ? -1 : 1;
      });
    case 'unearned-first':
      return sorted.sort((a, b) => {
        const aEarned = selectedSet.has(a.id);
        const bEarned = selectedSet.has(b.id);
        if (aEarned === bEarned) return a.name.localeCompare(b.name, 'pl');
        return aEarned ? 1 : -1;
      });
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name, 'pl'));
    case 'name-desc':
      return sorted.sort((a, b) => b.name.localeCompare(a.name, 'pl'));
    case 'rarity-asc':
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[a.rarity] ?? 0) - (BADGE_RARITY_ORDER[b.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    case 'rarity-desc':
      return sorted.sort((a, b) => {
        const diff = (BADGE_RARITY_ORDER[b.rarity] ?? 0) - (BADGE_RARITY_ORDER[a.rarity] ?? 0);
        return diff !== 0 ? diff : a.name.localeCompare(b.name, 'pl');
      });
    default:
      return sorted;
  }
}

export default function MemberBadgesModal({
  isOpen,
  member,
  groupId,
  badges = [],
  onClose,
  onConfirm,
}) {
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [earnedFilter, setEarnedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [studentBadges, setStudentBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initialSelectedIdsRef = useRef([]);

  useEffect(() => {
    if (!isOpen || !member || !groupId) return;

    setSearchQuery('');
    setRarityFilter('all');
    setEarnedFilter('all');
    setSortBy('rarity-asc');

    async function loadStudentBadges() {
      setIsLoading(true);
      try {
        const data = await fetchStudentBadges(groupId, member.accountId);
        setStudentBadges(data);
        const earnedIds = data.filter((b) => b.isEarned).map((b) => b.id);
        initialSelectedIdsRef.current = earnedIds;
        setSelectedIds(earnedIds);
      } catch (err) {
        console.error('Failed to load student badges:', err);
        setStudentBadges([]);
        initialSelectedIdsRef.current = [];
        setSelectedIds([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadStudentBadges();
  }, [isOpen, member, groupId]);

  const allBadges = useMemo(() => {
    if (studentBadges.length > 0) {
      return studentBadges.map((sb) => {
        const fullBadge = badges.find((b) => b.id === sb.id || b.dbId === sb.id);
        const icon = normalizeRankBadgeIcon(fullBadge?.icon ?? sb.icon, '');
        return {
          id: sb.id,
          name: sb.name || fullBadge?.name || 'Nieznana odznaka',
          iconFile: icon || fullBadge?.iconFile || sb.iconFile || '',
          rarity: fullBadge?.rarity || sb.rarity || 'common',
          storyDescription: fullBadge?.storyDescription || '',
          didacticDescription: fullBadge?.didacticDescription || fullBadge?.educationalDescription || '',
          rewardAmount: fullBadge?.rewardAmount || 0,
        };
      });
    }
    return badges.map((b) => ({
      id: b.id,
      name: b.name,
      iconFile: b.iconFile || '',
      rarity: b.rarity || 'common',
      storyDescription: b.storyDescription || '',
      didacticDescription: b.didacticDescription || '',
      rewardAmount: b.rewardAmount || 0,
    }));
  }, [studentBadges, badges]);

  const visibleBadges = useMemo(() => {
    const filtered = filterBadges(allBadges, {
      searchQuery,
      rarityFilter,
      earnedFilter,
      selectedIds,
    });

    return sortBadges(filtered, sortBy, selectedIds);
  }, [allBadges, searchQuery, rarityFilter, earnedFilter, sortBy, selectedIds]);

  const handleToggleBadge = useCallback((badgeId) => {
    setSelectedIds((prev) => (
      prev.includes(badgeId)
        ? prev.filter((id) => id !== badgeId)
        : [...prev, badgeId]
    ));
  }, []);

  const handleConfirm = async () => {
    if (!groupId || !member) return;

    const initialSet = new Set(initialSelectedIdsRef.current);
    const selectedSet = new Set(selectedIds);
    const badgeIdsToToggle = [
      ...selectedIds.filter((badgeId) => !initialSet.has(badgeId)),
      ...initialSelectedIdsRef.current.filter((badgeId) => !selectedSet.has(badgeId)),
    ];

    if (badgeIdsToToggle.length === 0) {
      onClose();
      return;
    }

    setIsSaving(true);

    try {
      for (const badgeId of badgeIdsToToggle) {
        const result = await toggleStudentBadge(groupId, member.accountId, badgeId);
        if (!result.ok) {
          throw new Error(result.error || SAVING_ERROR_BADGE__TEXTLABEL[LANGUAGE]);
        }
      }

      initialSelectedIdsRef.current = [...selectedIds];
      showSuccess(SAVED_SUCCESS__TEXTLABEL[LANGUAGE]);
      onConfirm?.(selectedIds);
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : SAVE_ERROR__TEXTLABEL[LANGUAGE]);
    } finally {
      setIsSaving(false);
    }
  };

  if (!member) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODAL_TITLE__TEXTLABEL[LANGUAGE]}
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmLabel={isSaving ? SAVING_BUTTON__TEXTLABEL[LANGUAGE] : SAVE_BUTTON__TEXTLABEL[LANGUAGE]}
      confirmDisabled={isSaving || isLoading}
      size="xl"
      className="member-modal"
    >
      <div className="member-modal__toolbar member-modal__toolbar--search">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder={SEARCH_PLACEHOLDER__TEXTLABEL[LANGUAGE]}
          name="badge-search"
          className="member-modal__search member-modal__search--prominent"
          aria-label={SEARCH_ARIA_LABEL__TEXTLABEL[LANGUAGE]}
        />
      </div>

      <div className="member-modal__controls-toggle-wrap">
        <button
          type="button"
          className="member-modal__controls-toggle"
          aria-expanded={filtersExpanded}
          onClick={() => setFiltersExpanded((prev) => !prev)}
        >
          {filtersExpanded ? HIDE_FILTERS_TOGGLE__TEXTLABEL[LANGUAGE] : SHOW_FILTERS_TOGGLE__TEXTLABEL[LANGUAGE]}
        </button>
      </div>

      {filtersExpanded ? (
        <div className="member-modal__controls">
        <section className="member-modal__control-group" aria-label={FILTERS_SECTION_ARIA__TEXTLABEL[LANGUAGE]}>
          <h3 className="member-modal__control-heading">{FILTERS_HEADING__TEXTLABEL[LANGUAGE]}</h3>

          <div className="member-modal__control-row">
            <span className="member-modal__control-sublabel">{RARITY_SUBLABEL__TEXTLABEL[LANGUAGE]}</span>
            <div className="member-modal__filters" role="group" aria-label={RARITY_FILTER_ARIA__TEXTLABEL[LANGUAGE]}>
              {RARITY_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={[
                    'member-modal__filter',
                    rarityFilter === filter.id ? 'member-modal__filter--active' : '',
                  ].join(' ')}
                  onClick={() => setRarityFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          <div className="member-modal__control-row">
            <span className="member-modal__control-sublabel">{STATUS_SUBLABEL__TEXTLABEL[LANGUAGE]}</span>
            <div className="member-modal__filters" role="group" aria-label={STATUS_FILTER_ARIA__TEXTLABEL[LANGUAGE]}>
              {EARNED_FILTERS.map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  className={[
                    'member-modal__filter',
                    earnedFilter === filter.id ? 'member-modal__filter--active' : '',
                  ].join(' ')}
                  onClick={() => setEarnedFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="member-modal__control-group" aria-label={SORTING_SECTION_ARIA__TEXTLABEL[LANGUAGE]}>
          <h3 className="member-modal__control-heading">{SORTING_HEADING__TEXTLABEL[LANGUAGE]}</h3>

          <div className="member-modal__control-row">
            <label htmlFor="badge-sort" className="member-modal__control-sublabel">
              {ORDER_SUBLABEL__TEXTLABEL[LANGUAGE]}
            </label>
            <select
              id="badge-sort"
              className="member-modal__sort-select"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              {BADGE_SORT_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </section>
      </div>
      ) : null}

      {isLoading ? (
        <p className="member-modal__loading">{LOADING_MESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : visibleBadges.length > 0 ? (
        <div className="member-modal__badge-grid">
          {visibleBadges.map((badge) => (
            <BadgeMini
              key={badge.id}
              rarity={badge.rarity}
              name={badge.name}
              storyDescription={badge.storyDescription}
              didacticDescription={badge.didacticDescription}
              rewardAmount={badge.rewardAmount}
              iconFile={badge.iconFile}
              selected={selectedIds.includes(badge.id)}
              onSelectedChange={() => handleToggleBadge(badge.id)}
              previewOnHover
              showEarnedAt={false}
            />
          ))}
        </div>
      ) : allBadges.length === 0 ? (
        <p className="member-modal__empty">{NO_BADGES_EMPTY__TEXTLABEL[LANGUAGE]}</p>
      ) : (
        <p className="member-modal__empty">{NO_FILTER_BADGES_EMPTY__TEXTLABEL[LANGUAGE]}</p>
      )}
    </Modal>
  );
}
