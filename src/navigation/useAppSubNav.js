import { useMemo } from 'react';
import { buildSubNavItems, SUB_NAV_META } from './shellTemplates.config.js';

/**
 * SubNav dla tras aplikacji bez kontekstu grupy (np. /templates).
 *
 * @param {keyof typeof SUB_NAV_META} configKey
 */
export default function useAppSubNav(configKey) {
  const meta = SUB_NAV_META[configKey] ?? { title: '', ariaLabel: 'Nawigacja podstrony' };

  return useMemo(() => {
    const items = buildSubNavItems(configKey, { groupId: null });
    return {
      sectionTitle: meta.title,
      ariaLabel: meta.ariaLabel,
      items,
    };
  }, [configKey, meta.ariaLabel, meta.title]);
}
