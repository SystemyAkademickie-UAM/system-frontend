import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/organizations.api.js', () => ({
  listOrganizations: vi.fn(),
  bulkOrganizations: vi.fn(),
  listAllAdministrators: vi.fn(),
  deleteOrganization: vi.fn(),
  createOrganization: vi.fn(),
  updateOrganization: vi.fn(),
  listOrganizationAdministrators: vi.fn(),
  grantOrganizationAdministrator: vi.fn(),
  revokeOrganizationAdministrator: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/Toast/Toast.jsx';
import {
  bulkOrganizations,
  listAllAdministrators,
  listOrganizations,
} from '../../services/organizations.api.js';
import OrganizationManagementContent from './OrganizationManagementContent.jsx';

const MOCK_ORGS = [
  { id: 1, name: 'UAM Poznań', domain: 'amu.edu.pl', loginMethod: 'saml', isActive: true },
  { id: 2, name: 'Politechnika', domain: 'put.poznan.pl', loginMethod: 'email', isActive: true },
];

describe('OrganizationManagementContent', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    listAllAdministrators.mockResolvedValue([]);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  async function renderComponent() {
    await act(async () => {
      root.render(createElement(
        MemoryRouter,
        { initialEntries: ['/organizations'] },
        createElement(ToastProvider, null, createElement(OrganizationManagementContent)),
      ));
    });
  }

  it('renders title and loaded organizations in table', async () => {
    listOrganizations.mockResolvedValue(MOCK_ORGS);
    bulkOrganizations.mockResolvedValue(MOCK_ORGS);

    await renderComponent();

    expect(container.textContent).toContain('Zarządzanie organizacjami');
    expect(container.textContent).toContain('UAM Poznań');
    expect(container.textContent).toContain('Politechnika');
    expect(container.textContent).toContain('amu.edu.pl');
    expect(container.textContent).toContain('put.poznan.pl');
  });

  it('renders empty message when no organizations exist', async () => {
    listOrganizations.mockResolvedValue([]);
    bulkOrganizations.mockResolvedValue([]);

    await renderComponent();

    expect(container.textContent).toContain('Brak zarejestrowanych organizacji.');
  });
});
