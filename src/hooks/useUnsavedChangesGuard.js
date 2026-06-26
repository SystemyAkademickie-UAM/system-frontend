import { useBlocker } from 'react-router-dom';
import { useCallback, useEffect, useState } from 'react';

/**
 * Blokuje nawigację SPA i zamykanie karty przy niezapisanych zmianach.
 *
 * @param {Object} options
 * @param {boolean} options.when — czy formularz ma niezapisane zmiany
 * @param {() => boolean | Promise<boolean>} [options.onSave] — zapis przed opuszczeniem; `true` = kontynuuj nawigację
 */
export function useUnsavedChangesGuard({ when, onSave }) {
  const blocker = useBlocker(when);
  const [isPromptOpen, setIsPromptOpen] = useState(false);

  useEffect(() => {
    if (blocker.state === 'blocked') {
      setIsPromptOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (!when) {
      return undefined;
    }

    const handleBeforeUnload = (event) => {
      event.preventDefault();
      event.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [when]);

  const dismissPrompt = useCallback(() => {
    setIsPromptOpen(false);
    if (blocker.state === 'blocked') {
      blocker.reset();
    }
  }, [blocker]);

  const discardChanges = useCallback(() => {
    setIsPromptOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker]);

  const saveAndContinue = useCallback(async () => {
    if (!onSave) {
      discardChanges();
      return;
    }

    const saved = await onSave();
    if (!saved) {
      setIsPromptOpen(false);
      if (blocker.state === 'blocked') {
        blocker.reset();
      }
      return;
    }

    setIsPromptOpen(false);
    if (blocker.state === 'blocked') {
      blocker.proceed();
    }
  }, [blocker, discardChanges, onSave]);

  return {
    isPromptOpen: isPromptOpen && blocker.state === 'blocked',
    dismissPrompt,
    discardChanges,
    saveAndContinue,
  };
}
