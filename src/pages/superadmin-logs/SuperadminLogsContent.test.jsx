import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../services/productionLogs.api.js', () => ({
  fetchProductionLogDays: vi.fn(),
  fetchOrganizations: vi.fn(),
  exportEncryptedProductionLogs: vi.fn(),
}));

vi.mock('../../utils/decryptProductionLogExport.js', () => ({
  generateLogExportKeyPair: vi.fn(),
  decryptProductionLogExport: vi.fn(),
}));

import {
  exportEncryptedProductionLogs,
  fetchOrganizations,
  fetchProductionLogDays,
} from '../../services/productionLogs.api.js';
import {
  decryptProductionLogExport,
  generateLogExportKeyPair,
} from '../../utils/decryptProductionLogExport.js';
import SuperadminLogsContent from './SuperadminLogsContent.jsx';

describe('SuperadminLogsContent', () => {
  let container;
  let root;

  const sampleDecryptedLogs = `2026-11-16 16:00:00 [LOG] [HTTP] [org:1] GET /api/groups 200 15ms - user:5 role:student ip:127.0.0.1
2026-11-16 16:00:05 [WARN] [HTTP] [org:1] POST /api/groups/join 400 8ms - user:5 role:student ip:127.0.0.1
2026-11-16 16:00:10 [ERROR] [HTTP] [org:system] GET /api/admin/backup 500 45ms - user:1 role:super ip:127.0.0.1
2026-11-16 16:00:15 [LOG] [BackupService] Created automated backup backup-auto-test.enc (1024 bytes)`;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);

    vi.clearAllMocks();
    fetchProductionLogDays.mockResolvedValue({
      days: ['2026-11-15', '2026-11-14'],
      timeZone: 'Europe/Warsaw',
    });
    fetchOrganizations.mockResolvedValue([
      { id: 1, name: 'Uniwersytet im. Adama Mickiewicza w Poznaniu', isActive: true, domain: 'amu.edu.pl' },
      { id: 2, name: 'Politechnika Poznańska', isActive: true, domain: 'put.poznan.pl' },
    ]);
    generateLogExportKeyPair.mockResolvedValue({
      clientPublicKey: 'mockPublicKey',
      privateKey: {},
    });
    exportEncryptedProductionLogs.mockResolvedValue({
      ciphertext: 'enc',
      iv: 'iv',
      authTag: 'tag',
      serverPublicKey: 'srvKey',
    });
    decryptProductionLogExport.mockResolvedValue(sampleDecryptedLogs);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('renders header, day selector, and controls', async () => {
    await act(async () => {
      root.render(createElement(SuperadminLogsContent));
    });

    expect(container.textContent).toContain('Logi systemowe i operacyjne');
    expect(container.textContent).toContain('Wczytaj logi');
    expect(container.textContent).toContain('Zapisz logi (.log)');
    expect(fetchProductionLogDays).toHaveBeenCalled();
    expect(fetchOrganizations).toHaveBeenCalled();
  });

  it('loads and decrypts logs, displaying KPI stats and table rows', async () => {
    await act(async () => {
      root.render(createElement(SuperadminLogsContent));
    });

    const loadButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent.includes('Wczytaj logi'),
    );
    expect(loadButton).toBeDefined();

    await act(async () => {
      loadButton.click();
    });

    expect(container.textContent).toContain('/api/groups');
    expect(container.textContent).toContain('BackupService');
    expect(container.textContent).toContain('Wszystkie zdarzenia');
  });

  it('filters logs by organization', async () => {
    await act(async () => {
      root.render(createElement(SuperadminLogsContent));
    });

    const loadButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent.includes('Wczytaj logi'),
    );
    await act(async () => {
      loadButton.click();
    });

    expect(container.textContent).toContain('/api/groups');

    const orgSelect = container.querySelector('#filter-org');
    expect(orgSelect).toBeDefined();

    await act(async () => {
      orgSelect.value = 'system';
      orgSelect.dispatchEvent(new Event('change', { bubbles: true }));
    });

    expect(container.textContent).not.toContain('/api/groups');
    expect(container.textContent).toContain('/api/admin/backup');
  });

  it('switches between structured table view and raw terminal view', async () => {
    await act(async () => {
      root.render(createElement(SuperadminLogsContent));
    });

    const loadButton = Array.from(container.querySelectorAll('button')).find((btn) =>
      btn.textContent.includes('Wczytaj logi'),
    );
    await act(async () => {
      loadButton.click();
    });

    const rawButton = Array.from(container.querySelectorAll('.superadmin-logs__toggle-btn')).find(
      (btn) => btn.textContent.includes('surowy'),
    );
    expect(rawButton).toBeDefined();

    await act(async () => {
      rawButton.click();
    });

    const rawPre = container.querySelector('.superadmin-logs__raw-output');
    expect(rawPre).toBeDefined();
    expect(rawPre.textContent).toContain('GET /api/groups');
  });
});
