import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = { name: '', visibilityStatus: 1 };

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
      setForm({
        name: stage.name,
        visibilityStatus: stage.visibilityStatus === 1 ? 1 : 0,
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, stage]);

  const isValid = useMemo(() => form.name.trim().length > 0, [form.name]);

  const handleConfirm = () => {
    if (!isValid || isLoading) return;
    onConfirm?.({
      name: form.name.trim(),
      visibilityStatus: form.visibilityStatus,
    });
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
        <TextField
          id="stage-name"
          label="Nazwa etapu"
          fieldKind="name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="np. Laboratorium nr 1: Zajęcia organizacyjne"
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
        <div className="rewards-modal__field">
          <label className="rewards-modal__checkbox-label">
            <input
              type="checkbox"
              checked={form.visibilityStatus === 1}
              onChange={(event) => setForm((prev) => ({
                ...prev,
                visibilityStatus: event.target.checked ? 1 : 0,
              }))}
            />
            <span>Etapy widoczny dla studentów</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
