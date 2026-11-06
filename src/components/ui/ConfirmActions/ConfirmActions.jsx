/**
 * @file ConfirmActions.jsx
 * @description Komponent interfejsu użytkownika ConfirmActions.
 */

// === IMPORTY I ZALEŻNOŚCI ===
﻿import Button from '../Button/Button.jsx';
import './ConfirmActions.css';

// === GŁÓWNY KOMPONENT WIDOKU ===
export default function ConfirmActions({
  onReject,
  onConfirm,
  rejectLabel = 'Odrzuć',
  confirmLabel = 'Zapisz',
  className = '',
}) {

// === RENDEROWANIE WIDOKU ===
return (
    <div className={['maq-confirm-actions', className].filter(Boolean).join(' ')} role="group" aria-label="Akcje zatwierdzenia">
      <div className="maq-confirm-actions__inner">
        <Button variant="text" onClick={onReject}>
          {rejectLabel}
        </Button>
        <Button variant="primary" size="md" onClick={onConfirm}>
          {confirmLabel}
        </Button>
      </div>
    </div>
  );
}
