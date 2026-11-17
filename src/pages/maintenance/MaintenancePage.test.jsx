/**
 * @file MaintenancePage.test.jsx
 * @description Testy jednostkowe dla komponentu MaintenancePage.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
  Link: ({ children, to }) => createElement('a', { href: to }, children),
}));

const mockFetchMaintenanceStatus = vi.fn();
const mockSubscribeMaintenanceStatus = vi.fn(() => () => {});
const mockGetCachedMaintenanceStatus = vi.fn();

vi.mock('../../services/maintenance.api.js', () => ({
  fetchMaintenanceStatus: () => mockFetchMaintenanceStatus(),
  subscribeMaintenanceStatus: (cb) => mockSubscribeMaintenanceStatus(cb),
  getCachedMaintenanceStatus: () => mockGetCachedMaintenanceStatus(),
}));

let mockRole = null;
vi.mock('../../context/AppRoleContext.jsx', () => ({
  useAppRoleOptional: () => ({ role: mockRole }),
}));

vi.mock('../../context/SessionContext.jsx', () => ({
  useSessionOptional: () => ({ role: mockRole }),
}));

import MaintenancePage from './MaintenancePage.jsx';

describe('MaintenancePage', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    mockNavigate.mockReset();
    mockRole = 'student';
    mockGetCachedMaintenanceStatus.mockReturnValue({
      enabled: true,
      message: 'Planowa przerwa techniczna na serwerze.',
      estimatedEndAt: '2026-11-17T18:00:00Z',
    });
    mockFetchMaintenanceStatus.mockResolvedValue({
      enabled: true,
      message: 'Planowa przerwa techniczna na serwerze.',
      estimatedEndAt: '2026-11-17T18:00:00Z',
    });
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders maintenance header, custom message, and estimated end time', async () => {
    await act(async () => {
      root.render(createElement(MaintenancePage));
    });

    expect(container.textContent).toContain('PRZERWA TECHNICZNA');
    expect(container.textContent).toContain('Prace serwisowe w toku');
    expect(container.textContent).toContain('Planowa przerwa techniczna na serwerze.');
    expect(container.textContent).toContain('Przewidywany czas zakończenia:');
    expect(container.textContent).toContain('Sprawdź dostępność systemu');
  });

  it('navigates to home if maintenance is inactive on status fetch', async () => {
    mockFetchMaintenanceStatus.mockResolvedValueOnce({
      enabled: false,
      message: '',
      estimatedEndAt: null,
    });

    await act(async () => {
      root.render(createElement(MaintenancePage));
    });

    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('displays supervisor access box when logged in as superadmin', async () => {
    mockRole = 'superadmin';

    await act(async () => {
      root.render(createElement(MaintenancePage));
    });

    expect(container.textContent).toContain('Panel osoby nadzorującej');
    expect(container.textContent).toContain('Przejdź do panelu organizacji');
    expect(container.textContent).toContain('Zarządzaj przerwą techniczną');
  });
});

