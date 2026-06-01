import { SVG_PLACEHOLDER } from '../constants/svgIcons.js';

/**
 * Katalog dostępnych ikon dla rang i odznak.
 *
 * Docelowo pobierany z backendu (GET /icons). Na razie zwraca placeholder
 * — gdy w bazie pojawi się tabela ikon, wystarczy podmienić implementację
 * na fetch i zachować kontrakt zwracanej tablicy.
 */

/**
 * @typedef {Object} IconCatalogItem
 * @property {string} id        — identyfikator ikony (zapisywany w `badge.icon` / `rank.icon`)
 * @property {string} fileName  — ścieżka względna w `public/assets/svg/`
 * @property {string} label     — czytelna nazwa do wyświetlenia w liście
 */

/** @type {IconCatalogItem[]} */
const PLACEHOLDER_CATALOG = [
  { id: SVG_PLACEHOLDER, fileName: SVG_PLACEHOLDER, label: 'Placeholder' },
];

/**
 * Zwraca dostępne ikony.
 * @returns {Promise<IconCatalogItem[]>}
 */
export async function fetchIconCatalog() {
  return PLACEHOLDER_CATALOG;
}
