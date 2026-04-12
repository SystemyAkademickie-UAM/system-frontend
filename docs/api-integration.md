# API integration (frontend)

This app talks to an HTTP **API** using JSON.

## Endpoint used

- **Method / path:** `POST /api/counter/increment` (relative to the configured API base URL).
- **Request body:** `{ "currentCount": number }` (integer ≥ 0).
- **Response body:** `{ "count": number }` — the incremented value.

The UI sends the current displayed count and replaces it with `count` from the response.

## Configuration

`VITE_API_BASE_URL` must point at the API’s origin (scheme + host + optional port), without a trailing slash. Example: `http://127.0.0.1:8080`.

Full request/response documentation is maintained **with the API service** that implements this contract.
