/** localStorage key for stable `X-Browser-ID` across reloads. */
export const BROWSER_ID_LOCAL_STORAGE_KEY = 'maq.browserId';

/** @deprecated Migrated automatically to {@link BROWSER_ID_LOCAL_STORAGE_KEY}. */
export const BROWSER_ID_LOCAL_STORAGE_KEY_LEGACY = 'maq.smokeTest.browserUuid';

/** @deprecated Orphan key from an older frontend build; removed during migration. */
export const BROWSER_ID_LOCAL_STORAGE_KEY_ORPHAN = 'maq.browserUuid';

/** sessionStorage: browser id pinned when starting SAML (must match ACS RelayState). */
export const BROWSER_ID_SAML_PENDING_SESSION_KEY = 'maq.samlPendingBrowserId';

/** RFC 4122 UUID (matches backend `BROWSER_ID_UUID_REGEX`). */
export const BROWSER_ID_UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
