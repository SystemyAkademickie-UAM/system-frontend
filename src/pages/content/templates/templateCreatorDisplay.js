/**
 * @param {import('../../../services/groupTemplates.api.js').GroupTemplateListItem} template
 */
export function resolveTemplateCreatorDisplay(template) {
  const displayName = template.creatorDisplayName?.trim();
  if (displayName) {
    return displayName;
  }

  const nickname = template.creatorNickname?.trim() || '';
  const legalName = template.creatorLegalName?.trim() || '';
  return nickname || legalName || 'Prowadzący';
}
