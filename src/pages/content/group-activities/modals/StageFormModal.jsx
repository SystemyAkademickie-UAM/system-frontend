import { useEffect, useMemo, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import AssetSvg from '../../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../../constants/svgIcons.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';

const EMPTY_FORM = { name: '', visibilityStatus: 1 };

function StageVisibilityCheckbox({ checked, onChange }) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const VISIBILITY__TEXTLABEL = {
    polish: 'Etap widoczny dla studentów',
    english: 'Stage visible to students',
  };
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
      <span className="rewards-modal__option-text">{VISIBILITY__TEXTLABEL[LANGUAGE]}</span>
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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [form, setForm] = useState(EMPTY_FORM);
  const isEdit = Boolean(stage);

  const EDITSTAGETITLE__TEXTLABEL = {
    polish: 'Edytuj etap',
    english: 'Edit Stage',
  };
  const ADDSTAGETITLE__TEXTLABEL = {
    polish: 'Dodaj etap',
    english: 'Add Stage',
  };
  const SAVEBUTTON__TEXTLABEL = {
    polish: 'Zapisz',
    english: 'Save',
  };
  const ADDBUTTON__TEXTLABEL = {
    polish: 'Dodaj',
    english: 'Add',
  };
  const STAGENAME__TEXTLABEL = {
    polish: 'Nazwa etapu',
    english: 'Stage Name',
  };
  const STAGENAMEPLACEHOLDER__TEXTLABEL = {
    polish: 'np. Laboratorium nr 1: Zajęcia organizacyjne',
    english: 'e.g. Laboratory No. 1: Orientation Session',
  };

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
      title={isEdit ? EDITSTAGETITLE__TEXTLABEL[LANGUAGE] : ADDSTAGETITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmDisabled={!isValid || isLoading}
      confirmLabel={isEdit ? SAVEBUTTON__TEXTLABEL[LANGUAGE] : ADDBUTTON__TEXTLABEL[LANGUAGE]}
      size="sm"
      className="rewards-modal"
    >
      <div className="rewards-modal__form">
        <TextField
          id="stage-name"
          label={STAGENAME__TEXTLABEL[LANGUAGE]}
          fieldKind="stageName"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          placeholder={STAGENAMEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
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
