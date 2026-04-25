import { useCallback, useState } from 'react';
import { getApiBaseUrl, getSamlLoginUrl } from './constants/api.constants.js';
import { COUNTER_INCREMENT_PATH } from './constants/apiPaths.constants.js';
import './App.css';

export default function App() {
  const [count, setCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const onAdd = useCallback(async () => {
    setErrorMessage(null);
    setIsLoading(true);
    try {
      const base = getApiBaseUrl();
      const url = `${base}${COUNTER_INCREMENT_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentCount: count }),
      });
      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || `HTTP ${response.status}`);
      }
      const data = await response.json();
      if (typeof data?.count !== 'number' || !Number.isFinite(data.count)) {
        throw new Error('Invalid response: expected numeric count');
      }
      setCount(data.count);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, [count]);

  const samlLoginUrl = getSamlLoginUrl();

  return (
    <main className="app">
      <h1>UNDER CONSTRUCTION</h1>
      <p className="app__label">Count: {count}</p>
      <button type="button" className="app__button" onClick={onAdd} disabled={isLoading}>
        Add
      </button>
      {samlLoginUrl.length > 0 ? (
        <p className="app__saml">
          <a className="app__saml-link" href={samlLoginUrl}>
            Institutional login (SAML 2.0 — direct IdP or proxy)
          </a>
        </p>
      ) : null}
      {errorMessage ? <p className="app__error">{errorMessage}</p> : null}
    </main>
  );
}
