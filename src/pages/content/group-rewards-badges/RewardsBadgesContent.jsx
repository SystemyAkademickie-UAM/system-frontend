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
import RewardsBulkVisibilityButton from '../group-rewards/shared/RewardsBulkVisibilityButton.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';

const CREATENEWBADGE__TEXTLABEL = {
  polish: 'Dodaj odznakę',
  english: 'Add Badge'
};

const LOADINBADGES__TEXTLABEL = {
  polish: 'Ładowanie odznak…',
  english: 'Loading badges…'
};

const NOBADGESMESSAGE__TEXTLABEL = {
  polish: 'Brak odznak w tej grupie. Kliknij "Dodaj odznakę", aby utworzyć pierwszą.',
  english: 'No badges in this group. Click "Add Badge" to create the first one.'
};

const BADGESEARCH__TEXTLABEL = {
  polish: {
    placeholder: 'Szukaj odznaki…',
    label: 'Szukaj odznaki'
  },
  english: {
    placeholder: 'Search badges…',
    label: 'Search badges'
  }
};

const BADGEUPDATEDMESSAGE__TEXTLABEL = {
  polish: 'Zaktualizowano odznakę u {count} studentów.',
  english: 'Badge updated for {count} students.'
};

const CREATECONFIRMMESSAGE__TEXTLABEL = {
  polish: 'Odznaka została utworzona.',
  english: 'Badge created successfully.'
};

const CREATEFAILMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się utworzyć odznaki.',
  english: 'Failed to create badge.'
};

const EDITCONFIRMMESSAGE__TEXTLABEL = {
  polish: 'Odznaka została zaktualizowana.',
  english: 'Badge updated successfully.'
};

const EDITFAILMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zaktualizować odznaki.',
  english: 'Failed to update badge.'
};

const DELETECONFIRMMESSAGE__TEXTLABEL = {
  polish: 'Odznaka została usunięta.',
  english: 'Badge deleted successfully.'
};

const DELETEFAILMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się usunąć odznaki.',
  english: 'Failed to delete badge.'
};

const ALLOPUBLISHEDMESSAGE__TEXTLABEL = {
  polish: 'Wszystkie odznaki są teraz widoczne dla studentów.',
  english: 'All badges are now visible to students.'
};

const ALLHIDDENMESSAGE__TEXTLABEL = {
  polish: 'Wszystkie odznaki są teraz ukryte przed studentami.',
  english: 'All badges are now hidden from students.'
};

const ALLTOGGLEFAILMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zmienić widoczności odznak.',
  english: 'Failed to change badge visibility.'
};

const PUBLISHMESSAGE__TEXTLABEL = {
  polish: 'Odznaka jest teraz widoczna dla studentów.',
  english: 'Badge is now visible to students.'
};

const UNPUBLISHMESSAGE__TEXTLABEL = {
  polish: 'Odznaka jest teraz ukryta przed studentami.',
  english: 'Badge is now hidden from students.'
};

const VISIBILITYTOGGLEFAILMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się zmienić widoczności odznaki.',
  english: 'Failed to change badge visibility.'
};

const ROWACTIONDELETETEXT__TEXTLABEL = {
  polish: 'Usuń odznakę',
  english: 'Delete badge'
};

const ROWACTIONASSIGNTEXT__TEXTLABEL = {
  polish: 'Przydziel odznakę',
  english: 'Assign badge'
};

const ROWACTIONASSIGNARIA__TEXTLABEL = {
  polish: 'Przydziel odznakę studentom',
  english: 'Assign badge to students'
};

const ROWACTIONEDITTEXT__TEXTLABEL = {
  polish: 'Edytuj odznakę',
  english: 'Edit badge'
};

const ROWACTIONEDITDESC__TEXTLABEL = {
  polish: 'Zmień dane odznaki w kreatorze.',
  english: 'Change badge details in the wizard.'
};

const ROWACTIONVISIBILITYTEXT__TEXTLABEL = {
  polish: 'Ukryj / Pokaż odznakę',
  english: 'Hide / Show badge'
};

const ROWACTIONVISIBILITYDESC__TEXTLABEL = {
  polish: 'Zmienia widoczność odznaki dla studenta.',
  english: 'Changes badge visibility for students.'
};

const RARITYFILTERLABEL__TEXTLABEL = {
  polish: 'Filtr rzadkości odznaki',
  english: 'Badge rarity filter'
};

const TABLEPAGINATIONLABEL__TEXTLABEL = {
  polish: 'Nawigacja stron listy odznak',
  english: 'Badge list page navigation'
};

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
    label: 'Rzadkość',
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
        <em>{badge.storyDescription}</em>
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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
    handleToggleAllPublished,
  } = useGroupBadges();

  const [searchQuery, setSearchQuery] = useState('');
  const [rarityFilter, setRarityFilter] = useState('all');
  const [sortBy, setSortBy] = useState(TREASURY_SORT.qualityDesc);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [bulkVisibilityLoading, setBulkVisibilityLoading] = useState(false);

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
      showSuccess(CREATECONFIRMMESSAGE__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || CREATEFAILMESSAGE__TEXTLABEL[LANGUAGE]);
    }
  }, [handleCreate, closeModal, showSuccess, showError]);

  const handleEditConfirm = useCallback(async (values) => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleUpdate(activeModal.badge.id, values);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(EDITCONFIRMMESSAGE__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || EDITFAILMESSAGE__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleUpdate, closeModal, showSuccess, showError]);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.badge) return;
    setModalLoading(true);
    const result = await handleDelete(activeModal.badge.id);
    setModalLoading(false);
    if (result.ok) {
      showSuccess(DELETECONFIRMMESSAGE__TEXTLABEL[LANGUAGE]);
      closeModal();
    } else {
      showError(result.error || DELETEFAILMESSAGE__TEXTLABEL[LANGUAGE]);
    }
  }, [activeModal, handleDelete, closeModal, showSuccess, showError]);

  const handleGiveConfirm = useCallback(({ changed, error: giveError } = {}) => {
    if (giveError) {
      showError(giveError);
      return;
    }
    if (changed > 0) {
      showSuccess(BADGEUPDATEDMESSAGE__TEXTLABEL[LANGUAGE].replace('{count}', changed));
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

  const handleTileAssignBadge = useCallback((treasuryBadge) => {
    const badge = badges.find((entry) => entry.dbId === treasuryBadge.dbId);
    if (badge) {
      openModal('give', badge);
    }
  }, [badges, openModal]);

  const handleToggleAllVisibility = useCallback(async () => {
    setBulkVisibilityLoading(true);
    const result = await handleToggleAllPublished();
    setBulkVisibilityLoading(false);

    if (result.ok) {
      showSuccess(
        result.targetPublished
          ? ALLOPUBLISHEDMESSAGE__TEXTLABEL[LANGUAGE]
          : ALLHIDDENMESSAGE__TEXTLABEL[LANGUAGE],
      );
      return;
    }

    showError(result.error || ALLTOGGLEFAILMESSAGE__TEXTLABEL[LANGUAGE]);
  }, [handleToggleAllPublished, showSuccess, showError, LANGUAGE]);

  const rowActions = useMemo(() => ({
    onDelete: (badge) => openModal('delete', badge),
    deleteLabel: ROWACTIONDELETETEXT__TEXTLABEL[LANGUAGE],
    deleteAriaLabel: (badge) => `${ROWACTIONDELETETEXT__TEXTLABEL[LANGUAGE]} ${badge.name}`,
    inlineActions: [
      {
        id: 'give',
        label: ROWACTIONASSIGNTEXT__TEXTLABEL[LANGUAGE],
        iconFile: SVG_ICONS.actions.assign,
        ariaLabel: ROWACTIONASSIGNARIA__TEXTLABEL[LANGUAGE],
        onSelect: (badge) => openModal('give', badge),
      },
    ],
    menuItems: [
      {
        id: 'edit',
        label: ROWACTIONEDITTEXT__TEXTLABEL[LANGUAGE],
        description: ROWACTIONEDITDESC__TEXTLABEL[LANGUAGE],
        onSelect: (badge) => openModal('edit', badge),
      },
      {
        id: 'visibility',
        label: ROWACTIONVISIBILITYTEXT__TEXTLABEL[LANGUAGE],
        description: ROWACTIONVISIBILITYDESC__TEXTLABEL[LANGUAGE],
        onSelect: async (badge) => {
          const result = await handleTogglePublished(badge.id);
          if (result.ok) {
            showSuccess(
              badge.isPublished === false
                ? PUBLISHMESSAGE__TEXTLABEL[LANGUAGE]
                : UNPUBLISHMESSAGE__TEXTLABEL[LANGUAGE],
            );
          } else {
            showError(result.error || VISIBILITYTOGGLEFAILMESSAGE__TEXTLABEL[LANGUAGE]);
          }
        },
      },
    ],
  }), [openModal, handleTogglePublished, showSuccess, showError, LANGUAGE]);

  const modalBadge = activeModal?.badge ?? null;

  const getBadgeRowColor = useCallback((badge) => {
    const config = getBadgeRarityConfig(badge.rarity);
    return config ? `var(${config.cssVar})` : null;
  }, []);

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
          <div className="maq-section-page__toolbar-start rewards-page__toolbar-start">
            <Button
              variant="primary"
              size="md"
              className="rewards-page__add-btn"
              onClick={() => openModal('create')}
            >
              {CREATENEWBADGE__TEXTLABEL[LANGUAGE]}
            </Button>
            <RewardsBulkVisibilityButton
              items={badges}
              isLoading={bulkVisibilityLoading}
              disabled={isLoading}
              onToggleAll={handleToggleAllVisibility}
            />
          </div>
          <div className={[
            'maq-section-page__toolbar-end',
            'rewards-page__toolbar-end',
            isTileView ? 'rewards-page__toolbar-end--stacked' : '',
          ].filter(Boolean).join(' ')}>
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={BADGESEARCH__TEXTLABEL[LANGUAGE].placeholder}
              name="badge-catalog-search"
              className="rewards-page__search"
              aria-label={BADGESEARCH__TEXTLABEL[LANGUAGE].label}
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
        <p className="rewards-page__loading page-unavailable__notice">{LOADINBADGES__TEXTLABEL[LANGUAGE]}</p>
      ) : badges.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">{NOBADGESMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : isTileView ? (
        <>
          {filtersExpanded ? (
            <CatalogFiltersPanel className="rewards-page__filters">
              <CatalogFilterGroup
                ariaLabel={RARITYFILTERLABEL__TEXTLABEL[LANGUAGE]}
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
            onAssignBadge={handleTileAssignBadge}
          />
        </>
      ) : (
        <DataTable
          columns={BADGE_COLUMNS}
          data={badges}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel={TABLEPAGINATIONLABEL__TEXTLABEL[LANGUAGE]}
          className="rewards-table"
          getRowColor={getBadgeRowColor}
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
