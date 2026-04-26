# API integration (frontend)

This app talks to an HTTP **API** using JSON.

## Endpoint used

- **Method / path:** `POST /counter/increment` relative to `VITE_API_BASE_URL` (which must include the API mount, e.g. `http://host/api` → full URL `http://host/api/counter/increment`).
- **Request body:** `{ "currentCount": number }` (integer ≥ 0).
- **Response body:** `{ "count": number }` — the incremented value.

The UI sends the current displayed count and replaces it with `count` from the response.

## Configuration

`VITE_API_BASE_URL` is scheme + host + optional port + **global API prefix** (e.g. `/api`), without a trailing slash. Example: `http://127.0.0.1:8080/api`.

If the UI is served over **HTTPS**, this value must use **`https://`** for the same host. Otherwise the browser blocks the request (**mixed content**). If you omit `VITE_API_BASE_URL` in a production build, the app uses `window.location.origin + '/api'` (same scheme as the page). The API still allows an older `http://…` build to be corrected at runtime when the hostname matches the page.

Full request/response documentation is maintained with the API service: **`system-backend/docs/api/api.md`** (counter, health, SAML, etc.).

## SAML 2.0 (institutional login — PIONIER.id flow in the SPA)

1. **`/login`** — primary action **„Zaloguj przez PIONIER.id”** uses React Router **`location.state`** (`provider: "pionier"`) so the URL stays **`/login`** while the institution picker is shown (e-mail box is disabled until that feature exists). On mount, the SPA calls **`GET /api/auth/saml/me`** with **`credentials: 'include'`**; if **`authenticated: true`**, it **`replace`** navigates to **`/home`** so a **new tab** on the same origin picks up the existing **HTTP-only** session cookie without duplicating state in `localStorage`.
2. That step loads **`GET /api/auth/saml/institutions`**, user picks an institution with **`mode: "ready"`**, then **full-page navigation** to **`GET /api/auth/saml/login?institution=<id>`** (e.g. `local-proxy`, `uam` when `SAML_UAM_*` is set on the API). Legacy **`/login?provider=pionier`** is replaced with the same state (query stripped). Legacy **`/login/pionier`** redirects to **`/login`** with that state.
3. After SAML ACS, the API redirects the browser to **`SAML_LOGIN_SUCCESS_REDIRECT_URL`** (default **`/home`** on the SPA).

The session JWT lives in an **HTTP-only** cookie **`maqSamlSession`** (set by the API on ACS). To log out of **this app**, call **`POST /api/auth/saml/logout`** with **`credentials: 'include'`** (see `getSamlLogoutUrl()` in `api.constants.js`) and treat **non-OK** or **thrown** responses as failure — if the request never reaches the API (e.g. **CORS**), the cookie is **not** cleared. After a **successful** logout, the SPA stores a one-shot flag so the next **`GET …/auth/saml/login`** includes **`forceAuthn=1`**, asking the IdP for a **fresh** authentication instead of silent SSO.

`getSamlLoginUrl(institutionId, { forceAuthn })` in `api.constants.js` builds the login URL. The browser must **not** use `fetch` for the SSO start — only navigation.

In local development, Vite proxies **`/api`** to `http://127.0.0.1:8080`, and the default API base uses **`window.location.origin + '/api'`** so the SSO flow and cookies stay on the same host as the dev server. Run the Nest API on port **8080** when using this proxy.
