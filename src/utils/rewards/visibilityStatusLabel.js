/**
 * @file visibilityStatusLabel.js
 * @description Funkcje pomocnicze i narzędziowe modułu visibilityStatusLabel.
 */

// === IMPORTY I STAŁE MODUŁU ===
import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

/** Trzy stany widoczności odznaki wybierane przez osobę prowadzącą. */
export const BADGE_VISIBILITY = {
  visible: 'visible',
  hidden: 'hidden',
  secret: 'secret',
};

const VISIBILITYPUBLICITEM__TEXTLABEL = {
  polish: 'Publiczny',
  english: 'Public',
};

const VISIBILITYHIDDENITEM__TEXTLABEL = {
  polish: 'Ukryty',
  english: 'Hidden',
};

const VISIBILITYPUBLICBADGE__TEXTLABEL = {
  polish: 'Publiczna',
  english: 'Public',
};

const VISIBILITYHIDDENBADGE__TEXTLABEL = {
  polish: 'Ukryta',
  english: 'Hidden',
};

const VISIBILITYSECRETBADGE__TEXTLABEL = {
  polish: 'Sekretna',
  english: 'Secret',
};

const BADGEVISIBILITYOPTIONS__TEXTLABEL = {
  polish: {
    [BADGE_VISIBILITY.visible]: 'Odznaka widoczna',
    [BADGE_VISIBILITY.hidden]: 'Odznaka ukryta',
    [BADGE_VISIBILITY.secret]: 'Odznaka sekretna',
  },
  english: {
    [BADGE_VISIBILITY.visible]: 'Visible badge',
    [BADGE_VISIBILITY.hidden]: 'Hidden badge',
    [BADGE_VISIBILITY.secret]: 'Secret badge',
  },
};

function resolveLanguage(language) {
  return language ?? READLANGUAGECOOKIE();
}

/**
 * @param {string} [language]
 * @returns {{ badge: { public: string, hidden: string, secret: string }, item: { public: string, hidden: string } }}
 */
function getVisibilityLabelsForLanguage(language) {
  const lang = resolveLanguage(language);
  return {
    badge: {
      public: VISIBILITYPUBLICBADGE__TEXTLABEL[lang] || VISIBILITYPUBLICBADGE__TEXTLABEL.english,
      hidden: VISIBILITYHIDDENBADGE__TEXTLABEL[lang] || VISIBILITYHIDDENBADGE__TEXTLABEL.english,
      secret: VISIBILITYSECRETBADGE__TEXTLABEL[lang] || VISIBILITYSECRETBADGE__TEXTLABEL.english,
    },
    item: {
      public: VISIBILITYPUBLICITEM__TEXTLABEL[lang] || VISIBILITYPUBLICITEM__TEXTLABEL.english,
      hidden: VISIBILITYHIDDENITEM__TEXTLABEL[lang] || VISIBILITYHIDDENITEM__TEXTLABEL.english,
    },
  };
}

// === GŁÓWNA LOGIKA NARZĘDZIOWA I EKSPORTY ===

/**
 * Wyznacza tryb widoczności odznaki na podstawie flag `isPublished` oraz `isSecret`.
 *
 * @param {{ isPublished?: boolean, isSecret?: boolean } | null | undefined} badge
 * @returns {'visible' | 'hidden' | 'secret'}
 */
export function getBadgeVisibilityMode(badge) {
  if (!badge || badge.isPublished === false) {
    return BADGE_VISIBILITY.hidden;
  }
  if (badge.isSecret === true) {
    return BADGE_VISIBILITY.secret;
  }
  return BADGE_VISIBILITY.visible;
}

/**
 * Mapuje wybrany tryb widoczności z formularza na flagi API (`isPublished`, `isSecret`).
 *
 * @param {'visible' | 'hidden' | 'secret'} mode
 * @returns {{ isPublished: boolean, isSecret: boolean }}
 */
export function badgeVisibilityModeToFlags(mode) {
  if (mode === BADGE_VISIBILITY.secret) {
    return { isPublished: true, isSecret: true };
  }
  if (mode === BADGE_VISIBILITY.visible) {
    return { isPublished: true, isSecret: false };
  }
  return { isPublished: false, isSecret: false };
}

/**
 * Zwraca listę opcji do listy rozwijanej widoczności odznaki w wymaganej kolejności.
 *
 * @param {string} [language]
 * @returns {Array<{ value: 'visible' | 'hidden' | 'secret', label: string }>}
 */
export function getBadgeVisibilityOptions(language) {
  const lang = resolveLanguage(language);
  const labels = BADGEVISIBILITYOPTIONS__TEXTLABEL[lang] || BADGEVISIBILITYOPTIONS__TEXTLABEL.english;
  return [
    { value: BADGE_VISIBILITY.visible, label: labels[BADGE_VISIBILITY.visible] },
    { value: BADGE_VISIBILITY.hidden, label: labels[BADGE_VISIBILITY.hidden] },
    { value: BADGE_VISIBILITY.secret, label: labels[BADGE_VISIBILITY.secret] },
  ];
}

/**
 * @param {boolean | undefined} isPublished
 * @param {'badge' | 'item'} [entity='item']
 * @param {string} [language]
 * @param {boolean} [isSecret=false]
 * @returns {string}
 */
export function getVisibilityStatusLabel(isPublished, entity = 'item', language, isSecret = false) {
  const labels = getVisibilityLabelsForLanguage(language);
  if (entity === 'badge') {
    if (isPublished === false) {
      return labels.badge.hidden;
    }
    return isSecret ? labels.badge.secret : labels.badge.public;
  }
  return isPublished === false ? labels.item.hidden : labels.item.public;
}

/**
 * @param {boolean | undefined} isPublished
 * @param {'badge' | 'item'} [entity='item']
 * @param {string} [language]
 * @param {boolean} [isSecret=false]
 * @returns {string}
 */
export function getTileVisibilityLabel(isPublished, entity = 'item', language, isSecret = false) {
  return getVisibilityStatusLabel(isPublished, entity, language, isSecret);
}
