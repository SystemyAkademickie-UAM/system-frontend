import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import '../auth/AuthCard.css';
import './WelcomeContent.css';

export default function WelcomeContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();

  useEffect(() => {
    if (searchParams.get('loggedOut') !== '1') {
      return;
    }
    showSuccess('Wylogowano pomyślnie.');
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, showSuccess]);

  return (
    <div className="welcome-page">
      <div className="auth-card welcome-page__card">
        <img
          src="/images/maq-logo.png"
          alt="MyAcademyQuest"
          className="welcome-page__logo auth-logo--maq-muted"
        />
        <p className="welcome-page__lead">Witaj w MyAcademyQuest</p>
        <Link to={loginPath()} className="auth-card__primary-btn welcome-page__login-btn">
          Zaloguj
        </Link>
      </div>
    </div>
  );
}
