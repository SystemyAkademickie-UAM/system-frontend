import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import RewardsCurrencyLabel from '../../group-rewards/shared/RewardsCurrencyLabel.jsx';
import { validateWholeNumberInput, sanitizeWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  description0: '',
  description1: '',
  reward: '',
  isVisible: true,
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
    polish: 'Nazwa aktywności*',
    english: 'Activity Name*',
  };
  const ACTIVITYNAMEPLACEHOLDER__TEXTLABEL = {
    polish: 'np. Zadanie wprowadzające',
    english: 'e.g. Introductory Task',
  };
  const REWARD__TEXTLABEL = {
    polish: 'Nagroda*',
    english: 'Reward*',
  };
  const REWARDPLACEHOLDER__TEXTLABEL = {
    polish: 'np. 10',
    english: 'e.g. 10',
  };
  const STORYDESCRIPTION__TEXTLABEL = {
    polish: 'Opis fabularny*',
    english: 'Story Description*',
  };
  const STORYDESCRIPTIONPLACEHOLDER__TEXTLABEL = {
    polish: 'Krótki opis w kontekście fabuły kursu',
    english: 'Short description in the context of the course story',
  };
  const EDUCATIONALDESCRIPTION__TEXTLABEL = {
    polish: 'Opis dydaktyczny*',
    english: 'Educational Description*',
  };
  const EDUCATIONALDESCRIPTIONPLACEHOLDER__TEXTLABEL = {
    polish: 'Cele i wymagania edukacyjne',
    english: 'Educational goals and requirements',
  };
  const STAGESUBTITLEPREFIX__TEXTLABEL = {
    polish: 'Etap:',
    english: 'Stage:',
  };
  const ISVISIBLE__TEXTLABEL = {
    polish: 'Aktywność widoczna dla studentów',
    english: 'Activity visible to students',
  };

  useEffect(() => {
    if (!isOpen) return;

    if (activity) {
      setForm({
        name: activity.name,
        description0: activity.description0 ?? '',
        description1: activity.description1 ?? '',
        reward: String(activity.reward ?? ''),
        isVisible: activity.isVisible !== false && activity.visibilityStatus !== 0 && activity.isPublished !== false,
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
    const nextValue = field === 'reward'
      ? sanitizeWholeNumberInput(event.target.value)
      : (field === 'isVisible' ? event.target.checked : event.target.value);
    setForm((prev) => ({ ...prev, [field]: nextValue }));
  };

  const handleConfirm = () => {
    if (!isValid || isLoading) return;

    onConfirm?.({
      name: form.name.trim(),
      description0: form.description0.trim(),
      description1: form.description1.trim(),
      reward: rewardValidation.value,
      isVisible: form.isVisible,
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

        <div className="rewards-modal__field">
          <label className="rewards-modal__option-label" htmlFor="activity-is-visible">
            <input
              id="activity-is-visible"
              type="checkbox"
              className="rewards-modal__option-input"
              checked={form.isVisible}
              onChange={handleChange('isVisible')}
            />
            <span
              className={[
                'rewards-modal__option-checkbox',
                form.isVisible ? 'rewards-modal__option-checkbox--checked' : '',
              ].filter(Boolean).join(' ')}
              aria-hidden="true"
            >
              {form.isVisible ? (
                <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
              ) : null}
            </span>
            <span className="rewards-modal__option-text">{ISVISIBLE__TEXTLABEL[LANGUAGE]}</span>
          </label>
        </div>
      </div>
    </Modal>
  );
}
