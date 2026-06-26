import { useEffect, useState } from 'react';
import { Modal, TextField } from '../../../../components/ui/index.js';
import '../../group-rewards/shared/rewardsModals.css';

export default function StageCloneModal({
  isOpen,
  stage,
  defaultName = '',
  onClose,
  onConfirm,
  isLoading = false,
}) {
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

  if (!stage) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Kopiuj etap"
      subtitle={stage.name}
      onConfirm={handleConfirm}
      confirmDisabled={!name.trim() || isLoading}
      confirmLabel={isLoading ? 'Kopiowanie…' : 'Kopiuj'}
      size="sm"
      className="rewards-modal"
    >
      <TextField
        id="stage-clone-name"
        label="Nazwa sklonowanego etapu"
        fieldKind="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="np. Kopia (Laboratorium nr 1)"
        className="rewards-modal__form"
        inputClassName="rewards-modal__input"
      />
    </Modal>
  );
}
