import { useState, useEffect } from 'react';
import { ProductCard } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { DEFAULT_CURRENCY_SYMBOL } from '../../../constants/currency.constants.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import { resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';
import './ProfileEqContentWindow.css';

const closeicon = PUBLIC_UI_ICONS.close;

const SHOP_PURCHASE_SUMMARY_PREFIX = 'maq-shop-purchase-summary:';

export function setShopPurchaseSummary(groupId, summary) {
  if (!groupId || typeof window === 'undefined') {
    return;
  }
  sessionStorage.setItem(`${SHOP_PURCHASE_SUMMARY_PREFIX}${groupId}`, JSON.stringify(summary));
}

export function getShopPurchaseSummary(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return null;
  }

  try {
    const raw = sessionStorage.getItem(`${SHOP_PURCHASE_SUMMARY_PREFIX}${groupId}`);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function clearShopPurchaseSummary(groupId) {
  if (!groupId || typeof window === 'undefined') {
    return;
  }
  sessionStorage.removeItem(`${SHOP_PURCHASE_SUMMARY_PREFIX}${groupId}`);
}

export default function ProfileEqContentWindow({ popupclose, groupId, purchaseditems, currencyemoji }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [currencyEmojiValue, setCurrencyEmojiValue] = useState(currencyemoji || DEFAULT_CURRENCY_SYMBOL);

  const { categoriesById } = useGroupItemCategories(groupId);

  async function onFetchCurrencyEmoji() {
    if (currencyemoji != null && currencyemoji != '') {
      setCurrencyEmojiValue(currencyemoji);
      return;
    }

    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/groups/' + groupId + '/currency';

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      const responsetext = await response.text();

      console.log('GET /groups/' + groupId + '/currency: ', response.status);
      console.log('GET /groups/' + groupId + '/currency: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/groups/' + groupId + '/currency not JSON: ' + responsetext);
      }

      console.log('GET /groups/' + groupId + '/currency JSON:', data);

      if (data && data.currencyEmoji != null && data.currencyEmoji != '') {
        setCurrencyEmojiValue(data.currencyEmoji);
      }
    } catch (error) {
      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }

  function closepopupwindow() {
    if (popupclose) {
      popupclose();
    }
  }

  useEffect(() => {
    onFetchCurrencyEmoji();
  }, []);

  let totalvalue = 0;
  let totalcost = 0;

  let i = 0;

  while (i < purchaseditems.length) {
    totalvalue = totalvalue + Number(purchaseditems[i].priceAmount);
    totalcost = totalcost + Number(purchaseditems[i].effectivePrice);
    i = i + 1;
  }

  const totalsaved = totalvalue - totalcost;

  const itemrows = [];

  i = 0;

  while (i < purchaseditems.length) {
    const rowitems = [];

    let j = 0;

    while (j < 4 && i < purchaseditems.length) {
      rowitems.push(purchaseditems[i]);
      i = i + 1;
      j = j + 1;
    }

    itemrows.push(rowitems);
  }

  return (
    <div className="purchase-summary-modal">
      <div className="purchase-summary-modal__dialog" onClick={(event) => event.stopPropagation()}>
        <button
          type="button"
          className="purchase-summary-modal__close"
          onClick={closepopupwindow}
          aria-label="Zamknij"
        >
          <img src={closeicon} alt="" />
        </button>

        <header className="purchase-summary-modal__header">
          Podsumowanie zakupów
        </header>

        <div className="purchase-summary-modal__items">
          {itemrows.map((rowitems, rowindex) => (
            <div key={`purchaserow${rowindex}`} className="purchase-summary-modal__row">
              {rowitems.map((item) => {
                const categoryIds = item.categories?.length
                  ? item.categories
                  : (item.categoryId != null ? [String(item.categoryId)] : []);
                const categoryDetails = resolveShopCategoryDetails(categoryIds, categoriesById);

                return (
                  <div key={`purchaseitem${item.id}`} className="purchase-summary-modal__item">
                    <ProductCard
                      itemId={item.id}
                      name={item.name}
                      storyDescription={item.storyDescription}
                      didacticDescription={item.didacticDescription}
                      imageRef={item.imageRef}
                      imageUrl={item.imageUrl}
                      categoryDetails={categoryDetails}
                      inventoryMode
                      ownedQuantity={1}
                      readOnly
                      hideAddToCart
                      hideActions
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <footer className="purchase-summary-modal__footer">
          <div className="purchase-summary-modal__summary-row">
            <span className="purchase-summary-modal__summary-label">Wartość przedmiotów</span>
            <span className="purchase-summary-modal__summary-value">{totalvalue}</span>
            <span>{currencyEmojiValue}</span>
          </div>
          <div className="purchase-summary-modal__divider" />
          <div className="purchase-summary-modal__summary-row">
            <span className="purchase-summary-modal__summary-label">Koszt przedmiotów</span>
            <span className="purchase-summary-modal__summary-value">{totalcost}</span>
            <span>{currencyEmojiValue}</span>
          </div>
          <div className="purchase-summary-modal__divider purchase-summary-modal__divider--strong" />
          <div className="purchase-summary-modal__summary-row">
            <span className="purchase-summary-modal__summary-label">Zaoszczędzono</span>
            <span className="purchase-summary-modal__summary-value purchase-summary-modal__summary-value--saved">
              {totalsaved}
            </span>
            <span>{currencyEmojiValue}</span>
          </div>

          {errorMessage ? (
            <p className="purchase-summary-modal__error" role="alert">{errorMessage}</p>
          ) : null}

          <div className="purchase-summary-modal__actions">
            <button
              type="button"
              className="purchase-summary-modal__confirm"
              onClick={closepopupwindow}
            >
              Potwierdź
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
