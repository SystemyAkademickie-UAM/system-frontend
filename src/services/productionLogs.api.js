/**
 * @file productionLogs.api.js
 * @description Moduł komunikacji z API backendu realizujący operacje dla productionLogs.
 */

// === IMPORTY I KONFIGURACJA KLIENTA API ===
import { getJson, postJson, putJson } from './api-client.js';
import { extractApiError } from './apiErrors.js';

// === PUNKTY KOŃCOWE I STAŁE ZAPYTAŃ ===
export const ADMIN_LOGS_PATH = '/admin/logs';
export const ADMIN_LOGS_RETENTION_PATH = '/admin/logs/retention';
export const ADMIN_LOGS_EXPORT_PATH = '/admin/logs/export';
export const CLIENT_LOGS_PATH = '/client-logs';
export const ADMIN_ORGANIZATIONS_PATH = '/admin/organizations';

/**
 * @returns {Promise<{ ttlDays: number, defaultTtlDays: number }>}
 */
export async function fetchLogRetention() {
  const result = await getJson(ADMIN_LOGS_RETENTION_PATH);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, 'Nie udało się pobrać konfiguracji retencji logów'));
  }
  return result.data;
}

/**
 * @param {number} ttlDays
 * @returns {Promise<{ ttlDays: number, defaultTtlDays: number }>}
 */
export async function updateLogRetention(ttlDays) {
  const result = await putJson(ADMIN_LOGS_RETENTION_PATH, { ttlDays });
  if (!result.ok) {
    throw new Error(extractApiError(result.data, 'Nie udało się zaktualizować retencji logów'));
  }
  return result.data;
}

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
 * @returns {Promise<Array<{ id: number, name: string, isActive: boolean, domain: string }>>}
 */
export async function fetchOrganizations() {
  const result = await getJson(ADMIN_ORGANIZATIONS_PATH);

  if (!result.ok) {
    return [];
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * @param {{ clientPublicKey: string, day: string, organizationId?: string }} payload
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

// === OPERACJE I ZAPYTANIA REST API ===
export function ingestClientLog(payload) {
  postJson(CLIENT_LOGS_PATH, payload).catch(() => undefined);
}
