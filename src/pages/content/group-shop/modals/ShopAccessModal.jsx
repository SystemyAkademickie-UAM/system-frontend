import { useEffect, useState } from 'react';
import { Modal, ShopToggleButton } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';
import './shopAccessModal.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.isShopOpen
 * @param {string | null} [props.shopOpensAt]
 * @param {() => void} props.onClose
 * @param {() => Promise<{ ok: boolean, error?: string }>} props.onToggleShopOpen
 * @param {(isoDate: string | null) => Promise<{ ok: boolean, error?: string }>} props.onScheduleShopOpen
 * @param {boolean} [props.isLoading]
 */
export default function ShopAccessModal({
  isOpen,
  isShopOpen,
  shopOpensAt = null,
  onClose,
  onToggleShopOpen,
  onScheduleShopOpen,
  isLoading = false,
}) {
  const [scheduleEnabled, setScheduleEnabled] = useState(false);
  const [openAt, setOpenAt] = useState('');
  const [localLoading, setLocalLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    if (shopOpensAt) {
      setScheduleEnabled(true);
      setOpenAt(new Date(shopOpensAt).toISOString().slice(0, 16));
      return;
    }
    setScheduleEnabled(false);
    setOpenAt('');
  }, [isOpen, shopOpensAt]);

  const handleToggle = async () => {
    setLocalLoading(true);
    await onToggleShopOpen();
    setLocalLoading(false);
  };

  const handleSaveSchedule = async () => {
    setLocalLoading(true);
    const iso = scheduleEnabled && openAt
      ? new Date(openAt).toISOString()
      : null;
    await onScheduleShopOpen(iso);
    setLocalLoading(false);
    onClose();
  };

  const busy = isLoading || localLoading;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Dostęp do sklepu"
      onConfirm={handleSaveSchedule}
      confirmLabel={busy ? 'Zapisywanie…' : 'Zapisz harmonogram'}
      confirmDisabled={busy || (scheduleEnabled && !openAt)}
      size="sm"
      className="rewards-modal shop-access-modal"
    >
      <div className="shop-access-modal__body">
        <div className="shop-access-modal__row">
          <p className="shop-access-modal__label">Status sklepu</p>
          <ShopToggleButton
            isShopOpen={isShopOpen}
            onToggle={handleToggle}
            disabled={busy}
          />
        </div>

        <div className="shop-access-modal__row">
          <label className="shop-access-modal__checkbox">
            <input
              type="checkbox"
              checked={scheduleEnabled}
              onChange={(event) => setScheduleEnabled(event.target.checked)}
              disabled={busy}
            />
            <span>Ustal datę otwarcia sklepu</span>
          </label>
        </div>

        {scheduleEnabled ? (
          <div className="shop-access-modal__row">
            <label htmlFor="shop-open-at" className="shop-access-modal__label">
              Data i godzina otwarcia
            </label>
            <input
              id="shop-open-at"
              type="datetime-local"
              className="rewards-modal__input"
              value={openAt}
              onChange={(event) => setOpenAt(event.target.value)}
              disabled={busy}
            />
            <p className="shop-access-modal__hint">
              Automatyczne otwarcie wymaga wsparcia backendu (patrz Backend Fix #5 — harmonogram otwarcia sklepu).
            </p>
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
