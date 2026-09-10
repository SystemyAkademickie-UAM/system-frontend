import { useState, useEffect, useMemo, useRef } from 'react';
import { Button, useToast } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import { bulkUpdateStudentLives, fetchGroupLivesConfig } from '../../../services/groupLives.api.js';
import { sanitizeWholeNumberInput } from '../../../utils/validation/rewardsNumericValidation.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './GroupSettingsHealthContentWindow.css';

const closeicon = PUBLIC_UI_ICONS.close;

const DEFAULTTITLE__TEXTLABEL = {
  polish: 'Życia',
  english: 'Lives'
};

const CLOSEARIALABEL__TEXTLABEL = {
  polish: 'Zamknij panel zarządzania',
  english: 'Close management panel'
};

const SUBTITLEPREFIX__TEXTLABEL = {
  polish: 'Panel pozwalający zarządzać liczbą szans',
  english: 'Panel allowing to manage lives count of'
};

const SUBTITLESUFFIX__TEXTLABEL = {
  polish: 'uczestników.',
  english: 'participants.'
};

const COLUMNNAME__TEXTLABEL = {
  polish: 'Imię i nazwisko',
  english: 'Full name'
};

const COLUMNNICKNAME__TEXTLABEL = {
  polish: 'Nickname',
  english: 'Nickname'
};

const COLUMNOPERATIONS__TEXTLABEL = {
  polish: 'Operacje',
  english: 'Operations'
};

const EMPTYSTATE__TEXTLABEL = {
  polish: 'Brak zapisanych uczestników w grupie.',
  english: 'No participants registered in the group.'
};

const UPDATEBUTTON__TEXTLABEL = {
  polish: 'Zaktualizuj',
  english: 'Update'
};

const BULKSETBUTTON__TEXTLABEL = {
  polish: 'Zmień',
  english: 'Set'
};

const BULKSETPREFIX__TEXTLABEL = {
  polish: 'Ustaw wszystkim:',
  english: 'Set to all:'
};

function sortStudents(students, sortField, sortReverse) {
  const sorted = [...students];

  sorted.sort((left, right) => {
    let comparison = 0;

    if (sortField === 'name') {
      const fullNameLeft = `${left.name}${left.surname}`;
      const fullNameRight = `${right.name}${right.surname}`;
      comparison = fullNameLeft.localeCompare(fullNameRight, 'pl');
    } else {
      comparison = String(left.nickname ?? '').localeCompare(String(right.nickname ?? ''), 'pl');
    }

    return sortReverse ? -comparison : comparison;
  });

  return sorted;
}

function getSortLabel(baseLabel, field, sortField, sortReverse) {
  if (sortField !== field) {
    return baseLabel;
  }

  return `${baseLabel} ${sortReverse ? '▲' : '▼'}`;
}

export default function GroupSettingsHealthContentWindow({
  popupclose,
  groupId,
  liveslabel,
  livesicon,
  liveslimit,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showSuccess, showError } = useToast();

  const [errorMessage, setErrorMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [sortField, setSortField] = useState('name');
  const [sortReverse, setSortReverse] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [bulkInputValue, setBulkInputValue] = useState('');
  const [maxLivesLimit, setMaxLivesLimit] = useState(
    liveslimit !== undefined && liveslimit !== null && liveslimit !== ''
      ? Number(liveslimit)
      : null
  );

  // Floating animations per accountId: { [accountId]: { id, text, type } }
  const [floatingEffects, setFloatingEffects] = useState({});
  const effectTimeoutRefs = useRef({});

  const titleText = liveslabel?.trim() || DEFAULTTITLE__TEXTLABEL[LANGUAGE];

  useEffect(() => {
    if (liveslimit !== undefined && liveslimit !== null && liveslimit !== '') {
      setMaxLivesLimit(Number(liveslimit));
    } else if (groupId) {
      void fetchGroupLivesConfig(groupId).then((res) => {
        if (res?.ok && res?.config?.livesMax != null) {
          setMaxLivesLimit(res.config.livesMax);
        }
      });
    }
  }, [groupId, liveslimit]);

  const triggerFloatingEffect = (accountId, deltaText, type) => {
    const effectId = Date.now() + Math.random();
    setFloatingEffects((prev) => ({
      ...prev,
      [accountId]: { id: effectId, text: deltaText, type },
    }));

    if (effectTimeoutRefs.current[accountId]) {
      clearTimeout(effectTimeoutRefs.current[accountId]);
    }

    effectTimeoutRefs.current[accountId] = setTimeout(() => {
      setFloatingEffects((prev) => {
        const next = { ...prev };
        if (next[accountId]?.id === effectId) {
          delete next[accountId];
        }
        return next;
      });
    }, 650);
  };

  async function onFetchStudents() {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/students`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });

      const responsetext = await response.text();
      let data = [];

      try {
        data = JSON.parse(responsetext);
      } catch {
        data = [];
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      setStudents(data.map((entry) => {
        const initialLives = Number(entry.lives ?? 0);
        return {
          accountId: entry.accountId,
          name: entry.name,
          surname: entry.surname,
          nickname: entry.nickname,
          initialLives,
          lives: initialLives,
        };
      }));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  useEffect(() => {
    void onFetchStudents();
    return () => {
      Object.values(effectTimeoutRefs.current).forEach(clearTimeout);
    };
  }, [groupId]);

  // Pojedyncza zmiana: +1 / -1
  const handleStudentStep = (accountId, direction) => {
    let changed = false;

    setStudents((prev) => prev.map((s) => {
      if (s.accountId !== accountId) return s;

      if (direction === 'increment') {
        if (maxLivesLimit != null && s.lives >= maxLivesLimit) {
          return s;
        }
        changed = true;
        const nextLives = maxLivesLimit != null ? Math.min(maxLivesLimit, s.lives + 1) : s.lives + 1;
        return {
          ...s,
          lives: nextLives,
        };
      }

      if (s.lives <= 0) {
        return s;
      }
      changed = true;
      return {
        ...s,
        lives: Math.max(0, s.lives - 1),
      };
    }));

    if (changed) {
      triggerFloatingEffect(
        accountId,
        direction === 'increment' ? '+1' : '-1',
        direction === 'increment' ? 'heal' : 'damage'
      );
    }
  };

  // Bezpośrednie wpisanie wartości samemu
  const handleStudentLivesDirectChange = (accountId, rawValue) => {
    const sanitized = sanitizeWholeNumberInput(rawValue);
    let parsed = sanitized === '' ? 0 : Math.max(0, Number(sanitized));

    if (maxLivesLimit != null && parsed > maxLivesLimit) {
      parsed = maxLivesLimit;
    }

    setStudents((prev) => prev.map((s) => {
      if (s.accountId !== accountId) return s;
      return {
        ...s,
        lives: parsed,
      };
    }));
  };

  // Masowa operacja +1 / -1 na KAŻDYM uczestniku
  const handleBulkStepAll = (direction) => {
    setStudents((prev) => prev.map((s) => {
      let nextLives = s.lives;

      if (direction === 'increment') {
        if (maxLivesLimit != null && s.lives >= maxLivesLimit) {
          return s;
        }
        nextLives = maxLivesLimit != null ? Math.min(maxLivesLimit, s.lives + 1) : s.lives + 1;
      } else {
        if (s.lives <= 0) {
          return s;
        }
        nextLives = Math.max(0, s.lives - 1);
      }

      triggerFloatingEffect(
        s.accountId,
        direction === 'increment' ? '+1' : '-1',
        direction === 'increment' ? 'heal' : 'damage'
      );

      return {
        ...s,
        lives: nextLives,
      };
    }));
  };

  // Zmiana wartości w polu masowym
  const handleBulkInputChange = (rawValue) => {
    const sanitized = sanitizeWholeNumberInput(rawValue);
    if (sanitized === '') {
      setBulkInputValue('');
      return;
    }

    let parsed = Number(sanitized);
    if (maxLivesLimit != null && parsed > maxLivesLimit) {
      parsed = maxLivesLimit;
    }
    setBulkInputValue(String(parsed));
  };

  // Masowe ustawienie konkretnej wartości KAŻDEMU uczestnikowi
  const handleBulkSetAll = () => {
    if (bulkInputValue.trim() === '') return;
    let targetVal = Math.max(0, Number(bulkInputValue) || 0);

    if (maxLivesLimit != null && targetVal > maxLivesLimit) {
      targetVal = maxLivesLimit;
    }

    setStudents((prev) => prev.map((s) => {
      const diff = targetVal - s.lives;
      if (diff !== 0) {
        triggerFloatingEffect(
          s.accountId,
          diff > 0 ? `+${diff}` : String(diff),
          diff > 0 ? 'heal' : 'damage'
        );
      }
      return {
        ...s,
        lives: targetVal,
      };
    }));
    setBulkInputValue('');
  };

  // Zapisanie zmian (Zaktualizuj)
  const handleSaveAll = async () => {
    setErrorMessage('');
    setIsSaving(true);

    const changedStudents = students
      .map((s) => ({
        accountId: s.accountId,
        delta: s.lives - s.initialLives,
      }))
      .filter((s) => s.delta !== 0);

    if (changedStudents.length === 0) {
      showSuccess('Brak zmian do zapisania.');
      setIsSaving(false);
      return;
    }

    try {
      const result = await bulkUpdateStudentLives(groupId, changedStudents);
      if (!result.ok) {
        throw new Error(result.error ?? 'Nie udało się zaktualizować żyć studentów.');
      }

      showSuccess('Życia studentów zostały zaktualizowane.');
      // Uaktualniamy initialLives na obecne
      setStudents((prev) => prev.map((s) => ({
        ...s,
        initialLives: s.lives,
      })));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Błąd podczas aktualizacji żyć.';
      setErrorMessage(msg);
      showError(msg);
    } finally {
      setIsSaving(false);
    }
  };

  function sortBy(field) {
    if (sortField === field) {
      setSortReverse((current) => !current);
      return;
    }
    setSortField(field);
    setSortReverse(false);
  }

  const displayStudents = useMemo(
    () => sortStudents(students, sortField, sortReverse),
    [students, sortField, sortReverse],
  );

  return (
    <div className="lives-manage-overlay" onClick={popupclose} role="presentation">
      <div
        className="lives-manage-dialog"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="lives-manage-title"
      >
        <button
          type="button"
          className="lives-manage-dialog__close"
          onClick={popupclose}
          aria-label={CLOSEARIALABEL__TEXTLABEL[LANGUAGE]}
        >
          <img src={closeicon} alt="" className="lives-manage-dialog__close-icon" />
        </button>

        <header className="lives-manage-dialog__header">
          <h2 id="lives-manage-title" className="lives-manage-dialog__title">
            <span className="lives-manage-dialog__title-icon" aria-hidden="true">{livesicon}</span>
            <span className="lives-manage-dialog__title-text">{titleText}</span>
          </h2>
          <p className="lives-manage-dialog__subtitle">
            {SUBTITLEPREFIX__TEXTLABEL[LANGUAGE]}
            {' '}
            {titleText.toLowerCase()}
            {' '}
            {SUBTITLESUFFIX__TEXTLABEL[LANGUAGE]}
          </p>
        </header>

        {errorMessage ? (
          <p className="lives-manage-dialog__error" role="alert">{errorMessage}</p>
        ) : null}

        <div className="lives-manage-dialog__body">
          <div className="lives-manage-table">
            <div className="lives-manage-table__grid lives-manage-table__head">
              <div className="lives-manage-table__head-cell">
                <button
                  type="button"
                  className={[
                    'lives-manage-sort-btn',
                    sortField === 'name' ? 'lives-manage-sort-btn--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => sortBy('name')}
                >
                  {getSortLabel(COLUMNNAME__TEXTLABEL[LANGUAGE], 'name', sortField, sortReverse)}
                </button>
              </div>
              <div className="lives-manage-table__head-cell lives-manage-table__head-cell--nickname">
                <button
                  type="button"
                  className={[
                    'lives-manage-sort-btn',
                    sortField === 'nickname' ? 'lives-manage-sort-btn--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => sortBy('nickname')}
                >
                  {getSortLabel(COLUMNNICKNAME__TEXTLABEL[LANGUAGE], 'nickname', sortField, sortReverse)}
                </button>
              </div>
              <div className="lives-manage-table__head-cell lives-manage-table__head-cell--actions">
                {COLUMNOPERATIONS__TEXTLABEL[LANGUAGE]}
              </div>
            </div>

            {displayStudents.length === 0 ? (
              <p className="lives-manage-table__empty">{EMPTYSTATE__TEXTLABEL[LANGUAGE]}</p>
            ) : (
              displayStudents.map((student) => {
                const delta = student.lives - student.initialLives;
                const activeEffect = floatingEffects[student.accountId];

                return (
                  <div
                    key={`student-${student.accountId}`}
                    className="lives-manage-table__grid lives-manage-table__row"
                  >
                    <div className="lives-manage-table__cell">
                      <span className="lives-manage-table__cell-text">
                        {student.name} {student.surname}
                      </span>
                    </div>

                    <div className="lives-manage-table__cell lives-manage-table__cell--nickname">
                      <span className="lives-manage-table__cell-text">{student.nickname || '—'}</span>
                    </div>

                    <div className="lives-manage-table__actions">
                      <div className="lives-manage-table__controls">
                        {/* Przycisk Minus — powiększony czerwony SVG */}
                        <button
                          type="button"
                          className="lives-manage-svg-btn lives-manage-svg-btn--decrease"
                          aria-label={`Odejmij życie: ${student.name} ${student.surname}`}
                          onClick={() => handleStudentStep(student.accountId, 'decrement')}
                          disabled={student.lives <= 0}
                        >
                          <svg className="lives-manage-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        </button>

                        {/* Zaokrąglony kwadrat z bezpośrednią edycją liczby żyć */}
                        <div className="lives-manage-value-box-wrapper">
                          {activeEffect && (
                            <span className={`lives-manage-floating-text lives-manage-floating-text--${activeEffect.type}`}>
                              {activeEffect.text}
                            </span>
                          )}
                          <input
                            className="lives-manage-value-box"
                            value={student.lives}
                            inputMode="numeric"
                            onChange={(e) => handleStudentLivesDirectChange(student.accountId, e.target.value)}
                            aria-label={`Liczba żyć dla ${student.name} ${student.surname}`}
                          />
                        </div>

                        {/* Przycisk Plus — powiększony zielony SVG */}
                        <button
                          type="button"
                          className="lives-manage-svg-btn lives-manage-svg-btn--increase"
                          aria-label={`Dodaj życie: ${student.name} ${student.surname}`}
                          onClick={() => handleStudentStep(student.accountId, 'increment')}
                          disabled={maxLivesLimit != null && student.lives >= maxLivesLimit}
                        >
                          <svg className="lives-manage-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <line x1="12" y1="5" x2="12" y2="19" strokeWidth="3" strokeLinecap="round" />
                            <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>

                      {/* Liczba zmiany (delta) bez kółka */}
                      <span
                        className={[
                          'lives-manage-delta-text',
                          delta > 0 ? 'lives-manage-delta-text--positive' : '',
                          delta < 0 ? 'lives-manage-delta-text--negative' : '',
                          delta === 0 ? 'lives-manage-delta-text--neutral' : '',
                        ].filter(Boolean).join(' ')}
                      >
                        {delta > 0 ? `+${delta}` : String(delta)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Stopka pop-upa */}
        <footer className="lives-manage-dialog__footer">
          <div className="lives-manage-footer-container">
            {/* Opcja "Ustaw wszystkim: [input] [Zmień]" po lewej */}
            <div className="lives-manage-footer-left">
              <div className="lives-manage-bulk-input-group">
                <span className="lives-manage-bulk-label">{BULKSETPREFIX__TEXTLABEL[LANGUAGE]}</span>
                <input
                  className="lives-manage-bulk-input"
                  placeholder="0"
                  inputMode="numeric"
                  value={bulkInputValue}
                  onChange={(e) => handleBulkInputChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleBulkSetAll()}
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleBulkSetAll}
                  disabled={bulkInputValue.trim() === ''}
                >
                  {BULKSETBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </div>

            {/* Prawa strona: [- +] oddzielone tabem od [Zaktualizuj] */}
            <div className="lives-manage-footer-right">
              <div className="lives-manage-bulk-step-group">
                <button
                  type="button"
                  className="lives-manage-svg-btn lives-manage-svg-btn--decrease"
                  title="Odejmij 1 życie wszystkim"
                  onClick={() => handleBulkStepAll('decrement')}
                  disabled={displayStudents.length > 0 && displayStudents.every((s) => s.lives <= 0)}
                >
                  <svg className="lives-manage-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </button>

                <button
                  type="button"
                  className="lives-manage-svg-btn lives-manage-svg-btn--increase"
                  title="Dodaj 1 życie wszystkim"
                  onClick={() => handleBulkStepAll('increment')}
                  disabled={maxLivesLimit != null && displayStudents.length > 0 && displayStudents.every((s) => s.lives >= maxLivesLimit)}
                >
                  <svg className="lives-manage-svg-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <line x1="12" y1="5" x2="12" y2="19" strokeWidth="3" strokeLinecap="round" />
                    <line x1="5" y1="12" x2="19" y2="12" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              <Button
                type="button"
                variant="primary"
                size="md"
                className="lives-manage-update-btn"
                onClick={handleSaveAll}
                disabled={isSaving}
              >
                {UPDATEBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
