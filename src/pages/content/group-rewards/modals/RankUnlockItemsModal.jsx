import { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import RankUnlockItemChecklist from '../shared/RankUnlockItemChecklist.jsx';
import '../../group-rewards/shared/rewardsModals.css';

function normalizeRankShopItemIds(items = []) {
  return items.map((item) => String(item).trim()).filter(Boolean);
}

export default function RankUnlockItemsModal({
  isOpen,
  rank,
  existingRanks = [],
  shopCatalogItems = [],
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [selectedShopItems, setSelectedShopItems] = useState([]);

  const rankRefs = useMemo(
    () => existingRanks.map((entry) => ({
      dbId: entry.dbId,
      name: entry.name,
      shopItems: entry.shopItems ?? [],
    })),
    [existingRanks],
  );

  const catalogItems = useMemo(
    () => shopCatalogItems.map((item) => ({
      id: String(item.id),
      name: item.name,
    })),
    [shopCatalogItems],
  );

  useEffect(() => {
    if (!isOpen || !rank) return;
    setSelectedShopItems(normalizeRankShopItemIds(rank.shopItems ?? []));
  }, [isOpen, rank]);

  const handleShopItemToggle = useCallback((itemId, checked) => {
    setSelectedShopItems((prev) => {
      const next = new Set(prev);
      if (checked) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return Array.from(next);
    });
  }, []);

  const handleConfirm = () => {
    if (isLoading) return;

    const catalogIds = new Set(catalogItems.map((item) => String(item.id)));
    const shopItems = selectedShopItems.filter((itemId) => catalogIds.has(itemId));

    onConfirm?.({ shopItems });
  };

  if (!rank) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Odblokowane przedmioty"
      subtitle={rank.name}
      onConfirm={handleConfirm}
      confirmDisabled={isLoading}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__field">
          <span className="rewards-modal__label">Przedmioty sklepu</span>
          <p className="rewards-modal__field-hint">
            Przedmioty niezaznaczone są domyślnie dostępne dla wszystkich. Wyższa ranga odblokowuje też przedmioty niższych rang.
          </p>
          <RankUnlockItemChecklist
            catalogItems={catalogItems}
            ranks={rankRefs}
            currentRankDbId={rank.dbId ?? null}
            selectedIds={selectedShopItems}
            onToggle={handleShopItemToggle}
          />
        </div>
      </div>
    </Modal>
  );
}
