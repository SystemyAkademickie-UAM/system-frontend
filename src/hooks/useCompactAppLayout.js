/**
 * @file useCompactAppLayout.js
 * @description Niestandardowy hook React enkapsulujący logikę dla useCompactAppLayout.
 */

// === IMPORTY I ZALEŻNOŚCI HOOKA ===
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

// === DEFINICJA HOOKA I ZARZĄDZANIE STANEM ===
export function useCompactAppLayout() {

const { pathname } = useLocation();
  return COMPACT_LAYOUT_PATHS.has(pathname) || isGroupJoinPath(pathname);
}
