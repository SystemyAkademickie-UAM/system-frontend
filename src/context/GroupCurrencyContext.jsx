import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_CURRENCY_ICON_FILE, DEFAULT_CURRENCY_SYMBOL } from '../constants/currency.constants.js';

const GroupCurrencyContext = createContext({
  symbol: DEFAULT_CURRENCY_SYMBOL,
  iconFile: DEFAULT_CURRENCY_ICON_FILE,
  iconUrl: null,
});

/**
 * Udostępnia symbol/ikonę waluty grupy w drzewie komponentów.
 * Docelowo wartości pochodzą z API grupy; na razie fallback to 🥕.
 */
export function GroupCurrencyProvider({ symbol, iconFile, iconUrl, children }) {
  const value = useMemo(() => ({
    symbol: symbol ?? DEFAULT_CURRENCY_SYMBOL,
    iconFile: iconFile ?? DEFAULT_CURRENCY_ICON_FILE,
    iconUrl: iconUrl ?? null,
  }), [symbol, iconFile, iconUrl]);

  return (
    <GroupCurrencyContext.Provider value={value}>
      {children}
    </GroupCurrencyContext.Provider>
  );
}

export function useGroupCurrency() {
  return useContext(GroupCurrencyContext);
}
