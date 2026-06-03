import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { isNodeProduction } from '../../../utils/nodeEnv.js';
import { seedGroupData } from './temporarySeedGroupData.js';
import './TemporaryDevSeedPanel.css';

const SEED_COUNT = 10;

/**
 * TYMCZASOWY panel dev — usuń po wdrożeniu wygodniejszego seedowania danych testowych.
 *
 * @param {Object} props
 * @param {boolean} props.isStudentView
 * @param {() => void} [props.onComplete]
 */
export default function TemporaryDevSeedPanel({ isStudentView, onComplete }) {
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
      await seedGroupData({
        groupId,
        count: SEED_COUNT,
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
      className="temporary-dev-seed"
      aria-label="Tymczasowe narzędzie developerskie"
    >
      <p className="temporary-dev-seed__badge">TYMCZASOWE — do usunięcia</p>
      <h2 className="temporary-dev-seed__title">Dev: losowe dane testowe</h2>
      <p className="temporary-dev-seed__description">
        Szybkie wypełnienie kursu po
        {' '}
        {SEED_COUNT}
        {' '}
        elementów każdego typu. Panel zniknie po usunięciu tego kodu.
      </p>

      <div className="temporary-dev-seed__actions">
        <button
          type="button"
          className="temporary-dev-seed__btn temporary-dev-seed__btn--primary"
          disabled={isBusy}
          onClick={() => runSeed({
            seedStages: true,
            seedActivities: true,
            seedRanks: true,
            seedBadges: true,
          })}
        >
          {isBusy ? 'Generowanie…' : `Wszystko (×${SEED_COUNT})`}
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: true, seedActivities: false, seedRanks: false, seedBadges: false })}
        >
          Etapy
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: true, seedRanks: false, seedBadges: false })}
        >
          Aktywności
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedRanks: true, seedBadges: false })}
        >
          Rangi
        </button>
        <button
          type="button"
          className="temporary-dev-seed__btn"
          disabled={isBusy}
          onClick={() => runSeed({ seedStages: false, seedActivities: false, seedRanks: false, seedBadges: true })}
        >
          Odznaki
        </button>
      </div>

      {logText ? (
        <pre className="temporary-dev-seed__log">{logText}</pre>
      ) : null}
    </aside>
  );
}
