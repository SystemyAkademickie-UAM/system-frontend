import { Link, useSearchParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import './WelcomeContent.css';

function IntroParagraph() {
  return (
    <p className="welcome-hero__intro">
      Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich{' '}
      <span className="welcome-hero__highlight">sztuk</span>
      {' '}oraz nauk gotowych zdobywać wiedzę i poszerzać swoje{' '}
      <span className="welcome-hero__highlight">umiejętności</span>
      {' '}w najodleglejszych krainach i czasach. Po drugiej stronie próżno szukać{' '}
      <span className="welcome-hero__highlight">wykładów i warsztatów</span>
      . Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące{' '}
      <span className="welcome-hero__highlight">ekspedycje</span>
      . Czy nie brak Ci sprytu i odwagi by przejść do świata, gdzie nauka i przygoda stanowią{' '}
      <span className="welcome-hero__highlight">jedno?</span>
    </p>
  );
}

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
    <div className="welcome-hero">
      <div className="welcome-hero__bg" aria-hidden="true">
        <div className="welcome-hero__bg-image" />
        <div className="welcome-hero__bg-glow" />
        <div className="welcome-hero__stars" />
        <div className="welcome-hero__vignette" />
      </div>

      <div className="welcome-hero__content">
        <header className="welcome-hero__header welcome-hero__reveal welcome-hero__reveal--1">
          <div className="welcome-hero__brand-row">
            <img
              src="/images/maq-logo.png"
              alt=""
              className="welcome-hero__logo"
              aria-hidden="true"
            />
            <p className="welcome-hero__aq" aria-hidden="true">
              <span className="welcome-hero__aq-a">A</span>
              <span className="welcome-hero__aq-q">Q</span>
            </p>
            <p className="welcome-hero__tagline">
              Nauka to{' '}
              <span className="welcome-hero__tagline-accent">przygoda</span>
            </p>
          </div>

          <h1 className="welcome-hero__title">
            MyAcademy<span className="welcome-hero__accent">Quest</span>
          </h1>
        </header>

        <div className="welcome-hero__intro-wrap welcome-hero__reveal welcome-hero__reveal--2">
          <IntroParagraph />
        </div>

        <Link
          to={loginPath()}
          className="welcome-hero__cta welcome-hero__reveal welcome-hero__reveal--3"
        >
          <span className="welcome-hero__cta-text">
            Kliknij, aby zanurzyć się w{' '}
            <span className="welcome-hero__accent">portalu</span>
          </span>
          <span className="welcome-hero__cta-shine" aria-hidden="true" />
        </Link>
      </div>

      <footer className="welcome-hero__footer welcome-hero__reveal welcome-hero__reveal--4">
        MyAcademyQuest 2026 ©
      </footer>
    </div>
  );
}
