import { useCallback, useMemo, useState } from 'react';
import {
  BADGE_RARITY,
  BADGE_RARITY_LABELS,
  Button,
  CurrencyDisplay,
  DataTable,
  AssetSvg,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  CatalogFiltersToggle,
  CatalogSortSelect,
  getBadgeRarityConfig,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import { getBadgeCssVars } from '../../../components/ui/Badge/badgeCssVars.js';
import { useGroupBadges } from './useGroupBadges.js';
import { getVisibilityStatusLabel } from '../../../utils/rewards/visibilityStatusLabel.js';
import RewardsBadgeTableRow from '../group-rewards/shared/RewardsBadgeTableRow.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import { useViewLayoutPreference } from '../../../hooks/useViewLayoutPreference.js';
import ViewLayoutToggle from '../../../components/ui/ViewLayoutToggle/ViewLayoutToggle.jsx';
import GroupMainBadgesContent from '../group-main-badges/GroupMainBadgesContent.jsx';
import { LECTURER_SORT_OPTIONS, TREASURY_SORT } from '../group-main-badges/badgeTreasuryModel.js';
import BadgeFormModal from './modals/BadgeFormModal.jsx';
import BadgeGiveModal from './modals/BadgeGiveModal.jsx';
import BadgeDeleteModal from './modals/BadgeDeleteModal.jsx';

const RARITY_FILTERS = [
  { id: 'all', label: 'Wszystkie' },
  { id: BADGE_RARITY.common, label: BADGE_RARITY_LABELS.common },
  { id: BADGE_RARITY.uncommon, label: BADGE_RARITY_LABELS.uncommon },
  { id: BADGE_RARITY.rare, label: BADGE_RARITY_LABELS.rare },
  { id: BADGE_RARITY.epic, label: BADGE_RARITY_LABELS.epic },
];

const BADGE_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '90px',
    className: 'rewards-table__th--position',
    render: (badge) => (
      <span className="rewards-table__position">#{badge.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nazwa',
    sort: 'text',
    width: '260px',
    render: (badge) => (
      <span className="rewards-table__name">{badge.name}</span>
    ),
  },
  {
    key: 'visibility',
    label: 'Widoczność',
    sort: 'text',
    width: '110px',
    accessor: (badge) => getVisibilityStatusLabel(badge.isPublished, 'badge'),
    render: (badge) => (
      <span
        className={[
          'rewards-table__visibility',
          badge.isPublished === false
            ? 'rewards-table__visibility--hidden'
            : 'rewards-table__visibility--public',
        ].join(' ')}
      >
        {getVisibilityStatusLabel(badge.isPublished, 'badge')}
      </span>
    ),
  },
  {
    key: '_spacer',
    label: '',
    sort: false,
    className: 'rewards-table__th--spacer',
    colClassName: 'rewards-table__col--spacer',
    cellClassName: 'rewards-table__cell--spacer',
    render: () => '\u00A0',
  },
  {
    key: 'icon',
    label: 'Ikona',
    sort: 'text',
    width: '140px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      badge.icon ? (
        <span className="rewards-table__icon-emoji" aria-hidden="true">{badge.icon}</span>
      ) : (
        <span className="rewards-table__cell-text rewards-table__cell-text--muted">—</span>
      )
    ),
  },
  {
    key: 'rarity',
    label: 'Jakość',
    sort: 'text',
    width: '120px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span
        className="rewards-table__rarity"
        data-rarity={badge.rarity}
        style={getBadgeCssVars(badge.rarity)}
      >
        {getBadgeRarityConfig(badge.rarity).label}
      </span>
    ),
  },
  {
    key: 'storyDescription',
    label: 'Opis fabularny',
    sort: 'text',
    width: '220px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span className="rewards-table__cell-text">
        {badge.storyDescription}
      </span>
    ),
  },
  {
    key: 'didacticDescription',
    label: 'Opis dydaktyczny',
    sort: 'text',
    width: '200px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (badge) => (
      <span className="rewards-table__cell-text">
        {badge.didacticDescription}
      </span>
    ),
  },
  {
    key: 'rewardAmount',
    label: 'Nagroda',
    sort: 'number',
    width: '100px',
    render: (badge) => (
      <CurrencyDisplay amount={badge.rewardAmount} size="sm" />
    ),
  },
];

export default function RewardsBadgesContent() {
  const nav = useGroupSubNav('group-rewards');
  const { layout, toggleLayout, isTileView } = useViewLayoutPreference('maq-rewards-badges-view');
  const { showSuccess, showError } = useToast();
  const {
    badges,
    students,
    isLoading,
    error,
    groupId,
    handleCreate,
    handleUpdate,
    handleDelete,
    handleTogglePublished,
  } = useGroupBadges();

  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [sortBy, setSortBy] = useState(TREASURY_SORT.qualityDesc);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  const openModal = useCallback((type, badge = null) => {
    setActiveModal({ type, badge });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleCreateConfirm = useCallback(async (values) => {
    setModalLoading(true);
    const result = await handleCreate(values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została utworzona.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się utworzyć odznaki.');
    }
  }, [handleCreate, closeModal, showSuccess, showError]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.badge.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została zaktualizowana.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się zaktualizować odznaki.');
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.badge.id);
    setModalLoading(false);
    if (result.ok) {
      showSuccess('Odznaka została usunięta.');
      closeModal();
    } else {
      showError(result.error || 'Nie udało się usunąć odznaki.');
    }
  }, [activeModal, handleDelete, closeModal, showSuccess, showError]);

  const handleGiveConfirm = useCallback(({ changed, error: giveError } = {}) => {
    if (giveError) {
      showError(giveError);
      return;
    }
    if (changed > 0) {
      showSuccess(`Zaktualizowano odznakę u ${changed} studentów.`);
    }
  }, [showSuccess, showError]);

  const handleTileEditBadge = useCallback((treasuryBadge) => {
    const badge = badges.find((entry) => entry.dbId === treasuryBadge.dbId);
    if (badge) {
      openModal('edit', badge);
    }
  }, [badges, openModal]);

  const handleTileDeleteBadge = useCallback((treasuryBadge) => {
    const badge = badges.find((entry) => entry.dbId === treasuryBadge.dbId);
    if (badge) {
      openModal('delete', badge);
    }
  }, [badges, openModal]);

  const rowActions = useMemo(() => ({
    onDelete: (badge) => openModal('delete', badge),
    deleteLabel: 'Usuń odznakę',
    deleteAriaLabel: (badge) => `Usuń odznakę ${badge.name}`,
    inlineActions: [
      {
        id: 'give',
        label: 'Przydziel odznakę',
        iconFile: SVG_ICONS.actions.assign,
        ariaLabel: 'Przydziel odznakę studentom',
        onSelect: (badge) => openModal('give', badge),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj odznakę',
        description: 'Zmień dane odznaki w kreatorze.',
        onSelect: (badge) => openModal('edit', badge),
      },
      {
        id: 'visibility',
        label: 'Ukryj / Pokaż odznakę',
        description: 'Zmienia widoczność odznaki dla studenta.',
        onSelect: async (badge) => {
          const result = await handleTogglePublished(badge.id);
          if (result.ok) {
            showSuccess(
              badge.isPublished === false
                ? 'Odznaka jest teraz widoczna dla studentów.'
                : 'Odznaka jest teraz ukryta przed studentami.',
            );
          } else {
            showError(result.error || 'Nie udało się zmienić widoczności odznaki.');
          }
        },
      },
    ],
  }), [openModal, handleTogglePublished, showSuccess, showError]);

  const modalBadge = activeModal?.badge ?? null;

  if (error) {
    return (
      <SectionPageLayout
        className="page-unavailable rewards-page"
        title={nav.sectionTitle}
        subNavItems={nav.items}
        subNavAriaLabel={nav.ariaLabel}
      >
        <p className="rewards-page__error" role="alert">{error}</p>
      </SectionPageLayout>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable rewards-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      headerAction={<ViewLayoutToggle layout={layout} onToggle={toggleLayout} />}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start">
            <Button
              variant="primary"
              size="md"
              className="rewards-page__add-btn"
              onClick={() => openModal('create')}
            >
              Dodaj odznakę
            </Button>
          </div>
          <div className={[
            'maq-section-page__toolbar-end',
            'rewards-page__toolbar-end',
            isTileView ? 'rewards-page__toolbar-end--stacked' : '',
          ].filter(Boolean).join(' ')}>
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj odznaki…"
              name="badge-catalog-search"
              className="rewards-page__search"
              aria-label="Szukaj odznaki"
            />
            {isTileView ? (
              <div className="rewards-page__toolbar-filters-row">
                <CatalogFiltersToggle
                  expanded={filtersExpanded}
                  onToggle={() => setFiltersExpanded((expanded) => !expanded)}
                />
              </div>
            ) : null}
          </div>
        </>
      )}
    >

      {isLoading ? (
        <p className="rewards-page__loading page-unavailable__notice">Ładowanie odznak…</p>
      ) : badges.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">Brak odznak w tej grupie. Kliknij „Dodaj odznakę”, aby utworzyć pierwszą.</p>
      ) : isTileView ? (
        <>
          {filtersExpanded ? (
            <CatalogFiltersPanel className="rewards-page__filters">
              <CatalogFilterGroup
                ariaLabel="Filtr jakości odznaki"
                filters={RARITY_FILTERS}
                activeId={rarityFilter}
                onSelect={setRarityFilter}
              />
              <CatalogSortSelect
                selectId="rewards-badges-sort"
                value={sortBy}
                onChange={setSortBy}
                options={LECTURER_SORT_OPTIONS}
              />
            </CatalogFiltersPanel>
          ) : null}
          <GroupMainBadgesContent
            embedded
            searchQuery={searchQuery}
            rarityFilter={rarityFilter}
            sortBy={sortBy}
            onRarityFilterChange={setRarityFilter}
            onSortByChange={setSortBy}
            showLecturerActions
            onEditBadge={handleTileEditBadge}
            onDeleteBadge={handleTileDeleteBadge}
          />
        </>
      ) : (
        <DataTable
          columns={BADGE_COLUMNS}
          data={badges}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy odznak"
          className="rewards-table"
          search={{
            external: true,
            value: searchQuery,
            filter: (badge, query) => (
              badge.name.toLowerCase().includes(query)
              || badge.storyDescription.toLowerCase().includes(query)
              || badge.didacticDescription.toLowerCase().includes(query)
            ),
          }}
          rowActions={rowActions}
          renderRow={RewardsBadgeTableRow}
        />
      )}

      <BadgeFormModal
        isOpen={activeModal?.type === 'create'}
        onClose={closeModal}
        onConfirm={handleCreateConfirm}
        isLoading={modalLoading}
      />
      <BadgeFormModal
        isOpen={activeModal?.type === 'edit'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleEditConfirm}
        isLoading={modalLoading}
      />
      <BadgeGiveModal
        isOpen={activeModal?.type === 'give'}
        badge={modalBadge}
        groupId={groupId}
        students={students}
        onClose={closeModal}
        onConfirm={handleGiveConfirm}
        isLoading={modalLoading}
      />
      <BadgeDeleteModal
        isOpen={activeModal?.type === 'delete'}
        badge={modalBadge}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
        isLoading={modalLoading}
      />
    </SectionPageLayout>
  );
}
