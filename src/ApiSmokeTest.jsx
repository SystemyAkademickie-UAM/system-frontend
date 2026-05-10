import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getApiBaseUrl, getSamlLoginUrl } from './constants/api.constants.js';
import {
  DRIVE_PATH,
  GROUPS_NEW_PATH,
  LOGIN_PATH,
  LOGOUT_PATH,
  SAML_BYPASS_SESSION_PATH,
} from './constants/apiPaths.constants.js';
import { describeDriveForbiddenReason, DRIVE_JSON_STATUS_FORBIDDEN } from './constants/driveApi.constants.js';
import {
  SMOKE_TEST_DEFAULT_CURRENCY_ICON,
  SMOKE_TEST_DEFAULT_LIFE_ICON,
} from './constants/smokeTestForm.constants.js';
import { getOrCreateBrowserId, resetStoredBrowserId } from './browserIdStorage.js';

/** @returns {string} */
function formatFetchError(response, bodyText) {
  const trimmed = bodyText.trim();
  if (trimmed.length > 0) {
    return trimmed;
  }
  return `HTTP ${response.status}`;
}

export default function ApiSmokeTest() {
  const { authToken, setAuthToken, clearAuthToken } = useAuth();
  const [browserId, setBrowserId] = useState(() => getOrCreateBrowserId());
  const [groupName, setGroupName] = useState('Smoke test group');
  const [groupDescription, setGroupDescription] = useState('Created from frontend smoke page');
  const [groupCurrency, setGroupCurrency] = useState('Coin');
  const [groupCurrencyIcon, setGroupCurrencyIcon] = useState(SMOKE_TEST_DEFAULT_CURRENCY_ICON);
  const [groupLife, setGroupLife] = useState('Lives');
  const [groupLifeIcon, setGroupLifeIcon] = useState(SMOKE_TEST_DEFAULT_LIFE_ICON);
  const [groupBannerRef, setGroupBannerRef] = useState('');
  const [driveFile, setDriveFile] = useState(null);
  const [driveRemoveRef, setDriveRemoveRef] = useState('');
  const [lastJson, setLastJson] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [isBusy, setIsBusy] = useState(false);

  const baseUrl = getApiBaseUrl();
  const samlLoginUrl = getSamlLoginUrl();

  function onRegenerateBrowserId() {
    setBrowserId(resetStoredBrowserId());
    clearAuthToken();
    setErrorMessage(null);
    setLastJson('');
  }

  /**
   * @param {'student' | 'lecturer'} profile
   */
  async function onEstablishDevSession(profile) {
    setErrorMessage(null);
    setLastJson('');
    setIsBusy(true);
    try {
      const url = `${baseUrl}${SAML_BYPASS_SESSION_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ profile }),
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error('Bypass session response was not JSON');
      }
      if (parsed?.ok !== true) {
        throw new Error('Bypass session did not return { ok: true }');
      }
      setLastJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  async function onLogin() {
    setErrorMessage(null);
    setLastJson('');
    setIsBusy(true);
    try {
      const url = `${baseUrl}${LOGIN_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: '{}',
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error('Login response was not JSON');
      }
      if (typeof parsed?.auth !== 'string' || parsed.auth.trim() === '') {
        throw new Error('Login response missing auth string');
      }
      setAuthToken(parsed.auth.trim());
      setLastJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  async function onLogout() {
    setErrorMessage(null);
    setLastJson('');
    setIsBusy(true);
    try {
      const url = `${baseUrl}${LOGOUT_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      const parsed = JSON.parse(text);
      clearAuthToken();
      setLastJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  /**
   * Creates group using auth from body (legacy/API client flow).
   */
  async function onCreateGroup() {
    setErrorMessage(null);
    setLastJson('');
    const trimmedAuth = authToken.trim();
    if (trimmedAuth === '') {
      setErrorMessage('Set auth token first (POST /login after SAML).');
      return;
    }
    const currencyIcon = Number(groupCurrencyIcon);
    const lifeIcon = Number(groupLifeIcon);
    if (!Number.isInteger(currencyIcon) || currencyIcon < 0) {
      setErrorMessage('currencyIcon must be a non-negative integer.');
      return;
    }
    if (!Number.isInteger(lifeIcon) || lifeIcon < 0) {
      setErrorMessage('lifeIcon must be a non-negative integer.');
      return;
    }
    setIsBusy(true);
    try {
      const payload = {
        auth: trimmedAuth,
        group: {
          name: groupName,
          description: groupDescription,
          currency: groupCurrency,
          currencyIcon,
          life: groupLife,
          lifeIcon,
        },
      };
      if (groupBannerRef.trim() !== '') {
        payload.group.bannerRef = groupBannerRef.trim();
      }
      const url = `${baseUrl}${GROUPS_NEW_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      const parsed = JSON.parse(text);
      setLastJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  /**
   * Creates group using HTTP-only maq_auth cookie (browser flow - no auth in body).
   */
  async function onCreateGroupCookieAuth() {
    setErrorMessage(null);
    setLastJson('');
    const currencyIcon = Number(groupCurrencyIcon);
    const lifeIcon = Number(groupLifeIcon);
    if (!Number.isInteger(currencyIcon) || currencyIcon < 0) {
      setErrorMessage('currencyIcon must be a non-negative integer.');
      return;
    }
    if (!Number.isInteger(lifeIcon) || lifeIcon < 0) {
      setErrorMessage('lifeIcon must be a non-negative integer.');
      return;
    }
    setIsBusy(true);
    try {
      const payload = {
        group: {
          name: groupName,
          description: groupDescription,
          currency: groupCurrency,
          currencyIcon,
          life: groupLife,
          lifeIcon,
        },
      };
      if (groupBannerRef.trim() !== '') {
        payload.group.bannerRef = groupBannerRef.trim();
      }
      const url = `${baseUrl}${GROUPS_NEW_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify(payload),
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      const parsed = JSON.parse(text);
      setLastJson(JSON.stringify(parsed, null, 2));
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  /**
   * Drive upload using cookie auth (no auth in JSON body).
   */
  async function onDrivePost() {
    setErrorMessage(null);
    setLastJson('');
    if (driveFile === null) {
      setErrorMessage('Choose an image file for drive upload.');
      return;
    }
    setIsBusy(true);
    try {
      const jsonPayload = {
        drive: {
          method: 'post',
          driveRef: '',
          size: driveFile.size,
        },
      };
      const formData = new FormData();
      formData.append('json', JSON.stringify(jsonPayload));
      formData.append('banner', driveFile, driveFile.name);
      const url = `${baseUrl}${DRIVE_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Browser-ID': browserId,
        },
        body: formData,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      const parsed = JSON.parse(text);
      setLastJson(JSON.stringify(parsed, null, 2));
      if (parsed.status === DRIVE_JSON_STATUS_FORBIDDEN) {
        setErrorMessage(
          describeDriveForbiddenReason(typeof parsed.reason === 'string' ? parsed.reason : undefined),
        );
      }
      if (typeof parsed?.driveRef === 'string' && parsed.driveRef.trim() !== '') {
        setDriveRemoveRef(parsed.driveRef.trim());
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  /**
   * Drive remove using cookie auth (no auth in JSON body).
   */
  async function onDriveRemove() {
    setErrorMessage(null);
    setLastJson('');
    const trimmedRef = driveRemoveRef.trim();
    if (trimmedRef === '') {
      setErrorMessage('Enter driveRef to remove (or upload first).');
      return;
    }
    setIsBusy(true);
    try {
      const formData = new FormData();
      formData.append(
        'json',
        JSON.stringify({
          drive: {
            method: 'remove',
            driveRef: trimmedRef,
            size: 0,
          },
        }),
      );
      const url = `${baseUrl}${DRIVE_PATH}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-Browser-ID': browserId,
        },
        body: formData,
      });
      const text = await response.text();
      if (!response.ok) {
        throw new Error(formatFetchError(response, text));
      }
      const parsed = JSON.parse(text);
      setLastJson(JSON.stringify(parsed, null, 2));
      if (parsed.status === DRIVE_JSON_STATUS_FORBIDDEN) {
        setErrorMessage(
          describeDriveForbiddenReason(typeof parsed.reason === 'string' ? parsed.reason : undefined),
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  function onUseDriveRefAsBanner() {
    const trimmed = driveRemoveRef.trim();
    if (trimmed !== '') {
      setGroupBannerRef(trimmed);
    }
  }

  return (
    <section className="smoke" aria-labelledby="smoke-heading">
      <h2 id="smoke-heading">API smoke test</h2>
      <p className="smoke__hint">
        Uses the Vite <code className="smoke__code">/api</code> proxy to Nest (<code className="smoke__code">127.0.0.1:8080</code>).
        <strong>POST /login</strong> needs the HTTP-only <code className="smoke__code">saml_session</code> cookie on this
        origin. In dev, use <strong>Establish dev session</strong> below (or institutional SAML). GET bypass links can miss
        the cookie if <code className="smoke__code">SAML_LOGIN_SUCCESS_REDIRECT_URL</code> uses a different host than this
        page (e.g. <code className="smoke__code">localhost</code> vs <code className="smoke__code">127.0.0.1</code>).
      </p>
      {samlLoginUrl.length > 0 ? (
        <p className="smoke__saml">
          <a className="smoke__link" href={samlLoginUrl}>
            Institutional login (SAML)
          </a>
        </p>
      ) : null}

      <div className="smoke__field">
        <label className="smoke__label" htmlFor="smoke-browser-id">
          X-Browser-ID (stored locally)
        </label>
        <input
          id="smoke-browser-id"
          className="smoke__input smoke__input--mono"
          type="text"
          readOnly
          value={browserId}
        />
        <button type="button" className="smoke__button smoke__button--secondary" onClick={onRegenerateBrowserId}>
          New browser id
        </button>
      </div>

      <div className="smoke__fieldset" aria-labelledby="dev-session-heading">
        <h3 id="dev-session-heading" className="smoke__subheading">
          Dev session (bypass)
        </h3>
        <p className="smoke__hint">
          Backend: <code className="smoke__code">SAML_BYPASS_ENABLED=true</code>, non-production <code className="smoke__code">NODE_ENV</code>.
        </p>
        <div className="smoke__actions">
          <button
            type="button"
            className="smoke__button smoke__button--secondary"
            onClick={() => onEstablishDevSession('student')}
            disabled={isBusy}
          >
            Establish dev session (student)
          </button>
          <button
            type="button"
            className="smoke__button smoke__button--secondary"
            onClick={() => onEstablishDevSession('lecturer')}
            disabled={isBusy}
          >
            Establish dev session (lecturer)
          </button>
        </div>
      </div>

      <div className="smoke__actions">
        <button type="button" className="smoke__button" onClick={onLogin} disabled={isBusy}>
          POST /login (mint auth + set cookie)
        </button>
        <button type="button" className="smoke__button smoke__button--secondary" onClick={onLogout} disabled={isBusy}>
          POST /login/logout (clear cookies)
        </button>
      </div>

      <div className="smoke__field">
        <label className="smoke__label" htmlFor="smoke-auth">
          Auth token (displayed for debugging)
        </label>
        <p className="smoke__hint">
          Returned in <code className="smoke__code">POST /login</code> JSON and also set as{' '}
          <code className="smoke__code">maq_auth</code> HTTP-only cookie. The cookie is used automatically for API
          calls via <code className="smoke__code">credentials: include</code>. The value shown here is for debugging /
          API clients only. Use <strong>Create group (cookie auth)</strong> to test without sending{' '}
          <code className="smoke__code">auth</code> in the request body.
        </p>
        <textarea
          id="smoke-auth"
          className="smoke__textarea smoke__input--mono"
          rows={3}
          value={authToken}
          onChange={(event) => setAuthToken(event.target.value)}
          spellCheck={false}
        />
        <button type="button" className="smoke__button smoke__button--secondary" onClick={clearAuthToken}>
          Clear auth (memory)
        </button>
      </div>

      <fieldset className="smoke__fieldset">
        <legend>POST /groups/new</legend>
        <label className="smoke__label" htmlFor="smoke-g-name">
          name
        </label>
        <input
          id="smoke-g-name"
          className="smoke__input"
          type="text"
          value={groupName}
          onChange={(event) => setGroupName(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-g-desc">
          description
        </label>
        <input
          id="smoke-g-desc"
          className="smoke__input"
          type="text"
          value={groupDescription}
          onChange={(event) => setGroupDescription(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-g-currency">
          currency
        </label>
        <input
          id="smoke-g-currency"
          className="smoke__input"
          type="text"
          value={groupCurrency}
          onChange={(event) => setGroupCurrency(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-g-currency-icon">
          currencyIcon
        </label>
        <input
          id="smoke-g-currency-icon"
          className="smoke__input"
          type="number"
          min={0}
          step={1}
          value={groupCurrencyIcon}
          onChange={(event) => setGroupCurrencyIcon(Number(event.target.value))}
        />
        <label className="smoke__label" htmlFor="smoke-g-life">
          life
        </label>
        <input
          id="smoke-g-life"
          className="smoke__input"
          type="text"
          value={groupLife}
          onChange={(event) => setGroupLife(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-g-life-icon">
          lifeIcon
        </label>
        <input
          id="smoke-g-life-icon"
          className="smoke__input"
          type="number"
          min={0}
          step={1}
          value={groupLifeIcon}
          onChange={(event) => setGroupLifeIcon(Number(event.target.value))}
        />
        <label className="smoke__label" htmlFor="smoke-g-banner">
          bannerRef (optional)
        </label>
        <input
          id="smoke-g-banner"
          className="smoke__input smoke__input--mono"
          type="text"
          value={groupBannerRef}
          onChange={(event) => setGroupBannerRef(event.target.value)}
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={onCreateGroup} disabled={isBusy}>
            Create group (body auth)
          </button>
          <button type="button" className="smoke__button" onClick={onCreateGroupCookieAuth} disabled={isBusy}>
            Create group (cookie auth)
          </button>
          <button type="button" className="smoke__button smoke__button--secondary" onClick={onUseDriveRefAsBanner}>
            Use last driveRef as banner
          </button>
        </div>
      </fieldset>

      <fieldset className="smoke__fieldset">
        <legend>POST /drive</legend>
        <label className="smoke__label" htmlFor="smoke-drive-file">
          Banner file (post)
        </label>
        <input
          id="smoke-drive-file"
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            setDriveFile(file ?? null);
          }}
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={onDrivePost} disabled={isBusy}>
            Upload (method post)
          </button>
        </div>
        <label className="smoke__label" htmlFor="smoke-drive-ref">
          driveRef (remove)
        </label>
        <input
          id="smoke-drive-ref"
          className="smoke__input smoke__input--mono"
          type="text"
          value={driveRemoveRef}
          onChange={(event) => setDriveRemoveRef(event.target.value)}
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={onDriveRemove} disabled={isBusy}>
            Remove (method remove)
          </button>
        </div>
      </fieldset>

      {lastJson.length > 0 ? (
        <div className="smoke__field">
          <span className="smoke__label">Last JSON response</span>
          <pre className="smoke__pre">{lastJson}</pre>
        </div>
      ) : null}
      {errorMessage ? <p className="app__error">{errorMessage}</p> : null}
    </section>
  );
}
