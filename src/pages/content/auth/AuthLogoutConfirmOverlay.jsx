import './AuthLogoutConfirmOverlay.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.isBusy
 * @param {string | null} props.errorMessage
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function AuthLogoutConfirmOverlay({
  isOpen,
  isBusy,
  errorMessage,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-logout-confirm" role="presentation">
      <button
        type="button"
        className="auth-logout-confirm__backdrop"
        aria-label="Anuluj"
        onClick={onCancel}
        disabled={isBusy}
      />

      <div
        className="auth-logout-confirm__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-logout-confirm-title"
        aria-describedby="auth-logout-confirm-message"
      >
        <h2 id="auth-logout-confirm-title" className="auth-logout-confirm__title">
          Wylogować się?
        </h2>

        <p id="auth-logout-confirm-message" className="auth-logout-confirm__message">
          Wrócisz do ekranu logowania. Twoja sesja zostanie zakończona.
        </p>

        {errorMessage && (
          <p className="auth-logout-confirm__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="auth-logout-confirm__actions">
          <button
            type="button"
            className="auth-logout-confirm__confirm"
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? 'Wylogowywanie...' : 'Wyloguj'}
          </button>
          <button
            type="button"
            className="auth-logout-confirm__cancel"
            onClick={onCancel}
            disabled={isBusy}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
