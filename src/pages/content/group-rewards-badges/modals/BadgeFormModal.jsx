import { useEffect, useMemo, useState } from 'react';
import { BADGE_RARITY, BADGE_RARITY_LABELS, InfoTooltip, Modal, TextField } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import EmojiPickerField from '../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { DEFAULT_BADGE_EMOJI } from '../../../../utils/ranks/rankBadgeIcon.js';
import { validateWholeNumberInput, sanitizeWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import RewardsCurrencyLabel from '../../group-rewards/shared/RewardsCurrencyLabel.jsx';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

const MODALTITLEEDIT__TEXTLABEL = {
  polish: 'Edytuj odznakę',
  english: 'Edit Badge'
};

const MODALTITLECREATE__TEXTLABEL = {
  polish: 'Dodaj odznakę',
  english: 'Add Badge'
};

const NAMELABEL__TEXTLABEL = {
  polish: 'Nazwa*',
  english: 'Name*'
};

const REWARDLABEL__TEXTLABEL = {
  polish: 'Nagroda*',
  english: 'Reward*'
};

const ICONLABEL__TEXTLABEL = {
  polish: 'Ikona',
  english: 'Icon'
};

const ICONARIALABEL__TEXTLABEL = {
  polish: 'Wybierz emoji odznaki',
  english: 'Choose badge emoji'
};

const RARITYLABEL__TEXTLABEL = {
  polish: 'Rzadkość',
  english: 'Rarity'
};

const RARITYTOOLTIPTEXT__TEXTLABEL = {
  polish: 'Wpływa na rzadkość odznaki w skarbcu.',
  english: 'Affects badge rarity in the treasury.'
};

const STORYDESCRIPTIONLABEL__TEXTLABEL = {
  polish: 'Opis fabularny*',
  english: 'Story Description*'
};

const DIDACTICDESCRIPTIONLABEL__TEXTLABEL = {
  polish: 'Opis dydaktyczny*',
  english: 'Didactic Description*'
};

const HIDDENOPTIONTEXT__TEXTLABEL = {
  polish: 'Ukryj odznakę (niewidoczna dla studentów)',
  english: 'Hide badge (hidden from students)'
};

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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
    const nextValue = field === 'rewardAmount'
      ? sanitizeWholeNumberInput(event.target.value)
      : event.target.value;
    setForm((prev) => ({ ...prev, [field]: nextValue }));
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
      title={isEdit ? MODALTITLEEDIT__TEXTLABEL[LANGUAGE] : MODALTITLECREATE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid}
      size="md"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <div className="rewards-modal__row rewards-modal__row--name-reward">
          <TextField
            id="badge-name"
            label={NAMELABEL__TEXTLABEL[LANGUAGE]}
            fieldKind="name"
            value={form.name}
            onChange={handleChange('name')}
            className="rewards-modal__field"
            inputClassName="rewards-modal__input"
          />
          <div className="rewards-modal__field">
            <RewardsCurrencyLabel htmlFor="badge-reward">{REWARDLABEL__TEXTLABEL[LANGUAGE]}</RewardsCurrencyLabel>
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
            label={ICONLABEL__TEXTLABEL[LANGUAGE]}
            value={form.icon}
            defaultEmoji={DEFAULT_BADGE_EMOJI}
            onChange={(emoji) => setForm((prev) => ({ ...prev, icon: emoji }))}
            ariaLabel={ICONARIALABEL__TEXTLABEL[LANGUAGE]}
          />

          <div className="rewards-modal__field">
            <label htmlFor="badge-rarity" className="rewards-modal__label">
              {RARITYLABEL__TEXTLABEL[LANGUAGE]}
              <InfoTooltip text={RARITYTOOLTIPTEXT__TEXTLABEL[LANGUAGE]} />
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
          label={STORYDESCRIPTIONLABEL__TEXTLABEL[LANGUAGE]}
          fieldKind="shortDescription"
          value={form.storyDescription}
          onChange={handleChange('storyDescription')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__textarea"
        />

        <TextField
          id="badge-edu"
          label={DIDACTICDESCRIPTIONLABEL__TEXTLABEL[LANGUAGE]}
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
            {HIDDENOPTIONTEXT__TEXTLABEL[LANGUAGE]}
          </BadgeOptionCheckbox>
        </div>
      </div>
    </Modal>
  );
}
