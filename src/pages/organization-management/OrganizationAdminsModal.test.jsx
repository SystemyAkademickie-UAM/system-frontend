import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/organizations.api.js', () => ({
  listOrganizationAdministrators: vi.fn(),
  listOrganizationAdministratorCandidates: vi.fn(),
  grantOrganizationAdministrator: vi.fn(),
  createFirstOrganizationAdministrator: vi.fn(),
  revokeOrganizationAdministrator: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/Toast/Toast.jsx';
import {
  createFirstOrganizationAdministrator,
  grantOrganizationAdministrator,
  listOrganizationAdministratorCandidates,
  listOrganizationAdministrators,
} from '../../services/organizations.api.js';
import OrganizationAdminsModal from './OrganizationAdminsModal.jsx';

describe('OrganizationAdminsModal', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  function typeInto(input, value) {
    const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }

  async function renderModal(organization) {
    await act(async () => {
      root.render(createElement(
        ToastProvider,
        null,
        createElement(OrganizationAdminsModal, {
          isOpen: true,
          onClose: () => undefined,
          organization,
          onAdminListChanged: () => undefined,
        }),
      ));
    });
  }

  it('shows people from the organization and grants the role without an email field', async () => {
    listOrganizationAdministrators.mockResolvedValue([]);
    listOrganizationAdministratorCandidates.mockResolvedValue([
      { userId: 7, name: 'Ada', surname: 'Lovelace', nickname: '', email: 'ada@university.example' },
      { userId: 8, name: 'Grace', surname: 'Hopper', nickname: '', email: 'grace@university.example' },
    ]);

    await renderModal({ id: 3, name: 'Email org', loginMethod: 'email' });

    expect(document.body.textContent).toContain('Ada Lovelace');
    expect(document.body.textContent).toContain('Grace Hopper');
    expect(document.body.querySelector('#admin-email-input')).toBeNull();

    const search = document.body.querySelector('input[name="administrator-search"]');
    await act(async () => {
      typeInto(search, 'Grace');
    });
    expect(document.body.textContent).not.toContain('Ada Lovelace');
    expect(document.body.textContent).toContain('Grace Hopper');

    const grantButton = [...document.body.querySelectorAll('button')].find((button) => button.textContent === 'Nadaj rolę');
    await act(async () => {
      grantButton.click();
    });
    expect(grantOrganizationAdministrator).toHaveBeenCalledWith(3, 8);
  });

  it('asks for the first person only when an email organization has nobody', async () => {
    listOrganizationAdministrators.mockResolvedValue([]);
    listOrganizationAdministratorCandidates.mockResolvedValue([]);
    createFirstOrganizationAdministrator.mockResolvedValue({ accountId: 1, userId: 2 });

    await renderModal({ id: 4, name: 'New email org', loginMethod: 'email' });

    expect(document.body.textContent).toContain('Pierwsza osoba administrująca');
    const name = document.body.querySelector('#first-admin-name');
    const surname = document.body.querySelector('#first-admin-surname');
    const email = document.body.querySelector('#first-admin-email');
    await act(async () => {
      typeInto(name, 'Ada');
      typeInto(surname, 'Lovelace');
      typeInto(email, 'ada@university.example');
    });
    const save = [...document.body.querySelectorAll('button')].find((button) => button.textContent === 'Dodaj osobę administrującą');
    await act(async () => {
      save.click();
    });
    expect(createFirstOrganizationAdministrator).toHaveBeenCalledWith(4, {
      email: 'ada@university.example',
      name: 'Ada',
      surname: 'Lovelace',
    });
  });
});
