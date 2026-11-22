/**
 * @file templateCreatorDisplay.js
 * @description Główny komponent widoku strony dla obszaru templateCreatorDisplay.
 */

// === IMPORTY I ZALEŻNOŚCI ===
/**
 * @param {import('../../services/groupTemplates.api.js').GroupTemplateListItem} template
 */

// === GŁÓWNY KOMPONENT WIDOKU ===
export function resolveTemplateCreatorDisplay(template) {

const displayName = template.creatorDisplayName?.trim();
  if (displayName) {
    return displayName;
  }

  const nickname = template.creatorNickname?.trim() || '';

const legalName = template.creatorLegalName?.trim() || '';

// === RENDEROWANIE WIDOKU ===
  return nickname || legalName || 'Osoba prowadząca';
}
