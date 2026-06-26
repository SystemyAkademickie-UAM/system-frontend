/**
 * TYMCZASOWE — generator produktów sklepu przez API backendu.
 */

import { createGroupItemCategory, fetchGroupItemCategories } from '../../../services/itemCategories.api.js';
import { fetchGroupBadges } from '../../../services/badges.api.js';
import { fetchGroupRanks } from '../../../services/ranks.api.js';
import { createGroupShopItem } from '../../../services/shop.api.js';
import { syncShopItemRankUnlock } from '../../../utils/ranks/rankShopItemUnlock.js';
import { pickRandom, randomInt } from '../group-ranking/temporarySeedGroupData.js';

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

const CATEGORY_NAMES = [
  'Wsparcie',
  'Czas',
  'Ocena',
  'Motywacja',
  'Strategia',
  'Bonus',
];

const CATEGORY_COLORS = [
  '#42f37d',
  '#4287f3',
  '#f3426c',
  '#f3d442',
  '#9b42f3',
  '#f37d42',
];

/**
 * @template T
 * @param {T[]} items
 * @param {number} count
 * @returns {T[]}
 */
function pickRandomMany(items, count) {
  const pool = [...items];
  const picked = [];

  while (picked.length < count && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }

  return picked;
}

/**
 * @param {string | number} groupId
 * @param {(line: string) => void} [onLog]
 */
async function ensureSeedCategories(groupId, onLog) {
  const result = await fetchGroupItemCategories(groupId);
  const categories = result.ok ? [...result.categories] : [];

  if (categories.length >= 4) {
    return categories;
  }

  const targetCount = 5;
  for (let index = categories.length; index < targetCount; index += 1) {
    const name = `${pickRandom(CATEGORY_NAMES)} ${index + 1}`;
    const createResult = await createGroupItemCategory(groupId, {
      name,
      color: CATEGORY_COLORS[index % CATEGORY_COLORS.length],
    });

    if (createResult.ok && createResult.category) {
      categories.push(createResult.category);
      onLog?.(`✓ Kategoria testowa: ${name}`);
    }
  }

  return categories;
}

/**
 * @param {Object} options
 * @param {string | number} options.groupId
 * @param {number} [options.count=10]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedTemporaryShopItems({ groupId, count = 10, onLog }) {
  const [ranks, badges, categories] = await Promise.all([
    fetchGroupRanks(groupId),
    fetchGroupBadges(groupId),
    ensureSeedCategories(groupId, onLog),
  ]);

  if (ranks.length === 0) {
    onLog?.('Uwaga: brak rang — produkty powstaną bez blokad rangowych.');
  }
  if (badges.length === 0) {
    onLog?.('Uwaga: brak odznak — produkty powstaną bez zniżek za odznaki.');
  }

  const rankRefs = ranks.map((rank) => ({
    dbId: rank.id,
    name: rank.name,
    shopItems: rank.uniqueStoreItems || [],
  }));

  let created = 0;

  for (let index = 0; index < count; index += 1) {
    const nameBase = PRODUCT_NAMES[index % PRODUCT_NAMES.length];
    const basePrice = 100 + index * 75;
    const maxCategories = Math.min(2, categories.length);
    const categoryCount = categories.length === 0 ? 0 : randomInt(1, Math.max(1, maxCategories));
    const selectedCategories = pickRandomMany(categories, categoryCount);
    const badgeCount = badges.length === 0 ? 0 : randomInt(0, Math.min(2, badges.length));
    const selectedBadges = pickRandomMany(badges, badgeCount);

    /** @type {Record<string, unknown>} */
    const payload = {
      name: `${nameBase} #${index + 1}`,
      basePrice,
      storyDescription: STORY_SNIPPETS[index % STORY_SNIPPETS.length],
      educationalDescription: DIDACTIC_SNIPPETS[index % DIDACTIC_SNIPPETS.length],
      stockQuantity: 20 + index,
      perStudentLimit: 2,
    };

    if (selectedCategories.length > 0) {
      payload.categoryIds = selectedCategories.map((category) => category.id);
    }

    if (selectedBadges.length > 0) {
      payload.badgePromotions = selectedBadges.map((badge) => {
        const usePercent = Math.random() < 0.55;
        return {
          id: badge.id,
          promotionType: usePercent ? 'percent' : 'fixed',
          value: usePercent ? randomInt(5, 25) : randomInt(10, 90),
        };
      });
    }

    const result = await createGroupShopItem(groupId, payload);
    if (!result.ok || !result.item) {
      onLog?.(`✗ ${payload.name}: ${result.error ?? 'błąd tworzenia'}`);
      continue;
    }

    created += 1;
    const categoryLabel = selectedCategories.map((category) => category.name).join(' + ') || 'brak';
    onLog?.(`✓ ${payload.name} → itemId=${result.item.id} [${categoryLabel}]`);

    if (ranks.length > 0 && Math.random() < 0.65) {
      const targetRank = pickRandom(ranks);
      const unlockResult = await syncShopItemRankUnlock(
        groupId,
        result.item.id,
        targetRank.id,
        rankRefs,
      );

      if (unlockResult.ok) {
        onLog?.(`  ↳ blokada rangi: ${targetRank.name}`);
      } else {
        onLog?.(`  ↳ nie udało się przypisać rangi: ${unlockResult.error ?? 'błąd'}`);
      }
    }
  }

  onLog?.(`Dodano ${created}/${count} produktów sklepowych (API).`);
}
