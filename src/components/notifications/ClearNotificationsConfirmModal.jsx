import { Modal } from '../ui/index.js';
import './ClearNotificationsConfirmModal.css';

const COPY = {
  all: {
    title: 'Wyczyść powiadomienia',
    body: 'Czy na pewno chcesz trwale usunąć wszystkie powiadomienia? Tej operacji nie można cofnąć.',
    confirmLabel: 'Wyczyść powiadomienia',
    confirmVariant: 'danger',
    modalClass: 'clear-notifications-modal clear-notifications-modal--all',
  },
  exceptItemUses: {
    title: 'Wyczyść powiadomienia (oprócz użyć przedmiotów)',
    body: 'Czy na pewno chcesz usunąć wszystkie powiadomienia oprócz użyć przedmiotów? Powiadomienia o użyciu przedmiotów pozostaną w dzienniku.',
    confirmLabel: 'Wyczyść (oprócz użyć przedmiotów)',
    confirmVariant: 'primary',
    modalClass: 'clear-notifications-modal clear-notifications-modal--partial',
  },
};

/**
 * @param {{
 *   isOpen: boolean,
 *   mode: 'all' | 'exceptItemUses' | null,
 *   isLoading?: boolean,
 *   onClose: () => void,
 *   onConfirm: () => void | Promise<void>,
 * }} props
 */
export default function ClearNotificationsConfirmModal({
  isOpen,
  mode,
  isLoading = false,
  onClose,
  onConfirm,
}) {
  if (!mode) {
    return null;
  }

  const copy = COPY[mode];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={copy.title}
      onConfirm={onConfirm}
      confirmLabel={isLoading ? 'Czyszczenie…' : copy.confirmLabel}
      confirmVariant={copy.confirmVariant}
      confirmDisabled={isLoading}
      size="sm"
      className={copy.modalClass}
    >
      <p className="clear-notifications-modal__text">{copy.body}</p>
    </Modal>
  );
}
