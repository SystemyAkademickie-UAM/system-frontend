import { useEffect, useState } from 'react';
import AppSectionPage from '../../../components/page/AppSectionPage.jsx';
import Button from '../../../components/ui/Button/Button.jsx';
import { PRODUCTION_LOG_TODAY_DAY } from '../../../constants/productionLogs.constants.js';
import {
  exportEncryptedProductionLogs,
  fetchProductionLogDays,
} from '../../../services/productionLogs.api.js';
import {
  decryptProductionLogExport,
  generateLogExportKeyPair,
} from '../../../utils/decryptProductionLogExport.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './SuperadminLogsContent.css';

const TITLE__TEXTLABEL = {
  polish: 'Logi produkcyjne',
  english: 'Production logs',
};
const DESCRIPTION__TEXTLABEL = {
  polish: 'Odczyt dziennych logów (szyfrowany transport).',
  english: 'Read daily logs (encrypted in transit).',
};
const HINT__TEXTLABEL = {
  polish: 'Lista dat w strefie {timeZone}. Treść przychodzi zaszyfrowana i jest odszyfrowywana tylko w tej przeglądarce.',
  english: 'Date list in the {timeZone} zone. Content arrives encrypted and is decrypted only in this browser.',
};
const DAYLABEL__TEXTLABEL = {
  polish: 'Dzień',
  english: 'Day',
};
const TODAYOPTION__TEXTLABEL = {
  polish: 'Dzisiaj (na żywo)',
  english: 'Today (live)',
};
const LOADINGBUTTON__TEXTLABEL = {
  polish: 'Wczytywanie…',
  english: 'Loading…',
};
const SHOWBUTTON__TEXTLABEL = {
  polish: 'Pokaż logi',
  english: 'Show logs',
};
const DEFAULT_LOG_TIME_ZONE = 'Europe/Warsaw';

export default function SuperadminLogsContent() {
  const LANGUAGE = READLANGUAGECOOKIE();
  const [days, setDays] = useState([]);
  const [timeZone, setTimeZone] = useState('');
  const [selectedDay, setSelectedDay] = useState(PRODUCTION_LOG_TODAY_DAY);
  const [logText, setLogText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let cancelled = false;
    fetchProductionLogDays()
      .then((payload) => {
        if (cancelled) {
          return;
        }
        setDays(payload.days ?? []);
        setTimeZone(payload.timeZone ?? '');
      })
      .catch((error) => {
        if (!cancelled) {
          setErrorMessage(error.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleLoadLogs() {
    setIsLoading(true);
    setErrorMessage('');
    setLogText('');
    try {
      const keyPair = await generateLogExportKeyPair();
      const encrypted = await exportEncryptedProductionLogs({
        clientPublicKey: keyPair.clientPublicKey,
        day: selectedDay,
      });
      const plaintext = await decryptProductionLogExport(encrypted, keyPair.privateKey);
      setLogText(plaintext);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  }

  const resolvedTimeZone = timeZone || DEFAULT_LOG_TIME_ZONE;

  return (
    <AppSectionPage
      title={TITLE__TEXTLABEL[LANGUAGE]}
      description={DESCRIPTION__TEXTLABEL[LANGUAGE]}
    >
      <div className="superadmin-logs">
        <p className="superadmin-logs__hint">
          {HINT__TEXTLABEL[LANGUAGE].replace('{timeZone}', resolvedTimeZone)}
        </p>
        <label className="superadmin-logs__label" htmlFor="superadmin-logs-day">
          {DAYLABEL__TEXTLABEL[LANGUAGE]}
        </label>
        <select
          id="superadmin-logs-day"
          className="superadmin-logs__select"
          value={selectedDay}
          onChange={(event) => setSelectedDay(event.target.value)}
        >
          <option value={PRODUCTION_LOG_TODAY_DAY}>{TODAYOPTION__TEXTLABEL[LANGUAGE]}</option>
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
        <Button type="button" onClick={handleLoadLogs} disabled={isLoading}>
          {isLoading ? LOADINGBUTTON__TEXTLABEL[LANGUAGE] : SHOWBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
        {errorMessage ? (
          <p className="superadmin-logs__error" role="alert">
            {errorMessage}
          </p>
        ) : null}
        <pre className="superadmin-logs__output">{logText}</pre>
      </div>
    </AppSectionPage>
  );
}
