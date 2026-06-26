import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_LIVES_LABEL, DEFAULT_LIVES_SYMBOL } from '../constants/lives.constants.js';
import { fetchGroupLivesConfig } from '../services/groupLives.api.js';
import { GROUP_LIVES_INVALIDATED } from '../services/groupLivesEvents.js';
import { subscribeGroupScopedEvent } from '../services/studentProfileEvents.js';

const defaultValue = {
  symbol: DEFAULT_LIVES_SYMBOL,
  label: DEFAULT_LIVES_LABEL,
  livesEnabled: false,
  livesMax: null,
  livesShopEnabled: false,
  isLoading: false,
  refetch: async () => {},
};

const GroupLivesContext = createContext(defaultValue);

/**
 * Udostępnia emoji i etykietę systemu żyć grupy w drzewie komponentów.
 */
export function GroupLivesProvider({
  symbol,
  label,
  livesEnabled,
  livesMax,
  livesShopEnabled,
  isLoading,
  refetch,
  children,
}) {
  const value = useMemo(() => ({
    symbol: symbol ?? DEFAULT_LIVES_SYMBOL,
    label: label ?? DEFAULT_LIVES_LABEL,
    livesEnabled: Boolean(livesEnabled),
    livesMax: livesMax == null ? null : Number(livesMax),
    livesShopEnabled: Boolean(livesShopEnabled),
    isLoading: Boolean(isLoading),
    refetch: refetch ?? defaultValue.refetch,
  }), [symbol, label, livesEnabled, livesMax, livesShopEnabled, isLoading, refetch]);

  return (
    <GroupLivesContext.Provider value={value}>
      {children}
    </GroupLivesContext.Provider>
  );
}

/**
 * Pobiera konfigurację żyć z API i udostępnia ją w kontekście.
 *
 * @param {string | null | undefined} groupId
 */
export function GroupLivesSettingsProvider({ groupId, children }) {
  const [symbol, setSymbol] = useState(DEFAULT_LIVES_SYMBOL);
  const [label, setLabel] = useState(DEFAULT_LIVES_LABEL);
  const [livesEnabled, setLivesEnabled] = useState(false);
  const [livesMax, setLivesMax] = useState(null);
  const [livesShopEnabled, setLivesShopEnabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!groupId) {
      setSymbol(DEFAULT_LIVES_SYMBOL);
      setLabel(DEFAULT_LIVES_LABEL);
      setLivesEnabled(false);
      setLivesMax(null);
      setLivesShopEnabled(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await fetchGroupLivesConfig(groupId);
    if (result.ok && result.config) {
      setSymbol(result.config.livesIcon || DEFAULT_LIVES_SYMBOL);
      setLabel(result.config.livesLabel || DEFAULT_LIVES_LABEL);
      setLivesEnabled(Boolean(result.config.livesEnabled));
      setLivesMax(
        result.config.livesMax == null ? null : Number(result.config.livesMax),
      );
      setLivesShopEnabled(Boolean(result.config.livesShopEnabled));
    } else {
      setLivesEnabled(false);
      setLivesMax(null);
      setLivesShopEnabled(false);
    }
    setIsLoading(false);
  }, [groupId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (!groupId) {
      return undefined;
    }

    return subscribeGroupScopedEvent(GROUP_LIVES_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        load();
      }
    });
  }, [groupId, load]);

  return (
    <GroupLivesProvider
      symbol={symbol}
      label={label}
      livesEnabled={livesEnabled}
      livesMax={livesMax}
      livesShopEnabled={livesShopEnabled}
      isLoading={isLoading}
      refetch={load}
    >
      {children}
    </GroupLivesProvider>
  );
}

export function useGroupLives() {
  return useContext(GroupLivesContext);
}
