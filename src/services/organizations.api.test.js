import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as apiClient from './api-client.js';
import {
  listOrganizations,
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  listAllAdministrators,
  listOrganizationAdministrators,
  grantOrganizationAdministrator,
  revokeOrganizationAdministrator,
} from './organizations.api.js';

describe('organizations.api', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('listOrganizations returns data when ok', async () => {
    vi.spyOn(apiClient, 'getJson').mockResolvedValue({
      ok: true,
      data: [{ id: 1, name: 'UAM', domain: 'amu.edu.pl', isActive: true }],
    });

    const result = await listOrganizations();
    expect(result).toEqual([{ id: 1, name: 'UAM', domain: 'amu.edu.pl', isActive: true }]);
    expect(apiClient.getJson).toHaveBeenCalledWith('/admin/organizations');
  });

  it('createOrganization posts data to /admin/organizations', async () => {
    const payload = { name: 'Politechnika', domain: 'put.poznan.pl', loginMethod: 'email' };
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({
      ok: true,
      data: { id: 2, ...payload },
    });

    const result = await createOrganization(payload);
    expect(result.id).toBe(2);
    expect(apiClient.postJson).toHaveBeenCalledWith('/admin/organizations', payload);
  });

  it('grantOrganizationAdministrator posts email to administrators endpoint', async () => {
    vi.spyOn(apiClient, 'postJson').mockResolvedValue({
      ok: true,
      data: { accountId: 10, email: 'admin@amu.edu.pl' },
    });

    const result = await grantOrganizationAdministrator(1, 'admin@amu.edu.pl');
    expect(result.accountId).toBe(10);
    expect(apiClient.postJson).toHaveBeenCalledWith('/admin/organizations/1/administrators', {
      email: 'admin@amu.edu.pl',
    });
  });

  it('throws extracted error message on failure', async () => {
    vi.spyOn(apiClient, 'getJson').mockResolvedValue({
      ok: false,
      data: { message: ['Domain already taken', 'Name is required'] },
    });

    await expect(listOrganizations()).rejects.toThrow('Domain already taken Name is required');
  });
});

