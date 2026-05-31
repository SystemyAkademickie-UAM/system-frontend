import { getJson, postJson } from './api-client.js';

/**
 * @typedef {Object} EnrollmentCodeRow
 * @property {number} id
 * @property {string} code
 * @property {boolean} isActive
 * @property {string | null} expiresAt
 * @property {number | null} maxUses
 * @property {number} useCount
 */

/**
 * @param {EnrollmentCodeRow[]} codes
 * @returns {string}
 */
function pickLatestActiveEnrollmentCode(codes) {
  const sorted = [...codes].sort((left, right) => right.id - left.id);
  const now = Date.now();
  for (const row of sorted) {
    if (!row.isActive) {
      continue;
    }
    if (row.expiresAt !== null && new Date(row.expiresAt).getTime() <= now) {
      continue;
    }
    if (row.maxUses !== null && row.useCount >= row.maxUses) {
      continue;
    }
    return row.code;
  }
  return '';
}

/**
 * Pobiera aktualny kod dostępu grupy (tylko prowadzący).
 * GET /groups/:groupId/enrollment-codes — wybiera najnowszy aktywny wiersz.
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, code?: string, error?: string }>}
 */
export async function fetchAccessCode(groupId) {
  const result = await getJson(`/groups/${groupId}/enrollment-codes`, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się pobrać kodu' };
  }
  const codes = Array.isArray(result.data) ? /** @type {EnrollmentCodeRow[]} */ (result.data) : [];
  return { ok: true, code: pickLatestActiveEnrollmentCode(codes) };
}

/**
 * Generuje kod dostępu do grupy (tylko prowadzący).
 * POST /groups/:groupId/enrollment-codes
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, code?: string, error?: string }>}
 */
export async function generateAccessCode(groupId) {
  const result = await postJson(`/groups/${groupId}/enrollment-codes`, {}, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się wygenerować kodu' };
  }
  const data = /** @type {{ code?: string }} */ (result.data);
  if (!data.code || data.code.trim().length === 0) {
    return { ok: false, error: 'Nie udało się wygenerować kodu' };
  }
  return { ok: true, code: data.code };
}

/**
 * Dołącza studenta do grupy przez kod.
 * GET /groups/:groupId/invite?code=XXXXXX
 *
 * @param {string | number} groupId
 * @param {string} code
 * @returns {Promise<{ ok: boolean, enrollmentId?: number, error?: string }>}
 */
export async function enrollByCode(groupId, code) {
  const result = await getJson(`/groups/${groupId}/invite?code=${encodeURIComponent(code)}`, {
    includeBrowserId: true,
  });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się dołączyć do grupy' };
  }
  const data = /** @type {{ enrollmentId?: number, groupId?: number }} */ (result.data);
  if (data.enrollmentId === -1) {
    return { ok: false, error: 'Brak uprawnień' };
  }
  if (data.enrollmentId === -2) {
    return { ok: false, error: 'Grupa nie istnieje' };
  }
  if (data.enrollmentId === -4) {
    return { ok: false, error: 'Nieprawidłowy, wygasły lub wyczerpany kod' };
  }
  if (data.enrollmentId === -3) {
    return { ok: false, error: 'Błąd bazy danych' };
  }
  if (!data.enrollmentId || data.enrollmentId < 0) {
    return { ok: false, error: 'Nie udało się dołączyć do grupy' };
  }
  return { ok: true, enrollmentId: data.enrollmentId };
}

/**
 * Dołącza studenta do grupy (bez kodu, bezpośrednio).
 * POST /groups/:groupId/enroll
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, enrollmentId?: number, error?: string }>}
 */
export async function enrollInGroup(groupId) {
  const result = await postJson(`/groups/${groupId}/enroll`, {}, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się dołączyć do grupy' };
  }
  const data = /** @type {{ enrollmentId?: number }} */ (result.data);
  if (!data.enrollmentId || data.enrollmentId < 0) {
    return { ok: false, error: 'Nie udało się dołączyć do grupy' };
  }
  return { ok: true, enrollmentId: data.enrollmentId };
}
