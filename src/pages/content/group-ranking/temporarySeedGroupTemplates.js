/**
 * TYMCZASOWE — generator szablonów grup przez API backendu.
 */

import { fetchUserGroups, updateGroup } from '../../../services/groups.api.js';
import { fetchPredefinedBanners } from '../../../services/banners.api.js';
import { saveGroupAsTemplate } from '../../../services/groupTemplates.api.js';
import { getPredefinedBannerPath } from '../../../utils/groupBannerRef.js';
import { pickRandom, randomInt } from './temporarySeedGroupData.js';

const DEV_LECTURER_OWNER_EMAILS = [
  'lecturer1@localhost.invalid',
  'lecturer2@localhost.invalid',
];

const TEMPLATE_NAME_PREFIXES = [
  'Kampania',
  'Kurs',
  'Misja',
  'Ścieżka',
  'Program',
  'Semestr',
  'Moduł',
  'Quest',
  'Scenariusz',
  'Pakiet',
];

const TEMPLATE_SUBJECTS = [
  'Algorytmy i struktury danych',
  'Bazy danych',
  'Programowanie obiektowe',
  'Sztuczna inteligencja',
  'Inżynieria oprogramowania',
  'Sieci komputerowe',
  'Bezpieczeństwo IT',
  'Grywalizacja w edukacji',
  'Matematyka dyskretna',
  'Systemy operacyjne',
];

const TEMPLATE_DESCRIPTIONS = [
  'Kompletny szablon z etapami, odznakami i sklepem nagród.',
  'Gotowa konfiguracja do szybkiego startu nowej grupy.',
  'Zestaw aktywności i rang dopasowany do kursu semestralnego.',
  'Szablon testowy z losową strukturą nagród i aktywności.',
  'Paczka startowa dla prowadzącego — skopiuj i dostosuj.',
  'Przykładowy układ z etapami, odznakami i wpisami na tablicy.',
  'Szablon z różnorodnymi nagrodami i aktywnościami do warsztatów.',
  'Konfiguracja pod kurs blended learning z elementami grywalizacji.',
  'Zestaw do szybkiego uruchomienia grupy projektowej.',
  'Model semestru z rankingiem, sklepem i odznakami motywacyjnymi.',
];

const TEMPLATE_BANNER_COLORS = [
  '#3b82f6',
  '#ef4444',
  '#22c55e',
  '#a855f7',
  '#f59e0b',
  '#14b8a6',
  '#ec4899',
  '#6366f1',
];

/**
 * @param {import('../../../services/banners.api.js').PredefinedBanner[]} predefinedBanners
 * @returns {string}
 */
function pickRandomBannerRef(predefinedBanners) {
  if (predefinedBanners.length > 0 && Math.random() < 0.65) {
    const banner = pickRandom(predefinedBanners);
    const path = getPredefinedBannerPath(banner);
    if (path) {
      return path;
    }
  }
  return `color:${pickRandom(TEMPLATE_BANNER_COLORS)}`;
}

/**
 * @param {Object} options
 * @param {string | number} options.groupId — bieżąca grupa (fallback gdy brak innych)
 * @param {number} [options.count=10]
 * @param {(line: string) => void} [options.onLog]
 */
export async function seedTemporaryGroupTemplates({ groupId, count = 10, onLog }) {
  const [ownedGroups, predefinedBanners] = await Promise.all([
    fetchUserGroups(),
    fetchPredefinedBanners(),
  ]);
  const sourceGroups = ownedGroups.length > 0 ? ownedGroups : [{ id: String(groupId) }];

  let created = 0;

  for (let index = 0; index < count; index += 1) {
    const source = sourceGroups[index % sourceGroups.length];
    const prefix = pickRandom(TEMPLATE_NAME_PREFIXES);
    const subject = pickRandom(TEMPLATE_SUBJECTS);
    const name = `${prefix}: ${subject} #${randomInt(10, 99)}`;
    const description = pickRandom(TEMPLATE_DESCRIPTIONS);
    const isPublic = index % 3 !== 0;
    const imageRef = pickRandomBannerRef(predefinedBanners);

    const bannerResult = await updateGroup(source.id, { imageRef });
    if (!bannerResult.ok) {
      onLog?.(`⚠ ${name}: nie udało się ustawić banera na grupie ${source.id}`);
    }

    const ownerEmail = pickRandom(DEV_LECTURER_OWNER_EMAILS);

    const result = await saveGroupAsTemplate(source.id, {
      name,
      description,
      isPublic,
      devCreatorEmail: ownerEmail,
    });

    if (result.ok) {
      created += 1;
      const visibility = isPublic ? 'publiczny' : 'prywatny';
      onLog?.(`✓ ${name} (${visibility}, właściciel: ${ownerEmail}, baner: ${imageRef}) ← grupa ${source.id} → templateId=${result.template?.id ?? '?'}`);
    } else {
      onLog?.(`✗ ${name}: ${result.error ?? 'błąd zapisu szablonu'}`);
    }
  }

  onLog?.(`Zapisano ${created}/${count} szablonów grup (API).`);
}
