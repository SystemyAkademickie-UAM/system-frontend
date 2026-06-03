import { getBrowserIdForAuth } from '../../../auth/browserIdStorage.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { notifyGroupContentChanged } from '../../../utils/groupContentInvalidation.js';

const STAGES_PATH = '/stages';
const ACTIVITIES_PATH = '/activities';

/**
 * @param {number | string} groupId
 * @returns {string}
 */
function getGroupRanksPath(groupId) {
  return `/groups/${groupId}/ranks`;
}

/**
 * @param {number | string} groupId
 * @returns {string}
 */
function getGroupBadgesPath(groupId) {
  return `/groups/${groupId}/badges`;
}

const STAGE_THEMES = [
  'Mgliste Wzgórza',
  'Krystaliczna Grota',
  'Zapomniana Biblioteka',
  'Leśna Przełęcz',
  'Ruiny Starożytnego Miasta',
  'Podziemny Labirynt',
  'Srebrne Jezioro',
  'Wieża Astronomów',
  'Polana Alchemików',
  'Czerwony Most',
  'Zamarznięta Dolina',
  'Ogród Eteru',
];

const ACTIVITY_VERBS = [
  'Odkryj',
  'Przeanalizuj',
  'Rozwiąż',
  'Zbadaj',
  'Przetestuj',
  'Opisz',
  'Porównaj',
  'Zaprojektuj',
  'Zinterpretuj',
  'Udowodnij',
];

const ACTIVITY_TOPICS = [
  'tajemniczy artefakt',
  'starożytną inskrypcję',
  'układ współrzędnych',
  'wzór matematyczny',
  'eksperyment laboratoryjny',
  'mapę skarbów',
  'kodeks honorowy',
  'mechanizm zegarowy',
  'legendę plemienną',
  'protokół bezpieczeństwa',
];

const RANK_TITLES = [
  'Nowicjusz',
  'Uczeń',
  'Adept',
  'Znawca',
  'Badacz',
  'Tropiciel',
  'Strażnik',
  'Mistrz',
  'Arcymistrz',
  'Legenda',
  'Wędrowiec',
  'Odkrywca',
];

const RANK_ICONS = ['⭐', '🌟', '✨', '🏅', '🎖️', '👑', '🔮', '🛡️', '⚔️', '📜'];

const BADGE_NAMES = [
  'Pierwszy Krok',
  'Wytrwałość',
  'Mistrz Quizu',
  'Złota Marchewka',
  'Nocny Maraton',
  'Perfekcjonista',
  'Duch Zespołu',
  'Analityk',
  'Kreatywny Umysł',
  'Strażnik Wiedzy',
  'Szybki Myśliciel',
  'Odkrywca Tajemnic',
];

const BADGE_ICONS = ['🏅', '⭐', '🏆', '🎖️', '🥇', '🌟', '💎', '🛡️', '📜', '🔮'];

const BADGE_RARITIES = ['common', 'uncommon', 'rare', 'epic'];

const STORE_ITEMS = [
  'Eliksir Skupienia',
  'Zwój Mądrości',
  'Amulet Wytrwałości',
  'Klucz do Archiwum',
  'Mapa Podziemi',
  'Pierścień Analityka',
  'Tarcza Początkującego',
  'Kompas Eksploratora',
];

/**
 * @template T
 * @param {T[]} items
 * @returns {T}
 */
export function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/**
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * @param {string} prefix
 * @returns {string}
 */
function uniqueLabel(prefix) {
  return `${prefix} ${randomInt(1000, 9999)}`;
}

/**
 * @param {string} url
 * @param {Record<string, unknown>} body
 */
async function postJson(url, body) {
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
  const { ok, data } = await postJson(`${baseUrl}${STAGES_PATH}`, {
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
 * @param {number} [options.count]
 * @param {boolean} [options.seedStages]
 * @param {boolean} [options.seedActivities]
 * @param {boolean} [options.seedRanks]
 * @param {boolean} [options.seedBadges]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedGroupData({
  groupId,
  count = 10,
  seedStages = true,
  seedActivities = true,
  seedRanks = true,
  seedBadges = true,
  onLog,
}) {
  const publicGroupId = Number(groupId);
  if (!Number.isFinite(publicGroupId) || publicGroupId <= 0) {
    throw new Error('Brak poprawnego ID grupy.');
  }

  const baseUrl = getApiBaseUrl();

  /** @type {string[]} */
  const logLines = [];
  const log = (line) => {
    logLines.push(line);
    onLog?.(line);
  };

  /** @type {{ stages: Array<{ id: number, name: string }>, activities: number[], ranks: number[], badges: number[], errors: string[] }} */
  const summary = {
    stages: [],
    activities: [],
    ranks: [],
    badges: [],
    errors: [],
  };

  log(`Start seedu dla grupy ${publicGroupId} (po ${count} elementów na typ).`);
  log('');

  if (seedStages) {
    log('— Etapy —');
    for (let index = 0; index < count; index += 1) {
      const theme = pickRandom(STAGE_THEMES);
      const name = `Etap: ${theme} ${index + 1}`;

      const { ok, status, data } = await postJson(`${baseUrl}${STAGES_PATH}`, {
        method: 'post',
        groupId: publicGroupId,
        name,
      });

      const stageId = typeof data === 'object' && data !== null && 'stage' in data
        ? Number(data.stage)
        : NaN;

      if (ok && Number.isFinite(stageId) && stageId > 0) {
        summary.stages.push({ id: stageId, name });
        log(`✓ ${name} → stageId=${stageId}`);
      } else {
        const message = `Etap ${index + 1} nieudany (HTTP ${status}): ${JSON.stringify(data)}`;
        summary.errors.push(message);
        log(`✗ ${message}`);
      }
    }
    log('');
  }

  if (seedActivities) {
    log('— Aktywności —');
    let stageIds = summary.stages.map((stage) => stage.id);

    if (stageIds.length === 0) {
      stageIds = await fetchExistingStageIds(publicGroupId);
    }

    if (stageIds.length === 0) {
      log('Pominięto: brak etapów w grupie (najpierw wygeneruj etapy).');
    } else {
      for (let index = 0; index < count; index += 1) {
        const stageId = stageIds[index % stageIds.length];
        const verb = pickRandom(ACTIVITY_VERBS);
        const topic = pickRandom(ACTIVITY_TOPICS);
        const name = `${verb} ${topic}`;

        const { ok, status, data } = await postJson(`${baseUrl}${ACTIVITIES_PATH}`, {
          method: 'post',
          stageId,
          name,
          currency: randomInt(25, 250),
          educationalDescription: `Opis dydaktyczny: ${name}.`,
          storyDescription: `Fabuła: uczestnik musi ${verb.toLowerCase()} ${topic}.`,
        });

        const activityId = typeof data === 'object' && data !== null && 'activity' in data
          ? Number(data.activity)
          : NaN;

        if (ok && Number.isFinite(activityId) && activityId > 0) {
          summary.activities.push(activityId);
          log(`✓ ${name} → activityId=${activityId} (stageId=${stageId})`);
        } else {
          const message = `Aktywność ${index + 1} nieudana (HTTP ${status}): ${JSON.stringify(data)}`;
          summary.errors.push(message);
          log(`✗ ${message}`);
        }
      }
    }
    log('');
  }

  if (seedRanks) {
    log('— Rangi —');
    for (let index = 0; index < count; index += 1) {
      const title = pickRandom(RANK_TITLES);
      const name = `${title} ${uniqueLabel('Ranga')}`;
      const requiredPoints = (index + 1) * randomInt(80, 120);

      const { ok, status, data } = await postJson(`${baseUrl}${getGroupRanksPath(publicGroupId)}`, {
        name,
        icon: pickRandom(RANK_ICONS),
        requiredPoints,
        storyDescription: `Opowieść rangi „${name}” — kamień milowy na ścieżce rozwoju.`,
        storeDiscount: randomInt(0, 15),
        uniqueStoreItems: [
          pickRandom(STORE_ITEMS),
          pickRandom(STORE_ITEMS),
        ],
      });

      const rankId = typeof data === 'object' && data !== null && 'id' in data
        ? Number(data.id)
        : NaN;

      if (ok && Number.isFinite(rankId) && rankId > 0) {
        summary.ranks.push(rankId);
        log(`✓ ${name} → rankId=${rankId} (${requiredPoints} pkt)`);
      } else {
        const message = `Ranga ${index + 1} nieudana (HTTP ${status}): ${JSON.stringify(data)}`;
        summary.errors.push(message);
        log(`✗ ${message}`);
      }
    }
    log('');
  }

  if (seedBadges) {
    log('— Odznaki —');
    for (let index = 0; index < count; index += 1) {
      const baseName = pickRandom(BADGE_NAMES);
      const name = `${baseName} ${uniqueLabel('')}`;
      const rarity = pickRandom(BADGE_RARITIES);

      const { ok, status, data } = await postJson(`${baseUrl}${getGroupBadgesPath(publicGroupId)}`, {
        name,
        icon: pickRandom(BADGE_ICONS),
        educationalDescription: `Zdobądź odznakę „${name}” wykonując wyzwanie kursu.`,
        storyDescription: `Symbol ${pickRandom(['odwagi', 'mądrości', 'wytrwałości', 'spostrzegawczości'])} w świecie gry.`,
        rewardAmount: randomInt(10, 100),
        rarity,
      });

      const badgeId = typeof data === 'object' && data !== null && 'id' in data
        ? Number(data.id)
        : NaN;

      if (ok && Number.isFinite(badgeId) && badgeId > 0) {
        summary.badges.push(badgeId);
        log(`✓ ${name} → badgeId=${badgeId} (${rarity})`);
      } else {
        const message = `Odznaka ${index + 1} nieudana (HTTP ${status}): ${JSON.stringify(data)}`;
        summary.errors.push(message);
        log(`✗ ${message}`);
      }
    }
    log('');
  }

  log('— Podsumowanie —');
  log(`Etapów: ${summary.stages.length}/${seedStages ? count : 0}`);
  log(`Aktywności: ${summary.activities.length}/${seedActivities ? count : 0}`);
  log(`Rang: ${summary.ranks.length}/${seedRanks ? count : 0}`);
  log(`Odznak: ${summary.badges.length}/${seedBadges ? count : 0}`);
  if (summary.errors.length > 0) {
    log(`Błędy: ${summary.errors.length}`);
  } else {
    log('Gotowe bez błędów.');
  }

  /** @type {import('../../../utils/groupContentInvalidation.js').GroupContentScope[]} */
  const changedScopes = [];
  if (summary.stages.length > 0) changedScopes.push('stages');
  if (summary.activities.length > 0) changedScopes.push('activities');
  if (summary.ranks.length > 0) changedScopes.push('ranks');
  if (summary.badges.length > 0) changedScopes.push('badges');
  if (changedScopes.length > 0) {
    notifyGroupContentChanged(publicGroupId, changedScopes);
  }

  return { summary, logLines };
}
