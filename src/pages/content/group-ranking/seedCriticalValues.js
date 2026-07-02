import { getBrowserIdForAuth } from '../../../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import {
  NAME_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  SHORT_DESCRIPTION_MAX_LENGTH,
  STAGE_NAME_MAX_LENGTH,
} from '../../../constants/fieldLimits.js';
import { createBadge } from '../../../services/badges.api.js';
import { postJson } from '../../../services/api-client.js';
import { fetchGroupRanks, createRank } from '../../../services/ranks.api.js';
import { createGroupShopItem } from '../../../services/shop.api.js';
import { buildCriticalText, formatCriticalLength } from '../../../utils/dev/criticalValuesText.js';
import { notifyGroupContentChanged } from '../../../utils/groupContentInvalidation.js';
import { calculateDefaultRankDiscount } from '../../../utils/ranks/rankDiscount.js';
import { DEFAULT_BADGE_EMOJI, DEFAULT_RANK_EMOJI } from '../../../utils/ranks/rankBadgeIcon.js';

const STAGES_PATH = '/stages';
const ACTIVITIES_PATH = '/activities';

/**
 * @param {string} url
 * @param {Record<string, unknown>} body
 */
async function postDevJson(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Browser-ID': getBrowserIdForAuth(),
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  /** @type {unknown} */
  let data = text;
  try {
    data = JSON.parse(text);
  } catch {
    // keep raw text
  }

  return { ok: response.ok, status: response.status, data };
}

/**
 * @param {number} publicGroupId
 * @returns {Promise<number[]>}
 */
async function fetchExistingStageIds(publicGroupId) {
  const baseUrl = getApiBaseUrl();
  const { ok, data } = await postDevJson(`${baseUrl}${STAGES_PATH}`, {
    method: 'retrieve',
    groupId: publicGroupId,
  });

  if (!ok || typeof data !== 'object' || data === null || !Array.isArray(data.stages)) {
    return [];
  }

  return data.stages
    .map((stage) => Number(stage.id))
    .filter((stageId) => Number.isFinite(stageId) && stageId > 0);
}

/**
 * @param {Object} options
 * @param {string | number} options.groupId
 * @param {boolean} [options.seedStages]
 * @param {boolean} [options.seedActivities]
 * @param {boolean} [options.seedPosts]
 * @param {boolean} [options.seedRanks]
 * @param {boolean} [options.seedBadges]
 * @param {boolean} [options.seedShopItems]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedCriticalValues({
  groupId,
  seedStages = true,
  seedActivities = true,
  seedPosts = true,
  seedRanks = true,
  seedBadges = true,
  seedShopItems = true,
  onLog,
}) {
  const publicGroupId = Number(groupId);
  if (!Number.isFinite(publicGroupId) || publicGroupId <= 0) {
    throw new Error('Brak poprawnego ID grupy.');
  }

  const baseUrl = getApiBaseUrl();
  const log = (line) => onLog?.(line);

  /** @type {import('../../../utils/groupContentInvalidation.js').GroupContentScope[]} */
  const changedScopes = [];
  /** @type {number | null} */
  let seededStageId = null;

  log('Start generatora wartości krytycznych (maks. długość pól tekstowych).');
  log('');

  if (seedStages) {
    log('— Etap —');
    const name = buildCriticalText(STAGE_NAME_MAX_LENGTH, 'etap');
    const { ok, status, data } = await postDevJson(`${baseUrl}${STAGES_PATH}`, {
      method: 'post',
      groupId: publicGroupId,
      name,
    });

    const stageId = typeof data === 'object' && data !== null && 'stage' in data
      ? Number(data.stage)
      : NaN;

    if (ok && Number.isFinite(stageId) && stageId > 0) {
      seededStageId = stageId;
      changedScopes.push('stages');
      log(`✓ Nazwa (${formatCriticalLength(name)}) → stageId=${stageId}`);
    } else {
      log(`✗ Etap nieudany (HTTP ${status}): ${JSON.stringify(data)}`);
    }
    log('');
  }

  if (seedActivities) {
    log('— Aktywność —');
    let stageId = seededStageId;

    if (!stageId) {
      const stageIds = await fetchExistingStageIds(publicGroupId);
      stageId = stageIds[0] ?? null;
    }

    if (!stageId) {
      log('Pominięto: brak etapów w grupie (najpierw wygeneruj etap).');
    } else {
      const name = buildCriticalText(NAME_MAX_LENGTH, 'aktywnosc-nazwa');
      const storyDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'aktywnosc-fab');
      const educationalDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'aktywnosc-dyd');

      const { ok, status, data } = await postDevJson(`${baseUrl}${ACTIVITIES_PATH}`, {
        method: 'post',
        stageId,
        name,
        currency: 100,
        storyDescription,
        educationalDescription,
      });

      const activityId = typeof data === 'object' && data !== null && 'activity' in data
        ? Number(data.activity)
        : NaN;

      if (ok && Number.isFinite(activityId) && activityId > 0) {
        changedScopes.push('activities');
        log(`✓ Nazwa (${formatCriticalLength(name)}), opisy (${formatCriticalLength(storyDescription)} + ${formatCriticalLength(educationalDescription)}) → activityId=${activityId} (stageId=${stageId})`);
      } else {
        log(`✗ Aktywność nieudana (HTTP ${status}): ${JSON.stringify(data)}`);
      }
    }
    log('');
  }

  if (seedPosts) {
    log('— Wpis —');
    const title = buildCriticalText(POST_TITLE_MAX_LENGTH, 'wpis-tytul');
    const content = buildCriticalText(POST_CONTENT_MAX_LENGTH, 'wpis-tresc');

    const result = await postJson(`/groups/${publicGroupId}/post`, {
      title,
      content,
      publishAt: new Date().toISOString(),
    });

    const postId = typeof result.data === 'object' && result.data !== null && 'post' in result.data
      ? Number(result.data.post)
      : NaN;

    if (result.ok && Number.isFinite(postId) && postId > 0) {
      log(`✓ Tytuł (${formatCriticalLength(title)}), treść (${formatCriticalLength(content)}) → postId=${postId}`);
    } else {
      log(`✗ Wpis nieudany (HTTP ${result.status}): ${JSON.stringify(result.data)}`);
    }
    log('');
  }

  if (seedRanks) {
    log('— Ranga —');
    const name = buildCriticalText(NAME_MAX_LENGTH, 'ranga-nazwa');
    const storyDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'ranga-fab');
    const existingRanks = await fetchGroupRanks(publicGroupId);

    const result = await createRank(publicGroupId, {
      name,
      icon: DEFAULT_RANK_EMOJI,
      requiredPoints: 100 + existingRanks.length * 50,
      storyDescription,
      discount: calculateDefaultRankDiscount(existingRanks),
    });

    if (result.ok && result.rank) {
      changedScopes.push('ranks');
      log(`✓ Nazwa (${formatCriticalLength(name)}), opis fabularny (${formatCriticalLength(storyDescription)}) → rankId=${result.rank.id}`);
    } else {
      log(`✗ Ranga nieudana: ${result.error ?? 'błąd tworzenia'}`);
    }
    log('');
  }

  if (seedBadges) {
    log('— Odznaka —');
    const name = buildCriticalText(NAME_MAX_LENGTH, 'odznaka-nazwa');
    const storyDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'odznaka-fab');
    const educationalDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'odznaka-dyd');

    const result = await createBadge(publicGroupId, {
      name,
      icon: DEFAULT_BADGE_EMOJI,
      storyDescription,
      educationalDescription,
      rewardAmount: 10,
      rarity: 'common',
    });

    if (result.ok && result.badge) {
      changedScopes.push('badges');
      log(`✓ Nazwa (${formatCriticalLength(name)}), opisy (${formatCriticalLength(storyDescription)} + ${formatCriticalLength(educationalDescription)}) → badgeId=${result.badge.id}`);
    } else {
      log(`✗ Odznaka nieudana: ${result.error ?? 'błąd tworzenia'}`);
    }
    log('');
  }

  if (seedShopItems) {
    log('— Produkt sklepowy —');
    const name = buildCriticalText(NAME_MAX_LENGTH, 'sklep-nazwa');
    const storyDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'sklep-fab');
    const educationalDescription = buildCriticalText(SHORT_DESCRIPTION_MAX_LENGTH, 'sklep-dyd');

    const result = await createGroupShopItem(publicGroupId, {
      name,
      basePrice: 100,
      storyDescription,
      educationalDescription,
      stockQuantity: 5,
      perStudentLimit: 1,
      imageRef: '🎁*#42f37d',
    });

    if (result.ok && result.item) {
      log(`✓ Nazwa (${formatCriticalLength(name)}), opisy (${formatCriticalLength(storyDescription)} + ${formatCriticalLength(educationalDescription)}) → itemId=${result.item.id}`);
    } else {
      log(`✗ Produkt nieudany: ${result.error ?? 'błąd tworzenia'}`);
    }
    log('');
  }

  if (changedScopes.length > 0) {
    notifyGroupContentChanged(publicGroupId, changedScopes);
  }

  log('— Gotowe —');
  log('Sprawdź widoki list/kafelków i formularze edycji dla wygenerowanych encji.');
}
