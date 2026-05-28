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
 * @property {string} fileName  — nazwa pliku SVG w `public/assets/svg/`
 * @property {string} label     — czytelna nazwa do wyświetlenia w liście
 */

/** @type {IconCatalogItem[]} */
const PLACEHOLDER_CATALOG = [
  { id: 'placeholder.svg', fileName: 'placeholder.svg', label: 'Domyślna ikona (placeholder)' },
];

/**
 * Zwraca dostępne ikony.
 * @returns {Promise<IconCatalogItem[]>}
 */
export async function fetchIconCatalog() {
  return PLACEHOLDER_CATALOG;
}
