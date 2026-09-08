import { useEffect, useMemo, useState } from 'react';
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
import { useProfileInventoryHistory } from '../../../hooks/shop/useProfileInventoryHistory.js';
import { fetchGroupShopItems } from '../../../services/shop.api.js';
import { resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import ProfileEqUseItemModal from './ProfileEqUseItemModal.jsx';
import '../group-activities/shared/activitiesShared.css';
import './ProfileEqContent.css';

const UNCATEGORIZED_FILTER_ID = '0';

const CATEGORYFILTERALL__TEXTLABEL = {
  polish: 'Wszystkie',
  english: 'All'
};

const CATEGORYFILTERUNCATEGORIZED__TEXTLABEL = {
  polish: '- - -',
  english: '- - -'
};

const CATEGORYFALLBACK__TEXTLABEL = {
  polish: 'Kategoria',
  english: 'Category'
};

const USEITEMSUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Przedmiot został użyty.',
  english: 'Item has been used.'
};

const USEITEMERRORMESSAGE__TEXTLABEL = {
  polish: 'Nie udało się użyć przedmiotu.',
  english: 'Failed to use item.'
};

const INVENTORYTITLE__TEXTLABEL = {
  polish: 'Posiadane przedmioty',
  english: 'Inventory'
};

const USEDITEMSTITLE__TEXTLABEL = {
  polish: 'Zużyte przedmioty',
  english: 'Used items'
};

const PURCHASEDCOUNT__TEXTLABEL = {
  polish: 'Posiadane',
  english: 'Owned'
};

const UNIQUECOUNT__TEXTLABEL = {
  polish: 'Unikatowe',
  english: 'Unique'
};

const USEDCOUNT__TEXTLABEL = {
  polish: 'Zużyte',
  english: 'Used'
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj przedmiotów…',
  english: 'Search items…'
};

const SEARCHBARIALABEL__TEXTLABEL = {
  polish: 'Szukaj przedmiotów w ekwipunku',
  english: 'Search items in inventory'
};

const FILTERGROUPALABEL__TEXTLABEL = {
  polish: 'Filtr kategorii przedmiotu',
  english: 'Item category filter'
};

const SHOWALLBUTTON__TEXTLABEL = {
  polish: 'Pokaż wszystkie',
  english: 'Show all'
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie ekwipunku…',
  english: 'Loading inventory…'
};

const EMPTYINVENTORYMESSAGE__TEXTLABEL = {
  polish: 'Brak zakupionych przedmiotów w ekwipunku.',
  english: 'No active items in inventory.'
};

const EMPTYUSEDMESSAGE__TEXTLABEL = {
  polish: 'Brak zużytych przedmiotów.',
  english: 'No used items.'
};

const NORESULTSMESSAGE__TEXTLABEL = {
  polish: 'Brak wyników wyszukiwania.',
  english: 'No search results.'
};

function formatDateTime(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('pl-PL', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

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

function buildInventoryCategoryFilters(entries, categoriesById, language) {
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

  const filters = [{ id: 'all', label: CATEGORYFILTERALL__TEXTLABEL[language] }];

  if (usedCategoryIds.has(UNCATEGORIZED_FILTER_ID)) {
    filters.push({ id: UNCATEGORIZED_FILTER_ID, label: CATEGORYFILTERUNCATEGORIZED__TEXTLABEL[language] });
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
        label: category?.name ?? `${CATEGORYFALLBACK__TEXTLABEL[language]} ${id}`,
        color: category?.color ?? undefined,
      });
    });

  return filters;
}

export default function ProfileEqContentContent({
  studentAccountId = null,
  readOnly = false,
}) {
  const { groupId } = useParams();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showSuccess, showError } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [usingItemId, setUsingItemId] = useState(null);
  const [confirmUseItem, setConfirmUseItem] = useState(null);
  const [catalogItems, setCatalogItems] = useState([]);
  const [localUsedItems, setLocalUsedItems] = useState([]);

  const {
    entries,
    isLoading: isInventoryLoading,
    error: inventoryError,
    useItem,
  } = useProfileInventory(groupId, { studentAccountId, readOnly });

  const {
    history,
    isLoading: isHistoryLoading,
  } = useProfileInventoryHistory(groupId, { studentAccountId });

  const { categoriesById } = useGroupItemCategories(groupId);

  useEffect(() => {
    if (!groupId) return;
    let isCancelled = false;
    fetchGroupShopItems(groupId).then((res) => {
      if (!isCancelled && res.ok && Array.isArray(res.items)) {
        setCatalogItems(res.items);
      }
    });
    return () => {
      isCancelled = true;
    };
  }, [groupId]);

  const itemsMap = useMemo(() => {
    const map = new Map();
    catalogItems.forEach((it) => map.set(String(it.id), it));
    entries.forEach((entry) => {
      if (entry.item) {
        map.set(String(entry.item.id), entry.item);
      }
    });
    return map;
  }, [catalogItems, entries]);

  const backendUsedItems = useMemo(() => {
    return history.filter((record) => record.type === 'ITEM_USED');
  }, [history]);

  const mergedUsedItems = useMemo(() => {
    const combined = [...localUsedItems];
    backendUsedItems.forEach((bItem) => {
      const alreadyAdded = combined.some(
        (cItem) => cItem.id === bItem.id || (cItem.isLocal && cItem.itemId === bItem.itemId && Math.abs(new Date(cItem.date).getTime() - new Date(bItem.date).getTime()) < 3000),
      );
      if (!alreadyAdded) {
        combined.push(bItem);
      }
    });
    return combined.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [localUsedItems, backendUsedItems]);

  const totalPurchased = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.quantity, 0),
    [entries],
  );

  const uniqueCount = entries.length;

  const categoryFilters = useMemo(
    () => buildInventoryCategoryFilters(entries, categoriesById, LANGUAGE),
    [entries, categoriesById, LANGUAGE],
  );

  const filteredEntries = useMemo(
    () => filterInventoryEntries(entries, searchQuery, categoryFilter),
    [entries, searchQuery, categoryFilter],
  );

  const handleConfirmUseItem = async () => {
    if (!confirmUseItem?.itemId) {
      return;
    }

    const itemObj = entries.find((e) => Number(e.itemId) === Number(confirmUseItem.itemId))?.item
      || itemsMap.get(String(confirmUseItem.itemId));

    setUsingItemId(confirmUseItem.itemId);
    const result = await useItem(confirmUseItem.itemId);
    setUsingItemId(null);

    if (result.ok) {
      showSuccess(USEITEMSUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
      setConfirmUseItem(null);

      // Dynamically add to used items
      const newUsedRecord = {
        id: `local-${Date.now()}`,
        isLocal: true,
        type: 'ITEM_USED',
        date: new Date().toISOString(),
        itemId: Number(confirmUseItem.itemId),
        itemName: itemObj?.name || confirmUseItem.itemName,
        isExtraLife: itemObj?.isExtraLife || false,
      };
      setLocalUsedItems((prev) => [newUsedRecord, ...prev]);
      return;
    }

    showError(result.error ?? USEITEMERRORMESSAGE__TEXTLABEL[LANGUAGE]);
  };

  const openUseItemConfirm = (itemId, itemName) => {
    if (readOnly) {
      return;
    }
    setConfirmUseItem({ itemId, itemName });
  };

  const isLoading = isInventoryLoading || isHistoryLoading;
  const error = inventoryError;

  return (
    <div className="profile-eq-page">
      <header className="profile-eq-page__header">
        <h2 className="profile-eq-page__title">{INVENTORYTITLE__TEXTLABEL[LANGUAGE]}</h2>
      </header>

      {error ? (
        <p className="profile-eq-page__error" role="alert">{error}</p>
      ) : null}

      <div className="maq-section-page__toolbar profile-eq-page__toolbar">
        <div className="maq-section-page__toolbar-start profile-eq-page__counts">
          <span className="activities-page__count">
            {PURCHASEDCOUNT__TEXTLABEL[LANGUAGE]}
            {' '}
            {totalPurchased}
          </span>
          <span className="activities-page__count">
            {UNIQUECOUNT__TEXTLABEL[LANGUAGE]}
            {' '}
            {uniqueCount}
          </span>
        </div>

        <div className="maq-section-page__toolbar-end">
          <SearchBar
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            name="profile-eq-search"
            className="profile-eq-page__search"
            aria-label={SEARCHBARIALABEL__TEXTLABEL[LANGUAGE]}
          />
        </div>
      </div>

      {categoryFilters.length > 1 ? (
        <>
          <CatalogFiltersPanel className="profile-eq-page__filters">
            <div className="profile-eq-page__filters-row">
              <CatalogFilterGroup
                ariaLabel={FILTERGROUPALABEL__TEXTLABEL[LANGUAGE]}
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
                {SHOWALLBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
            </div>
          </CatalogFiltersPanel>
          <Divider className="profile-eq-page__divider" />
        </>
      ) : null}

      {isLoading && entries.length === 0 ? (
        <p className="profile-eq-page__message">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : filteredEntries.length === 0 ? (
        <p className="profile-eq-page__message">
          {entries.length === 0
            ? EMPTYINVENTORYMESSAGE__TEXTLABEL[LANGUAGE]
            : NORESULTSMESSAGE__TEXTLABEL[LANGUAGE]}
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

      {/* SEKCJA: Zużyte przedmioty */}
      <Divider className="profile-eq-page__divider" />

      <header className="profile-eq-page__header">
        <h2 className="profile-eq-page__title">{USEDITEMSTITLE__TEXTLABEL[LANGUAGE]}</h2>
        <span className="activities-page__count">
          {USEDCOUNT__TEXTLABEL[LANGUAGE]}
          {' '}
          {mergedUsedItems.length}
        </span>
      </header>

      {mergedUsedItems.length === 0 ? (
        <p className="profile-eq-page__message">{EMPTYUSEDMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : (
        <div className="profile-eq-page__grid profile-eq-page__grid--used">
          {mergedUsedItems.map((record) => {
            const itemMeta = itemsMap.get(String(record.itemId));
            const categoryIds = itemMeta?.categories?.length
              ? itemMeta.categories
              : (itemMeta?.categoryId != null ? [String(itemMeta.categoryId)] : []);
            const categoryDetails = resolveShopCategoryDetails(categoryIds, categoriesById);

            return (
              <ProductCard
                key={`used-${record.id}`}
                itemId={record.itemId}
                name={record.itemName || itemMeta?.name || 'Przedmiot'}
                storyDescription={itemMeta?.storyDescription || ''}
                didacticDescription={itemMeta?.didacticDescription || ''}
                imageRef={itemMeta?.imageRef}
                imageUrl={itemMeta?.imageUrl}
                categoryDetails={categoryDetails}
                isExtraLife={record.isExtraLife || itemMeta?.isExtraLife}
                isUsed
                dateLabel={`Użyto: ${formatDateTime(record.date)}`}
                hideAddToCart
                hideActions
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
