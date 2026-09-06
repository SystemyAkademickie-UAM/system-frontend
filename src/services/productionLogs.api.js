import { getJson, postJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

export const ADMIN_LOGS_PATH = '/admin/logs';
export const ADMIN_LOGS_EXPORT_PATH = '/admin/logs/export';
export const CLIENT_LOGS_PATH = '/client-logs';

/**
 * @returns {Promise<{ days: string[], timeZone: string }>}
 */
export async function fetchProductionLogDays() {
  const result = await getJson(ADMIN_LOGS_PATH);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, 'Nie udało się pobrać listy logów'));
  }
  return result.data;
}

/**
 * @param {{ clientPublicKey: string, day: string }} payload
 * @returns {Promise<object>}
 */
export async function exportEncryptedProductionLogs(payload) {
  const result = await postJson(ADMIN_LOGS_EXPORT_PATH, payload);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, 'Nie udało się pobrać logów'));
  }
  return result.data;
}

/**
 * Fire-and-forget browser line. Failures must not throw into the UI.
 * @param {{ level: 'error' | 'warn', message: string, source?: string }} payload
 */
export function ingestClientLog(payload) {
  postJson(CLIENT_LOGS_PATH, payload).catch(() => undefined);
}
