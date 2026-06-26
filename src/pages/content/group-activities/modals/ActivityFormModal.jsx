import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import { validateWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  description0: '',
  description1: '',
  reward: '',
};

export default function ActivityFormModal({
  isOpen,
  activity,
  stageName,
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(activity);

  useEffect(() => {
    if (!isOpen) return;

    if (activity) {
      setForm({
        name: activity.name,
        description0: activity.description0 ?? '',
        description1: activity.description1 ?? '',
        reward: String(activity.reward ?? ''),
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, activity]);

  const rewardValidation = useMemo(
    () => validateWholeNumberInput(form.reward),
    [form.reward],
  );

  const isValid = useMemo(() => (
    form.name.trim()
    && form.description0.trim()
    && form.description1.trim()
    && rewardValidation.valid
  ), [form, rewardValidation.valid]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleConfirm = () => {
    if (!isValid || isLoading) return;

    onConfirm?.({
      name: form.name.trim(),
      description0: form.description0.trim(),
      description1: form.description1.trim(),
      reward: rewardValidation.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edytuj aktywność' : 'Dodaj aktywność'}
      subtitle={stageName ? `Etap: ${stageName}` : undefined}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isEdit ? 'Zapisz' : 'Dodaj'}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <TextField
          id="activity-name"
          label="Nazwa aktywności"
          fieldKind="name"
          value={form.name}
          onChange={handleChange('name')}
          placeholder="np. Zadanie wprowadzające"
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />

        <TextField
          id="activity-story"
          label="Opis fabularny"
          fieldKind="shortDescription"
          value={form.description0}
          onChange={handleChange('description0')}
          placeholder="Krótki opis w kontekście fabuły kursu"
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <TextField
          id="activity-edu"
          label="Opis dydaktyczny"
          fieldKind="shortDescription"
          value={form.description1}
          onChange={handleChange('description1')}
          placeholder="Cele i wymagania edukacyjne"
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <TextField
          id="activity-reward"
          label="Nagroda (waluta)"
          type="number"
          value={form.reward}
          onChange={handleChange('reward')}
          placeholder="np. 10"
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
      </div>
    </Modal>
  );
}
