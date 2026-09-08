import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProfilePageLayout from '../group-profile/ProfilePageLayout.jsx';
import {
  Button,
  CatalogFilterGroup,
  CatalogFiltersPanel,
  Divider,
  ProductCard,
  SearchBar,
} from '../../../components/ui/index.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import { useProfileInventoryHistory } from '../../../hooks/shop/useProfileInventoryHistory.js';
import { useGroupCurrency } from '../../../context/GroupCurrencyContext.jsx';
import { fetchGroupShopItems } from '../../../services/shop.api.js';
import { resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../group-activities/shared/activitiesShared.css';
import './ProfilePurchasesContent.css';

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

const PURCHASESTITLE__TEXTLABEL = {
  polish: 'Historia zakupów',
  english: 'Purchase history'
};

const TOTALPURCHASEDCOUNT__TEXTLABEL = {
  polish: 'Łącznie zakupione',
  english: 'Total purchased'
};

const SEARCHPLACEHOLDER__TEXTLABEL = {
  polish: 'Szukaj w historii zakupów…',
  english: 'Search purchase history…'
};

const SEARCHBARIALABEL__TEXTLABEL = {
  polish: 'Szukaj w historii zakupów',
  english: 'Search in purchase history'
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
  polish: 'Ładowanie historii zakupów…',
  english: 'Loading purchase history…'
};

const EMPTYPURCHASESMESSAGE__TEXTLABEL = {
  polish: 'Brak zakupionych przedmiotów.',
  english: 'No purchased items.'
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

export default function ProfilePurchasesContent() {
  const { groupId } = useParams();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [catalogItems, setCatalogItems] = useState([]);

  const { symbol: currencyEmoji } = useGroupCurrency();
  const { history, isLoading, error } = useProfileInventoryHistory(groupId);
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
    return map;
  }, [catalogItems]);

  const purchaseRecords = useMemo(() => {
    return history.filter((record) => record.type === 'SHOP_PURCHASE');
  }, [history]);

  const filteredPurchases = useMemo(() => {
    const normalized = searchQuery.trim().toLowerCase();

    return purchaseRecords.filter((record) => {
      const itemMeta = itemsMap.get(String(record.itemId));
      const categoryIds = itemMeta?.categories?.length
        ? itemMeta.categories
        : (itemMeta?.categoryId != null ? [String(itemMeta.categoryId)] : []);

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
        record.itemName,
        itemMeta?.name,
        itemMeta?.storyDescription,
        itemMeta?.didacticDescription,
      ].filter(Boolean).join(' ').toLowerCase();

      return haystack.includes(normalized);
    });
  }, [purchaseRecords, itemsMap, searchQuery, categoryFilter]);

  const categoryFilters = useMemo(() => {
    const usedCategoryIds = new Set();

    purchaseRecords.forEach((record) => {
      const itemMeta = itemsMap.get(String(record.itemId));
      const categoryIds = itemMeta?.categories?.length
        ? itemMeta.categories
        : (itemMeta?.categoryId != null ? [String(itemMeta.categoryId)] : []);

      if (categoryIds.length === 0) {
        usedCategoryIds.add(UNCATEGORIZED_FILTER_ID);
        return;
      }

      categoryIds.forEach((id) => usedCategoryIds.add(String(id)));
    });

    const filters = [{ id: 'all', label: CATEGORYFILTERALL__TEXTLABEL[LANGUAGE] }];

    if (usedCategoryIds.has(UNCATEGORIZED_FILTER_ID)) {
      filters.push({ id: UNCATEGORIZED_FILTER_ID, label: CATEGORYFILTERUNCATEGORIZED__TEXTLABEL[LANGUAGE] });
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
          label: category?.name ?? `${CATEGORYFALLBACK__TEXTLABEL[LANGUAGE]} ${id}`,
          color: category?.color ?? undefined,
        });
      });

    return filters;
  }, [purchaseRecords, itemsMap, categoriesById, LANGUAGE]);

  return (
    <ProfilePageLayout>
      <div className="profile-purchases-page">
        <header className="profile-purchases-page__header">
          <h2 className="profile-purchases-page__title">{PURCHASESTITLE__TEXTLABEL[LANGUAGE]}</h2>
        </header>

        {error ? (
          <p className="profile-purchases-page__error" role="alert">{error}</p>
        ) : null}

        <div className="maq-section-page__toolbar profile-purchases-page__toolbar">
          <div className="maq-section-page__toolbar-start profile-purchases-page__counts">
            <span className="activities-page__count">
              {TOTALPURCHASEDCOUNT__TEXTLABEL[LANGUAGE]}
              {' '}
              {purchaseRecords.length}
            </span>
          </div>

          <div className="maq-section-page__toolbar-end">
            <SearchBar
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder={SEARCHPLACEHOLDER__TEXTLABEL[LANGUAGE]}
              name="profile-purchases-search"
              className="profile-purchases-page__search"
              aria-label={SEARCHBARIALABEL__TEXTLABEL[LANGUAGE]}
            />
          </div>
        </div>

        {categoryFilters.length > 1 ? (
          <>
            <CatalogFiltersPanel className="profile-purchases-page__filters">
              <div className="profile-purchases-page__filters-row">
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
                  className="profile-purchases-page__toggle-categories"
                  onClick={() => setCategoryFilter('all')}
                >
                  {SHOWALLBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </CatalogFiltersPanel>
            <Divider className="profile-purchases-page__divider" />
          </>
        ) : null}

        {isLoading ? (
          <p className="profile-purchases-page__message">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
        ) : filteredPurchases.length === 0 ? (
          <p className="profile-purchases-page__message">
            {purchaseRecords.length === 0
              ? EMPTYPURCHASESMESSAGE__TEXTLABEL[LANGUAGE]
              : NORESULTSMESSAGE__TEXTLABEL[LANGUAGE]}
          </p>
        ) : (
          <div className="profile-purchases-page__grid">
            {filteredPurchases.map((record) => {
              const itemMeta = itemsMap.get(String(record.itemId));
              const categoryIds = itemMeta?.categories?.length
                ? itemMeta.categories
                : (itemMeta?.categoryId != null ? [String(itemMeta.categoryId)] : []);
              const categoryDetails = resolveShopCategoryDetails(categoryIds, categoriesById);

              return (
                <ProductCard
                  key={`purchase-${record.id}`}
                  itemId={record.itemId}
                  name={record.itemName || itemMeta?.name || 'Produkt'}
                  storyDescription={itemMeta?.storyDescription || ''}
                  didacticDescription={itemMeta?.didacticDescription || ''}
                  imageRef={itemMeta?.imageRef}
                  imageUrl={itemMeta?.imageUrl}
                  categoryDetails={categoryDetails}
                  isExtraLife={record.isExtraLife || itemMeta?.isExtraLife}
                  isPurchasedHistory
                  priceAmount={record.price}
                  priceEmoji={currencyEmoji}
                  dateLabel={`Zakupiono: ${formatDateTime(record.date)}`}
                  hideAddToCart
                  hideActions
                />
              );
            })}
          </div>
        )}
      </div>
    </ProfilePageLayout>
  );
}
