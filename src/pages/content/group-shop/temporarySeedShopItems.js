/**
 * TYMCZASOWE — generator produktów sklepu do localStorage (do usunięcia wraz z panelem dev).
 */

import { appendShopItems } from './shopItemsStorage.js';
import { pickRandomShopCategoryIds } from './shopCategories.js';

const PRODUCT_NAMES = [
  'Konsultacja z Mistrzem',
  'Zwolnienie z ćwiczeń',
  'Dodatkowy termin kolokwium',
  'Poprawa wybranej pracy',
  'Przedłużenie deadline\'u',
  'Karta mocy na egzamin',
  'Eliksir Skupienia',
  'Tarcza przed spóźnieniem',
  'Amulet Systematyczności',
  'Klucz do archiwum wiedzy',
];

const STORY_SNIPPETS = [
  'Legenda głosi, że ten bonus otwiera drzwi do ukrytej wiedzy.',
  'Rzadki artefakt zarezerwowany dla najbardziej wytrwałych uczestników misji.',
  'Dar od Mistrza Gry, który może odmienić losy całego semestru.',
  'Relikt z poprzedniego semestru, wciąż emanujący aurą motywacji.',
];

const DIDACTIC_SNIPPETS = [
  'Jednorazowa rozmowa z prowadzącym w celu omówienia bieżących trudności.',
  'Możliwość oddania pracy z opóźnieniem bez utraty punktów.',
  'Dodatkowe 24 godziny na oddanie wybranego zadania.',
  'Możliwość poprawy jednej ocenionej pracy w semestrze.',
];

/**
 * @param {number} basePrice
 * @returns {number | undefined}
 */
function pickRandomSalePrice(basePrice) {
  if (Math.random() >= 0.4) {
    return undefined;
  }

  const discountFactor = 0.55 + Math.random() * 0.35;
  const salePrice = Math.round(basePrice * discountFactor);
  if (salePrice >= basePrice || salePrice < 1) {
    return undefined;
  }

  return salePrice;
}

/**
 * @param {number} count
 * @returns {import('./shopItem.types.js').ShopItem[]}
 */
export function generateTemporaryShopItems(count = 10) {
  const timestamp = Date.now();

  return Array.from({ length: count }, (_, index) => {
    const nameBase = PRODUCT_NAMES[index % PRODUCT_NAMES.length];
    const priceAmount = 100 + index * 75;
    const salePriceAmount = pickRandomSalePrice(priceAmount);

    return {
      id: `dev-shop-${timestamp}-${index}`,
      name: `${nameBase} #${index + 1}`,
      storyDescription: STORY_SNIPPETS[index % STORY_SNIPPETS.length],
      didacticDescription: DIDACTIC_SNIPPETS[index % DIDACTIC_SNIPPETS.length],
      priceAmount,
      ...(salePriceAmount != null ? { salePriceAmount } : {}),
      categories: pickRandomShopCategoryIds(4),
    };
  });
}

/**
 * @param {Object} options
 * @param {string | number} options.groupId
 * @param {number} [options.count=10]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedTemporaryShopItems({ groupId, count = 10, onLog }) {
  const items = generateTemporaryShopItems(count);
  appendShopItems(groupId, items);
  onLog?.(`Dodano ${items.length} produktów sklepowych (localStorage).`);
}
