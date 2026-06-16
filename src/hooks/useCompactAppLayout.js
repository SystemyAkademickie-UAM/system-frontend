import { useLocation } from 'react-router-dom';
import { appHelpPath, appSettingsPath, groupsListPath } from '../routes/pathRegistry.js';

const COMPACT_LAYOUT_PATHS = new Set([groupsListPath(), appSettingsPath(), appHelpPath()]);

export function useCompactAppLayout() {
  const { pathname } = useLocation();
  return COMPACT_LAYOUT_PATHS.has(pathname);
}
