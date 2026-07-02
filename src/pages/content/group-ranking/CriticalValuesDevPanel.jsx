import { useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  NAME_MAX_LENGTH,
  POST_CONTENT_MAX_LENGTH,
  POST_TITLE_MAX_LENGTH,
  SHORT_DESCRIPTION_MAX_LENGTH,
  STAGE_NAME_MAX_LENGTH,
} from '../../../constants/fieldLimits.js';
import { isNodeProduction } from '../../../utils/nodeEnv.js';
import { seedCriticalValues } from './seedCriticalValues.js';
import './TemporaryDevSeedPanel.css';

/**
 * Panel dev — generator encji z maksymalną długością pól tekstowych.
 *
 * @param {Object} props
 * @param {boolean} props.isStudentView
 * @param {() => void} [props.onComplete]
 */
export default function CriticalValuesDevPanel({ isStudentView, onComplete }) {
  const { groupId } = useParams();
  const [isBusy, setIsBusy] = useState(false);
  const [logText, setLogText] = useState('');

  if (isNodeProduction() || isStudentView) {
    return null;
  }

  async function runSeed(options) {
    if (!groupId || isBusy) {
      return;
    }

    setIsBusy(true);
    setLogText('');

    /** @type {string[]} */
    const lines = [];

    try {
      await seedCriticalValues({
        groupId,
        onLog: (line) => {
          lines.push(line);
          setLogText(lines.join('\n'));
        },
        ...options,
      });

      onComplete?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      lines.push(`Błąd: ${message}`);
      setLogText(lines.join('\n'));
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <aside
      className="temporary-dev-seed temporary-dev-seed--critical"
      aria-label="Narzędzie developerskie wartości krytycznych"
    >
      <p className="temporary-dev-seed__badge">DEV</p>
      <h2 className="temporary-dev-seed__title">Wartości krytyczne</h2>
      <p className="temporary-dev-seed__description">
        Tworzy po jednej encji każdego typu z tekstem o maksymalnej dozwolonej długości
        {' '}
        (etap
        {' '}
        {STAGE_NAME_MAX_LENGTH}
        , aktywność/nazwy
        {' '}
        {NAME_MAX_LENGTH}
        , opisy
        {' '}
        {SHORT_DESCRIPTION_MAX_LENGTH}
        , wpis
        {' '}
        {POST_TITLE_MAX_LENGTH}
        /
        {POST_CONTENT_MAX_LENGTH}
        ). Limity z
        {' '}
        <code>fieldLimits.js</code>
        .
      </p>

      <div className="temporary-dev-seed__actions">
        <button
          type="button"
          className="temporary-dev-seed__btn temporary-dev-seed__btn--primary"
          disabled={isBusy}
          onClick={() => runSeed({
            seedStages: true,
            seedActivities: true,
            seedPosts: true,
            seedRanks: true,
            seedBadges: true,
            seedShopItems: true,
          })}
        >
          {isBusy ? 'Generowanie…' : 'Wszystko'}
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: true, seedActivities: false, seedPosts: false, seedRanks: false, seedBadges: false, seedShopItems: false })}
        >
          Etapy
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: true, seedPosts: false, seedRanks: false, seedBadges: false, seedShopItems: false })}
        >
          Aktywności
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedPosts: true, seedRanks: false, seedBadges: false, seedShopItems: false })}
        >
          Wpisy
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedPosts: false, seedRanks: true, seedBadges: false, seedShopItems: false })}
        >
          Rangi
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedPosts: false, seedRanks: false, seedBadges: true, seedShopItems: false })}
        >
          Odznaki
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedPosts: false, seedRanks: false, seedBadges: false, seedShopItems: true })}
        >
          Produkty sklepu
        </button>
      </div>

      {logText ? (
        <pre className="temporary-dev-seed__log">{logText}</pre>
      ) : null}
    </aside>
  );
}
