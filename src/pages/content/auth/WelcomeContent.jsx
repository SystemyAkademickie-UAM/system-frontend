import { Link, useSearchParams } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './WelcomeContent.css';

const TAGLINE_WORDS__TEXTLABEL = {
  polish: ['zabawa', 'przygoda', 'wyprawa', 'ekspedycja', 'podróż', 'eksploracja'],
  english: ['fun', 'adventure', 'expedition', 'campaign', 'journey', 'exploration']
};

const PORTAL_WORDS__TEXTLABEL = {
  polish: ['portalu', 'magii', 'przygodzie'],
  english: ['portal', 'magic', 'adventure']
};

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

const TAGLINE_PREFIX__TEXTLABEL = {
  polish: 'Nauka to',
  english: 'Learning is'
};

const PORTAL_PREFIX__TEXTLABEL = {
  polish: 'Zanurz się w',
  english: 'Immerse yourself in'
};

const INTRO_LINE1_PREFIX__TEXTLABEL = {
  polish: 'Witaj, Wędrowcze. Stoisz u bram portalu łączącego uczelnie zrzeszające adeptów wszelkich',
  english: 'Welcome, Traveler. You stand at the gates of a portal connecting universities gathering adepts of all'
};

const INTRO_LINE2_PREFIX__TEXTLABEL = {
  polish: 'oraz nauk gotowych zdobywać wiedzę i poszerzać swoje',
  english: 'and sciences ready to gain knowledge and expand their'
};

const INTRO_LINE3_PREFIX__TEXTLABEL = {
  polish: 'w najodleglejszych krainach i czasach. Po drugiej stronie próżno szukać',
  english: 'in the most distant realms and times. On the other side, you will not find'
};

const INTRO_LINE4_PREFIX__TEXTLABEL = {
  polish: 'Ich miejsce zajmują epickie kampanie, sekretne misje oraz ekscytujące',
  english: 'Instead, there are epic campaigns, secret missions, and exciting'
};

const INTRO_LINE5_PREFIX__TEXTLABEL = {
  polish: 'Czy nie brak Ci sprytu i odwagi by przejść do świata, gdzie nauka i przygoda stanowią',
  english: 'Do you not lack wit and courage to enter a world where learning and adventure form'
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
      <span className="welcome-hero__text-gray">{grayText}</span>
      {'\u00A0'}
      <span className="welcome-hero__text-green">{greenText}</span>
    </div>
  );
}

export default function WelcomeContent() {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [searchParams, setSearchParams] = useSearchParams();
  const { showSuccess } = useToast();
  const isCoarsePointer = useCoarsePointer();

  const [taglineWord, setTaglineWord] = useState(() =>
    pickRandom(TAGLINE_WORDS__TEXTLABEL[LANGUAGE]));
  const [portalWord, setPortalWord] = useState(() =>
    pickRandom(PORTAL_WORDS__TEXTLABEL[LANGUAGE]));
  const [introWords, setIntroWords] = useState(() => ({
    line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]),
    line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]),
    line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]),
    line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]),
    line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]),
  }));
  const [ticks, setTicks] = useState(0);
  const [tickDirection, setTickDirection] = useState(1);

  const refreshPortalWord = useCallback(() => {
    setPortalWord(pickRandom(PORTAL_WORDS__TEXTLABEL[LANGUAGE]));
  }, [LANGUAGE]);

  const refreshTaglineWord = useCallback(() => {
    setTaglineWord(pickRandom(TAGLINE_WORDS__TEXTLABEL[LANGUAGE]));
  }, [LANGUAGE]);

  const refreshIntroWords = useCallback(() => {
    setIntroWords({
      line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]),
      line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]),
      line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]),
      line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]),
      line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]),
    });
  }, [LANGUAGE]);

  useEffect(() => {
    setTaglineWord(pickRandom(TAGLINE_WORDS__TEXTLABEL[LANGUAGE]));
    setPortalWord(pickRandom(PORTAL_WORDS__TEXTLABEL[LANGUAGE]));
    setIntroWords({
      line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]),
      line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]),
      line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]),
      line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]),
      line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]),
    });
  }, [LANGUAGE]);

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
    showSuccess(LOGGEDOUT_SUCCESS__TEXTLABEL[LANGUAGE]);
    setSearchParams({}, { replace: true });
  }, [searchParams, setSearchParams, showSuccess, LANGUAGE]);

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
          aria-label={PORTAL_PREFIX__TEXTLABEL[LANGUAGE]}
        >
          <div className="welcome-hero__portal-btn">
            <span className="welcome-hero__text-gray">{PORTAL_PREFIX__TEXTLABEL[LANGUAGE]}</span>
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
          grayText={TAGLINE_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={taglineWord}
          onSwap={refreshTaglineWord}
        />

        <div className="welcome-hero__title">
          <span className="welcome-hero__text-gray">MyAcademy</span>
          <span className="welcome-hero__text-green">Quest</span>
        </div>

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--1"
          grayText={INTRO_LINE1_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={introWords.line0}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line0: pickRandom(INTRO_LINE0_WORDS__TEXTLABEL[LANGUAGE]) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--2"
          grayText={INTRO_LINE2_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={introWords.line1}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line1: pickRandom(INTRO_LINE1_WORDS__TEXTLABEL[LANGUAGE]) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--3"
          grayText={INTRO_LINE3_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={`${introWords.line2}.`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line2: pickRandom(INTRO_LINE2_WORDS__TEXTLABEL[LANGUAGE]) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--4"
          grayText={INTRO_LINE4_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={`${introWords.line3}.`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line3: pickRandom(INTRO_LINE3_WORDS__TEXTLABEL[LANGUAGE]) }))}
        />

        <SwapBlock
          className="welcome-hero__intro-line welcome-hero__intro-line--5"
          grayText={INTRO_LINE5_PREFIX__TEXTLABEL[LANGUAGE]}
          greenText={`${introWords.line4}?`}
          onSwap={() => setIntroWords((prev) => ({ ...prev, line4: pickRandom(INTRO_LINE4_WORDS__TEXTLABEL[LANGUAGE]) }))}
        />
      </div>

      <footer className="welcome-hero__footer welcome-hero__reveal welcome-hero__reveal--4">
        {FOOTER_TEXT__TEXTLABEL[LANGUAGE]}
      </footer>
    </div>
  );
}
