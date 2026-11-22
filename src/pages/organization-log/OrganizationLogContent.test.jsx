import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/organizationAdmin.api.js', () => ({
  listOrganizationLog: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/Toast/Toast.jsx';
import { listOrganizationLog } from '../../services/organizationAdmin.api.js';
import OrganizationLogContent from './OrganizationLogContent.jsx';

const GRANT = {
  id: 'archive:1',
  source: 'archive',
  occurredAt: '2026-11-16T19:05:00.000Z',
  category: 'organization',
  kind: 'role_granted',
  actorName: 'University Administrator',
  subjectName: 'Grace Hopper',
  subjectAccountId: 11,
  groupName: '',
  roleName: 'student',
  fileKind: null,
  fileName: null,
  fileSizeBytes: null,
  detail: {},
  links: { group: null, account: '/users?accountId=11', profile: null },
};

describe('OrganizationLogContent', () => {
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

  async function renderLogs() {
    await act(async () => {
      root.render(createElement(
        MemoryRouter,
        { initialEntries: ['/logs'] },
        createElement(ToastProvider, null, createElement(OrganizationLogContent)),
      ));
    });
  }

  it('renders the sentence and a separate open link', async () => {
    listOrganizationLog.mockResolvedValue({ items: [GRANT] });
    await renderLogs();
    expect(container.textContent).toContain('Nadano rolę osoba studiująca osobie Grace Hopper.');
    const open = [...container.querySelectorAll('a')].find((link) => link.textContent === 'Otwórz');
    expect(open?.getAttribute('href')).toBe('/users?accountId=11');
  });

  it('keeps the empty sentence after the first load fails', async () => {
    listOrganizationLog.mockRejectedValue(new Error('Sieć'));
    await renderLogs();
    expect(container.textContent).toContain('Brak wpisów dla tego filtra.');
    expect(document.body.textContent).toContain('Sieć');
  });
});
