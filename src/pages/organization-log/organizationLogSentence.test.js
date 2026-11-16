import { describe, expect, it } from 'vitest';
import { organizationLogSentence, safeOrganizationLogLink } from './organizationLogSentence.js';

describe('organizationLogSentence', () => {
  it('names the granted role in English', () => {
    expect(organizationLogSentence({
      kind: 'role_granted',
      subjectName: 'Grace Hopper',
      roleName: 'student',
    }, 'en')).toBe('Grace Hopper was granted the studying person role.');
  });

  it('names the granted role in Polish', () => {
    expect(organizationLogSentence({
      kind: 'role_granted',
      subjectName: 'Grace Hopper',
      roleName: 'student',
    }, 'pl')).toBe('Nadano rolę osoba studiująca osobie Grace Hopper.');
  });
});

describe('safeOrganizationLogLink', () => {
  it('keeps a person link inside this application', () => {
    expect(safeOrganizationLogLink('/users?accountId=11')).toBe('/users?accountId=11');
  });

  it('drops an external address', () => {
    expect(safeOrganizationLogLink('https://example.com/users?accountId=11')).toBeNull();
  });
});
