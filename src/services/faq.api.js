/**
 * @file faq.api.js
 * @description Moduł komunikacji z API backendu realizujący operacje odczytu i zarządzania stroną FAQ.
 */

// === IMPORTY I KONFIGURACJA KLIENTA API ===
import {
  FAQ_ADMIN_PATH,
  FAQ_ADMIN_REORDER_PATH,
  FAQ_PUBLIC_PATH,
} from '../constants/faq.constants.js';
import {
  deleteJson,
  getJson,
  patchJson,
  postJson,
  putJson,
} from './api-client.js';
import { extractApiError } from './apiErrors.js';

/**
 * @typedef {Object} FaqItem
 * @property {number} id
 * @property {string} question
 * @property {string} answer
 * @property {string} category
 * @property {number} orderIndex
 * @property {boolean} isPublished
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} FaqDraftItem
 * @property {string} question
 * @property {string} answer
 * @property {string} [category]
 * @property {number} [orderIndex]
 * @property {boolean} [isPublished]
 */

/**
 * Buduje ścieżkę z parametrami zapytania URL.
 * @param {string} basePath
 * @param {Record<string, string | undefined>} params
 * @returns {string}
 */
function buildPathWithQuery(basePath, params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      searchParams.set(key, value);
    }
  });
  const queryString = searchParams.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

// === OPERACJE ODCZYTU (DLA WSZYSTKICH UŻYTKOWNIKÓW) ===
/**
 * Pobiera listę opublikowanych wpisów FAQ dostępnych dla wszystkich użytkowników.
 * @param {{ category?: string, grouped?: boolean }} [options]
 * @returns {Promise<FaqItem[]>}
 */
export async function fetchPublicFaqs(options = {}) {
  const path = buildPathWithQuery(FAQ_PUBLIC_PATH, {
    category: options.category,
    grouped: options.grouped ? 'true' : undefined,
  });
  const result = await getJson(path);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return Array.isArray(result.data) ? result.data : [];
}

// === OPERACJE ZARZĄDZANIA (OSOBA NADZORUJĄCA) ===
/**
 * Pobiera pełną listę wpisów FAQ (wraz ze szkicami) dla osoby nadzorującej.
 * @param {{ category?: string, search?: string }} [filters]
 * @returns {Promise<FaqItem[]>}
 */
export async function fetchAdminFaqs(filters = {}) {
  const path = buildPathWithQuery(FAQ_ADMIN_PATH, {
    category: filters.category,
    search: filters.search,
  });
  const result = await getJson(path);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Zastępuje i zapisuje całą listę wpisów na stronie FAQ (tryb Edytuj -> Zapisz).
 * @param {FaqDraftItem[]} items
 * @returns {Promise<FaqItem[]>}
 */
export async function replaceAllFaqs(items) {
  const result = await putJson(FAQ_ADMIN_PATH, { items });
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Tworzy pojedynczy wpis FAQ.
 * @param {FaqDraftItem} payload
 * @returns {Promise<FaqItem>}
 */
export async function createFaq(payload) {
  const result = await postJson(FAQ_ADMIN_PATH, payload);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return /** @type {FaqItem} */ (result.data);
}

/**
 * Aktualizuje pojedynczy wpis FAQ po identyfikatorze.
 * @param {number} id
 * @param {Partial<FaqDraftItem>} payload
 * @returns {Promise<FaqItem>}
 */
export async function updateFaq(id, payload) {
  const result = await putJson(`${FAQ_ADMIN_PATH}/${id}`, payload);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return /** @type {FaqItem} */ (result.data);
}

/**
 * Zmienia kolejność wpisów FAQ.
 * @param {{ id: number, orderIndex: number }[]} items
 * @returns {Promise<FaqItem[]>}
 */
export async function reorderFaqs(items) {
  const result = await patchJson(FAQ_ADMIN_REORDER_PATH, { items });
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return Array.isArray(result.data) ? result.data : [];
}

/**
 * Usuwa pojedynczy wpis FAQ po identyfikatorze.
 * @param {number} id
 * @returns {Promise<{ deleted: boolean, id: number }>}
 */
export async function deleteFaq(id) {
  const result = await deleteJson(`${FAQ_ADMIN_PATH}/${id}`);
  if (!result.ok) {
    throw new Error(extractApiError(result.data, ''));
  }
  return /** @type {{ deleted: boolean, id: number }} */ (result.data);
}
