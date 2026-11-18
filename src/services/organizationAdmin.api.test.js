import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./api-client.js', () => ({
  getJson: vi.fn(),
  postJson: vi.fn(),
  patchJson: vi.fn(),
  deleteJson: vi.fn(),
}));

import {
  deleteJson,
  getJson,
  patchJson,
  postJson,
} from './api-client.js';
import {
  createOrganizationAccount,
  deleteOrganizationAccount,
  getOrganizationDashboard,
  getOrganizationStorage,
  listManageableOrganizations,
  listOrganizationAccounts,
  updateOrganizationAccount,
} from './organizationAdmin.api.js';

describe('organizationAdmin.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls getOrganizationDashboard with correct endpoint', async () => {
    getJson.mockResolvedValue({ ok: true, data: { organization: { id: 1 } } });

    const result = await getOrganizationDashboard(1);

    expect(getJson).toHaveBeenCalledWith('/admin/organizations/1/dashboard');
    expect(result).toEqual({ organization: { id: 1 } });
  });

  it('calls getOrganizationStorage with correct endpoint', async () => {
    getJson.mockResolvedValue({ ok: true, data: { quotaBytes: 104857600 } });

    const result = await getOrganizationStorage(2);

    expect(getJson).toHaveBeenCalledWith('/admin/organizations/2/storage');
    expect(result).toEqual({ quotaBytes: 104857600 });
  });

  it('throws an error with backend message on failure', async () => {
    getJson.mockResolvedValue({
      ok: false,
      data: { message: 'Organization 99 not found' },
    });

    await expect(getOrganizationDashboard(99)).rejects.toThrow('Organization 99 not found');
  });

  it('calls listManageableOrganizations', async () => {
    getJson.mockResolvedValue({ ok: true, data: [{ id: 1, name: 'UAM' }] });

    const result = await listManageableOrganizations();

    expect(getJson).toHaveBeenCalledWith('/admin/manageable-organizations');
    expect(result).toEqual([{ id: 1, name: 'UAM' }]);
  });
});
