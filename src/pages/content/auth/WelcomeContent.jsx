import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import './WelcomeContent.css';

const TAGLINE_WORDS = ['zabawa', 'przygoda', 'wyprawa', 'ekspedycja', 'podróż', 'eksploracja'];
const PORTAL_WORDS = ['portalu', 'magii', 'przygodzie'];
const INTRO_LINES = {
  line0: ['sztuk', 'dziedzin', 'dyscyplin', 'rzemiosł', 'profesji'],
  line1: ['umiejętności', 'talenty', 'kompetencje', 'moce', 'atuty'],
  line2: ['wykładów i warsztatów', 'zajęć i seminariów', 'lekcji i ćwiczeń', 'kursów i treningów'],
  line3: ['ekspedycje', 'wyprawy', 'misje', 'podróże', 'eskapady', 'kampanie'],
  line4: ['jedno', 'jedność', 'całość', 'harmonię', 'nierozłączną całość'],
};

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

/** Zapobiega wiszącym spójnikom na końcu linii (PL). */
function withPolishLineBreaks(text) {
  return text.replace(
    /\s+(i|a|o|u|w|z|na|do|od|po|ze|że|by|co|się|oraz|czy|jak|gdy|to|już|też|więc|lub|albo|nad|pod|przy|bez|dla|ku|we|za|ani|niż|tym|gdyż|lecz|aby|gdyby|więc)\s+/gi,
    (_, word) => `\u00A0${word} `,
  );
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

function useWordSwapHandler(onSwap) {
  const isCoarsePointer = useCoarsePointer();

  return useCallback((event) => {
    if (isCoarsePointer) {
      event.preventDefault();
      event.stopPropagation();
    }
    onSwap();
  }, [isCoarsePointer, onSwap]);
}

function SwapBlock({
  className,
  grayText,
  greenText,
  onSwap,
}) {
  const isCoarsePointer = useCoarsePointer();
  const handleSwap = useWordSwapHandler(onSwap);

  return (
    <div
      className={className}
      onMouseEnter={isCoarsePointer ? undefined : onSwap}
      onClick={isCoarsePointer ? handleSwap : undefined}
      onKeyDown={isCoarsePointer ? (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleSwap(event);
        }
      } : undefined}
      role={isCoarsePointer ? 'button' : undefined}
      tabIndex={isCoarsePointer ? 0 : undefined}
    >
      <span className="welcome-hero__text-gray">{withPolishLineBreaks(grayText)}</span>
      {'\u00A0'}
      <span className="welcome-hero__text-green">{greenText}</span>
    </div>
  );
}

export default function WelcomeContent() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();
  const isCoarsePointer = useCoarsePointer();

  const [taglineWord, setTaglineWord] = useState('');
  const [portalWord, setPortalWord] = useState('');
  const [introWords, setIntroWords] = useState({
    line0: '',
    line1: '',
    line2: '',
    line3: '',
    line4: '',
  });
  const [ticks, setTicks] = useState(0);
  const [tickDirection, setTickDirection] = useState(1);

  const refreshPortalWord = useCallback(() => {
    setPortalWord(pickRandom(PORTAL_WORDS));
  }, []);

  useEffect(() => {
    setTaglineWord(pickRandom(TAGLINE_WORDS));
    setPortalWord(pickRandom(PORTAL_WORDS));
    setIntroWords({
      line0: pickRandom(INTRO_LINES.line0),
      line1: pickRandom(INTRO_LINES.line1),
      line2: pickRandom(INTRO_LINES.line2),
      line3: pickRandom(INTRO_LINES.line3),
      line4: pickRandom(INTRO_LINES.line4),
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTicks((previous) => {
        let next = previous + tickDirection;

        if (next >= 50) {
          next = 50;
          setTickDirection(-1);
        }

        if (next <= 0) {
          next = 0;
          setTickDirection(1);
        }

        return next;
      });
    }, 25);

    return () => clearInterval(interval);
  }, [tickDirection]);

  useEffect(() => {
    if (searchParams.get('loggedOut') !== '1') {
      return;
    }
    showSuccess('Wylogowano pomyślnie.');
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, showSuccess]);

  return (
    <div
      className="welcome-hero"
      style={{ '--welcome-tagline-scale': 1 - ticks * 0.01 }}
    >
      <div className="welcome-hero__bg" aria-hidden="true">
        <div className="welcome-hero__bg-image" />
        <div className="welcome-hero__bg-glow" />
        <div className="welcome-hero__stars" />
        <div className="welcome-hero__vignette" />
      </div>

      <div className="welcome-hero__content">
        <Link
          to={loginPath()}
          className="welcome-hero__portal-link"
          aria-label={`Zanurz się w ${portalWord}`}
        >
          <div className="welcome-hero__portal-btn">
            <span className="welcome-hero__text-gray">{withPolishLineBreaks('Zanurz się w')}</span>
            {' '}
            <span
              className="welcome-hero__text-green welcome-hero__portal-word"
              onMouseEnter={isCoarsePointer ? undefined : refreshPortalWord}
            >
              {portalWord}
            </span>
          </div>
        </Link>

        <div className="welcome-hero__brand">
          <img
            src="/images/maq-logo.png"
            alt=""
            className="welcome-hero__brand-logo"
            aria-hidden="true"
          />
          <span className="welcome-hero__brand-a" aria-hidden="true">A</span>
          <span className="welcome-hero__brand-q" aria-hidden="true">Q</span>
        </div>

        <SwapBlock
          className="welcome-hero__tagline"
          grayText="Nauka to"
          greenText={taglineWord}
          onSwap={() => setTaglineWord(pickRandom(TAGLINE_WORDS))}
        />

        <div className="welcome-hero__title">
          <span className="welcome-hero__text-gray">MyAcademy</span>
          <span className="welcome-hero__text-green">Quest</span>
        </div>

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--1"
          grayText="Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich"
          greenText={introWords.line0}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line0: pickRandom(INTRO_LINES.line0) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--2"
          grayText="oraz nauk gotowych zdobywać wiedzę i poszerzać swoje"
          greenText={introWords.line1}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line1: pickRandom(INTRO_LINES.line1) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--3"
          grayText="w najodleglejszych krainach i czasach. Po drugiej stronie próżno szukać"
          greenText={`${introWords.line2}.`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line2: pickRandom(INTRO_LINES.line2) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--4"
          grayText="Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące"
          greenText={`${introWords.line3}.`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line3: pickRandom(INTRO_LINES.line3) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--5"
          grayText="Czy nie brak Ci sprytu i odwagi by przejść do świata, gdzie nauka i przygoda stanowią"
          greenText={`${introWords.line4}?`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line4: pickRandom(INTRO_LINES.line4) }))}
        />
      </div>

      <footer className="welcome-hero__footer welcome-hero__reveal welcome-hero__reveal--4">
        MyAcademyQuest 2026 ©
      </footer>
    </div>
  );
}
