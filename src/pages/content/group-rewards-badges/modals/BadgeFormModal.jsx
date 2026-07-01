import { useEffect, useMemo, useState } from 'react';
import { BADGE_RARITY, BADGE_RARITY_LABELS, InfoTooltip, Modal, TextField } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import EmojiPickerField from '../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { DEFAULT_BADGE_EMOJI } from '../../../../utils/ranks/rankBadgeIcon.js';
import { validateWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import RewardsCurrencyLabel from '../../group-rewards/shared/RewardsCurrencyLabel.jsx';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  icon: DEFAULT_BADGE_EMOJI,
  rarity: BADGE_RARITY.common,
  storyDescription: '',
  didacticDescription: '',
  rewardAmount: '',
  startHidden: false,
};

function BadgeOptionCheckbox({
  id,
  checked,
  onChange,
  children,
}) {
  return (
    <label className="rewards-modal__option-label" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="rewards-modal__option-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span
        className={[
          'rewards-modal__option-checkbox',
          checked ? 'rewards-modal__option-checkbox--checked' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {checked ? (
          <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
        ) : null}
      </span>
      <span className="rewards-modal__option-text">{children}</span>
    </label>
  );
}

export default function BadgeFormModal({
  isOpen,
  badge,
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(badge);

  useEffect(() => {
    if (!isOpen) return;

    if (badge) {
      setForm({
        name: badge.name,
        icon: badge.icon || badge.iconFile || DEFAULT_BADGE_EMOJI,
        rarity: badge.rarity,
        storyDescription: badge.storyDescription,
        didacticDescription: badge.didacticDescription,
        rewardAmount: String(badge.rewardAmount),
        startHidden: badge.isPublished === false,
      });
      return;
    }

    setForm(EMPTY_FORM);
  }, [isOpen, badge]);

  const rewardValidation = useMemo(
    () => validateWholeNumberInput(form.rewardAmount),
    [form.rewardAmount],
  );

  const isValid = useMemo(() => (
    form.name.trim()
    && form.icon.trim()
    && form.storyDescription.trim()
    && form.didacticDescription.trim()
    && rewardValidation.valid
  ), [form, rewardValidation.valid]);

  const handleChange = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleConfirm = () => {
    if (!isValid) return;

    onConfirm?.({
      name: form.name.trim(),
      icon: form.icon.trim(),
      iconFile: form.icon.trim(),
      rarity: form.rarity,
      storyDescription: form.storyDescription.trim(),
      didacticDescription: form.didacticDescription.trim(),
      rewardAmount: rewardValidation.value,
      isPublished: !form.startHidden,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEdit ? 'Edytuj odznakę' : 'Dodaj odznakę'}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__row rewards-modal__row--name-reward">
          <TextField
            id="badge-name"
            label="Nazwa"
            fieldKind="name"
            value={form.name}
            onChange={handleChange('name')}
            className="rewards-modal__field"
            inputClassName="rewards-modal__input"
          />
          <div className="rewards-modal__field">
            <RewardsCurrencyLabel htmlFor="badge-reward">Nagroda</RewardsCurrencyLabel>
            <input
              id="badge-reward"
              type="text"
              inputMode="numeric"
              className="rewards-modal__input"
              value={form.rewardAmount}
              onChange={handleChange('rewardAmount')}
            />
          </div>
        </div>

        <div className="rewards-modal__row rewards-modal__row--icon-rarity">
          <EmojiPickerField
            className="rewards-modal__field rewards-modal__field--icon"
            label="Ikona"
            value={form.icon}
            defaultEmoji={DEFAULT_BADGE_EMOJI}
            onChange={(emoji) => setForm((prev) => ({ ...prev, icon: emoji }))}
            ariaLabel="Wybierz emoji odznaki"
          />

          <div className="rewards-modal__field">
            <label htmlFor="badge-rarity" className="rewards-modal__label">
              Jakość
              <InfoTooltip text="Wpływa na rzadkość odznaki w skarbcu." />
            </label>
            <select
              id="badge-rarity"
              className="rewards-modal__input"
              value={form.rarity}
              onChange={handleChange('rarity')}
            >
              {Object.entries(BADGE_RARITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>

        <TextField
          id="badge-story"
          label="Opis fabularny"
          fieldKind="shortDescription"
          value={form.storyDescription}
          onChange={handleChange('storyDescription')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <TextField
          id="badge-edu"
          label="Opis dydaktyczny"
          fieldKind="shortDescription"
          value={form.didacticDescription}
          onChange={handleChange('didacticDescription')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <div className="rewards-modal__field">
          <BadgeOptionCheckbox
            id="badge-start-hidden"
            checked={form.startHidden}
            onChange={(checked) => setForm((prev) => ({ ...prev, startHidden: checked }))}
          >
            Ukryj odznakę (niewidoczna dla studentów)
          </BadgeOptionCheckbox>
        </div>
      </div>
    </Modal>
  );
}
