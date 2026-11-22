import { describe, expect, it } from 'vitest';
import { parseOrganizationAccountCsv } from './parseOrganizationAccountCsv.js';

describe('parseOrganizationAccountCsv', () => {
  it('keeps studying and leading rows', () => {
    const actual = parseOrganizationAccountCsv([
      'email,name,surname,role,nickname',
      'ada@example.com,Ada,Local,student,ada',
      'alan@example.com,Alan,Local,lecturer,',
      'boss@example.com,Boss,Local,administrator,',
    ].join('\n'));
    expect(actual).toEqual([
      { email: 'ada@example.com', name: 'Ada', surname: 'Local', role: 'student', nickname: 'ada' },
      { email: 'alan@example.com', name: 'Alan', surname: 'Local', role: 'lecturer', nickname: '' },
    ]);
  });

  it('ignores account and user ids from an older export', () => {
    const actual = parseOrganizationAccountCsv([
      'accountid,userid,email,name,surname,nickname,role',
      '2,4,ada@example.com,Ada,Local,ada,student',
    ].join('\n'));
    expect(actual).toEqual([
      { email: 'ada@example.com', name: 'Ada', surname: 'Local', role: 'student', nickname: 'ada' },
    ]);
    expect(actual[0]).not.toHaveProperty('accountId');
    expect(actual[0]).not.toHaveProperty('userId');
  });

  it('returns nothing when the header is missing a required column', () => {
    expect(parseOrganizationAccountCsv('name,surname\nAda,Local')).toEqual([]);
  });
});
