import { useEffect, useMemo, useState } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { PUBLIC_UI_ICONS } from '../../../constants/publicUiIcons.js';
import './GroupSettingsHealthContentWindow.css';

const closeicon = PUBLIC_UI_ICONS.close;
const decreaseicon = PUBLIC_UI_ICONS.decrease;
const increaseicon = PUBLIC_UI_ICONS.increase;

function sortStudents(students, sortField, sortReverse) {
  const sorted = [...students];

  sorted.sort((left, right) => {
    let comparison = 0;

    if (sortField === 'nr') {
      comparison = left.accountId - right.accountId;
    } else if (sortField === 'name') {
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
}) {
  const [errorMessage, setErrorMessage] = useState('');
  const [students, setStudents] = useState([]);
  const [sortField, setSortField] = useState('nr');
  const [sortReverse, setSortReverse] = useState(false);

  const titleText = liveslabel?.trim() || 'Życia';

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

      setStudents(data.map((entry) => ({
        accountId: entry.accountId,
        name: entry.name,
        surname: entry.surname,
        nickname: entry.nickname,
        lives: entry.lives ?? 0,
        difference: 0,
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  async function changeLives(accountId, direction) {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const action = direction === 'increment' ? 'increment' : 'decrement';
      const url = `${base}/groups/${groupId}/students/${accountId}/lives/${action}`;

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
        body: JSON.stringify({}),
      });

      const responsetext = await response.text();
      let data = null;

      try {
        data = JSON.parse(responsetext);
      } catch {
        data = null;
      }

      const livesValue = data?.lives;

      setStudents((prevStudents) => prevStudents.map((student) => (
        student.accountId === accountId
          ? {
            ...student,
            lives: livesValue ?? student.lives,
            difference: student.difference + (direction === 'increment' ? 1 : -1),
          }
          : student
      )));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  function hideLivesPopup() {
    popupclose?.();
  }

  function sortBy(field) {
    if (sortField === field) {
      setSortReverse((current) => !current);
      return;
    }

    setSortField(field);
    setSortReverse(false);
  }

  useEffect(() => {
    void onFetchStudents();
  }, [groupId]);

  const displayStudents = useMemo(
    () => sortStudents(students, sortField, sortReverse),
    [students, sortField, sortReverse],
  );

  return (
    <div
      className="lives-manage-overlay"
      onClick={hideLivesPopup}
      role="presentation"
    >
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
          onClick={hideLivesPopup}
          aria-label="Zamknij panel zarządzania"
        >
          <img src={closeicon} alt="" className="lives-manage-dialog__close-icon" />
        </button>

        <header className="lives-manage-dialog__header">
          <h2 id="lives-manage-title" className="lives-manage-dialog__title">
            <span className="lives-manage-dialog__title-icon" aria-hidden="true">{livesicon}</span>
            <span className="lives-manage-dialog__title-text">{titleText}</span>
          </h2>
          <p className="lives-manage-dialog__subtitle">
            Panel pozwalający zwiększać i zmniejszać
            {' '}
            {titleText.toLowerCase()}
            {' '}
            uczestników.
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
                    sortField === 'nr' ? 'lives-manage-sort-btn--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => sortBy('nr')}
                >
                  {getSortLabel('Nr', 'nr', sortField, sortReverse)}
                </button>
              </div>
              <div className="lives-manage-table__head-cell">
                <button
                  type="button"
                  className={[
                    'lives-manage-sort-btn',
                    sortField === 'name' ? 'lives-manage-sort-btn--active' : '',
                  ].filter(Boolean).join(' ')}
                  onClick={() => sortBy('name')}
                >
                  {getSortLabel('Imię i nazwisko', 'name', sortField, sortReverse)}
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
                  {getSortLabel('Nickname', 'nickname', sortField, sortReverse)}
                </button>
              </div>
              <div className="lives-manage-table__head-cell lives-manage-table__head-cell--actions">
                Operacje
              </div>
            </div>

            {displayStudents.length === 0 ? (
              <p className="lives-manage-table__empty">Brak zapisanych uczestników w grupie.</p>
            ) : (
              displayStudents.map((student) => (
                <div
                  key={`student-${student.accountId}`}
                  className="lives-manage-table__grid lives-manage-table__row"
                >
                  <div className="lives-manage-table__cell lives-manage-table__cell--id">
                    {student.accountId}
                  </div>
                  <div className="lives-manage-table__cell">
                    <span className="lives-manage-table__cell-text">
                      {student.name}
                      {' '}
                      {student.surname}
                    </span>
                  </div>
                  <div className="lives-manage-table__cell lives-manage-table__cell--nickname">
                    <span className="lives-manage-table__cell-text">{student.nickname || '—'}</span>
                  </div>
                  <div className="lives-manage-table__actions">
                    <button
                      type="button"
                      className="lives-manage-action-btn lives-manage-action-btn--decrease"
                      aria-label={`Zmniejsz liczbę: ${student.name} ${student.surname}`}
                      onClick={() => changeLives(student.accountId, 'decrement')}
                    >
                      <img src={decreaseicon} alt="" className="lives-manage-action-btn__icon" />
                    </button>
                    <span className="lives-manage-stat" aria-label={`Aktualna liczba: ${student.lives}`}>
                      {student.lives}
                    </span>
                    <button
                      type="button"
                      className="lives-manage-action-btn lives-manage-action-btn--increase"
                      aria-label={`Zwiększ liczbę: ${student.name} ${student.surname}`}
                      onClick={() => changeLives(student.accountId, 'increment')}
                    >
                      <img src={increaseicon} alt="" className="lives-manage-action-btn__icon" />
                    </button>
                    <span
                      className={[
                        'lives-manage-stat',
                        student.difference > 0 ? 'lives-manage-stat--delta-positive' : '',
                        student.difference < 0 ? 'lives-manage-stat--delta-negative' : '',
                        student.difference === 0 ? 'lives-manage-stat--delta-empty' : '',
                      ].filter(Boolean).join(' ')}
                      aria-label={
                        student.difference === 0
                          ? 'Brak zmian w tej sesji'
                          : `Zmiana w tej sesji: ${student.difference > 0 ? '+' : ''}${student.difference}`
                      }
                    >
                      {student.difference > 0
                        ? `+${student.difference}`
                        : student.difference < 0
                          ? String(student.difference)
                          : '0'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <footer className="lives-manage-dialog__footer">
          <p className="lives-manage-dialog__footnote">
            Kolumna po prawej pokazuje bieżącą wartość oraz zmianę wprowadzoną w tej sesji (+ / −).
          </p>
        </footer>
      </div>
    </div>
  );
}
