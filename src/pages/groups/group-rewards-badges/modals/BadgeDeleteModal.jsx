/**
 * @file BadgeDeleteModal.jsx
 * @description Komponent okna modalnego BadgeDeleteModal z obsługą formularza i akcji użytkownika.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { Modal } from '../../../../components/ui/index.js';
import { useState } from 'react';
import '../../group-rewards/shared/rewardsModals.css';
import { READLANGUAGECOOKIE } from '../../../../utils/LANGUAGECOOKIE.js';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const MODALTITLE__TEXTLABEL = {
  polish: 'Usuń odznakę',
  english: 'Delete Badge'
};

const CONFIRMLABEL__TEXTLABEL = {
  polish: 'Usuń',
  english: 'Delete'
};

const CONFIRMATIONTEXT__TEXTLABEL = {
  polish: ['Czy na pewno chcesz usunąć odznakę ', '{name}', '?'],

english: ['Are you sure you want to delete badge ', '{name}', '?']
};

// === KOMPONENT OKNA DIALOGOWEGO ===
export default function BadgeDeleteModal({
  isOpen,
  badge,
  onClose,
  onConfirm,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

const handleConfirm = () => {
    onConfirm?.();
    onClose();
  };

  if (!badge) return null;

// === RENDEROWANIE OKNA MODALNEGO ===
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={MODALTITLE__TEXTLABEL[LANGUAGE]}
      onConfirm={handleConfirm}
      confirmLabel={CONFIRMLABEL__TEXTLABEL[LANGUAGE]}
      confirmVariant="danger"
      size="sm"
      className="rewards-modal"
    >
      <p className="rewards-modal__delete-text">
        {CONFIRMATIONTEXT__TEXTLABEL[LANGUAGE].map((segment, index) => (
          segment === '{name}' ? <strong key={index}>{badge.name}</strong> : segment
        ))}
      </p>
    </Modal>
  );
}
