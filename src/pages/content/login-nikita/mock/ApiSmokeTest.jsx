import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../../constants/api.constants.js';
import {
  DRIVE_PATH,
  getGroupEnrollPath,
  GROUPS_NEW_PATH,
  LOGIN_PATH,
  LOGOUT_PATH,
  SAML_BYPASS_SESSION_PATH,
  STAGES_PATH,
  ACTIVITIES_PATH,
  describeDriveForbiddenReason,
  DRIVE_JSON_STATUS_FORBIDDEN,
  SMOKE_TEST_DEFAULT_CURRENCY_ICON,
  SMOKE_TEST_DEFAULT_LIFE_ICON,
} from './mockConstants.js';
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
  const [enrollGroupId, setEnrollGroupId] = useState('');
  const [driveFile, setDriveFile] = useState(null);
  const [driveRemoveRef, setDriveRemoveRef] = useState('');
  const [stageGroupId, setStageGroupId] = useState('');
  const [stageName, setStageName] = useState('Test Stage');
  const [stageId, setStageId] = useState('');
  const [activityStageId, setActivityStageId] = useState('');
  const [activityName, setActivityName] = useState('Test Activity');
  const [activityCurrency, setActivityCurrency] = useState('100');
  const [activityEduDesc, setActivityEduDesc] = useState('Educational description');
  const [activityStoryDesc, setActivityStoryDesc] = useState('Story description');
  const [activityId, setActivityId] = useState('');
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
    const livesIcon = Number(groupLifeIcon);
    if (!Number.isInteger(currencyIcon) || currencyIcon < 0) {
      setErrorMessage('currencyIcon must be a non-negative integer.');
      return;
    }
    if (!Number.isInteger(livesIcon) || livesIcon < 0) {
      setErrorMessage('livesIcon must be a non-negative integer.');
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
          lives: groupLife,
          livesIcon,
        },
      };
      if (groupBannerRef.trim() !== '') {
        payload.group.imageRef = groupBannerRef.trim();
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
    const livesIcon = Number(groupLifeIcon);
    if (!Number.isInteger(currencyIcon) || currencyIcon < 0) {
      setErrorMessage('currencyIcon must be a non-negative integer.');
      return;
    }
    if (!Number.isInteger(livesIcon) || livesIcon < 0) {
      setErrorMessage('livesIcon must be a non-negative integer.');
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
          lives: groupLife,
          livesIcon,
        },
      };
      if (groupBannerRef.trim() !== '') {
        payload.group.imageRef = groupBannerRef.trim();
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
   * Student enrollment using cookie auth.
   */
  async function onEnrollInGroup() {
    setErrorMessage(null);
    setLastJson('');
    const trimmedId = enrollGroupId.trim();
    if (trimmedId === '') {
      setErrorMessage('Enter a group ID to enroll in.');
      return;
    }
    const groupId = Number(trimmedId);
    if (!Number.isInteger(groupId) || groupId < 1) {
      setErrorMessage('Group ID must be a positive integer.');
      return;
    }
    setIsBusy(true);
    try {
      const url = `${baseUrl}${getGroupEnrollPath(groupId)}`;
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserId,
        },
        body: JSON.stringify({}),
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

  /**
   * @param {'post' | 'modify' | 'remove' | 'retrieve'} method
   */
  async function onStageAction(method) {
    setErrorMessage(null);
    setLastJson('');
    setIsBusy(true);
    try {
      /** @type {Record<string, unknown>} */
      const payload = { method };
      const trimmedAuth = authToken.trim();
      if (trimmedAuth !== '') {
        payload.auth = trimmedAuth;
      }
      if (method === 'post') {
        if (!stageGroupId.trim()) {
          throw new Error('Group ID is required for creating a stage.');
        }
        payload.groupId = Number(stageGroupId);
        payload.name = stageName;
      } else if (method === 'modify') {
        if (!stageId.trim()) {
          throw new Error('Stage ID is required for modification.');
        }
        payload.stageId = Number(stageId);
        if (stageName.trim()) payload.name = stageName;
        if (stageGroupId.trim()) payload.groupId = Number(stageGroupId);
      } else if (method === 'remove') {
        if (!stageId.trim()) {
          throw new Error('Stage ID is required for removal.');
        }
        payload.stageId = Number(stageId);
      } else if (method === 'retrieve') {
        if (stageGroupId.trim()) payload.groupId = Number(stageGroupId);
        if (stageId.trim()) payload.stageId = Number(stageId);
      }
      const url = `${baseUrl}${STAGES_PATH}`;
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
      if (method === 'post' && parsed.status === 200 && parsed.stage > 0) {
        setStageId(String(parsed.stage));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  /**
   * @param {'post' | 'modify' | 'remove' | 'retrieve'} method
   */
  async function onActivityAction(method) {
    setErrorMessage(null);
    setLastJson('');
    setIsBusy(true);
    try {
      /** @type {Record<string, unknown>} */
      const payload = { method };
      const trimmedAuth = authToken.trim();
      if (trimmedAuth !== '') {
        payload.auth = trimmedAuth;
      }
      if (method === 'post') {
        if (!activityStageId.trim()) {
          throw new Error('Stage ID is required for creating an activity.');
        }
        payload.stageId = Number(activityStageId);
        payload.name = activityName;
        payload.currency = Number(activityCurrency);
        payload.educationalDescription = activityEduDesc;
        payload.storyDescription = activityStoryDesc;
      } else if (method === 'modify') {
        if (!activityId.trim()) {
          throw new Error('Activity ID is required for modification.');
        }
        payload.activityId = Number(activityId);
        if (activityName.trim()) payload.name = activityName;
        if (activityStageId.trim()) payload.stageId = Number(activityStageId);
        if (activityCurrency.trim()) payload.currency = Number(activityCurrency);
        if (activityEduDesc.trim()) payload.educationalDescription = activityEduDesc;
        if (activityStoryDesc.trim()) payload.storyDescription = activityStoryDesc;
      } else if (method === 'remove') {
        if (!activityId.trim()) {
          throw new Error('Activity ID is required for removal.');
        }
        payload.activityId = Number(activityId);
      } else if (method === 'retrieve') {
        if (activityStageId.trim()) payload.stageId = Number(activityStageId);
        if (activityId.trim()) payload.activityId = Number(activityId);
      }
      const url = `${baseUrl}${ACTIVITIES_PATH}`;
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
      if (method === 'post' && parsed.status === 200 && parsed.activity > 0) {
        setActivityId(String(parsed.activity));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setErrorMessage(message);
    } finally {
      setIsBusy(false);
    }
  }

  function onUseStageIdForActivity() {
    if (stageId.trim()) {
      setActivityStageId(stageId);
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
          POST /logout (clear cookies)
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
        <label className="smoke__label" htmlFor="smoke-g-lives">
          lives
        </label>
        <input
          id="smoke-g-lives"
          className="smoke__input"
          type="text"
          value={groupLife}
          onChange={(event) => setGroupLife(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-g-lives-icon">
          livesIcon
        </label>
        <input
          id="smoke-g-lives-icon"
          className="smoke__input"
          type="number"
          min={0}
          step={1}
          value={groupLifeIcon}
          onChange={(event) => setGroupLifeIcon(Number(event.target.value))}
        />
        <label className="smoke__label" htmlFor="smoke-g-image-ref">
          imageRef (optional)
        </label>
        <input
          id="smoke-g-image-ref"
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
        <legend>POST /groups/:id/enroll (Student)</legend>
        <p className="smoke__hint">
          Enroll as a student in a group. Requires <strong>student</strong> session (use dev bypass above).
          Enter the public group ID (e.g. from Create group response).
        </p>
        <label className="smoke__label" htmlFor="smoke-enroll-group-id">
          Group ID
        </label>
        <input
          id="smoke-enroll-group-id"
          className="smoke__input"
          type="number"
          min={1}
          step={1}
          value={enrollGroupId}
          onChange={(event) => setEnrollGroupId(event.target.value)}
          placeholder="e.g. 100001"
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={onEnrollInGroup} disabled={isBusy}>
            Enroll in group
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

      <fieldset className="smoke__fieldset">
        <legend>POST /stages (Lecturer)</legend>
        <p className="smoke__hint">
          Manage stages within groups. Requires <strong>lecturer</strong> session for post/modify/remove.
          Retrieve requires any authenticated session.
        </p>
        <label className="smoke__label" htmlFor="smoke-stage-group-id">
          Group ID (public, e.g. 100001)
        </label>
        <input
          id="smoke-stage-group-id"
          className="smoke__input"
          type="number"
          min={1}
          step={1}
          value={stageGroupId}
          onChange={(event) => setStageGroupId(event.target.value)}
          placeholder="e.g. 100001"
        />
        <label className="smoke__label" htmlFor="smoke-stage-name">
          Stage Name
        </label>
        <input
          id="smoke-stage-name"
          className="smoke__input"
          type="text"
          value={stageName}
          onChange={(event) => setStageName(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-stage-id">
          Stage ID (for modify/remove/retrieve, DB id e.g. 1)
        </label>
        <input
          id="smoke-stage-id"
          className="smoke__input"
          type="number"
          min={1}
          step={1}
          value={stageId}
          onChange={(event) => setStageId(event.target.value)}
          placeholder="e.g. 1"
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={() => onStageAction('post')} disabled={isBusy}>
            Create (method post)
          </button>
          <button type="button" className="smoke__button" onClick={() => onStageAction('modify')} disabled={isBusy}>
            Modify (method modify)
          </button>
          <button type="button" className="smoke__button smoke__button--secondary" onClick={() => onStageAction('remove')} disabled={isBusy}>
            Remove (method remove)
          </button>
          <button type="button" className="smoke__button smoke__button--secondary" onClick={() => onStageAction('retrieve')} disabled={isBusy}>
            Retrieve (method retrieve)
          </button>
        </div>
      </fieldset>

      <fieldset className="smoke__fieldset">
        <legend>POST /activities (Lecturer)</legend>
        <p className="smoke__hint">
          Manage activities within stages. Requires <strong>lecturer</strong> session for post/modify/remove.
          Retrieve requires any authenticated session.
        </p>
        <label className="smoke__label" htmlFor="smoke-activity-stage-id">
          Stage ID (DB id e.g. 1)
        </label>
        <div className="smoke__actions" style={{ marginBottom: '8px' }}>
          <input
            id="smoke-activity-stage-id"
            className="smoke__input"
            type="number"
            min={1}
            step={1}
            value={activityStageId}
            onChange={(event) => setActivityStageId(event.target.value)}
            placeholder="e.g. 1"
            style={{ flex: 1 }}
          />
          <button type="button" className="smoke__button smoke__button--secondary" onClick={onUseStageIdForActivity}>
            Use last stage ID
          </button>
        </div>
        <label className="smoke__label" htmlFor="smoke-activity-name">
          Activity Name
        </label>
        <input
          id="smoke-activity-name"
          className="smoke__input"
          type="text"
          value={activityName}
          onChange={(event) => setActivityName(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-activity-currency">
          Currency Reward
        </label>
        <input
          id="smoke-activity-currency"
          className="smoke__input"
          type="number"
          min={0}
          step={1}
          value={activityCurrency}
          onChange={(event) => setActivityCurrency(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-activity-edu-desc">
          Educational Description
        </label>
        <textarea
          id="smoke-activity-edu-desc"
          className="smoke__textarea"
          rows={2}
          value={activityEduDesc}
          onChange={(event) => setActivityEduDesc(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-activity-story-desc">
          Story Description
        </label>
        <textarea
          id="smoke-activity-story-desc"
          className="smoke__textarea"
          rows={2}
          value={activityStoryDesc}
          onChange={(event) => setActivityStoryDesc(event.target.value)}
        />
        <label className="smoke__label" htmlFor="smoke-activity-id">
          Activity ID (for modify/remove/retrieve, DB id e.g. 1)
        </label>
        <input
          id="smoke-activity-id"
          className="smoke__input"
          type="number"
          min={1}
          step={1}
          value={activityId}
          onChange={(event) => setActivityId(event.target.value)}
          placeholder="e.g. 1"
        />
        <div className="smoke__actions">
          <button type="button" className="smoke__button" onClick={() => onActivityAction('post')} disabled={isBusy}>
            Create (method post)
          </button>
          <button type="button" className="smoke__button" onClick={() => onActivityAction('modify')} disabled={isBusy}>
            Modify (method modify)
          </button>
          <button type="button" className="smoke__button smoke__button--secondary" onClick={() => onActivityAction('remove')} disabled={isBusy}>
            Remove (method remove)
          </button>
          <button type="button" className="smoke__button smoke__button--secondary" onClick={() => onActivityAction('retrieve')} disabled={isBusy}>
            Retrieve (method retrieve)
          </button>
        </div>
      </fieldset>

      {lastJson.length > 0 ? (
        <div className="smoke__field">
          <span className="smoke__label">Last JSON response</span>
          <pre className="smoke__pre">{lastJson}</pre>
        </div>
      ) : null}
      {errorMessage ? <p className="mock-app__error">{errorMessage}</p> : null}
    </section>
  );
}
