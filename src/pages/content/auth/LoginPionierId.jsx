import './AuthCard.css';
import './LoginPionierId.css';

export default function LoginPionierId({ onContinue }) {
  return (
    <div className="auth-card auth-card--wizard-panel login-pionierid">
      <div className="login-pionierid__body">
        <img
          src="/images/pionierid-logo.png"
          alt="PIONIER.id"
          className="login-pionierid__logo auth-logo--pionier"
        />

        <div className="login-pionierid__actions">
          <button
            type="button"
            className="auth-card__primary-btn login-pionierid__btn"
            onClick={onContinue}
          >
            Zaloguj się przez PIONIER.ID
          </button>

          <a href="#" className="auth-card__secondary-link login-pionierid__email-link">
            Zaloguj się przez e-mail
          </a>
        </div>
      </div>
    </div>
  );
}
