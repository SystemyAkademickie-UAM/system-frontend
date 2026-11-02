import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_LOGIN_CONTEXT_PATH } from '../../constants/authPaths.constants.js';

vi.mock('../../services/api-client.js', () => ({
  postJson: vi.fn(),
}));

import { postJson } from '../../services/api-client.js';
import OrganizationRoleDialog, {
  loginContextMenu,
  loginContextMenuLabel,
} from './OrganizationRoleDialog.jsx';

const MEMBERSHIPS = [
  { organizationId: 1, name: 'Internal', roles: ['super'] },
  { organizationId: 2, name: 'Localhost IdP', roles: ['lecturer', 'student'] },
];

describe('OrganizationRoleDialog confirm', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=english';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    postJson.mockReset();
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  async function renderDialog(onSaved) {
    await act(async () => {
      root.render(createElement(OrganizationRoleDialog, {
        isOpen: true,
        required: true,
        memberships: MEMBERSHIPS,
        organizationId: 2,
        role: 'lecturer',
        onClose: () => {},
        onSaved,
      }));
    });
  }

  async function confirm() {
    const button = [...document.body.querySelectorAll('button')].find(
      (item) => item.textContent === 'Continue',
    );
    await act(async () => {
      button.click();
    });
  }

  it('saves the selected organization and role, then reports success', async () => {
    const onSaved = vi.fn().mockResolvedValue(undefined);
    postJson.mockResolvedValue({ ok: true });
    await renderDialog(onSaved);

    const roleSelect = document.getElementById('login-context-role');
    await act(async () => {
      roleSelect.value = 'student';
      roleSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await confirm();

    expect(postJson).toHaveBeenCalledWith(AUTH_LOGIN_CONTEXT_PATH, {
      organizationId: 2,
      role: 'student',
    });
    expect(onSaved).toHaveBeenCalledOnce();
  });

  it('shows the save error and does not continue when the request fails', async () => {
    const onSaved = vi.fn();
    postJson.mockResolvedValue({ ok: false });
    await renderDialog(onSaved);
    await confirm();

    expect(onSaved).not.toHaveBeenCalled();
    expect(document.body.textContent).toContain('Could not save the choice.');
  });
});

describe('loginContextMenu', () => {
  it('hides the menu when there is nothing to change', () => {
    expect(loginContextMenu([{ organizationId: 2, roles: ['student'] }])).toEqual({
      canChange: false,
      kind: 'role',
    });
    expect(loginContextMenuLabel([], 'english')).toBeNull();
  });

  it('offers only the organization when every organization has one role', () => {
    const memberships = [
      { organizationId: 1, roles: ['super'] },
      { organizationId: 2, roles: ['lecturer'] },
    ];

    expect(loginContextMenu(memberships).kind).toBe('organization');
    expect(loginContextMenuLabel(memberships, 'polish')).toBe('Zmień organizację');
    expect(loginContextMenuLabel(memberships, 'english')).toBe('Change organization');
  });

  it('offers only the role when one organization has several roles', () => {
    const memberships = [{ organizationId: 2, roles: ['lecturer', 'student'] }];

    expect(loginContextMenu(memberships).kind).toBe('role');
    expect(loginContextMenuLabel(memberships, 'english')).toBe('Change role');
  });

  it('offers both when several organizations include a multi-role organization', () => {
    const memberships = [
      { organizationId: 1, roles: ['super'] },
      { organizationId: 2, roles: ['lecturer', 'student'] },
    ];

    expect(loginContextMenu(memberships).kind).toBe('both');
    expect(loginContextMenuLabel(memberships, 'polish')).toBe('Zmień organizację i rolę');
  });
});
