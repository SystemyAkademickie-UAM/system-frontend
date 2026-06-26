import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { DEFAULT_CURRENCY_ICON_FILE, DEFAULT_CURRENCY_SYMBOL } from '../constants/currency.constants.js';
import { fetchGroupCurrencyConfig } from '../services/groupCurrency.api.js';
import { GROUP_CURRENCY_INVALIDATED } from '../services/groupCurrencyEvents.js';
import { subscribeGroupScopedEvent } from '../services/studentProfileEvents.js';

const defaultValue = {
  symbol: DEFAULT_CURRENCY_SYMBOL,
  name: '',
  iconFile: DEFAULT_CURRENCY_ICON_FILE,
  iconUrl: null,
  isLoading: false,
  refetch: async () => {},
};

const GroupCurrencyContext = createContext(defaultValue);

/**
 * Udostępnia symbol i nazwę waluty grupy w drzewie komponentów.
 */
export function GroupCurrencyProvider({ symbol, name, iconFile, iconUrl, isLoading, refetch, children }) {
  const value = useMemo(() => ({
    symbol: symbol ?? DEFAULT_CURRENCY_SYMBOL,
    name: name ?? '',
    iconFile: iconFile ?? DEFAULT_CURRENCY_ICON_FILE,
    iconUrl: iconUrl ?? null,
    isLoading: Boolean(isLoading),
    refetch: refetch ?? defaultValue.refetch,
  }), [symbol, name, iconFile, iconUrl, isLoading, refetch]);

  return (
    <GroupCurrencyContext.Provider value={value}>
      {children}
    </GroupCurrencyContext.Provider>
  );
}

/**
 * Pobiera konfigurację waluty z API i udostępnia ją w kontekście.
 *
 * @param {string | null | undefined} groupId
 */
export function GroupCurrencySettingsProvider({ groupId, children }) {
  const [symbol, setSymbol] = useState(DEFAULT_CURRENCY_SYMBOL);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!groupId) {
      setSymbol(DEFAULT_CURRENCY_SYMBOL);
      setName('');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const result = await fetchGroupCurrencyConfig(groupId);
    if (result.ok && result.config) {
      setSymbol(result.config.currencyEmoji || DEFAULT_CURRENCY_SYMBOL);
      setName(result.config.currency || '');
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

    return subscribeGroupScopedEvent(GROUP_CURRENCY_INVALIDATED, (eventGroupId) => {
      if (eventGroupId === String(groupId)) {
        load();
      }
    });
  }, [groupId, load]);

  return (
    <GroupCurrencyProvider
      symbol={symbol}
      name={name}
      isLoading={isLoading}
      refetch={load}
    >
      {children}
    </GroupCurrencyProvider>
  );
}

export function useGroupCurrency() {
  return useContext(GroupCurrencyContext);
}
