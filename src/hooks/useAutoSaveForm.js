import { useCallback, useEffect, useRef } from 'react';

/**
 * Autozapis formularza:
 * - pola tekstowe: `commitSave` na blur lub Enter (pojedyncza linia),
 * - pozostałe pola: natychmiast po zmianie `watchValues` (z pominięciem hydratacji).
 *
 * @param {Object} options
 * @param {boolean} options.ready — formularz załadowany i gotowy do zapisu
 * @param {() => string} options.getFingerprint — stabilny odcisk całego formularza
 * @param {unknown[]} [options.watchValues] — wartości poza polami tekstowymi (select, checkbox, baner…)
 * @param {() => void | Promise<void>} options.onSave
 */
export function useAutoSaveForm({
  ready,
  getFingerprint,
  watchValues = [],
  onSave,
}) {
  const fingerprintRef = useRef(null);
  const getFingerprintRef = useRef(getFingerprint);
  const onSaveRef = useRef(onSave);
  const isSavingRef = useRef(false);
  getFingerprintRef.current = getFingerprint;
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!ready) {
      fingerprintRef.current = null;
      return;
    }
    fingerprintRef.current = getFingerprintRef.current();
  }, [ready]);

  const runSaveIfDirty = useCallback(async () => {
    if (!ready || fingerprintRef.current === null || isSavingRef.current) {
      return;
    }

    const fingerprint = getFingerprintRef.current();
    if (fingerprint === fingerprintRef.current) {
      return;
    }

    isSavingRef.current = true;
    try {
      await onSaveRef.current();
      fingerprintRef.current = getFingerprintRef.current();
    } finally {
      isSavingRef.current = false;
    }
  }, [ready]);

  useEffect(() => {
    if (!ready || fingerprintRef.current === null) {
      return;
    }
    void runSaveIfDirty();
  }, [ready, runSaveIfDirty, ...watchValues]);

  const commitSave = useCallback(() => {
    void runSaveIfDirty();
  }, [runSaveIfDirty]);

  const handleTextFieldKeyDown = useCallback((event) => {
    if (event.key !== 'Enter') {
      return;
    }
    if (event.target instanceof HTMLTextAreaElement) {
      return;
    }
    event.preventDefault();
    commitSave();
    if (event.target instanceof HTMLElement) {
      event.target.blur();
    }
  }, [commitSave]);

  return {
    commitSave,
    handleTextFieldKeyDown,
  };
}
