import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import RewardsCurrencyLabel from '../../group-rewards/shared/RewardsCurrencyLabel.jsx';
import { validateWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(activity);

  const EDITACTIVITYTITLE__TEXTLABEL = {
    polish: 'Edytuj aktywność',
    english: 'Edit Activity',
  };
  const ADDACTIVITYTITLE__TEXTLABEL = {
    polish: 'Dodaj aktywność',
    english: 'Add Activity',
  };
  const SAVEBUTTON__TEXTLABEL = {
    polish: 'Zapisz',
    english: 'Save',
  };
  const ADDBUTTON__TEXTLABEL = {
    polish: 'Dodaj',
    english: 'Add',
  };
  const ACTIVITYNAME__TEXTLABEL = {
    polish: 'Nazwa aktywności',
    english: 'Activity Name',
  };
  const ACTIVITYNAMEPLACEHOLDER__TEXTLABEL = {
    polish: 'np. Zadanie wprowadzające',
    english: 'e.g. Introductory Task',
  };
  const REWARD__TEXTLABEL = {
    polish: 'Nagroda',
    english: 'Reward',
  };
  const REWARDPLACEHOLDER__TEXTLABEL = {
    polish: 'np. 10',
    english: 'e.g. 10',
  };
  const STORYDESCRIPTION__TEXTLABEL = {
    polish: 'Opis fabularny',
    english: 'Story Description',
  };
  const STORYDESCRIPTIONPLACEHOLDER__TEXTLABEL = {
    polish: 'Krótki opis w kontekście fabuły kursu',
    english: 'Short description in the context of the course story',
  };
  const EDUCATIONALDESCRIPTION__TEXTLABEL = {
    polish: 'Opis dydaktyczny',
    english: 'Educational Description',
  };
  const EDUCATIONALDESCRIPTIONPLACEHOLDER__TEXTLABEL = {
    polish: 'Cele i wymagania edukacyjne',
    english: 'Educational goals and requirements',
  };
  const STAGESUBTITLEPREFIX__TEXTLABEL = {
    polish: 'Etap:',
    english: 'Stage:',
  };

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
      title={isEdit ? EDITACTIVITYTITLE__TEXTLABEL[LANGUAGE] : ADDACTIVITYTITLE__TEXTLABEL[LANGUAGE]}
      subtitle={stageName ? `${STAGESUBTITLEPREFIX__TEXTLABEL[LANGUAGE]} ${stageName}` : undefined}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isEdit ? SAVEBUTTON__TEXTLABEL[LANGUAGE] : ADDBUTTON__TEXTLABEL[LANGUAGE]}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__row rewards-modal__row--name-reward">
          <TextField
            id="activity-name"
            label={ACTIVITYNAME__TEXTLABEL[LANGUAGE]}
            fieldKind="name"
            value={form.name}
            onChange={handleChange('name')}
            placeholder={ACTIVITYNAMEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
            className="rewards-modal__field"
            inputClassName="rewards-modal__input"
          />

          <div className="rewards-modal__field">
            <RewardsCurrencyLabel htmlFor="activity-reward">
              {REWARD__TEXTLABEL[LANGUAGE]}
            </RewardsCurrencyLabel>
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
              placeholder={REWARDPLACEHOLDER__TEXTLABEL[LANGUAGE]}
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

        <TextField
          id="activity-story"
          label={STORYDESCRIPTION__TEXTLABEL[LANGUAGE]}
          fieldKind="shortDescription"
          value={form.description0}
          onChange={handleChange('description0')}
          placeholder={STORYDESCRIPTIONPLACEHOLDER__TEXTLABEL[LANGUAGE]}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <TextField
          id="activity-edu"
          label={EDUCATIONALDESCRIPTION__TEXTLABEL[LANGUAGE]}
          fieldKind="shortDescription"
          value={form.description1}
          onChange={handleChange('description1')}
          placeholder={EDUCATIONALDESCRIPTIONPLACEHOLDER__TEXTLABEL[LANGUAGE]}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />
      </div>
    </Modal>
  );
}
