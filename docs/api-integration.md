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

Full request/response documentation is maintained **with the API service** that implements this contract.
