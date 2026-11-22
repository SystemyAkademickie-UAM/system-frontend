/**
 * @file organizations.api.js
 * @description Moduł komunikacji z API organizacji i administratorów dla roli osoby nadzorującej (superadmin).
 */

import { deleteJson, getJson, patchJson, postJson } from './api-client.js';

function extractErrorMessage(data) {
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data?.message)) {
    return data.message.join(' ');
  }
  if (typeof data?.message === 'string') {
    return data.message;
  }
  return 'Wystąpił błąd podczas komunikacji z serwerem.';
}

async function requireOk(result) {
  if (result.ok) {
    return result.data;
  }
  throw new Error(extractErrorMessage(result.data));
}

/**
 * Pobiera podstawową listę organizacji (id, name, isActive, domain).
 */
export async function listOrganizations() {
  return requireOk(await getJson('/admin/organizations'));
}

/**
 * Pobiera pełne szczegóły pojedynczej organizacji.
 * @param {number} organizationId
 */
export async function getOrganization(organizationId) {
  return requireOk(await getJson(`/admin/organizations/${organizationId}`));
}

/**
 * Pobiera pełne rekordy organizacji dla przekazanych identyfikatorów.
 * @param {number[]} ids
 */
export async function bulkOrganizations(ids) {
  return requireOk(await postJson('/admin/organizations/bulk', { ids }));
}

/**
 * Tworzy nową organizację w systemie.
 * @param {Object} data - Obiekt CreateOrganizationDto
 */
export async function createOrganization(data) {
  return requireOk(await postJson('/admin/organizations', data));
}

/**
 * Aktualizuje właściwości istniejącej organizacji.
 * @param {number} organizationId
 * @param {Object} data - Obiekt UpdateOrganizationDto
 */
export async function updateOrganization(organizationId, data) {
  return requireOk(await patchJson(`/admin/organizations/${organizationId}`, data));
}

/**
 * Usuwa (dezaktywuje/soft-delete) organizację.
 * @param {number} organizationId
 */
export async function deleteOrganization(organizationId) {
  return requireOk(await deleteJson(`/admin/organizations/${organizationId}`));
}

/**
 * Pobiera listę administratorów wszystkich aktywnych organizacji.
 */
export async function listAllAdministrators() {
  return requireOk(await getJson('/admin/organizations/administrators'));
}

/**
 * Pobiera listę administratorów przypisanych do wybranej organizacji.
 * @param {number} organizationId
 */
export async function listOrganizationAdministrators(organizationId) {
  return requireOk(await getJson(`/admin/organizations/${organizationId}/administrators`));
}

/**
 * Osoby z organizacji, które nie mają jeszcze roli osoby administrującej.
 * @param {number} organizationId
 */
export async function listOrganizationAdministratorCandidates(organizationId) {
  return requireOk(await getJson(`/admin/organizations/${organizationId}/administrators/candidates`));
}

/**
 * Nadaje rolę osoby administrującej osobie, która już jest w organizacji.
 * @param {number} organizationId
 * @param {number} userId
 */
export async function grantOrganizationAdministrator(organizationId, userId) {
  return requireOk(await postJson(`/admin/organizations/${organizationId}/administrators`, { userId }));
}

/**
 * Tworzy pierwszą osobę w organizacji logującej się łączem e-mail i nadaje jej rolę administrującą.
 * @param {number} organizationId
 * @param {{ email: string, name: string, surname: string }} body
 */
export async function createFirstOrganizationAdministrator(organizationId, body) {
  return requireOk(await postJson(`/admin/organizations/${organizationId}/administrators/first`, body));
}

/**
 * Odbiera rolę administratora danej organizacji.
 * @param {number} organizationId
 * @param {number} accountId
 */
export async function revokeOrganizationAdministrator(organizationId, accountId) {
  return requireOk(await deleteJson(`/admin/organizations/${organizationId}/administrators/${accountId}`));
}

