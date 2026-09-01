import { READLANGUAGECOOKIE } from '../../utils/LANGUAGECOOKIE.js';

const VISIBILITYPUBLICITEM__TEXTLABEL = {
  polish: 'Publiczny',
  english: 'Public'
};

const VISIBILITYHIDDENITEM__TEXTLABEL = {
  polish: 'Ukryty',
  english: 'Hidden'
};

const VISIBILITYPUBLICBADGE__TEXTLABEL = {
  polish: 'Publiczna',
  english: 'Public'
};

const VISIBILITYHIDDENBADGE__TEXTLABEL = {
  polish: 'Ukryta',
  english: 'Hidden'
};

const VISIBILITY_LABELS = {
  badge: { public: VISIBILITYPUBLICBADGE__TEXTLABEL.english, hidden: VISIBILITYHIDDENBADGE__TEXTLABEL.english },
  item: { public: VISIBILITYPUBLICITEM__TEXTLABEL.english, hidden: VISIBILITYHIDDENITEM__TEXTLABEL.english },
};

/**
 * @param {string} language
 * @returns {{public: string, hidden: string}}
 */
function getVisibilityLabelsForLanguage(language) {
  const lang = language ?? READLANGUAGECOOKIE();
  return {
    badge: { public: VISIBILITYPUBLICBADGE__TEXTLABEL[lang] || VISIBILITYPUBLICBADGE__TEXTLABEL.english, hidden: VISIBILITYHIDDENBADGE__TEXTLABEL[lang] || VISIBILITYHIDDENBADGE__TEXTLABEL.english },
    item: { public: VISIBILITYPUBLICITEM__TEXTLABEL[lang] || VISIBILITYPUBLICITEM__TEXTLABEL.english, hidden: VISIBILITYHIDDENITEM__TEXTLABEL[lang] || VISIBILITYHIDDENITEM__TEXTLABEL.english },
  };
}

/**
 * @param {boolean | undefined} isPublished
 * @param {'badge' | 'item'} [entity='item']
 * @param {string} [language]
 * @returns {'Publiczna' | 'Ukryta' | 'Publiczny' | 'Ukryty' | 'Public' | 'Hidden'}
 */
export function getVisibilityStatusLabel(isPublished, entity = 'item', language) {
  const labels = getVisibilityLabelsForLanguage(language);
  const entityLabels = labels[entity] ?? labels.item;
  return isPublished === false ? entityLabels.hidden : entityLabels.public;
}

/**
 * @param {boolean | undefined} isPublished
 * @param {'badge' | 'item'} [entity='item']
 * @returns {'Odkryta' | 'Ukryta' | 'Odkryty' | 'Ukryty'}
 */
const TILEVISIBLEBADGE__TEXTLABEL = {
  polish: 'Odkryta',
  english: 'Unlocked'
};

const TILEHIDDENBADGE__TEXTLABEL = {
  polish: 'Ukryta',
  english: 'Locked'
};

const TILEVISIBLEITEM__TEXTLABEL = {
  polish: 'Odkryty',
  english: 'Unlocked'
};

const TILEHIDDENITEM__TEXTLABEL = {
  polish: 'Ukryty',
  english: 'Locked'
};

export function getTileVisibilityLabel(isPublished, entity = 'item', language) {
  const lang = language ?? READLANGUAGECOOKIE();
  
  if (entity === 'badge') {
    return isPublished === false ? TILEHIDDENBADGE__TEXTLABEL[lang] || TILEHIDDENBADGE__TEXTLABEL.english : TILEVISIBLEBADGE__TEXTLABEL[lang] || TILEVISIBLEBADGE__TEXTLABEL.english;
  }

  return isPublished === false ? TILEHIDDENITEM__TEXTLABEL[lang] || TILEHIDDENITEM__TEXTLABEL.english : TILEVISIBLEITEM__TEXTLABEL[lang] || TILEVISIBLEITEM__TEXTLABEL.english;
}
