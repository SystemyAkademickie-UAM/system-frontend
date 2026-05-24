import './AuthRolePickerOverlay.css';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.isBusy
 * @param {string | null} props.errorMessage
 * @param {Array<{ id: string, label: string, sessionRole?: string }>} props.personas
 * @param {string} props.selectedPersonaId
 * @param {(personaId: string) => void} props.onSelectedPersonaIdChange
 * @param {(personaId: string) => void} props.onConfirmPersona
 * @param {() => void} props.onClose
 */
export default function AuthRolePickerOverlay({
  isOpen,
  isBusy,
  errorMessage,
  personas,
  selectedPersonaId,
  onSelectedPersonaIdChange,
  onConfirmPersona,
  onClose,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-role-picker" role="presentation">
      <button
        type="button"
        className="auth-role-picker__backdrop"
        aria-label="Zamknij"
        onClick={onClose}
        disabled={isBusy}
      />

      <div
        className="auth-role-picker__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-role-picker-title"
      >
        <h2 id="auth-role-picker-title" className="auth-role-picker__title">
          Zaloguj się jako (dev)
        </h2>

        <label className="auth-role-picker__field" htmlFor="auth-role-picker-select">
          <span className="auth-role-picker__field-label">Wybierz konto testowe</span>
          <select
            id="auth-role-picker-select"
            className="auth-role-picker__select"
            value={selectedPersonaId}
            onChange={(event) => onSelectedPersonaIdChange(event.target.value)}
            disabled={isBusy || personas.length === 0}
          >
            {personas.map((persona) => (
              <option key={persona.id} value={persona.id}>
                {persona.label}
                {persona.sessionRole ? ` (${persona.sessionRole})` : ''}
              </option>
            ))}
          </select>
        </label>

        {errorMessage && (
          <p className="auth-role-picker__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="auth-role-picker__actions">
          <button
            type="button"
            className="auth-role-picker__option"
            onClick={() => onConfirmPersona(selectedPersonaId)}
            disabled={isBusy || personas.length === 0 || selectedPersonaId.trim().length === 0}
          >
            {isBusy ? 'Logowanie...' : 'Kontynuuj'}
          </button>
          <button
            type="button"
            className="auth-role-picker__cancel"
            onClick={onClose}
            disabled={isBusy}
          >
            Anuluj
          </button>
        </div>
      </div>
    </div>
  );
}
