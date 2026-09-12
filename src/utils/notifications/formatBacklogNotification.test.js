import { describe, expect, it } from 'vitest';
import { formatBacklogNotification } from './formatBacklogNotification.js';

describe('formatBacklogNotification', () => {
  const groupId = 100001;

  it('routes lecturer view to specific student profile for student events', () => {
    const studentEvents = [
      { type: 'STUDENT_JOINED', accountId: 42, value: JSON.stringify({ studentNickname: 'Ania' }) },
      { type: 'SHOP_PURCHASE', accountId: 42, value: JSON.stringify({ itemName: 'Mikstura' }) },
      { type: 'ITEM_USED', accountId: 42, value: JSON.stringify({ itemName: 'Mikstura' }) },
      { type: 'ACTIVITY_COMPLETED', accountId: 42, value: JSON.stringify({ activityName: 'Zadanie 1' }) },
      { type: 'BADGE_EARNED', accountId: 42, value: JSON.stringify({ badgeName: 'Mistrz' }) },
      { type: 'RANK_UP', accountId: 42, value: JSON.stringify({ rankName: 'Ekspert' }) },
      { type: 'LIVES_CHANGED', accountId: 42, value: JSON.stringify({ delta: -1 }) },
      { type: 'CURRENCY_ADDED', accountId: 42, value: JSON.stringify({ delta: 50 }) },
    ];

    for (const item of studentEvents) {
      const formatted = formatBacklogNotification(groupId, item, false);
      expect(formatted.href).toBe(`/groups/${groupId}/student-profile/42`);
      expect(formatted.accountId).toBe(42);
    }
  });

  it('resolves accountId from payload if item.accountId is 0 or missing', () => {
    const item = {
      type: 'SHOP_PURCHASE',
      accountId: 0,
      value: JSON.stringify({ studentAccountId: 88, itemName: 'Zwój' }),
    };

    const formatted = formatBacklogNotification(groupId, item, false);
    expect(formatted.href).toBe(`/groups/${groupId}/student-profile/88`);
    expect(formatted.accountId).toBe(88);
  });

  it('routes global non-student events to proper lecturer paths', () => {
    const items = [
      { type: 'STAGE_ADDED', accountId: 0, value: '{}', expected: `/groups/${groupId}/activities` },
      { type: 'BADGE_ADDED', accountId: 0, value: '{}', expected: `/groups/${groupId}/rewards` },
      { type: 'SHOP_ITEM_ADDED', accountId: 0, value: '{}', expected: `/groups/${groupId}/rewards/shop-items` },
      { type: 'SHOP_STATUS_CHANGED', accountId: 0, value: '{}', expected: `/groups/${groupId}/rewards/shop-items` },
      { type: 'POST_ADDED', accountId: 0, value: '{}', expected: `/groups/${groupId}/activities/posts` },
      { type: 'LIVES_SYSTEM_CHANGED', accountId: 0, value: '{}', expected: `/groups/${groupId}/home` },
    ];

    for (const item of items) {
      const formatted = formatBacklogNotification(groupId, item, false);
      expect(formatted.href).toBe(item.expected);
    }
  });

  it('routes student view to student paths appropriately', () => {
    const formattedActivity = formatBacklogNotification(groupId, { type: 'ACTIVITY_COMPLETED', accountId: 42, value: '{}' }, true);
    expect(formattedActivity.href).toBe(`/groups/${groupId}/activity-list`);

    const formattedShop = formatBacklogNotification(groupId, { type: 'SHOP_PURCHASE', accountId: 42, value: '{}' }, true);
    expect(formattedShop.href).toBe(`/groups/${groupId}/shop`);
  });

  it('formats totalEarned changes appropriately for student and lecturer views', () => {
    const item = {
      type: 'CURRENCY_ADDED',
      accountId: 42,
      value: JSON.stringify({
        totalEarned: 300,
        totalEarnedDelta: 100,
        isTotalEarned: true,
        studentNickname: 'Marek',
      }),
    };

    const studentFormatted = formatBacklogNotification(groupId, item, true);
    expect(studentFormatted.typeLabel).toBe('Waluta zgromadzona');
    expect(studentFormatted.title).toBe('Zwiększono walutę zgromadzoną (+100)');

    const lecturerFormatted = formatBacklogNotification(groupId, item, false);
    expect(lecturerFormatted.typeLabel).toBe('Waluta zgromadzona');
    expect(lecturerFormatted.title).toBe('Marek: zwiększono walutę zgromadzoną (+100)');
    expect(lecturerFormatted.href).toBe(`/groups/${groupId}/student-profile/42`);
  });
});
