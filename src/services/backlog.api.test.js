import { beforeEach, describe, expect, it, vi } from 'vitest';

const { getJsonMock } = vi.hoisted(() => ({
  getJsonMock: vi.fn(),
}));

vi.mock('./api-client.js', () => ({
  getJson: getJsonMock,
  patchJson: vi.fn(),
  deleteJson: vi.fn(),
}));

import { fetchGroupBacklog } from './backlog.api.js';

describe('backlog.api — fetchGroupBacklog', () => {
  beforeEach(() => {
    getJsonMock.mockReset();
  });

  it('preserves studentNickname, studentName, and studentSurname and normalizes blanks to null', async () => {
    getJsonMock.mockResolvedValue({
      ok: true,
      data: [
        {
          id: 10,
          type: 'SHOP_PURCHASE',
          date: '2026-11-25T10:00:00.000Z',
          value: '{"itemName":"Mikstura"}',
          accountId: 42,
          isRead: false,
          studentNickname: ' Ania ',
          studentName: 'Anna',
          studentSurname: 'Nowak',
        },
        {
          id: 11,
          type: 'STUDENT_JOINED',
          date: '2026-11-25T10:01:00.000Z',
          value: '{}',
          accountId: 43,
          isRead: true,
          studentNickname: '   ',
          studentName: '',
          studentSurname: null,
        },
        {
          id: 12,
          type: 'OTHER',
          date: '2026-11-25T10:02:00.000Z',
          value: '{}',
          accountId: 44,
          isRead: false,
          studentName: 123,
        },
      ],
    });

    const result = await fetchGroupBacklog(100001, { take: 10, skip: 0, studentView: false });

    expect(getJsonMock).toHaveBeenCalledWith('/groups/100001/backlog?take=10&skip=0', { includeBrowserId: true });
    expect(result.ok).toBe(true);
    expect(result.items).toEqual([
      {
        id: 10,
        type: 'SHOP_PURCHASE',
        date: '2026-11-25T10:00:00.000Z',
        value: '{"itemName":"Mikstura"}',
        accountId: 42,
        isRead: false,
        studentNickname: 'Ania',
        studentName: 'Anna',
        studentSurname: 'Nowak',
      },
      {
        id: 11,
        type: 'STUDENT_JOINED',
        date: '2026-11-25T10:01:00.000Z',
        value: '{}',
        accountId: 43,
        isRead: true,
        studentNickname: null,
        studentName: null,
        studentSurname: null,
      },
      {
        id: 12,
        type: 'OTHER',
        date: '2026-11-25T10:02:00.000Z',
        value: '{}',
        accountId: 44,
        isRead: false,
        studentNickname: null,
        studentName: null,
        studentSurname: null,
      },
    ]);
  });
});
