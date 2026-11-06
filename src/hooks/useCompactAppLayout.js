/**
 * @file useCompactAppLayout.js
 * @description Niestandardowy hook React enkapsulujący logikę zwijania nawigacji dla useCompactAppLayout.
 */

// === IMPORTY I ZALEŻNOŚCI HOOKA ===
import { useLocation } from 'react-router-dom';
import { useAppRole } from '../context/AppRoleContext.jsx';
import { APP_ROLE } from '../navigation/shellTemplates.config.js';
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

// === DEFINICJA HOOKA I ZARZĄDZANIE STANEM ===
export function useCompactAppLayout() {
  const { pathname } = useLocation();
  const { role } = useAppRole();

  if (role === APP_ROLE.ADMIN || role === APP_ROLE.SUPERADMIN) {
    return false;
  }

  return COMPACT_LAYOUT_PATHS.has(pathname) || isGroupJoinPath(pathname);
}
