/**
 * Mirrors backend `process.env.NODE_ENV === 'production'`.
 * Baked at build/dev time from the same `NODE_ENV` variable (Docker build arg / local `.env`).
 * @param {string | undefined} nodeEnv
 * @returns {boolean}
 */
export function resolveNodeProduction(nodeEnv) {
  return nodeEnv === 'production';
}

export function isNodeProduction() {
  return resolveNodeProduction(import.meta.env.NODE_ENV);
}
