/**
 * Resolves a path under Vite `public/` for use in <img src> etc.
 * @param {string} relativePath e.g. "assets/logomyacademyquest.png"
 */
export function publicAssetPath(relativePath) {
  const trimmed = relativePath.replace(/^\/+/, '');
  const root = (import.meta.env.BASE_URL ?? '/').replace(/\/+$/, '') || '';
  return `${root}/${trimmed}`.replace(/\/+/g, '/');
}
