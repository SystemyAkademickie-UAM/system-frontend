import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../context/SessionContext.jsx', () => ({
  useSession: () => ({ user: { organizationId: 3 } }),
}));

vi.mock('../../services/organizationAdmin.api.js', () => ({
  listManageableOrganizations: vi.fn(),
  listOrganizationAccounts: vi.fn(),
  createOrganizationAccount: vi.fn(),
  updateOrganizationAccount: vi.fn(),
  deleteOrganizationAccount: vi.fn(),
  downloadOrganizationAccounts: vi.fn(),
  importOrganizationAccounts: vi.fn(),
  sendOrganizationLoginLink: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/Toast/Toast.jsx';
import {
  listManageableOrganizations,
  listOrganizationAccounts,
} from '../../services/organizationAdmin.api.js';
import UserManagementContent from './UserManagementContent.jsx';

const ADA = {
  accountId: 2,
  name: 'Ada',
  surname: 'Local',
  email: 'ada@example.com',
  nickname: 'ada',
  role: 'lecturer',
};

describe('UserManagementContent', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    listManageableOrganizations.mockResolvedValue([{ id: 3, loginMethod: 'email' }]);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  async function renderPeople() {
    await act(async () => {
      root.render(createElement(
        MemoryRouter,
        { initialEntries: ['/users'] },
        createElement(ToastProvider, null, createElement(UserManagementContent)),
      ));
    });
  }

  it('renders a person and a change button', async () => {
    listOrganizationAccounts.mockResolvedValue({ items: [ADA], nextAfterAccountId: null });
    await renderPeople();
    expect(container.textContent).toContain('Ada Local');
    expect(container.textContent).toContain('Zmień');
  });

  it('renders organization selector when multiple manageable organizations exist', async () => {
    listManageableOrganizations.mockResolvedValue([
      { id: 3, name: 'Org A', loginMethod: 'email' },
      { id: 4, name: 'Org B', loginMethod: 'email' },
    ]);
    listOrganizationAccounts.mockResolvedValue({ items: [], nextAfterAccountId: null });
    await renderPeople();
    expect(container.textContent).toContain('Organizacja:');
    expect(container.querySelector('#user-org-select')).not.toBeNull();
  });

  it('keeps the empty sentence after the first load fails', async () => {
    listOrganizationAccounts.mockRejectedValue(new Error('Sieć'));
    await renderPeople();
    expect(container.textContent).toContain('W tej organizacji nie ma jeszcze kont.');
    expect(document.body.textContent).toContain('Sieć');
  });
});
