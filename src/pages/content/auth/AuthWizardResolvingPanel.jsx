import './AuthCard.css';
import './AuthWizardResolvingPanel.css';

/** Krótki placeholder w karcie logowania — unika migania między krokami podczas sprawdzania sesji. */
export default function AuthWizardResolvingPanel() {
  return (
    <div
      className="auth-card auth-card--wizard-panel auth-wizard-resolving"
      aria-busy="true"
      aria-label="Ładowanie"
    >
      <span className="auth-wizard-resolving__spinner" />
    </div>
  );
}
