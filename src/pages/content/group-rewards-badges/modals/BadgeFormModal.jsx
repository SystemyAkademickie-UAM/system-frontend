import { useEffect, useMemo, useState } from 'react';
import { BADGE_RARITY, BADGE_RARITY_LABELS, Modal } from '../../../../components/ui/index.js';
import { fetchIconCatalog } from '../../../../services/icons.api.js';
import { validateWholeNumberInput } from '../../group-rewards/shared/rewardsNumericValidation.js';
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

  const showRewardError = form.rewardAmount.trim() !== '' && !rewardValidation.valid;

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
        <div className="rewards-modal__field">
          <label htmlFor="badge-name" className="rewards-modal__label">Nazwa</label>
          <input
            id="badge-name"
            type="text"
            className="rewards-modal__input"
            value={form.name}
            onChange={handleChange('name')}
          />
        </div>

        <div className="rewards-modal__row">
          <div className="rewards-modal__field">
            <label htmlFor="badge-icon" className="rewards-modal__label">Ikona</label>
            <select
              id="badge-icon"
              className="rewards-modal__select"
              value={form.iconFile}
              onChange={handleChange('iconFile')}
            >
              <option value="">Wybierz ikonę…</option>
              {iconCatalog.map((icon) => (
                <option key={icon.id} value={icon.id}>{icon.label}</option>
              ))}
            </select>
          </div>

          <div className="rewards-modal__field">
            <label htmlFor="badge-rarity" className="rewards-modal__label">Jakość</label>
            <select
              id="badge-rarity"
              className="rewards-modal__select"
              value={form.rarity}
              onChange={handleChange('rarity')}
            >
              {Object.values(BADGE_RARITY).map((rarity) => (
                <option key={rarity} value={rarity}>
                  {BADGE_RARITY_LABELS[rarity]}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="badge-story" className="rewards-modal__label">Opis fabularny</label>
          <textarea
            id="badge-story"
            className="rewards-modal__textarea"
            value={form.storyDescription}
            onChange={handleChange('storyDescription')}
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="badge-didactic" className="rewards-modal__label">Opis dydaktyczny</label>
          <textarea
            id="badge-didactic"
            className="rewards-modal__textarea"
            value={form.didacticDescription}
            onChange={handleChange('didacticDescription')}
          />
        </div>

        <div className="rewards-modal__field">
          <label htmlFor="badge-reward" className="rewards-modal__label">Nagroda</label>
          <input
            id="badge-reward"
            type="text"
            inputMode="numeric"
            className={[
              'rewards-modal__input',
              showRewardError ? 'rewards-modal__input--error' : '',
            ].filter(Boolean).join(' ')}
            value={form.rewardAmount}
            onChange={handleChange('rewardAmount')}
            placeholder="np. 50"
            aria-invalid={showRewardError}
            aria-describedby={showRewardError ? 'badge-reward-error' : undefined}
          />
          {showRewardError ? (
            <p id="badge-reward-error" className="rewards-modal__field-error" role="alert">
              {rewardValidation.error}
            </p>
          ) : null}
        </div>
      </div>
    </Modal>
  );
}
