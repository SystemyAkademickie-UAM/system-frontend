# API integration (frontend)

This SPA talks to the **system-backend** HTTP API over JSON. Full endpoint reference lives in the backend repo: **`docs/api.md`**.

## Base URL

`VITE_API_BASE_URL` is scheme + host + optional port + **global API prefix** (`/api`), without a trailing slash.

| Environment | Typical value | Notes |
| ----------- | ------------- | ----- |
| Vite dev (`npm run dev`) | *(unset)* → `window.location.origin + '/api'` | Vite proxies `/api` → `http://127.0.0.1:8080` |
| Docker UI (default) | *(unset)* → same origin | nginx proxies `/api/` → Nest on host **8080** |
| Direct Nest / split origin | `http://127.0.0.1:8080/api` | Set at build time; mind cookies and CORS |

Use **`127.0.0.1`** consistently with backend `CORS_ORIGIN` and SAML cookie settings (avoid mixing `localhost` and `127.0.0.1`).

If the page is **HTTPS**, the API base must also use **`https://`** (mixed content otherwise).

## Authentication

### Browser id

Each browser install stores an RFC 4122 UUID in **`localStorage`**. The app sends it as header **`X-Browser-ID`** on strong-auth requests. Before SAML login, the SPA **pins** this id so the value in RelayState matches the header after redirect (`pinBrowserIdForSamlFlow` in `src/auth/browserIdStorage.js`).

### SAML institutional login

1. User opens **`/login`**, picks an organization.
2. Full-page navigation to **`GET {apiBase}/auth/saml/login?organizationId=&browserId=`** (not `fetch`).
3. After IdP sign-in, ACS mints **`maq_auth`** (HTTP-only cookie) when RelayState carries the browser id.
4. **`SessionContext`** restores session via **`GET /login/me`**, then registration status / profile as needed.

Local stack: backend on **8080**, optional IdP on **5000** — see backend [saml-local-idp.md](../system-backend/docs/saml-local-idp.md).

### Session endpoints (SPA)

| Method / path | Purpose |
| ------------- | ------- |
| `GET /login/me` | Authenticated user snapshot (strong auth preferred) |
| `GET /login/registration-status` | Registration wizard progress |
| `POST /login/profile` | Nickname + avatar during `/login` |
| `POST /login/accept-eula` | Complete registration |
| `GET /profile` | Profile (soft auth) |
| `POST /login` | Exchange SAML session for opaque bearer (when needed) |
| `POST /logout` | Revoke token + clear cookies |

Registered users are redirected from **`/login`** to **`/groups`** when session + registration are complete.

### Opaque bearer

Some lecturer/student APIs accept `{ "auth": "<token>" }` in the body or `auth` query param, or the **`maq_auth`** cookie. Issued by **`POST /login`** after SAML; bound to **`X-Browser-ID`**.

## Groups and enrollment codes

| Method / path | Role | Purpose |
| ------------- | ---- | ------- |
| `GET /groups` | both | User's groups |
| `POST /groups/new` | lecturer | Create group |
| `GET /groups/:groupId/enrollment-codes` | lecturer | List invite codes |
| `POST /groups/:groupId/enrollment-codes` | lecturer | Generate / create code |
| `PATCH /groups/:groupId/enrollment-codes/:codeId` | lecturer | Update limits / active flag |
| `DELETE /groups/:groupId/enrollment-codes/:codeId` | lecturer | Delete code |
| `GET /groups/:groupId/invite?code=` | student | Join by code (`enrollmentId`; `-4` = invalid code) |
| `POST /groups/:groupId/enroll` | student | Enroll without code |

Production helpers: `src/services/enrollment.api.js` (used by group members UI).

Legacy **`POST /groups/generate-code`** and **`GET /groups/:groupId/access-code`** still exist on the API but are not used by the main UI; prefer enrollment-codes CRUD.

## Dev API test workspace

When **`NODE_ENV=development`** at build time, **`/dev/api-test`** exposes manual panels for login/logout, registration, groups, enrollment codes, and other endpoints. Login panel: **`POST /login`** and **`POST /logout`** only (no dev SAML bypass).

## Counter demo

Placeholder contract still wired in the sample UI:

- **`POST /counter/increment`** — body `{ "currentCount": number }`, response `{ "count": number }`.
