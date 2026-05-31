import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = { name: '' };

export default function StageFormModal({
  isOpen,
  stage,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(stage);

  useEffect(() => {
    if (!isOpen) return;

    if (stage) {
      setForm({ name: stage.name });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, stage]);

  const isValid = useMemo(() => form.name.trim().length > 0, [form.name]);

  const handleConfirm = () => {
    if (!isValid || isLoading) return;
    onConfirm?.({ name: form.name.trim() });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edytuj etap' : 'Dodaj etap'}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isEdit ? 'Zapisz' : 'Dodaj'}
      size="sm"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__field">
          <label htmlFor="stage-name" className="rewards-modal__label">Nazwa etapu</label>
          <input
            id="stage-name"
            type="text"
            className="rewards-modal__input"
            value={form.name}
            onChange={(event) => setForm({ name: event.target.value })}
            placeholder="np. Laboratorium nr 1: Zajęcia organizacyjne"
          />
        </div>
      </div>
    </Modal>
  );
}
