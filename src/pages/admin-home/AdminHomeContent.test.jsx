import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../context/SessionContext.jsx', () => ({
  useSession: () => ({ user: { organizationId: 1 } }),
}));

vi.mock('../../services/organizationAdmin.api.js', () => ({
  listManageableOrganizations: vi.fn(),
  getOrganizationDashboard: vi.fn(),
}));

import {
  getOrganizationDashboard,
  listManageableOrganizations,
} from '../../services/organizationAdmin.api.js';
import AdminHomeContent from './AdminHomeContent.jsx';

const MOCK_DASHBOARD = {
  organization: {
    id: 1,
    name: 'Wydział Matematyki i Informatyki UAM',
    domain: 'wmi.amu.edu.pl',
    loginMethod: 'saml',
    contactEmail: 'kontakt@wmi.amu.edu.pl',
    contactPhone: '+48 61 829 0000',
    representative: {
      fullName: 'Jan Kowalski',
      email: 'jan.kowalski@amu.edu.pl',
      phone: '+48 61 829 0001',
    },
    address: {
      town: 'Poznań',
      street: 'ul. Uniwersytetu Poznańskiego',
      building: '4',
      postalCode: '61-614',
      country: 'pl',
    },
    isActive: true,
    createdAt: '2026-10-01T12:00:00.000Z',
  },
  summary: {
    accounts: {
      total: 42,
      students: 35,
      lecturers: 5,
      administrators: 2,
    },
    groups: {
      total: 10,
      withBanner: 8,
    },
    storage: {
      folderPath: 'storage/drive/1',
      quotaBytes: 104857600, // 100 MB
      usedBytes: 15728640,  // 15 MB
      availableBytes: 89128960,
      usagePercent: 15.0,
      fileCount: 8,
      bannersCount: 8,
      serverTotalPoolBytes: 5368709120,
      maxFileSizeBytes: 4194304,
      estimatedMaxBanners: 25,
    },
    recentActivity: [
      {
        id: 1,
        occurredAt: '2026-11-17T12:00:00.000Z',
        category: 'organization',
        kind: 'file_stored',
        actorName: 'Piotr Nowak',
        groupName: 'Algorytmy',
        fileName: 'banner.png',
        fileSizeBytes: 2000000,
      },
    ],
  },
};

describe('AdminHomeContent', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    listManageableOrganizations.mockResolvedValue([
      { id: 1, name: 'Wydział Matematyki i Informatyki UAM', loginMethod: 'saml' },
    ]);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  async function renderComponent() {
    await act(async () => {
      root.render(
        createElement(
          MemoryRouter,
          { initialEntries: ['/home'] },
          createElement(AdminHomeContent),
        ),
      );
    });
  }

  it('renders organization details, account counts, groups, and storage metrics in Polish', async () => {
    getOrganizationDashboard.mockResolvedValue(MOCK_DASHBOARD);
    await renderComponent();

    expect(container.textContent).toContain('Moja organizacja');
    expect(container.textContent).toContain('Wydział Matematyki i Informatyki UAM');
    expect(container.textContent).toContain('wmi.amu.edu.pl');
    expect(container.textContent).toContain('Jan Kowalski');
    expect(container.textContent).toContain('Osoby w organizacji');
    expect(container.textContent).toContain('42');
    expect(container.textContent).toContain('Osoby studiujące');
    expect(container.textContent).toContain('35');
    expect(container.textContent).toContain('Przestrzeń dyskowa organizacji');
    expect(container.textContent).toContain('storage/drive/1');
    expect(container.textContent).toContain('15.00 MB');
    expect(container.textContent).toContain('100.00 MB');
    expect(container.textContent).toContain('Zarządzaj kontami');
    expect(container.textContent).toContain('Zarządzaj przestrzenią dyskową');
  });

  it('renders English labels when language is set to english', async () => {
    document.cookie = 'CURRENTLANGUAGE=english';
    getOrganizationDashboard.mockResolvedValue(MOCK_DASHBOARD);
    await renderComponent();

    expect(container.textContent).toContain('My organization');
    expect(container.textContent).toContain('People in organization');
    expect(container.textContent).toContain('Studying persons');
    expect(container.textContent).toContain('Leading persons');
    expect(container.textContent).toContain('Administering persons');
    expect(container.textContent).toContain('Organization disk storage');
    expect(container.textContent).toContain('Manage disk space');
  });

  it('renders error banner and retry button when fetching dashboard fails', async () => {
    getOrganizationDashboard.mockRejectedValue(new Error('Błąd serwera'));
    await renderComponent();

    expect(container.textContent).toContain('Błąd serwera');
    expect(container.textContent).toContain('Spróbuj ponownie');
  });
});
