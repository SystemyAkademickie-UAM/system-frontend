import { useEffect, useRef } from 'react';

/**
 * Uruchamia zapis po zmianie wartości formularza (z debounce).
 * Pierwszy przebieg po `enabled === true` jest pomijany — to hydratacja danych.
 */
export function useDebouncedAutoSave({
  enabled,
  values,
  onSave,
  delay = 450,
}) {
  const isReadyRef = useRef(false);
  const timeoutRef = useRef(null);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) {
      isReadyRef.current = false;
      return undefined;
    }

    if (!isReadyRef.current) {
      isReadyRef.current = true;
      return undefined;
    }

    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      void onSaveRef.current();
    }, delay);

    return () => {
      clearTimeout(timeoutRef.current);
    };
  }, [enabled, delay, ...values]);
}
