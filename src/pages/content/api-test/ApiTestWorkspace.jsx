import { useCallback, useEffect, useMemo, useState } from 'react';

import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { AUTH_SAML_ME_PATH } from '../../../constants/authPaths.constants.js';
import { AuthProvider, useAuth } from './mock/AuthContext.jsx';
import {
  getOrCreateBrowserId,
  resetStoredBrowserId,
} from './mock/browserIdStorage.js';
import {
  LOGIN_PATH,
  LOGOUT_PATH,
  SAML_BYPASS_SESSION_PATH,
} from './mock/mockConstants.js';
import { API_TEST_SECTIONS, findSection } from './apiTestSections.js';
import ApiMethodBadge, { parseHttpMethodLabel } from './ApiMethodBadge.jsx';
import { useSyncedPayload } from './useSyncedPayload.js';
import nobodgeitImg from '../../../assets/nobodgeit.png';
import './ApiTestWorkspace.css';

/** @returns {string} */
function formatFetchError(response, bodyText) {
  const trimmed = bodyText.trim();
  if (trimmed.length > 0) {
    try {
      return JSON.stringify(JSON.parse(trimmed), null, 2);
    } catch {
      return trimmed;
    }
  }
  return `HTTP ${response.status}`;
}

/**
 * @param {Record<string, unknown> | null | undefined} user
 * @returns {string}
 */
function formatSessionUserName(user) {
  if (!user) {
    return '—';
  }
  const givenName = typeof user.givenName === 'string' ? user.givenName.trim() : '';
  const surname = typeof user.surname === 'string' ? user.surname.trim() : '';
  const fullName = [givenName, surname].filter((part) => part.length > 0).join(' ');
  if (fullName.length > 0) {
    return fullName;
  }
  if (typeof user.email === 'string' && user.email.trim() !== '') {
    return user.email.trim();
  }
  return '—';
}

function ApiPanelTitle({ title }) {
  const httpLabel = parseHttpMethodLabel(title);
  return (
    <h2 className="api-test-workspace__panel-title">
      {httpLabel ? (
        <ApiMethodBadge label={title} />
      ) : (
        <span className="api-test-workspace__panel-title-text">{title}</span>
      )}
    </h2>
  );
}

function ApiTestWorkspaceInner() {
  const { authToken, setAuthToken, clearAuthToken } = useAuth();
  const [activeSectionId, setActiveSectionId] = useState('login');
  const [browserId, setBrowserId] = useState(() => getOrCreateBrowserId());
  const [sessionUser, setSessionUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isBusy, setIsBusy] = useState(false);
  const [driveFile, setDriveFile] = useState(null);
  const [loginBypassProfile, setLoginBypassProfile] = useState('lecturer');
  const [loginPreviewJson, setLoginPreviewJson] = useState('{}');

  const activeSection = findSection(activeSectionId);
  const defaultValues = useMemo(
    () => (activeSection?.defaultValues ? activeSection.defaultValues() : {}),
    [activeSection],
  );

  const synced = useSyncedPayload(activeSectionId, activeSection, defaultValues);

  useEffect(() => {
    setDriveFile(null);
  }, [activeSectionId]);

  useEffect(() => {
    if (activeSectionId === 'login') {
      return;
    }
    const trimmedAuth = authToken.trim();
    if (trimmedAuth === '') {
      return;
    }
    if (activeSection?.fields?.some((field) => field.key === 'auth')) {
      synced.updateField('auth', trimmedAuth);
    }
  }, [authToken, activeSectionId, activeSection]);

  const refreshSession = useCallback(async () => {
    try {
      const base = getApiBaseUrl();
      const response = await fetch(`${base}${AUTH_SAML_ME_PATH}`, { credentials: 'include' });
      if (response.ok) {
        const data = await response.json();
        if (data.authenticated && data.user) {
          setSessionUser(data.user);
          return;
        }
      }
      setSessionUser(null);
    } catch {
      setSessionUser(null);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  useEffect(() => {
    setLoginPreviewJson(JSON.stringify({ profile: loginBypassProfile }, null, 2));
  }, [loginBypassProfile]);

  const displayName = authChecked ? formatSessionUserName(sessionUser) : '…';
  const displayRole = authChecked ? (sessionUser?.role ?? '—') : '…';
  const loggedLabel = sessionUser ? 'Logged' : 'Not logged';

  async function runLoginAction(action) {
    setIsBusy(true);
    setResponseText('');
    const base = getApiBaseUrl();
    try {
      if (action === 'bypass') {
        const response = await fetch(`${base}${SAML_BYPASS_SESSION_PATH}`, {
          method: 'POST',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: loginBypassProfile }),
        });
        const text = await response.text();
        if (!response.ok) {
          throw new Error(formatFetchError(response, text));
        }
        setResponseText(text);
        await refreshSession();
        return;
      }
      if (action === 'login') {
        const response = await fetch(`${base}${LOGIN_PATH}`, {
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
        const parsed = JSON.parse(text);
        if (typeof parsed.auth === 'string') {
          setAuthToken(parsed.auth.trim());
        }
        setResponseText(JSON.stringify(parsed, null, 2));
        return;
      }
      if (action === 'logout') {
        const response = await fetch(`${base}${LOGOUT_PATH}`, {
          method: 'POST',
          credentials: 'include',
        });
        const text = await response.text();
        if (!response.ok) {
          throw new Error(formatFetchError(response, text));
        }
        clearAuthToken();
        setResponseText(text);
        await refreshSession();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResponseText(message);
    } finally {
      setIsBusy(false);
    }
  }

  function onRegenerateBrowserId() {
    setBrowserId(resetStoredBrowserId());
    clearAuthToken();
    setResponseText('');
  }

  function onClearMemory() {
    clearAuthToken();
    setResponseText('');
  }

  async function onSendRequest() {
    if (!activeSection || activeSection.kind === 'login') {
      return;
    }
    if (!synced.canSend) {
      return;
    }
    if (activeSection.id === 'enroll' && String(synced.values.enrollGroupId ?? '').trim() === '') {
      synced.setValidationError('Group ID is required in the path.');
      return;
    }
    if (
      (activeSection.id === 'badges' || activeSection.id === 'ranks') &&
      String(synced.values.groupId ?? '').trim() === ''
    ) {
      synced.setValidationError('Group ID is required in the path.');
      return;
    }
    setIsBusy(true);
    setResponseText('');
    const base = getApiBaseUrl();
    const path = activeSection.buildPath ? activeSection.buildPath(synced.values) : '';
    const url = `${base}${path}`;
    const headers = {};
    if (activeSection.needsBrowserId) {
      headers['X-Browser-ID'] = browserId;
    }
    try {
      if (activeSection.kind === 'multipart') {
        if (synced.values.driveMethod === 'post' && driveFile === null) {
          synced.setValidationError('Banner file is required for drive.method post.');
          setIsBusy(false);
          return;
        }
        const formData = new FormData();
        formData.append('json', JSON.stringify(synced.payload));
        if (driveFile !== null) {
          formData.append('banner', driveFile, driveFile.name);
        }
        const response = await fetch(url, {
          method: 'POST',
          credentials: 'include',
          headers,
          body: formData,
        });
        const text = await response.text();
        setResponseText(formatFetchError(response, text));
        return;
      }
      headers['Content-Type'] = 'application/json';
      const response = await fetch(url, {
        method: activeSection.method ?? 'POST',
        credentials: 'include',
        headers,
        body: JSON.stringify(synced.payload),
      });
      const text = await response.text();
      let formatted = text;
      try {
        formatted = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        formatted = formatFetchError(response, text);
      }
      setResponseText(formatted);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResponseText(message);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <div className="api-test-workspace">
      <aside className="api-test-workspace__sidebar" aria-label="API test sections">
        <p className="api-test-workspace__sidebar-title">Dev API test</p>
        <nav className="api-test-workspace__nav">
          {API_TEST_SECTIONS.map((section) => (
            <button
              key={section.id}
              type="button"
              className={
                section.id === activeSectionId
                  ? 'api-test-workspace__nav-btn api-test-workspace__nav-btn--active'
                  : 'api-test-workspace__nav-btn'
              }
              onClick={() => setActiveSectionId(section.id)}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      <div className="api-test-workspace__main">
        <header className="api-test-workspace__topbar">
          <div className="api-test-workspace__topbar-item">
            <span className="api-test-workspace__topbar-label">Name</span>
            <span className="api-test-workspace__topbar-value">{authChecked ? displayName : '…'}</span>
          </div>
          <div className="api-test-workspace__topbar-item">
            <span className="api-test-workspace__topbar-label">Role</span>
            <span className="api-test-workspace__topbar-value">{authChecked ? displayRole : '…'}</span>
          </div>
          <div className="api-test-workspace__topbar-item">
            <span className="api-test-workspace__topbar-label">Status</span>
            <span
              className={
                sessionUser
                  ? 'api-test-workspace__status api-test-workspace__status--ok'
                  : 'api-test-workspace__status'
              }
            >
              {authChecked ? loggedLabel : '…'}
            </span>
          </div>
        </header>

        <div className="api-test-workspace__panels">
          <section className="api-test-workspace__panel" aria-label="Request form">
            <ApiPanelTitle title={activeSection?.title ?? 'Section'} />

            {activeSectionId === 'login' ? (
              <div className="api-test-workspace__form">
                <label className="api-test-workspace__field">
                  <span className="api-test-workspace__field-label">X-Browser-ID</span>
                  <input className="api-test-workspace__input api-test-workspace__input--mono" readOnly value={browserId} />
                </label>
                <div className="api-test-workspace__actions">
                  <button type="button" className="api-test-workspace__btn" onClick={onRegenerateBrowserId}>
                    New browser id
                  </button>
                  <button type="button" className="api-test-workspace__btn api-test-workspace__btn--secondary" onClick={onClearMemory}>
                    Clear auth (memory)
                  </button>
                </div>
                <label className="api-test-workspace__field">
                  <span className="api-test-workspace__field-label">Bypass profile</span>
                  <select
                    className="api-test-workspace__input"
                    value={loginBypassProfile}
                    onChange={(event) => setLoginBypassProfile(event.target.value)}
                  >
                    <option value="student">student</option>
                    <option value="lecturer">lecturer</option>
                  </select>
                </label>
                <label className="api-test-workspace__field">
                  <span className="api-test-workspace__field-label">Auth token (debug)</span>
                  <textarea
                    className="api-test-workspace__textarea api-test-workspace__input--mono"
                    rows={3}
                    value={authToken}
                    onChange={(event) => setAuthToken(event.target.value)}
                  />
                </label>
                <div className="api-test-workspace__actions">
                  <button type="button" className="api-test-workspace__btn" disabled={isBusy} onClick={() => runLoginAction('bypass')}>
                    Establish dev session
                  </button>
                  <button type="button" className="api-test-workspace__btn" disabled={isBusy} onClick={() => runLoginAction('login')}>
                    POST /login
                  </button>
                  <button type="button" className="api-test-workspace__btn api-test-workspace__btn--secondary" disabled={isBusy} onClick={() => runLoginAction('logout')}>
                    POST /logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="api-test-workspace__form">
                <div className="api-test-workspace__nobodgeit-container">
                  <img
                    src={nobodgeitImg}
                    alt="No Bodge It"
                    className="api-test-workspace__nobodgeit"
                  />
                </div>
                {activeSection?.fields?.map((field) => {
                  if (field.type === 'file') {
                    return (
                      <label key={field.key} className="api-test-workspace__field">
                        <span className="api-test-workspace__field-label">{field.label}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setDriveFile(file);
                            if (file !== null) {
                              synced.updateField('driveSize', file.size);
                            }
                          }}
                        />
                      </label>
                    );
                  }
                  if (field.type === 'select') {
                    return (
                      <label key={field.key} className="api-test-workspace__field">
                        <span className="api-test-workspace__field-label">{field.label}</span>
                        <select
                          className="api-test-workspace__input"
                          value={String(synced.values[field.key] ?? '')}
                          onChange={(event) => synced.updateField(field.key, event.target.value)}
                        >
                          {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </label>
                    );
                  }
                  const inputType = field.type === 'number' ? 'number' : 'text';
                  const isTextarea = field.type === 'textarea';
                  return (
                    <label key={field.key} className="api-test-workspace__field">
                      <span className="api-test-workspace__field-label">{field.label}</span>
                      {isTextarea ? (
                        <textarea
                          className="api-test-workspace__textarea api-test-workspace__input--mono"
                          rows={2}
                          value={String(synced.values[field.key] ?? '')}
                          onChange={(event) => synced.updateField(field.key, event.target.value)}
                        />
                      ) : (
                        <input
                          className="api-test-workspace__input"
                          type={inputType}
                          value={String(synced.values[field.key] ?? '')}
                          onChange={(event) =>
                            synced.updateField(
                              field.key,
                              field.type === 'number' ? Number(event.target.value) : event.target.value,
                            )
                          }
                        />
                      )}
                    </label>
                  );
                })}
                {activeSection?.buildPath ? (
                  <p className="api-test-workspace__path">
                    Path: <code>{activeSection.buildPath(synced.values)}</code>
                  </p>
                ) : null}
                <div className="api-test-workspace__actions">
                  <button
                    type="button"
                    className="api-test-workspace__btn api-test-workspace__btn--primary"
                    disabled={isBusy || !synced.canSend}
                    onClick={onSendRequest}
                  >
                    Send request
                  </button>
                </div>
              </div>
            )}
          </section>

          <section className="api-test-workspace__panel" aria-label="Request JSON">
            <h2 className="api-test-workspace__panel-title">Request JSON</h2>
            <div className="api-test-workspace__panel-body">
              {activeSectionId === 'login' ? (
                <textarea
                  className="api-test-workspace__json-editor api-test-workspace__input--mono"
                  value={loginPreviewJson}
                  onChange={(event) => {
                    const text = event.target.value;
                    setLoginPreviewJson(text);
                    try {
                      const parsed = JSON.parse(text);
                      if (parsed.profile === 'student' || parsed.profile === 'lecturer') {
                        setLoginBypassProfile(parsed.profile);
                      }
                    } catch {
                      // keep form state until JSON is valid
                    }
                  }}
                  spellCheck={false}
                />
              ) : (
                <>
                  <textarea
                    className="api-test-workspace__json-editor api-test-workspace__input--mono"
                    value={synced.jsonText}
                    onChange={(event) => synced.updateJsonText(event.target.value)}
                    spellCheck={false}
                  />
                  {synced.jsonSyntaxError ? (
                    <p className="api-test-workspace__error">{synced.jsonSyntaxError}</p>
                  ) : null}
                  {synced.validationError ? (
                    <p className="api-test-workspace__error">{synced.validationError}</p>
                  ) : null}
                </>
              )}
            </div>
          </section>

          <section className="api-test-workspace__panel" aria-label="Response JSON">
            <h2 className="api-test-workspace__panel-title">Response</h2>
            <div className="api-test-workspace__panel-body">
              <pre className="api-test-workspace__response">{responseText.length > 0 ? responseText : '—'}</pre>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function ApiTestWorkspace() {
  return (
    <AuthProvider>
      <ApiTestWorkspaceInner />
    </AuthProvider>
  );
}
