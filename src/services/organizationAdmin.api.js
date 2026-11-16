import { getApiBaseUrl } from '../constants/api.constants.js';
import { ORGANIZATION_ACCOUNT_PAGE_SIZE } from '../constants/organizationAdmin.constants.js';
import { deleteJson, getJson, patchJson, postJson } from './api-client.js';

function messageFrom(data) {
  if (typeof data === 'string') {
    return data;
  }
  if (Array.isArray(data?.message)) {
    return data.message.join(' ');
  }
  if (typeof data?.message === 'string') {
    return data.message;
  }
  return 'Request failed';
}

async function requireOk(result) {
  if (result.ok) {
    return result.data;
  }
  throw new Error(messageFrom(result.data));
}

export async function listManageableOrganizations() {
  return requireOk(await getJson('/admin/manageable-organizations'));
}

export async function listOrganizationAccounts(organizationId, afterAccountId) {
  const query = new URLSearchParams({ limit: String(ORGANIZATION_ACCOUNT_PAGE_SIZE) });
  if (afterAccountId) {
    query.set('afterAccountId', String(afterAccountId));
  }
  return requireOk(await getJson(`/admin/organizations/${organizationId}/accounts/page?${query}`));
}

export async function createOrganizationAccount(organizationId, body) {
  return requireOk(await postJson(`/admin/organizations/${organizationId}/accounts`, body));
}

export async function updateOrganizationAccount(organizationId, accountId, body) {
  return requireOk(await patchJson(`/admin/organizations/${organizationId}/accounts/${accountId}`, body));
}

export async function deleteOrganizationAccount(organizationId, accountId) {
  return requireOk(await deleteJson(`/admin/organizations/${organizationId}/accounts/${accountId}`));
}

export async function importOrganizationAccounts(organizationId, users) {
  return requireOk(await postJson(`/admin/organizations/${organizationId}/accounts/import`, { users }));
}

export async function sendOrganizationLoginLink(organizationId, accountId) {
  return requireOk(await postJson(`/admin/organizations/${organizationId}/accounts/${accountId}/magic-link`, {}));
}

export async function downloadOrganizationAccounts(organizationId) {
  const response = await fetch(`${getApiBaseUrl()}/admin/organizations/${organizationId}/accounts/export`, {
    credentials: 'include',
  });
  if (!response.ok) {
    throw new Error('Export failed');
  }
  return response.blob();
}

export async function listOrganizationLog(query) {
  const params = new URLSearchParams();
  params.set('category', query.category);
  params.set('limit', String(query.limit));
  if (query.before && query.beforeId && query.beforeSource) {
    params.set('before', query.before);
    params.set('beforeId', String(query.beforeId));
    params.set('beforeSource', query.beforeSource);
  }
  return requireOk(await getJson(`/admin/organization-log?${params}`));
}
