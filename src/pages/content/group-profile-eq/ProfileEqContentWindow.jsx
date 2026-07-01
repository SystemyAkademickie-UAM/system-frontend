import { useState, useEffect } from 'react';
import { ProductCard, Divider } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { DEFAULT_CURRENCY_SYMBOL } from '../../../constants/currency.constants.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { useGroupItemCategories } from '../../../hooks/shop/useGroupItemCategories.js';
import { resolveShopCategoryDetails } from '../../../utils/shop/shopCategories.js';

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

export default function ProfileEqContentWindow({popupclose, groupId, purchaseditems, currencyemoji}) {

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
          'X-Browser-ID': browserid
        }
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

  var totalvalue = 0;
  var totalcost = 0;

  let i = 0;

  while (i < purchaseditems.length) {

    totalvalue = totalvalue + Number(purchaseditems[i].priceAmount);
    totalcost = totalcost + Number(purchaseditems[i].effectivePrice);

    i = i + 1;
  }

  var totalsaved = totalvalue - totalcost;

  var itemrows = [];

  i = 0;

  while (i < purchaseditems.length) {

    var rowitems = [];

    let j = 0;

    while (j < 4 && i < purchaseditems.length) {

      rowitems.push(purchaseditems[i]);

      i = i + 1;
      j = j + 1;
    }

    itemrows.push(rowitems);
  }

  return (
    <div style = {{width: '100%', height: '100%', position: 'fixed', top: '0%', left: '0%', backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <div onClick = {(event) => event.stopPropagation()} style = {{backgroundColor: 'rgb(26, 26, 42)', width: '70%', height: '70%', position: 'relative', borderRadius: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden'}}>
        <div onClick = {closepopupwindow} style = {{width: '5%', aspectRatio: '1 / 1', position: 'absolute', top: '2%', left: '94%', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', cursor: 'pointer', zIndex: 1}}>
          <img src = {closeicon} style = {{width: '60%', height: '60%'}}/>
        </div>
        <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: '3%', gap: '0.5vh'}}>
          <div style = {{width: '100%', position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '18px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}><span>Podsumowanie zakupów</span></div>
        </div>

        <div style = {{width: '96%', position: 'relative', left: '2%', display: 'flex', flexDirection: 'column', gap: '1vh', overflowY: 'auto', flex: 1, paddingTop: '2%', paddingBottom: '2%'}}>

          {itemrows.map((rowitems, rowindex) => (
            <div key = {'purchaserow' + rowindex} style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', gap: '1%', alignItems: 'stretch', justifyContent: 'flex-start'}}>
              {rowitems.map((item) => {
                const categoryIds = item.categories?.length
                  ? item.categories
                  : (item.categoryId != null ? [String(item.categoryId)] : []);
                const categoryDetails = resolveShopCategoryDetails(categoryIds, categoriesById);

                return (
                  <div key = {'purchaseitem' + item.id} style = {{width: '23.75%', position: 'relative', display: 'flex', flexDirection: 'column'}}>
                    <ProductCard
                      itemId = {item.id}
                      name = {item.name}
                      storyDescription = {item.storyDescription}
                      didacticDescription = {item.didacticDescription}
                      imageRef = {item.imageRef}
                      imageUrl = {item.imageUrl}
                      categoryDetails = {categoryDetails}
                      inventoryMode
                      ownedQuantity = {1}
                      readOnly
                      hideAddToCart
                      hideActions
                    />
                  </div>
                );
              })}
            </div>
          ))}


          <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'column', gap: '1vh', paddingTop: '2%'}}>
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', width: '25%', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Wartość przedmiotów</span></div>
              <div style = {{position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', width: '5%', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', gap: '0.5vh'}}><span>{totalvalue}</span></div>
              <span>{currencyEmojiValue}</span>
            </div>
            <div style = {{width: '35%', height: '1px', backgroundColor: 'rgba(30, 204, 56, 0.5)'}} />
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', width: '25%', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Koszt przedmiotów</span></div>
              <div style = {{position: 'relative', color: 'rgb(227, 224, 247)', fontSize: '16px', display: 'flex', width: '5%', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', gap: '0.5vh'}}><span>{totalcost}</span></div>
              <span>{currencyEmojiValue}</span>
            </div>
            <div style = {{width: '35%', height: '1px', backgroundColor: 'rgb(30, 204, 56)'}} />
            <div style = {{width: '100%', position: 'relative', display: 'flex', flexDirection: 'row', alignItems: 'center', paddingLeft: '2%', paddingRight: '2%'}}>
              <div style = {{position: 'relative', color: 'rgb(187, 203, 185)', fontSize: '14px', display: 'flex', width: '25%', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start'}}><span>Zaoszczędzono</span></div>
              <div style = {{position: 'relative', color: 'rgb(30, 204, 56)', fontSize: '16px', display: 'flex', width: '5%', fontWeight: 900, alignItems: 'center', justifyContent: 'flex-start', gap: '0.5vh'}}><span>{totalsaved}</span></div>
              <span>{currencyEmojiValue}</span>
            </div>
          </div>


          {errorMessage ? (
            <div style = {{width: '100%', position: 'relative', color: 'rgb(255, 120, 120)', fontSize: '14px', display: 'flex', fontWeight: 500, alignItems: 'center', justifyContent: 'flex-start', paddingLeft: '2%'}}><span>{errorMessage}</span></div>
          ) : null}


        </div>

        <div onClick = {closepopupwindow} style = {{backgroundColor: 'rgba(30, 204, 56)', width: '12%', height: '6%', position: 'relative', bottom: '3%', left: '84%', borderRadius: '8px', color: 'rgb(0, 57, 21)', fontSize: '16px', display: 'flex', fontWeight: 900, alignItems: 'center', justifyContent: 'center', textAlign: 'center', cursor: 'pointer'}}>Potwierdź</div>

      </div>
    </div>
  )
}
