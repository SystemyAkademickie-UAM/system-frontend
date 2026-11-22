import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../context/SessionContext.jsx', () => ({
  useSession: () => ({ user: { organizationId: 1 } }),
}));

vi.mock('../../services/organizationAdmin.api.js', () => ({
  listManageableOrganizations: vi.fn(),
  getOrganizationStorage: vi.fn(),
}));

import {
  getOrganizationStorage,
  listManageableOrganizations,
} from '../../services/organizationAdmin.api.js';
import DiskSpaceContent from './DiskSpaceContent.jsx';

const MOCK_STORAGE = {
  organizationId: 1,
  organizationName: 'Wydział Matematyki i Informatyki UAM',
  folderPath: 'storage/drive/1',
  quotaBytes: 104857600, // 100 MB
  usedBytes: 10485760,  // 10 MB
  availableBytes: 94371840,
  usagePercent: 10.0,
  fileCount: 2,
  serverTotalPoolBytes: 5368709120,
  maxFileSizeBytes: 4194304,
  estimatedMaxBanners: 25,
  files: [
    {
      ref: '11111111-1111-4111-8111-111111111111',
      fileName: '11111111-1111-4111-8111-111111111111',
      size: 2097152, // 2 MB
      mimeType: 'image/png',
      createdAt: '2026-11-15T14:00:00.000Z',
      groupId: 10,
      groupName: 'Algorytmy Zaawansowane',
      subjectName: 'Informatyka',
      lecturerName: 'Tomasz Lis',
      lecturerEmail: 'tlis@amu.edu.pl',
      downloadUrl: '/api/drive/11111111-1111-4111-8111-111111111111?organizationId=1',
    },
    {
      ref: '22222222-2222-4222-8222-222222222222',
      fileName: '22222222-2222-4222-8222-222222222222',
      size: 1048576, // 1 MB
      mimeType: 'image/jpeg',
      createdAt: '2026-11-16T10:00:00.000Z',
      groupId: 11,
      groupName: 'Bazy Danych',
      subjectName: 'Informatyka',
      lecturerName: 'Anna Kowalska',
      lecturerEmail: 'akowalska@amu.edu.pl',
      downloadUrl: '/api/drive/22222222-2222-4222-8222-222222222222?organizationId=1',
    },
  ],
};

describe('DiskSpaceContent', () => {
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
          { initialEntries: ['/disk-space'] },
          createElement(DiskSpaceContent),
        ),
      );
    });
  }

  it('renders disk space KPI metrics, folder path, and stored banners table in Polish', async () => {
    getOrganizationStorage.mockResolvedValue(MOCK_STORAGE);
    await renderComponent();

    expect(container.textContent).toContain('Zarządzanie przestrzenią dyskową');
    expect(container.textContent).toContain('10.00 MB');
    expect(container.textContent).toContain('100.00 MB');
    expect(container.textContent).toContain('storage/drive/1');
    expect(container.textContent).toContain('Algorytmy Zaawansowane');
    expect(container.textContent).toContain('Tomasz Lis');
    expect(container.textContent).toContain('Bazy Danych');
    expect(container.textContent).toContain('Anna Kowalska');
    expect(container.textContent).toContain('Otwórz podgląd');
  });

  it('filters file list by search query', async () => {
    getOrganizationStorage.mockResolvedValue(MOCK_STORAGE);
    await renderComponent();

    const searchInput = container.querySelector('.disk-space-search-input');
    expect(searchInput).not.toBeNull();

    await act(async () => {
      const nativeSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      ).set;
      nativeSetter.call(searchInput, 'Bazy Danych');
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    expect(container.textContent).toContain('Bazy Danych');
    expect(container.textContent).not.toContain('Algorytmy Zaawansowane');
  });

  it('renders English labels when language is set to english', async () => {
    document.cookie = 'CURRENTLANGUAGE=english';
    getOrganizationStorage.mockResolvedValue(MOCK_STORAGE);
    await renderComponent();

    expect(container.textContent).toContain('Disk Space Management');
    expect(container.textContent).toContain('Used space');
    expect(container.textContent).toContain('Allocated quota');
    expect(container.textContent).toContain('Available space');
    expect(container.textContent).toContain('Uploaded banners & files');
    expect(container.textContent).toContain('Open preview');
  });
});
