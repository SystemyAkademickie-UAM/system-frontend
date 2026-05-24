/**
 * Resolves a path under Vite `public/` for use in <img src> etc.
 * @param {string} relativePath e.g. "assets/icon/maq.ico"
 */
export function publicAssetPath(relativePath) {
  const trimmed = relativePath.replace(/^\/+/, '');
  const root = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '') || '';
  return `${root}/${trimmed}`.replace(/\/+/g, '/');
}

/** Logo aplikacji — public/assets/icon/maq.ico */
export function appLogoPath() {
  return publicAssetPath('assets/icon/maq.ico');
}
