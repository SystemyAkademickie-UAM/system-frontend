import { useEffect, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function StageCloneModal({
  isOpen,
  stage,
  defaultName = '',
  onClose,
  onConfirm,
  isLoading = false,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [name, setName] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setName(defaultName);
  }, [isOpen, defaultName]);

  const handleConfirm = () => {
    const trimmed = name.trim();
    if (!trimmed || isLoading) return;
    onConfirm?.(trimmed);
  };

  const CLONESTAGETITLE__TEXTLABEL = {
    polish: 'Kopiuj etap',
    english: 'Copy Stage',
  };
  const COPYBUTTON__TEXTLABEL = {
    polish: 'Kopiuj',
    english: 'Copy',
  };
  const COPYINGTEXT__TEXTLABEL = {
    polish: 'Kopiowanie...',
    english: 'Copying...',
  };
  const CLONENAME__TEXTLABEL = {
    polish: 'Nazwa sklonowanego etapu',
    english: 'Cloned stage name',
  };
  const CLONENAMEPLACEHOLDER__TEXTLABEL = {
    polish: 'np. Kopia (Laboratorium nr 1)',
    english: 'e.g. Copy (Laboratory No. 1)',
  };

  if (!stage) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={CLONESTAGETITLE__TEXTLABEL[LANGUAGE]}
      subtitle={stage.name}
      onConfirm={handleConfirm}
      confirmDisabled={!name.trim() || isLoading}
      confirmLabel={isLoading ? COPYINGTEXT__TEXTLABEL[LANGUAGE] : COPYBUTTON__TEXTLABEL[LANGUAGE]}
      size="sm"
      className="rewards-modal"
    >
      <TextField
        id="stage-clone-name"
        label={CLONENAME__TEXTLABEL[LANGUAGE]}
        fieldKind="stageName"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder={CLONENAMEPLACEHOLDER__TEXTLABEL[LANGUAGE]}
        className="rewards-modal__form"
        inputClassName="rewards-modal__input"
      />
    </Modal>
  );
}
