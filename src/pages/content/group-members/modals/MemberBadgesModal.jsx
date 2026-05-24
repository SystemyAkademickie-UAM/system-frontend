import { useEffect, useMemo, useState } from 'react';
import { BadgeMini, BADGE_RARITY, BADGE_RARITY_LABELS, Modal, SearchBar } from '../../../../components/ui/index.js';
import {
  ALL_BADGES,
  BADGE_SORT_OPTIONS,
  sortBadges,
} from '../membersMockData.js';
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

function filterBadges(badges, { searchQuery, rarityFilter, earnedFilter, selectedIds }) {
  const query = searchQuery.trim().toLowerCase();

  return badges.filter((badge) => {
    const isEarned = selectedIds.includes(badge.id);

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

export default function MemberBadgesModal({
  isOpen,
  member,
  onClose,
  onConfirm,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [earnedFilter, setEarnedFilter] = useState('all');
  const [sortBy, setSortBy] = useState('rarity-asc');
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (!isOpen || !member) return;

    setSearchQuery('');
    setRarityFilter('all');
    setEarnedFilter('all');
    setSortBy('rarity-asc');
    setSelectedIds([...(member.earnedBadgeIds ?? [])]);
  }, [isOpen, member]);

  const visibleBadges = useMemo(() => {
    const filtered = filterBadges(ALL_BADGES, {
      searchQuery,
      rarityFilter,
      earnedFilter,
      selectedIds,
    });

    return sortBadges(filtered, sortBy, selectedIds);
  }, [searchQuery, rarityFilter, earnedFilter, sortBy, selectedIds]);

  const handleToggleBadge = (badgeId, selected) => {
    setSelectedIds((prev) => {
      if (selected) {
        return prev.includes(badgeId) ? prev : [...prev, badgeId];
      }

      return prev.filter((id) => id !== badgeId);
    });
  };

  const handleConfirm = () => {
    onConfirm?.(selectedIds);
    onClose();
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

      {visibleBadges.length > 0 ? (
        <div className="member-modal__badge-grid">
          {visibleBadges.map((badge) => (
            <BadgeMini
              key={badge.id}
              rarity={badge.rarity}
              name={badge.name}
              storyDescription={badge.storyDescription}
              didacticDescription={badge.didacticDescription}
              rewardAmount={badge.rewardAmount}
              rewardEmoji={badge.rewardEmoji}
              selected={selectedIds.includes(badge.id)}
              onSelectedChange={(selected) => handleToggleBadge(badge.id, selected)}
              previewOnHover
              showEarnedAt={false}
            />
          ))}
        </div>
      ) : (
        <p className="member-modal__empty">Brak odznak spełniających wybrane filtry.</p>
      )}
    </Modal>
  );
}
