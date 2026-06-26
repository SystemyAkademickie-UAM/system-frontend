import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = { name: '', visibilityStatus: 1 };

function StageVisibilityCheckbox({ checked, onChange }) {
  return (
    <label className="rewards-modal__option-label" htmlFor="stage-visibility">
      <input
        id="stage-visibility"
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
      <span className="rewards-modal__option-text">Etap widoczny dla studentów</span>
    </label>
  );
}

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
          fieldKind="stageName"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder="np. Laboratorium nr 1: Zajęcia organizacyjne"
          className="rewards-modal__field"
          inputClassName="rewards-modal__input"
        />
        <div className="rewards-modal__field">
          <StageVisibilityCheckbox
            checked={form.visibilityStatus === 1}
            onChange={(checked) => setForm((prev) => ({
              ...prev,
              visibilityStatus: checked ? 1 : 0,
            }))}
          />
        </div>
      </div>
    </Modal>
  );
}
