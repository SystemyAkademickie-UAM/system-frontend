import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/organizations.api.js', () => ({
  listOrganizationAdministrators: vi.fn(),
  listOrganizationAdministratorCandidates: vi.fn(),
  grantOrganizationAdministrator: vi.fn(),
  grantOrganizationAdministratorByEmail: vi.fn(),
  revokeOrganizationAdministrator: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/Toast/Toast.jsx';
import {
  grantOrganizationAdministrator,
  grantOrganizationAdministratorByEmail,
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

  it('adds an administering person by email even when the organization already has people', async () => {
    listOrganizationAdministrators.mockResolvedValue([]);
    listOrganizationAdministratorCandidates.mockResolvedValue([
      { userId: 9, name: 'Existing', surname: 'Person', nickname: '', email: 'existing@university.example' },
    ]);
    grantOrganizationAdministratorByEmail.mockResolvedValue({ accountId: 1, userId: 2 });

    await renderModal({ id: 4, name: 'Email org', loginMethod: 'email' });

    expect(document.body.textContent).toContain('Dodaj osobę administrującą');
    expect(document.body.textContent).toContain('Existing Person');
    const name = document.body.querySelector('#admin-email-name');
    const surname = document.body.querySelector('#admin-email-surname');
    const email = document.body.querySelector('#admin-email-address');
    await act(async () => {
      typeInto(name, 'Ada');
      typeInto(surname, 'Lovelace');
      typeInto(email, 'ada@university.example');
    });
    const save = [...document.body.querySelectorAll('button')].find((button) => button.textContent === 'Dodaj i nadaj rolę');
    await act(async () => {
      save.click();
    });
    expect(grantOrganizationAdministratorByEmail).toHaveBeenCalledWith(4, {
      email: 'ada@university.example',
      name: 'Ada',
      surname: 'Lovelace',
    });
  });

  it('does not offer email creation for a SAML organization', async () => {
    listOrganizationAdministrators.mockResolvedValue([]);
    listOrganizationAdministratorCandidates.mockResolvedValue([]);

    await renderModal({ id: 5, name: 'SAML org', loginMethod: 'saml' });

    expect(document.body.querySelector('#admin-email-address')).toBeNull();
    expect(document.body.textContent).toContain('nie nadaje tej roli');
  });
});
