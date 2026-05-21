/**
 * @param {unknown} value
 * @returns {value is Record<string, unknown>}
 */
function isRecord(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * @param {Record<string, unknown>} obj
 * @param {string} path - dot path, e.g. `group.name`
 * @returns {unknown}
 */
function getByPath(obj, path) {
  const parts = path.split('.');
  let current = obj;
  for (const part of parts) {
    if (!isRecord(current) || !(part in current)) {
      return undefined;
    }
    current = current[part];
  }
  return current;
}

/**
 * @param {Record<string, unknown>} payload
 * @param {string[]} requiredKeys - dot paths
 * @param {string[]} [allowEmptyKeys] - keys that may be present as empty string
 * @returns {string | null}
 */
export function validateRequiredKeys(payload, requiredKeys, allowEmptyKeys = []) {
  const allowEmpty = new Set(allowEmptyKeys);
  const missing = [];
  for (const key of requiredKeys) {
    const value = getByPath(payload, key);
    if (value === undefined || value === null) {
      missing.push(key);
      continue;
    }
    if (value === '' && !allowEmpty.has(key)) {
      missing.push(key);
    }
  }
  if (missing.length === 0) {
    return null;
  }
  return `Missing required keys: ${missing.join(', ')}`;
}

/**
 * @param {string} text
 * @returns {{ parsed: Record<string, unknown> | null, error: string | null }}
 */
export function parseJsonObject(text) {
  try {
    const parsed = JSON.parse(text);
    if (!isRecord(parsed)) {
      return { parsed: null, error: 'JSON root must be an object.' };
    }
    return { parsed, error: null };
  } catch {
    return { parsed: null, error: 'Invalid JSON syntax.' };
  }
}
