import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'maq.leader.showNickname';

function readShowNickname() {
  if (typeof window === 'undefined') {
    return true;
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return true;
  }
  return stored === 'true';
}

export function setLeaderShowNickname(enabled) {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, enabled ? 'true' : 'false');
  window.dispatchEvent(new CustomEvent('maq:leader-display-preferences'));
}

/**
 * Preferencja wyświetlania ksywki prowadzącego.
 * Źródło prawdy: backend (`profile.showNickname`); localStorage synchronizuje UI między kartami.
 *
 * @param {boolean | undefined} profileShowNickname — z GET /profile
 */
export function useLeaderDisplayPreferences(profileShowNickname) {
  const [showNickname, setShowNicknameState] = useState(readShowNickname);

  useEffect(() => {
    if (profileShowNickname === undefined) {
      return;
    }
    setLeaderShowNickname(profileShowNickname);
    setShowNicknameState(profileShowNickname);
  }, [profileShowNickname]);

  useEffect(() => {
    const sync = () => setShowNicknameState(readShowNickname());
    window.addEventListener('maq:leader-display-preferences', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('maq:leader-display-preferences', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const setShowNickname = useCallback((enabled) => {
    setLeaderShowNickname(enabled);
    setShowNicknameState(enabled);
  }, []);

  return { showNickname, setShowNickname };
}
