import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import { authLegalDocumentUrl } from '../../../constants/authLegalDocuments.constants.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './WelcomeContent.css';

const INTRO_LINE0_WORDS__TEXTLABEL = {
  polish: ['sztuk', 'dziedzin', 'dyscyplin', 'rzemiosł', 'profesji'],
  english: ['arts', 'disciplines', 'fields', 'crafts', 'professions']
};

const INTRO_LINE1_WORDS__TEXTLABEL = {
  polish: ['umiejętności', 'talenty', 'kompetencje', 'moce', 'atuty'],
  english: ['skills', 'talents', 'abilities', 'powers', 'advantages']
};

const INTRO_LINE2_WORDS__TEXTLABEL = {
  polish: ['wykładów i warsztatów', 'zajęć i seminariów', 'lekcji i ćwiczeń', 'kursów i treningów'],
  english: ['lectures and workshops', 'classes and seminars', 'lessons and exercises', 'courses and training']
};

const INTRO_LINE3_WORDS__TEXTLABEL = {
  polish: ['ekspedycje', 'wyprawy', 'misje', 'podróże', 'eskapady', 'kampanie'],
  english: ['expeditions', 'journeys', 'missions', 'travels', 'escapades', 'campaigns']
};

const INTRO_LINE4_WORDS__TEXTLABEL = {
  polish: ['jedno', 'jedność', 'całość', 'harmonię', 'nierozłączną całość'],
  english: ['unity', 'oneness', 'wholeness', 'harmony', 'indivisible whole']
};

const JOIN_BUTTON__TEXTLABEL = {
  polish: 'Dołącz',
  english: 'Join'
};

const SUBTITLE__TEXTLABEL = {
  polish: 'MyAcademyQuest - system do grywalizacji',
  english: 'MyAcademyQuest - gamification system'
};

const SCROLL_HINT__TEXTLABEL = {
  polish: 'Przewiń w dół',
  english: 'Scroll down'
};

const LOGGEDOUT_SUCCESS__TEXTLABEL = {
  polish: 'Wylogowano pomyślnie.',
  english: 'Logged out successfully.'
};

const FOOTER_TEXT__TEXTLABEL = {
  polish: 'MyAcademyQuest 2026 ©',
  english: 'MyAcademyQuest 2026 ©'
};

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function useCoarsePointer() {
  const [isCoarsePointer, setIsCoarsePointer] = useState(
    () => window.matchMedia('(hover: none) and (pointer: coarse)').matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(hover: none) and (pointer: coarse)');
    const onChange = () => setIsCoarsePointer(mediaQuery.matches);
    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  return isCoarsePointer;
}

function SwapWord({
  word,
  onSwap,
  suffix = '',
}) {
  const isCoarsePointer = useCoarsePointer();

  return (
    <span
      className="welcome-swap-word"
      onMouseEnter={isCoarsePointer ? undefined : onSwap}
    >
      <span className="welcome-swap-word__inner">{word}</span>
      {suffix ? <span className="welcome-swap-word__suffix">{suffix}</span> : null}
    </span>
  );
}

export default function WelcomeContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();
  const storySectionRef = useRef(null);

  const [introWords, setIntroWords] = useState(() => ({
    line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]),
    line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]),
    line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]),
    line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]),
    line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]),
  }));

  useEffect(() => {
    setIntroWords({
      line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]),
      line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]),
      line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]),
      line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]),
      line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]),
    });
  }, [LANGUAGE]);

  useEffect(() => {
    if (searchParams.get('loggedOut') !== '1') {
      return;
    }
    showSuccess(LOGGEDOUT_SUCCESS__TEXTLABEL[LANGUAGE]);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, showSuccess, LANGUAGE]);

  const scrollToStory = () => {
    storySectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="welcome-hero">
      <div className="welcome-hero__bg" aria-hidden="true">
        <div className="welcome-hero__bg-image" />
        <div className="welcome-hero__bg-glow" />
        <div className="welcome-hero__stars" />
        <div className="welcome-hero__vignette" />
      </div>

      {/* Górny pasek nawigacyjny z przyciskiem Dołącz */}
      <header className="welcome-nav">
        <Link
          to={loginPath()}
          className="welcome-nav__join-btn"
          aria-label={JOIN_BUTTON__TEXTLABEL[LANGUAGE]}
        >
          {JOIN_BUTTON__TEXTLABEL[LANGUAGE]}
        </Link>
      </header>

      <div className="welcome-scroll-container">
        {/* SEKCJA 1: Główna z wycentrowanym logo MAQ (ikona + AQ) i podpisem */}
        <section className="welcome-section welcome-section--hero">
          <div className="welcome-hero__main-brand">
            <div className="welcome-hero__brand">
              <img
                src="/images/maq-logo.png"
                alt="MyAcademyQuest Logo"
                className="welcome-hero__brand-logo"
              />
              <span className="welcome-hero__brand-a" aria-hidden="true">A</span>
              <span className="welcome-hero__brand-q" aria-hidden="true">Q</span>
            </div>
            <p className="welcome-hero__subtitle">
              {SUBTITLE__TEXTLABEL[LANGUAGE]}
            </p>
          </div>

          <button
            type="button"
            className="welcome-hero__scroll-indicator"
            onClick={scrollToStory}
            aria-label={SCROLL_HINT__TEXTLABEL[LANGUAGE]}
          >
            <span className="welcome-hero__scroll-chevron" aria-hidden="true">↓</span>
          </button>
        </section>

        {/* SEKCJA 2: Fabuła — linie kończące się na wybranych słowach */}
        <section
          ref={storySectionRef}
          className="welcome-section welcome-section--story"
        >
          <div className="welcome-story-card">
            <div className="welcome-story-card__narrative">
              <p className="welcome-story-paragraph">
                <span className="welcome-story-line">
                  Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich{' '}
                  <SwapWord
                    word={introWords.line0}
                    onSwap={() => setIntroWords((prev) => ({ ...prev, line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]) }))}
                  />
                </span>
                <span className="welcome-story-line">
                  oraz nauk gotowych zdobywać wiedzę i poszerzać swoje{' '}
                  <SwapWord
                    word={introWords.line1}
                    onSwap={() => setIntroWords((prev) => ({ ...prev, line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]) }))}
                  />
                </span>
                <span className="welcome-story-line">
                  w najodleglejszych krainach i czasach.
                </span>
              </p>

              <p className="welcome-story-paragraph">
                <span className="welcome-story-line">
                  Po drugiej stronie próżno szukać{' '}
                  <SwapWord
                    word={introWords.line2}
                    suffix="."
                    onSwap={() => setIntroWords((prev) => ({ ...prev, line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]) }))}
                  />
                </span>
                <span className="welcome-story-line">
                  Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące{' '}
                  <SwapWord
                    word={introWords.line3}
                    suffix="."
                    onSwap={() => setIntroWords((prev) => ({ ...prev, line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]) }))}
                  />
                </span>
              </p>

              <p className="welcome-story-paragraph">
                <span className="welcome-story-line">
                  Czy nie brak Ci sprytu i odwagi by przejść
                </span>
                <span className="welcome-story-line">
                  do świata, gdzie nauka i przygoda stanowią{' '}
                  <SwapWord
                    word={introWords.line4}
                    suffix="?"
                    onSwap={() => setIntroWords((prev) => ({ ...prev, line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]) }))}
                  />
                </span>
              </p>
            </div>

            <div className="welcome-story-card__cta">
              <Link to={loginPath()} className="welcome-story-card__btn">
                {JOIN_BUTTON__TEXTLABEL[LANGUAGE]}
              </Link>
            </div>
          </div>
        </section>

        {/* SEKCJA 3: Stopka i Kontakt */}
        <footer className="welcome-section welcome-section--footer">
          <div className="welcome-footer__content">
            <div className="welcome-footer__grid">
              <div className="welcome-footer__column welcome-footer__column--brand">
                <div className="welcome-footer__logo-title">
                  <span className="welcome-hero__text-gray">MyAcademy</span>
                  <span className="welcome-hero__text-green">Quest</span>
                </div>
                <p className="welcome-footer__description">
                  Nowoczesny system grywalizacji akademickiej. Łączymy edukację z interaktywną przygodą i mechanikami gier.
                </p>
              </div>

              <div className="welcome-footer__column">
                <h3 className="welcome-footer__heading">Kontakt</h3>
                <ul className="welcome-footer__list">
                  <li>Email: kontakt@myacademyquest.pl</li>
                  <li>Wsparcie: support@myacademyquest.pl</li>
                </ul>
              </div>

              <div className="welcome-footer__column">
                <h3 className="welcome-footer__heading">Informacje</h3>
                <ul className="welcome-footer__list">
                  <li>
                    <a
                      href={authLegalDocumentUrl('documentation')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="welcome-footer__link"
                    >
                      Dokumentacja
                    </a>
                  </li>
                  <li>
                    <a
                      href={authLegalDocumentUrl('privacyPolicy')}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="welcome-footer__link"
                    >
                      Polityka Prywatności
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <div className="welcome-footer__bottom">
              <span className="welcome-footer__copyright">{FOOTER_TEXT__TEXTLABEL[LANGUAGE]}</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

