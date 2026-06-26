import { useEffect, useMemo, useState } from 'react';
import { BADGE_RARITY, BADGE_RARITY_LABELS, InfoTooltip, Modal, TextField } from '../../../../components/ui/index.js';
import IconPicker from '../../../../components/ui/IconPicker/IconPicker.jsx';
import { fetchIconCatalog } from '../../../../services/icons.api.js';
import { validateWholeNumberInput } from '../../../../utils/validation/rewardsNumericValidation.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = {
  name: '',
  iconFile: '',
  rarity: BADGE_RARITY.common,
  storyDescription: '',
  didacticDescription: '',
  rewardAmount: '',
};

export default function BadgeFormModal({
  isOpen,
  badge,
  onClose,
  onConfirm,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [iconCatalog, setIconCatalog] = useState([]);
  const isEdit = Boolean(badge);

  useEffect(() => {
    if (!isOpen) return;

    let cancelled = false;
    fetchIconCatalog().then((catalog) => {
      if (!cancelled) setIconCatalog(catalog);
    });
    return () => { cancelled = true; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    if (badge) {
      setForm({
        name: badge.name,
        iconFile: badge.iconFile,
        rarity: badge.rarity,
        storyDescription: badge.storyDescription,
        didacticDescription: badge.didacticDescription,
        rewardAmount: String(badge.rewardAmount),
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
    && form.iconFile.trim()
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
      iconFile: form.iconFile.trim(),
      rarity: form.rarity,
      storyDescription: form.storyDescription.trim(),
      didacticDescription: form.didacticDescription.trim(),
      rewardAmount: rewardValidation.value,
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
          <label className="rewards-modal__label">Ikona</label>
          <IconPicker
            icons={iconCatalog}
            value={form.iconFile}
            onChange={(iconId) => setForm((prev) => ({ ...prev, iconFile: iconId }))}
            name="badge-icon"
          />
        </div>

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

        <TextField
          id="badge-reward"
          label="Nagroda (waluta)"
          type="number"
          value={form.rewardAmount}
          onChange={handleChange('rewardAmount')}
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
      </div>
    </Modal>
  );
}
