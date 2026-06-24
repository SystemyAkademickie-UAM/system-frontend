/**
 * TYMCZASOWE — generator produktów sklepu przez API backendu.
 */

import { createGroupShopItem } from '../../../services/shop.api.js';

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
 * @param {Object} options
 * @param {string | number} options.groupId
 * @param {number} [options.count=10]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedTemporaryShopItems({ groupId, count = 10, onLog }) {
  let created = 0;

  for (let index = 0; index < count; index += 1) {
    const nameBase = PRODUCT_NAMES[index % PRODUCT_NAMES.length];
    const basePrice = 100 + index * 75;

    const payload = {
      name: `${nameBase} #${index + 1}`,
      basePrice,
      storyDescription: STORY_SNIPPETS[index % STORY_SNIPPETS.length],
      educationalDescription: DIDACTIC_SNIPPETS[index % DIDACTIC_SNIPPETS.length],
      stockQuantity: 20 + index,
      perStudentLimit: 2,
    };

    const result = await createGroupShopItem(groupId, payload);
    if (result.ok) {
      created += 1;
      onLog?.(`✓ ${payload.name} → itemId=${result.item?.id ?? '?'}`);
    } else {
      onLog?.(`✗ ${payload.name}: ${result.error ?? 'błąd tworzenia'}`);
    }
  }

  onLog?.(`Dodano ${created}/${count} produktów sklepowych (API).`);
}
