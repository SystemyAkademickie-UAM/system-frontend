/**
 * @file maintenance.api.test.js
 * @description Testy jednostkowe dla serwisu maintenance.api.
 */

import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchMaintenanceStatus,
  getCachedMaintenanceStatus,
  isCachedMaintenanceActive,
  subscribeMaintenanceStatus,
  updateCachedMaintenanceStatus,
  SYSTEM_STATUS_PATH,
} from './maintenance.api.js';

vi.mock('./api-client.js', () => ({
  getJson: vi.fn(),
}));

import { getJson } from './api-client.js';

describe('maintenance.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    sessionStorage.clear();
    updateCachedMaintenanceStatus(null);
  });

  it('updates cached status and notifies listeners', () => {
    const listener = vi.fn();
    const unsubscribe = subscribeMaintenanceStatus(listener);

    const status = {
      enabled: true,
      message: 'Prace serwisowe',
      estimatedEndAt: '2026-11-17T18:00:00Z',
      updatedAt: '2026-11-17T14:00:00Z',
    };

    updateCachedMaintenanceStatus(status);

    expect(isCachedMaintenanceActive()).toBe(true);
    expect(getCachedMaintenanceStatus()).toEqual(status);
    expect(listener).toHaveBeenCalledWith(status);

    unsubscribe();
  });

  it('fetches maintenance status from system status endpoint', async () => {
    getJson.mockResolvedValueOnce({
      ok: true,
      data: {
        maintenance: {
          enabled: true,
          message: 'Maintenance break in progress',
          estimatedEndAt: '2026-11-17T20:00:00Z',
          updatedAt: '2026-11-17T14:00:00Z',
        },
        serverTime: '2026-11-17T15:00:00Z',
      },
    });

    const result = await fetchMaintenanceStatus();
    expect(getJson).toHaveBeenCalledWith(SYSTEM_STATUS_PATH);
    expect(result).toEqual({
      enabled: true,
      message: 'Maintenance break in progress',
      estimatedEndAt: '2026-11-17T20:00:00Z',
      updatedAt: '2026-11-17T14:00:00Z',
    });
    expect(isCachedMaintenanceActive()).toBe(true);
  });

  it('returns cached status on fetch failure', async () => {
    const initialStatus = {
      enabled: true,
      message: 'Fallback notice',
      estimatedEndAt: null,
      updatedAt: null,
    };
    updateCachedMaintenanceStatus(initialStatus);

    getJson.mockResolvedValueOnce({ ok: false, status: 503, data: null });

    const result = await fetchMaintenanceStatus();
    expect(result).toEqual(initialStatus);
  });
});

