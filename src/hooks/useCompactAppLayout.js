import { useLocation } from 'react-router-dom';
import {
  appHelpPath,
  appSettingsPath,
  groupsListPath,
  isGroupJoinPath,
  templatesMyPath,
  templatesPath,
} from '../routes/pathRegistry.js';

const COMPACT_LAYOUT_PATHS = new Set([
  groupsListPath(),
  appSettingsPath(),
  appHelpPath(),
  templatesPath(),
  templatesMyPath(),
]);

export function useCompactAppLayout() {
  const { pathname } = useLocation();
  return COMPACT_LAYOUT_PATHS.has(pathname) || isGroupJoinPath(pathname);
}
