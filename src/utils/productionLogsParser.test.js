import { describe, it, expect } from 'vitest';
import { parseLogLines, filterAndSortLogs } from './productionLogsParser.js';

describe('productionLogsParser', () => {
  const sampleRawLogs = `2026-11-16 16:00:00 [LOG] [HTTP] [org:1] GET /api/groups 200 15ms - user:5 role:student ip:127.0.0.1
2026-11-16 16:00:05 [WARN] [HTTP] [org:1] POST /api/groups/join 400 8ms - user:5 role:student ip:127.0.0.1
2026-11-16 16:00:10 [ERROR] [HTTP] [org:system] GET /api/admin/backup 500 45ms - user:1 role:super ip:127.0.0.1
2026-11-16 16:00:15 [LOG] [BackupService] Created automated backup backup-auto-test.enc (1024 bytes)
2026-11-16 16:00:20 [LOG] [HTTP] [org:2] GET /api/badges 200 12ms - user:10 role:lecturer ip:192.168.1.5
2026-11-16 16:00:25 [ERROR] [SuperAdminBootstrapService] Bootstrap failure
Error: Database connection lost
    at Database.connect (db.js:10)`;

  const mockOrgs = [
    { id: 1, name: 'Uniwersytet im. Adama Mickiewicza w Poznaniu' },
    { id: 2, name: 'Politechnika Poznańska' },
  ];

  it('parses raw text and computes summary statistics', () => {
    const { entries, stats, detectedOrgs } = parseLogLines(sampleRawLogs, mockOrgs);

    expect(entries.length).toBe(6);
    expect(stats.total).toBe(6);
    expect(stats.httpCount).toBe(4);
    expect(stats.errorCount).toBe(2);
    expect(stats.warnCount).toBe(1);
    expect(stats.avgDurationMs).toBe(Math.round((15 + 8 + 45 + 12) / 4)); // 20ms
    expect(detectedOrgs.length).toBe(3); // org 1, system, org 2
  });

  it('correctly maps organization names and system context', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const org1Entry = entries.find((e) => e.orgId === '1');
    expect(org1Entry?.orgName).toBe('Uniwersytet im. Adama Mickiewicza w Poznaniu');
    expect(org1Entry?.isHttp).toBe(true);
    expect(org1Entry?.httpStatus).toBe(200);

    const backupEntry = entries.find((e) => e.context === 'BackupService');
    expect(backupEntry?.orgId).toBe('system');
    expect(backupEntry?.orgName).toBe('System / Globalne');
  });

  it('preserves multi-line stack traces on error entries', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);
    const bootstrapError = entries.find((e) => e.context === 'SuperAdminBootstrapService');

    expect(bootstrapError?.details).toContain('Database connection lost');
    expect(bootstrapError?.details).toContain('at Database.connect');
  });

  it('filters by organizationId', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const org1Logs = filterAndSortLogs(entries, { organizationId: '1' });
    expect(org1Logs.length).toBe(2);
    expect(org1Logs.every((e) => e.orgId === '1')).toBe(true);

    const systemLogs = filterAndSortLogs(entries, { organizationId: 'system' });
    expect(systemLogs.length).toBe(3);
    expect(systemLogs.every((e) => e.orgId === 'system')).toBe(true);
  });

  it('filters by log level', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const errorLogs = filterAndSortLogs(entries, { level: 'error' });
    expect(errorLogs.length).toBe(2);
    expect(errorLogs.every((e) => e.level === 'ERROR')).toBe(true);

    const warnLogs = filterAndSortLogs(entries, { level: 'warn' });
    expect(warnLogs.length).toBe(1);
    expect(warnLogs[0].level).toBe('WARN');
  });

  it('filters by category', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const httpLogs = filterAndSortLogs(entries, { category: 'http' });
    expect(httpLogs.length).toBe(4);

    const backupLogs = filterAndSortLogs(entries, { category: 'backup' });
    expect(backupLogs.length).toBe(1);
    expect(backupLogs[0].context).toBe('BackupService');
  });

  it('searches by keyword', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const searchResults = filterAndSortLogs(entries, { searchPhrase: '192.168.1.5' });
    expect(searchResults.length).toBe(1);
    expect(searchResults[0].httpPath).toBe('/api/badges');
  });

  it('sorts by organization name and severity', () => {
    const { entries } = parseLogLines(sampleRawLogs, mockOrgs);

    const sortedBySeverity = filterAndSortLogs(entries, { sortBy: 'level_desc' });
    expect(sortedBySeverity[0].level).toBe('ERROR');
    expect(sortedBySeverity[1].level).toBe('ERROR');

    const sortedByOrg = filterAndSortLogs(entries, { sortBy: 'org_asc' });
    expect(sortedByOrg[0].orgName.localeCompare(sortedByOrg[1].orgName, 'pl')).toBeLessThanOrEqual(0);
  });
});
