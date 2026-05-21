import { useParams } from 'react-router-dom';
import { buildSubNavItems, SUB_NAV_META } from './shellTemplates.config.js';

/**
 * Zwraca SubNav z pełnymi ścieżkami dla sekcji grupy.
 *
 * @param {keyof typeof SUB_NAV_META} configKey
 */
export default function useGroupSubNav(configKey) {
  const { groupId } = useParams();
  const meta = SUB_NAV_META[configKey] ?? { title: '', ariaLabel: 'Nawigacja podstrony' };

  return {
    sectionTitle: meta.title,
    ariaLabel: meta.ariaLabel,
    items: buildSubNavItems(configKey, { groupId }),
  };
}
