import Button from '../Button/Button.jsx';
import './ConfirmActions.css';

export default function ConfirmActions({
  onReject,
  onConfirm,
  rejectLabel = 'Odrzuć',
  confirmLabel = 'Zapisz',
  className = '',
}) {
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
