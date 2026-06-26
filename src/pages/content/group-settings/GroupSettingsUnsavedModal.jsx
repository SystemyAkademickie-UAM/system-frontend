import { Button, Modal } from '../../../components/ui/index.js';
import '../settings/SettingsContent.css';

/**
 * @param {{
 *   isOpen: boolean,
 *   isSaving?: boolean,
 *   onClose: () => void,
 *   onDiscard: () => void,
 *   onSave: () => void,
 * }} props
 */
export default function GroupSettingsUnsavedModal({
  isOpen,
  isSaving = false,
  onClose,
  onDiscard,
  onSave,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Niezapisane zmiany"
      subtitle="Masz niezapisane zmiany na tej stronie. Czy chcesz je zapisać przed opuszczeniem?"
      showFooter={false}
      className="settings-page__unsaved-modal"
    >
      <div className="settings-page__unsaved-actions">
        <Button type="button" variant="secondary" size="md" onClick={onClose}>
          Anuluj
        </Button>
        <Button type="button" variant="secondary" size="md" onClick={onDiscard}>
          Odrzuć zmiany
        </Button>
        <Button
          type="button"
          variant="primary"
          size="md"
          onClick={onSave}
          disabled={isSaving}
        >
          Zapisz
        </Button>
      </div>
    </Modal>
  );
}
