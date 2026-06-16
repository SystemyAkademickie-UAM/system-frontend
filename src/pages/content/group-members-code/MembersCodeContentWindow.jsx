import { useEffect, useMemo, useState } from 'react';

import { Modal, useToast, CharacterLimitedField } from '../../../components/ui/index.js';
import { ENROLLMENT_ENTRY_CODE_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import AssetSvg from '../../../components/ui/AssetSvg/AssetSvg.jsx';
import { SVG_ICONS } from '../../../constants/svgIcons.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import {
  clampExpireDateTime,
  EXPIRE_IN_PAST_MESSAGE,
  formatLocalDateInput,
  formatLocalTimeInput,
  isExpireDateTimeInPast,
} from './enrollmentCodeExpiry.js';
import './MembersCodeContent.css';

function buildExpiresAt(hasExpires, expireDate, expireTime) {
  if (hasExpires === 0) {
    return '';
  }

  if (expireDate === '') {
    return '';
  }

  return parseLocalExpireDateTime(expireDate, expireTime).toISOString();
}

function getDefaultExpireValues() {
  const now = new Date();
  return {
    date: formatLocalDateInput(now),
    time: formatLocalTimeInput(now),
  };
}

function ModalOptionCheckbox({ id, checked, onChange, ariaLabel }) {
  return (
    <label className="members-code-modal__checkbox-label" htmlFor={id}>
      <input
        id={id}
        type="checkbox"
        className="members-code-modal__checkbox-input"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        aria-label={ariaLabel}
      />
      <span
        className={[
          'members-code-modal__checkbox',
          checked ? 'members-code-modal__checkbox--checked' : '',
        ].filter(Boolean).join(' ')}
        aria-hidden="true"
      >
        {checked ? (
          <AssetSvg name={SVG_ICONS.status.check} width={18} height={18} alt="" />
        ) : null}
      </span>
    </label>
  );
}

export default function MembersCodeContentWindow({ popupclose, groupId, editCodeId, onsaved }) {  const [errorMessage, setErrorMessage] = useState('');
  const { showSuccess } = useToast();

  const [inputCode, setInputCode] = useState('');
  const [hasExpires, setHasExpires] = useState(0);
  const [expireDate, setExpireDate] = useState(() => getDefaultExpireValues().date);
  const [expireTime, setExpireTime] = useState(() => getDefaultExpireValues().time);
  const [hasMaxUses, setHasMaxUses] = useState(0);
  const [maxUsesValue, setMaxUsesValue] = useState('10');
  const [isActive, setIsActive] = useState(1);
  const [displayCode, setDisplayCode] = useState('');

  const isEditMode = editCodeId !== 0;

  const minExpireDate = useMemo(() => formatLocalDateInput(new Date()), [hasExpires, expireDate, expireTime]);
  const minExpireTime = useMemo(() => {
    if (expireDate !== minExpireDate) {
      return '00:00';
    }
    return formatLocalTimeInput(new Date());
  }, [expireDate, minExpireDate]);

  const expireValidationError = useMemo(() => {
    if (hasExpires !== 1 || !expireDate) {
      return '';
    }

    return isExpireDateTimeInPast(expireDate, expireTime) ? EXPIRE_IN_PAST_MESSAGE : '';
  }, [hasExpires, expireDate, expireTime]);

  function clearData() {
    const defaults = getDefaultExpireValues();
    setErrorMessage('');
    setInputCode('');
    setHasExpires(0);
    setExpireDate(defaults.date);
    setExpireTime(defaults.time);
    setHasMaxUses(0);
    setMaxUsesValue('10');
    setIsActive(1);
    setDisplayCode('');
  }

  function closeWindow() {
    clearData();
    popupclose?.();
  }

  function enableExpiration() {
    const now = new Date();
    setHasExpires(1);
    const clamped = clampExpireDateTime(
      expireDate || formatLocalDateInput(now),
      expireTime || formatLocalTimeInput(now),
    );
    setExpireDate(clamped.date);
    setExpireTime(clamped.time);
    setErrorMessage('');
  }

  function disableExpiration() {
    setHasExpires(0);
    setErrorMessage('');
  }

  function handleExpireDateChange(nextDate) {
    const clamped = clampExpireDateTime(nextDate, expireTime);
    setExpireDate(clamped.date);
    setExpireTime(clamped.time);
    setErrorMessage('');
  }

  function handleExpireTimeChange(nextTime) {
    const clamped = clampExpireDateTime(expireDate, nextTime);
    setExpireDate(clamped.date);
    setExpireTime(clamped.time);
    setErrorMessage('');
  }

  function validateExpiration() {
    if (hasExpires !== 1) {
      return true;
    }

    if (!expireDate) {
      setErrorMessage('Wybierz datę wygaśnięcia kodu.');
      return false;
    }

    if (isExpireDateTimeInPast(expireDate, expireTime)) {
      setErrorMessage(EXPIRE_IN_PAST_MESSAGE);
      return false;
    }

    return true;
  }

  function fillFromReceivedData(receivedData) {
    setDisplayCode(receivedData.code);

    if (receivedData.expiresAt != null && receivedData.expiresAt !== '') {
      setHasExpires(1);
      const date = new Date(receivedData.expiresAt);
      setExpireDate(formatLocalDateInput(date));
      setExpireTime(formatLocalTimeInput(date));
    } else {
      setHasExpires(0);
      const defaults = getDefaultExpireValues();
      setExpireDate(defaults.date);
      setExpireTime(defaults.time);
    }

    if (receivedData.maxUses != null) {
      setHasMaxUses(1);
      setMaxUsesValue(String(receivedData.maxUses));
    } else {
      setHasMaxUses(0);
      setMaxUsesValue('10');
    }

    setIsActive(receivedData.isActive === true ? 1 : 0);
  }

  async function fetchOneCode() {
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/enrollment-codes/${editCodeId}`;

      const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
      });

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error('Nie udało się odczytać kodu.');
      }

      if (!response.ok) {
        throw new Error(`Nie udało się pobrać kodu (status ${response.status}).`);
      }

      fillFromReceivedData(data);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  async function createCode() {
    setErrorMessage('');

    if (!validateExpiration()) {
      return;
    }

    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/enrollment-codes`;
      const body = {};

      if (inputCode.trim() !== '') {
        body.code = inputCode.trim();
      }

      if (hasExpires === 1) {
        const expiresAtIso = buildExpiresAt(hasExpires, expireDate, expireTime);
        if (expiresAtIso !== '') {
          body.expiresAt = expiresAtIso;
        }
      }

      if (hasMaxUses === 1) {
        body.maxUses = Number(maxUsesValue);
      }

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify(body),
      });

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage(`Nie udało się wygenerować kodu (status ${response.status}).`);
        return;
      }

      closeWindow();
      onsaved?.();
      showSuccess('Kod został utworzony.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  async function updateCode() {
    setErrorMessage('');

    if (!validateExpiration()) {
      return;
    }

    try {
      const base = getApiBaseUrl();
      const browserId = getOrCreateBrowserId();
      const url = `${base}/groups/${groupId}/enrollment-codes/${editCodeId}`;
      const body = {};

      if (hasExpires === 1) {
        const expiresAtIso = buildExpiresAt(hasExpires, expireDate, expireTime);
        if (expiresAtIso !== '') {
          body.expiresAt = expiresAtIso;
        }
      } else {
        body.expiresAt = null;
      }

      if (hasMaxUses === 1) {
        body.maxUses = Number(maxUsesValue);
      } else {
        body.maxUses = null;
      }

      body.isActive = isActive === 1;

      const response = await fetch(url, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify(body),
      });

      if (response.status < 200 || response.status >= 300) {
        setErrorMessage(`Nie udało się zmienić kodu (status ${response.status}).`);
        return;
      }

      closeWindow();
      onsaved?.();
      showSuccess('Kod został zmieniony.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  function handleSaveClick() {
    if (isEditMode) {
      updateCode();
    } else {
      createCode();
    }
  }

  useEffect(() => {
    if (editCodeId === 0) {
      clearData();
    } else {
      fetchOneCode();
    }
  }, [editCodeId]);

  const saveDisabled = Boolean(expireValidationError);

  return (
    <Modal
      isOpen
      onClose={closeWindow}
      title={isEditMode ? 'Edytuj kod dostępu' : 'Generuj nowy kod dostępu'}
      onConfirm={handleSaveClick}
      confirmLabel={isEditMode ? 'Zmień' : 'Generuj'}
      confirmDisabled={saveDisabled}
      size="md"
      className="members-code-modal"
    >
      <div className="members-code-modal__form">
        {errorMessage ? (
          <p className="members-code-modal__error" role="alert">{errorMessage}</p>
        ) : null}

        {isEditMode ? (
          <div className="members-code-modal__field">
            <span className="members-code-modal__label">Kod</span>
            <span className="members-code-modal__code-value">{displayCode}</span>
          </div>
        ) : (
          <div className="members-code-modal__field">
            <label htmlFor="members-code-custom" className="members-code-modal__label">
              Własny kod (opcjonalnie)
            </label>
            <CharacterLimitedField value={inputCode} maxLength={ENROLLMENT_ENTRY_CODE_MAX_LENGTH}>
              <input
                id="members-code-custom"
                type="text"
                className="members-code-modal__input"
                value={inputCode}
                onChange={(event) => setInputCode(
                  event.target.value.slice(0, ENROLLMENT_ENTRY_CODE_MAX_LENGTH),
                )}
                placeholder="losowy kod"
                maxLength={ENROLLMENT_ENTRY_CODE_MAX_LENGTH}
              />
            </CharacterLimitedField>
          </div>
        )}

        <div className="members-code-modal__field">
          <span className="members-code-modal__label">Data wygaśnięcia</span>
          <div className="members-code-modal__option-row">
            <input
              type="date"
              className="members-code-modal__input members-code-modal__input--date"
              value={expireDate}
              min={minExpireDate}
              disabled={hasExpires !== 1}
              onChange={(event) => handleExpireDateChange(event.target.value)}
              aria-label="Data wygaśnięcia kodu"
            />
            <input
              type="time"
              className="members-code-modal__input members-code-modal__input--time"
              value={expireTime}
              min={hasExpires === 1 && expireDate === minExpireDate ? minExpireTime : undefined}
              disabled={hasExpires !== 1}
              onChange={(event) => handleExpireTimeChange(event.target.value)}
              aria-label="Godzina wygaśnięcia kodu"
            />
            <ModalOptionCheckbox
              id="members-code-expires-enabled"
              checked={hasExpires === 1}
              onChange={(checked) => (checked ? enableExpiration() : disableExpiration())}
              ariaLabel="Włącz datę wygaśnięcia kodu"
            />
          </div>
          {expireValidationError ? (
            <p className="members-code-modal__field-error" role="alert">{expireValidationError}</p>
          ) : null}
        </div>

        <div className="members-code-modal__field">
          <span className="members-code-modal__label">Limit użyć</span>
          <div className="members-code-modal__option-row">
            <input
              type="number"
              min="1"
              className="members-code-modal__input members-code-modal__input--number"
              value={maxUsesValue}
              disabled={hasMaxUses !== 1}
              onChange={(event) => setMaxUsesValue(event.target.value)}
              aria-label="Limit użyć kodu"
            />
            <ModalOptionCheckbox
              id="members-code-max-uses-enabled"
              checked={hasMaxUses === 1}
              onChange={(checked) => {
                setHasMaxUses(checked ? 1 : 0);
                setErrorMessage('');
              }}
              ariaLabel="Włącz limit użyć kodu"
            />
          </div>
        </div>

        {isEditMode ? (
          <div className="members-code-modal__field members-code-modal__field--inline">
            <span className="members-code-modal__label">Kod aktywny</span>
            <ModalOptionCheckbox
              id="members-code-active"
              checked={isActive === 1}
              onChange={(checked) => setIsActive(checked ? 1 : 0)}
              ariaLabel="Kod aktywny"
            />
          </div>
        ) : null}
      </div>
    </Modal>
  );
}
