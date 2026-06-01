import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BadgeMini, BADGE_RARITY, BADGE_RARITY_LABELS, Modal, SearchBar, useToast } from '../../../../components/ui/index.js';
import { fetchStudentBadges, toggleStudentBadge } from '../../../../services/students.api.js';
import './memberModals.css';

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
        const fullBadge = badges.find((b) => b.id === sb.id);
        return {
          id: sb.id,
          name: sb.name || fullBadge?.name || 'Nieznana odznaka',
          iconFile: fullBadge?.iconFile || sb.iconFile || '',
          rarity: fullBadge?.rarity || 'common',
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
          throw new Error(result.error || 'Nie udało się zmienić odznaki.');
        }
      }

      initialSelectedIdsRef.current = [...selectedIds];
      showSuccess('Odznaki uczestnika zostały zapisane.');
      onConfirm?.(selectedIds);
      onClose();
    } catch (err) {
      showError(err instanceof Error ? err.message : 'Nie udało się zapisać odznak.');
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
      title="Dodaj / usuń odznakę"
      subtitle={member.name}
      onConfirm={handleConfirm}
      confirmLabel={isSaving ? 'Zapisywanie…' : 'Zapisz'}
      confirmDisabled={isSaving || isLoading}
      size="xl"
      className="member-modal"
    >
      <div className="member-modal__toolbar member-modal__toolbar--search">
        <SearchBar
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Szukaj odznak…"
          name="badge-search"
          className="member-modal__search member-modal__search--prominent"
          aria-label="Szukaj odznak"
        />
      </div>

      <div className="member-modal__controls-toggle-wrap">
        <button
          type="button"
          className="member-modal__controls-toggle"
          aria-expanded={filtersExpanded}
          onClick={() => setFiltersExpanded((prev) => !prev)}
        >
          {filtersExpanded ? 'Ukryj filtry i sortowanie' : 'Pokaż filtry i sortowanie'}
        </button>
      </div>

      {filtersExpanded ? (
        <div className="member-modal__controls">
        <section className="member-modal__control-group" aria-label="Filtry odznak">
          <h3 className="member-modal__control-heading">Filtry</h3>

          <div className="member-modal__control-row">
            <span className="member-modal__control-sublabel">Rzadkość</span>
            <div className="member-modal__filters" role="group" aria-label="Filtr rzadkości">
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
            <span className="member-modal__control-sublabel">Status</span>
            <div className="member-modal__filters" role="group" aria-label="Filtr statusu zdobycia">
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

        <section className="member-modal__control-group" aria-label="Sortowanie odznak">
          <h3 className="member-modal__control-heading">Sortowanie</h3>

          <div className="member-modal__control-row">
            <label htmlFor="badge-sort" className="member-modal__control-sublabel">
              Kolejność
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
        <p className="member-modal__loading">Ładowanie odznak...</p>
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
        <p className="member-modal__empty">Brak odznak w tej grupie.</p>
      ) : (
        <p className="member-modal__empty">Brak odznak spełniających wybrane filtry.</p>
      )}
    </Modal>
  );
}
