import { getJson, postJson } from './api-client.js';

/**
 * Pobiera aktualny kod dostępu grupy (tylko prowadzący).
 * GET /groups/:groupId/access-code
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, code?: string, error?: string }>}
 */
export async function fetchAccessCode(groupId) {
  const result = await getJson(`/groups/${groupId}/access-code`, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się pobrać kodu' };
  }
  const data = /** @type {{ code?: string, groupId?: number }} */ (result.data);
  if (data.groupId === -1) {
    return { ok: false, error: 'Brak uprawnień do odczytu kodu' };
  }
  if (data.groupId === -2) {
    return { ok: false, error: 'Grupa nie istnieje' };
  }
  if (data.groupId === -3) {
    return { ok: false, error: 'Błąd bazy danych' };
  }
  return { ok: true, code: data.code || '' };
}

/**
 * Generuje kod dostępu do grupy (tylko prowadzący).
 * POST /groups/generate-code
 *
 * @param {string | number} groupId
 * @returns {Promise<{ ok: boolean, code?: string, error?: string }>}
 */
export async function generateAccessCode(groupId) {
  const result = await postJson('/groups/generate-code', { groupId: Number(groupId) }, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się wygenerować kodu' };
  }
  const data = /** @type {{ code?: string, groupId?: number }} */ (result.data);
  if (!data.code || data.groupId < 0) {
    if (data.groupId === -1) {
      return { ok: false, error: 'Brak uprawnień do generowania kodu' };
    }
    if (data.groupId === -2) {
      return { ok: false, error: 'Grupa nie istnieje' };
    }
    return { ok: false, error: 'Nie udało się wygenerować kodu' };
  }
  return { ok: true, code: data.code };
}

/**
 * Dołącza studenta do grupy przez kod.
 * GET /groups/:groupId/invite?code=XXXXXX
 *
 * @param {string | number} groupId
 * @param {string} code - 6-znakowy kod dostępu
 * @returns {Promise<{ ok: boolean, enrollmentId?: number, error?: string }>}
 */
export async function enrollByCode(groupId, code) {
  const result = await getJson(`/groups/${groupId}/invite?code=${encodeURIComponent(code)}`, { includeBrowserId: true });
  if (!result.ok) {
    const errorData = /** @type {{ message?: string }} */ (result.data);
    return { ok: false, error: errorData?.message || 'Nie udało się dołączyć do grupy' };
  }
  const data = /** @type {{ enrollmentId?: number, groupId?: number }} */ (result.data);
  if (data.enrollmentId === -1) {
    return { ok: false, error: 'Brak uprawnień' };
  }
  if (data.enrollmentId === -2) {
    return { ok: false, error: 'Nieprawidłowy kod lub grupa' };
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
