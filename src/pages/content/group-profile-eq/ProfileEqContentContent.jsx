import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Button,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  Divider,
  ProductCard,
  SearchBar,
  useToast,
} from '../../../components/ui/index.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import { useProfileInventory } from '../../../hooks/shop/useProfileInventory.js';
import { resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import ProfileEqUseItemModal from './ProfileEqUseItemModal.jsx';
import '../group-activities/shared/activitiesShared.css';
import './ProfileEqContent.css';

const UNCATEGORIZED_FILTER_ID = '0';

/**
 * @param {import('../../../utils/shop/shopItem.types.js').InventoryEntry[]} entries
 * @param {string} searchQuery
 * @param {string} categoryFilter
 */
function filterInventoryEntries(entries, searchQuery, categoryFilter) {
  const normalized = searchQuery.trim().toLowerCase();

  return entries.filter((entry) => {
    const item = entry.item;
    const categoryIds = item.categories?.length
      ? item.categories
      : (item.categoryId != null ? [String(item.categoryId)] : []);

    if (categoryFilter === UNCATEGORIZED_FILTER_ID) {
      if (categoryIds.length > 0) {
        return false;
      }
    } else if (categoryFilter !== 'all' && !categoryIds.includes(categoryFilter)) {
      return false;
    }

    if (!normalized) {
      return true;
    }

    const haystack = [
      item.name,
      item.storyDescription,
      item.didacticDescription,
    ].filter(Boolean).join(' ').toLowerCase();

    return haystack.includes(normalized);
  });
}

/**
 * @param {import('../../../utils/shop/shopItem.types.js').InventoryEntry[]} entries
 * @param {Map<string, import('../../../services/itemCategories.api.js').ItemCategory>} categoriesById
 */
function buildInventoryCategoryFilters(entries, categoriesById) {
  const usedCategoryIds = new Set();

  entries.forEach((entry) => {
    const item = entry.item;
    const categoryIds = item.categories?.length
      ? item.categories
      : (item.categoryId != null ? [String(item.categoryId)] : []);

    if (categoryIds.length === 0) {
      usedCategoryIds.add(UNCATEGORIZED_FILTER_ID);
      return;
    }

    categoryIds.forEach((id) => usedCategoryIds.add(String(id)));
  });

  const filters = [{ id: 'all', label: 'Wszystkie' }];

  if (usedCategoryIds.has(UNCATEGORIZED_FILTER_ID)) {
    filters.push({ id: UNCATEGORIZED_FILTER_ID, label: '- - -' });
  }

  [...usedCategoryIds]
    .filter((id) => id !== UNCATEGORIZED_FILTER_ID)
    .sort((left, right) => {
      const leftName = categoriesById.get(left)?.name ?? left;
      const rightName = categoriesById.get(right)?.name ?? right;
      return leftName.localeCompare(rightName, 'pl');
    })
    .forEach((id) => {
      const category = categoriesById.get(id);
      filters.push({
        id,
        label: category?.name ?? `Kategoria ${id}`,
        color: category?.color ?? undefined,
      });
    });

  return filters;
}

/**
 * @param {Object} props
 * @param {string | number | null} [props.studentAccountId]
 * @param {boolean} [props.readOnly]
 */
export default function ProfileEqContentContent({
  studentAccountId = null,
  readOnly = false,
}) {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [usingItemId, setUsingItemId] = useState(null);
  const [confirmUseItem, setConfirmUseItem] = useState(null);

  const {
    entries,
    isLoading,
    error,
    useItem,
  } = useProfileInventory(groupId, { studentAccountId, readOnly });

  const { categoriesById } = useGroupItemCategories(groupId);

  const totalPurchased = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantity, 0),
    [entries],
  );

  const uniqueCount = entries.length;

  const categoryFilters = useMemo(
    () => buildInventoryCategoryFilters(entries, categoriesById),
    [entries, categoriesById],
  );

  const filteredEntries = useMemo(
    () => filterInventoryEntries(entries, searchQuery, categoryFilter),
    [entries, searchQuery, categoryFilter],
  );

  const handleConfirmUseItem = async () => {
    if (!confirmUseItem?.itemId) {
      return;
    }

    setUsingItemId(confirmUseItem.itemId);
    const result = await useItem(confirmUseItem.itemId);
    setUsingItemId(null);

    if (result.ok) {
      showSuccess('Przedmiot został użyty.');
      setConfirmUseItem(null);
      return;
    }

    showError(result.error ?? 'Nie udało się użyć przedmiotu.');
  };

  const openUseItemConfirm = (itemId, itemName) => {
    if (readOnly) {
      return;
    }
    setConfirmUseItem({ itemId, itemName });
  };

  return (
    <div className="profile-eq-page">
      <header className="profile-eq-page__header">
        <h2 className="profile-eq-page__title">Ekwipunek</h2>
      </header>

      {error ? (
        <p className="profile-eq-page__error" role="alert">{error}</p>
      ) : null}

      <div className="maq-section-page__toolbar profile-eq-page__toolbar">
        <div className="maq-section-page__toolbar-start profile-eq-page__counts">
          <span className="activities-page__count">
            Zakupione
            {' '}
            {totalPurchased}
          </span>
          <span className="activities-page__count">
            Unikatowe
            {' '}
            {uniqueCount}
          </span>
        </div>

        <div className="maq-section-page__toolbar-end">
          <SearchBar
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Szukaj przedmiotów…"
            name="profile-eq-search"
            className="profile-eq-page__search"
            aria-label="Szukaj przedmiotów w ekwipunku"
          />
        </div>
      </div>

      {categoryFilters.length > 1 ? (
        <>
          <CatalogFiltersPanel className="profile-eq-page__filters">
            <div className="profile-eq-page__filters-row">
              <CatalogFilterGroup
                ariaLabel="Filtr kategorii przedmiotu"
                filters={categoryFilters}
                activeId={categoryFilter}
                onSelect={setCategoryFilter}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                className="profile-eq-page__toggle-categories"
                onClick={() => setCategoryFilter('all')}
              >
                Pokaż wszystkie
              </Button>
            </div>
          </CatalogFiltersPanel>
          <Divider className="profile-eq-page__divider" />
        </>
      ) : null}

      {isLoading ? (
        <p className="profile-eq-page__message">Ładowanie ekwipunku…</p>
      ) : filteredEntries.length === 0 ? (
        <p className="profile-eq-page__message">
          {entries.length === 0
            ? 'Brak zakupionych przedmiotów.'
            : 'Brak wyników wyszukiwania.'}
        </p>
      ) : (
        <div className="profile-eq-page__grid">
          {filteredEntries.map((entry) => {
            const item = entry.item;
            const categoryIds = item.categories?.length
              ? item.categories
              : (item.categoryId != null ? [String(item.categoryId)] : []);
            const categoryDetails = resolveShopCategoryDetails(categoryIds, categoriesById);

            return (
              <ProductCard
                key={`${entry.id}-${entry.itemId}`}
                itemId={item.id}
                name={item.name}
                storyDescription={item.storyDescription}
                didacticDescription={item.didacticDescription}
                imageRef={item.imageRef}
                imageUrl={item.imageUrl}
                categoryDetails={categoryDetails}
                inventoryMode
                ownedQuantity={entry.quantity}
                readOnly={readOnly}
                disabled={usingItemId === entry.itemId}
                onUse={() => openUseItemConfirm(entry.itemId, item.name)}
                hideAddToCart
                hideActions={readOnly}
              />
            );
          })}
        </div>
      )}

      <ProfileEqUseItemModal
        isOpen={confirmUseItem != null}
        itemName={confirmUseItem?.itemName}
        isLoading={usingItemId != null}
        onClose={() => {
          if (usingItemId == null) {
            setConfirmUseItem(null);
          }
        }}
        onConfirm={handleConfirmUseItem}
      />
    </div>
  );
}
