import { useLocation } from 'react-router-dom';
import {
  appHelpPath,
  appSettingsPath,
  groupsListPath,
  isGroupJoinPath,
  templatesGalleryPath,
  templatesPath,
} from '../routes/pathRegistry.js';

const COMPACT_LAYOUT_PATHS = new Set([
  groupsListPath(),
  appSettingsPath(),
  appHelpPath(),
  templatesPath(),
  templatesGalleryPath(),
]);

export function useCompactAppLayout() {
  const { pathname } = useLocation();
  return COMPACT_LAYOUT_PATHS.has(pathname) || isGroupJoinPath(pathname);
}
