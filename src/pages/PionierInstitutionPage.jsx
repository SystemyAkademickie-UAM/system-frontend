import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY } from '../constants/authPaths.constants.js';
import { getApiBaseUrl, getSamlInstitutionsUrl, getSamlLoginUrl } from '../constants/api.constants.js';

/**
 * @typedef {{ id: string; name: string; mode: 'ready' | 'planned' | 'needs_config' }} InstitutionRow
 */

export default function PionierInstitutionPage() {
  const [institutions, setInstitutions] = useState(
    /** @type {{ samlReady: boolean; institutions: InstitutionRow[] } | null} */ (null),
  );
  const [loadError, setLoadError] = useState(/** @type {string | null} */ (null));
  const [selectedId, setSelectedId] = useState('');

  useEffect(() => {
    const url = getSamlInstitutionsUrl();
    if (url.length === 0) {
      setLoadError('Brak adresu API (VITE_API_BASE_URL).');
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(url, { credentials: 'include' });
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }
        const data = await response.json();
        if (!cancelled) {
          setInstitutions(data);
        }
      } catch (e) {
        if (!cancelled) {
          setLoadError(e instanceof Error ? e.message : String(e));
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const selectable = (institutions?.institutions ?? []).filter((r) => r.mode === 'ready');
  const planned = (institutions?.institutions ?? []).filter((r) => r.mode === 'planned');

  const onContinue = useCallback(() => {
    if (selectedId.length === 0) {
      return;
    }
    const forceAuthn = sessionStorage.getItem(AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY) === '1';
    if (forceAuthn) {
      sessionStorage.removeItem(AUTH_SAML_FORCE_AUTHN_ONCE_STORAGE_KEY);
    }
    const target = getSamlLoginUrl(selectedId, { forceAuthn });
    if (target.length === 0) {
      return;
    }
    globalThis.location.href = target;
  }, [selectedId]);

  const apiBase = getApiBaseUrl();

  return (
    <main className="auth">
      <nav className="auth__nav">
        <Link to="/login">← Wróć</Link>
      </nav>
      <h1 className="auth__title">PIONIER.id — wybór uczelni</h1>
      <p className="auth__lead">
        Wybierz uczelnię i kontynuuj. Zostaniesz przekierowany na stronę logowania SAML tej uczelni (w środowisku
        developerskim: lokalny IdP lub UAM, gdy skonfigurujesz zmienne <code>SAML_UAM_*</code>).
      </p>
      {planned.length > 0 ? (
        <p className="auth__note">
          <strong>PIONIER.id (centralna strona federacji)</strong> — w przygotowaniu; na razie logujemy się
          bezpośrednio wybranym IdP zgodnie z konfiguracją API.
        </p>
      ) : null}
      {loadError !== null ? <p className="auth__error">{loadError}</p> : null}
      {institutions !== null && !institutions.samlReady ? (
        <p className="auth__error">
          SAML po stronie API nie jest skonfigurowany — ustaw zmienne <code>SAML_*</code> (patrz{' '}
          <code>system-backend/docs/api/api.md</code>).
        </p>
      ) : null}
      <div className="auth__panel">
        <label className="auth__label" htmlFor="institution-select">
          Uczelnia
        </label>
        <select
          id="institution-select"
          className="auth__select"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          disabled={selectable.length === 0}
        >
          <option value="">— wybierz —</option>
          {selectable.map((row) => (
            <option key={row.id} value={row.id}>
              {row.name}
            </option>
          ))}
        </select>
        <button
          type="button"
          className="auth__button auth__button--primary"
          onClick={onContinue}
          disabled={selectedId.length === 0 || apiBase.length === 0}
        >
          Dalej — logowanie SAML
        </button>
      </div>
    </main>
  );
}
