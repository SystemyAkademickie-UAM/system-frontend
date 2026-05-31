import { useEffect, useMemo, useState } from 'react';
import { Modal } from '../../../../components/ui/index.js';
import { validateWholeNumberInput } from '../../group-rewards/shared/rewardsNumericValidation.js';
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

  const showRewardError = form.reward.trim() !== '' && !rewardValidation.valid;

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
        <div className="rewards-modal__field">
          <label htmlFor="activity-name" className="rewards-modal__label">Nazwa aktywności</label>
          <input
            id="activity-name"
            type="text"
            className="rewards-modal__input"
            value={form.name}
            onChange={handleChange('name')}
            placeholder="np. Zadanie wprowadzające"
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="activity-story" className="rewards-modal__label">Opis fabularny</label>
          <textarea
            id="activity-story"
            className="rewards-modal__textarea"
            value={form.description0}
            onChange={handleChange('description0')}
            placeholder="Krótki opis w kontekście fabuły kursu"
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="activity-edu" className="rewards-modal__label">Opis dydaktyczny</label>
          <textarea
            id="activity-edu"
            className="rewards-modal__textarea"
            value={form.description1}
            onChange={handleChange('description1')}
            placeholder="Cele i wymagania edukacyjne"
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="activity-reward" className="rewards-modal__label">Nagroda (waluta)</label>
          <input
            id="activity-reward"
            type="text"
            inputMode="numeric"
            className={[
              'rewards-modal__input',
              showRewardError ? 'rewards-modal__input--error' : '',
            ].filter(Boolean).join(' ')}
            value={form.reward}
            onChange={handleChange('reward')}
            placeholder="np. 10"
            aria-invalid={showRewardError}
            aria-describedby={showRewardError ? 'activity-reward-error' : undefined}
          />
          {showRewardError ? (
            <p id="activity-reward-error" className="rewards-modal__field-error" role="alert">
              {rewardValidation.error}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
