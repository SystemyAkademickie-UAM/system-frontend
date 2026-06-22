import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  CurrencyDisplay,
  DataTable,
  SearchBar,
  ShopToggleButton,
  useToast,
} from '../../../components/ui/index.js';
import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import { groupShopAddPath } from '../../../routes/pathRegistry.js';
import '../../../components/page/PageUnavailable.css';
import { resolveShopCategoryLabels } from '../group-shop/shopCategories.js';
import ShopDeleteModal from '../group-shop/modals/ShopDeleteModal.jsx';
import { useGroupShopItems, useGroupShopOpen } from '../group-shop/useGroupShop.js';
import RewardsShopItemTableRow from '../group-rewards/shared/RewardsShopItemTableRow.jsx';
import '../group-rewards/shared/rewardsShared.css';
import '../group-rewards/shared/rewardsTablePreview.css';
import './RewardsShopItemsContent.css';

/**
 * @param {number | null | undefined} value
 * @returns {string}
 */
function formatLimitValue(value) {
  if (value === null || value === undefined) {
    return 'Bez limitu';
  }
  return String(value);
}

/**
 * @param {import('../group-shop/shopItem.types.js').ShopItem} item
 * @param {number} index
 */
function mapShopItemToRow(item, index) {
  const categoryLabels = resolveShopCategoryLabels(item.categories);
  return {
    ...item,
    position: index + 1,
    categoryLabel: categoryLabels.join(', ') || '—',
    stockLabel: formatLimitValue(item.stockQuantity),
    studentLimitLabel: formatLimitValue(item.perStudentLimit),
  };
}

const SHOP_ITEM_COLUMNS = [
  {
    key: 'position',
    label: 'Numer',
    sort: 'number',
    width: '90px',
    className: 'rewards-table__th--position',
    render: (item) => (
      <span className="rewards-table__position">#{item.position}</span>
    ),
  },
  {
    key: 'name',
    label: 'Nazwa',
    sort: 'text',
    width: '240px',
    render: (item) => (
      <span className="rewards-table__name">{item.name}</span>
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
    key: 'priceAmount',
    label: 'Cena',
    sort: 'number',
    width: '120px',
    render: (item) => (
      <CurrencyDisplay
        amount={item.priceAmount}
        symbol="🥕"
        size="sm"
      />
    ),
  },
  {
    key: 'storyDescription',
    label: 'Opis fabularny',
    sort: 'text',
    width: '220px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.storyDescription || '—'}
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
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.didacticDescription || '—'}
      </span>
    ),
  },
  {
    key: 'categoryLabel',
    label: 'Kategoria',
    sort: 'text',
    width: '160px',
    cellClassName: 'rewards-table__cell--truncate',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text rewards-table__cell-text--truncate">
        {item.categoryLabel}
      </span>
    ),
  },
  {
    key: 'stockLabel',
    label: 'Stan magazynu',
    sort: 'text',
    width: '130px',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text">{item.stockLabel}</span>
    ),
  },
  {
    key: 'studentLimitLabel',
    label: 'Limit / student',
    sort: 'text',
    width: '130px',
    hiddenBelow: 768,
    render: (item) => (
      <span className="rewards-table__cell-text">{item.studentLimitLabel}</span>
    ),
  },
];

export default function RewardsShopItemsContent() {
  const nav = useGroupSubNav('group-rewards');
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const {
    items,
    isLoading,
    error,
    deleteItem,
  } = useGroupShopItems(groupId);
  const { isShopOpen, toggleShopOpen } = useGroupShopOpen(groupId);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeModal, setActiveModal] = useState(null);

  const catalogItems = useMemo(
    () => items.map(mapShopItemToRow),
    [items],
  );

  const handleToggleShopOpen = useCallback(async () => {
    const result = await toggleShopOpen();
    if (!result?.ok) {
      showError(result?.error ?? 'Nie udało się zmienić statusu sklepu.');
    }
  }, [showError, toggleShopOpen]);

  const openDeleteModal = useCallback((item) => {
    setActiveModal({ type: 'delete', item });
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  const handleDeleteConfirm = useCallback(async () => {
    if (!activeModal?.item) {
      return;
    }

    const result = await deleteItem(activeModal.item.id);

    if (result.ok) {
      showSuccess('Produkt został usunięty.');
      closeModal();
      return;
    }

    showError(result.error ?? 'Nie udało się usunąć produktu.');
  }, [activeModal, deleteItem, closeModal, showSuccess, showError]);

  const handleEdit = useCallback((item) => {
    if (!groupId) {
      return;
    }
    navigate(`${groupShopAddPath(groupId)}?itemId=${encodeURIComponent(item.id)}`);
  }, [groupId, navigate]);

  const handleAddProduct = useCallback(() => {
    if (!groupId) {
      return;
    }
    navigate(groupShopAddPath(groupId));
  }, [groupId, navigate]);

  const rowActions = useMemo(() => ({
    onDelete: openDeleteModal,
    deleteLabel: 'Usuń produkt',
    deleteAriaLabel: (item) => `Usuń produkt ${item.name}`,
    menuItems: [
      {
        id: 'edit',
        label: 'Edytuj produkt',
        description: 'Otwórz formularz dodawania produktu.',
        onSelect: handleEdit,
      },
    ],
  }), [openDeleteModal, handleEdit]);

  const modalItem = activeModal?.item ?? null;

  if (error) {
    return (
      <SectionPageLayout
        className="page-unavailable rewards-page rewards-shop-items"
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
      className="page-unavailable rewards-page rewards-shop-items"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
      toolbar={(
        <>
          <div className="maq-section-page__toolbar-start rewards-shop-items__toolbar-start">
            <ShopToggleButton
              isShopOpen={isShopOpen}
              onToggle={handleToggleShopOpen}
              className="rewards-shop-items__toggle"
            />
            <Button
              variant="primary"
              size="md"
              className="rewards-page__add-btn rewards-shop-items__add-btn"
              onClick={handleAddProduct}
            >
              Dodaj produkt
            </Button>
          </div>
          <div className="maq-section-page__toolbar-end">
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Szukaj produktu…"
              name="shop-item-catalog-search"
              className="rewards-page__search rewards-shop-items__search"
              aria-label="Szukaj produktu"
            />
          </div>
        </>
      )}
    >

      {isLoading ? (
        <p className="rewards-page__loading page-unavailable__notice">Ładowanie produktów…</p>
      ) : catalogItems.length === 0 ? (
        <p className="rewards-page__empty page-unavailable__notice">
          Brak produktów w sklepie. Kliknij „Dodaj produkt”, aby utworzyć pierwszy.
        </p>
      ) : (
        <DataTable
          columns={SHOP_ITEM_COLUMNS}
          data={catalogItems}
          rowKey="id"
          tiebreakerKey="position"
          itemsPerPage={10}
          paginationAriaLabel="Nawigacja stron listy produktów sklepowych"
          className="rewards-table rewards-table--shop-items"
          search={{
            external: true,
            value: searchQuery,
            filter: (item, query) => (
              item.name.toLowerCase().includes(query)
              || item.storyDescription.toLowerCase().includes(query)
              || item.didacticDescription.toLowerCase().includes(query)
              || item.categoryLabel.toLowerCase().includes(query)
              || item.stockLabel.toLowerCase().includes(query)
              || item.studentLimitLabel.toLowerCase().includes(query)
            ),
          }}
          rowActions={rowActions}
          renderRow={RewardsShopItemTableRow}
        />
      )}

      <ShopDeleteModal
        isOpen={activeModal?.type === 'delete'}
        item={modalItem}
        onClose={closeModal}
        onConfirm={handleDeleteConfirm}
      />
    </SectionPageLayout>
  );
}
