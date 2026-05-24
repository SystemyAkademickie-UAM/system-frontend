/** Default Pionier.id institution (locked until multi-IdP support). */
export const PIONIER_DEFAULT_INSTITUTION_ID = 'uam';

/** @type {{ id: string, label: string, enabled: boolean }[]} */
export const PIONIER_INSTITUTIONS = [
  {
    id: 'uam',
    label: 'Uniwersytet im. Adama Mickiewicza w Poznaniu (UAM)',
    enabled: true,
  },
];

/** Card width as fraction of 1920px Figma artboard (569 / 1920). */
export const AUTH_CARD_VIEWPORT_WIDTH_RATIO = 569 / 1920;

/** Inner content width as fraction of 1920px artboard (501 / 1920). */
export const AUTH_CONTENT_VIEWPORT_WIDTH_RATIO = 501 / 1920;

/** Panel width as fraction of 1920px artboard (1113 / 1920). */
export const AUTH_PANEL_VIEWPORT_WIDTH_RATIO = 1113 / 1920;

/** Auth card min height at 1920px — synced with `--auth-card-min-height` in AuthShell.css. */
export const AUTH_CARD_MIN_HEIGHT_PX = 558;

/** Footer MAQ logo opacity — matches muted footer text on `#282834`. */
export const MAQ_LOGO_MUTED_OPACITY = 0.6;
