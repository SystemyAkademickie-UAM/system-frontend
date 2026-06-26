import { useMemo } from 'react';
import {
  buildShopItemOwnerMap,
  normalizeShopItemId,
} from '../../../../utils/ranks/rankShopItemUnlock.js';

/**
 * @typedef {Object} CatalogItem
 * @property {string} id
 * @property {string} name
 */

/**
 * @typedef {Object} RankRef
 * @property {number} dbId
 * @property {string} name
 * @property {string[]} [shopItems]
 */

/**
 * @param {Object} props
 * @param {CatalogItem[]} props.catalogItems
 * @param {RankRef[]} props.ranks
 * @param {number | null | undefined} props.currentRankDbId
 * @param {string[]} props.selectedIds
 * @param {(itemId: string, checked: boolean) => void} props.onToggle
 */
export default function RankUnlockItemChecklist({
  catalogItems = [],
  ranks = [],
  currentRankDbId = null,
  selectedIds = [],
  onToggle,
}) {
  const ownerMap = useMemo(
    () => buildShopItemOwnerMap(ranks, currentRankDbId),
    [ranks, currentRankDbId],
  );
  const selectedSet = useMemo(
    () => new Set(selectedIds.map((itemId) => normalizeShopItemId(itemId))),
    [selectedIds],
  );

  if (catalogItems.length === 0) {
    return (
      <p className="rewards-modal__field-hint">
        Brak produktów w sklepie. Dodaj przedmioty w katalogu sklepu, aby przypisać je do rangi.
      </p>
    );
  }

  return (
    <ul className="rewards-modal__item-list" role="group" aria-label="Przedmioty odblokowywane przez rangę">
      {catalogItems.map((item) => {
        const itemId = normalizeShopItemId(item.id);
        const owner = ownerMap.get(itemId);
        const disabled = Boolean(owner);
        const checked = selectedSet.has(itemId);
        const tooltip = disabled
          ? `Przypisany do rangi „${owner.name}". Odblokuj w edytorze przedmiotu lub edytuj tamtą rangę.`
          : undefined;

        return (
          <li key={itemId}>
            <label
              className={[
                'rewards-modal__item-option',
                disabled ? 'rewards-modal__item-option--disabled' : '',
                checked ? 'rewards-modal__item-option--selected' : '',
              ].filter(Boolean).join(' ')}
              title={tooltip}
            >
              <input
                type="checkbox"
                className="rewards-modal__item-checkbox"
                checked={checked}
                disabled={disabled}
                onChange={(event) => onToggle(itemId, event.target.checked)}
              />
              <span className="rewards-modal__item-name">{item.name}</span>
            </label>
          </li>
        );
      })}
    </ul>
  );
}
