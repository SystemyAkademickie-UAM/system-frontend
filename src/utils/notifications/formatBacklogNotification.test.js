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

  it('formats SHOP_ITEM_ADDED without [object Object] and includes cost', () => {
    const item = {
      type: 'SHOP_ITEM_ADDED',
      accountId: 0,
      value: JSON.stringify({
        itemName: 'dsad',
        storyDescription: 'dasdsa',
        educationalDescription: 'das',
        price: 111,
      }),
    };

    const studentFormatted = formatBacklogNotification(groupId, item, true);
    expect(studentFormatted.typeLabel).toBe('Nowy produkt w sklepie');
    expect(studentFormatted.title).toBe('Nowy produkt: dsad');
    expect(studentFormatted.message).toBe('dasdsa · das · Koszt: 111');
    expect(studentFormatted.message).not.toContain('[object Object]');
  });

  it('displays student full name in parentheses across all lecturer notification types in Polish and English', () => {
    const baseIdentity = {
      studentNickname: 'Marek99',
      studentName: 'Marek',
      studentSurname: 'Kowalski',
    };
    const cases = [
      { type: 'STUDENT_JOINED', payload: {}, expectedPl: 'Marek99 (Marek Kowalski) dołączył(a) do grupy', expectedEn: 'Marek99 (Marek Kowalski) joined the group' },
      { type: 'SHOP_PURCHASE', payload: { itemName: 'Mikstura', price: 50 }, expectedPl: 'Marek99 (Marek Kowalski) kupił(a): Mikstura (50)', expectedEn: 'Marek99 (Marek Kowalski) purchased: Mikstura (50)' },
      { type: 'SHOP_PURCHASE', payload: { isExtraLife: true, price: 30 }, expectedPl: 'Marek99 (Marek Kowalski) kupił(a): dodatkowe życie (30)', expectedEn: 'Marek99 (Marek Kowalski) purchased: extra life (30)' },
      { type: 'ITEM_USED', payload: { itemName: 'Tarcza' }, expectedPl: 'Marek99 (Marek Kowalski) użył(a): Tarcza', expectedEn: 'Marek99 (Marek Kowalski) used: Tarcza' },
      { type: 'ACTIVITY_COMPLETED', payload: { activityName: 'Quiz 1' }, expectedPl: 'Marek99 (Marek Kowalski) zaliczył(a): Quiz 1', expectedEn: 'Marek99 (Marek Kowalski) completed: Quiz 1' },
      { type: 'BADGE_EARNED', payload: { badgeName: 'Pionier' }, expectedPl: 'Marek99 (Marek Kowalski) zdobył(a) odznakę: Pionier', expectedEn: 'Marek99 (Marek Kowalski) earned a badge: Pionier' },
      { type: 'RANK_UP', payload: { rankName: 'Mistrz' }, expectedPl: 'Marek99 (Marek Kowalski) awansował(a) na rangę: Mistrz', expectedEn: 'Marek99 (Marek Kowalski) ranked up to: Mistrz' },
      { type: 'LIVES_CHANGED', payload: { delta: -1, lives: 2 }, expectedPl: 'Marek99 (Marek Kowalski): Życia: -1 (aktualnie: 2)', expectedEn: 'Marek99 (Marek Kowalski): Lives: -1 (currently: 2)' },
      { type: 'CURRENCY_ADDED', payload: { currencyDelta: 25 }, expectedPl: 'Marek99 (Marek Kowalski) otrzymał(a) walutę (+25)', expectedEn: 'Marek99 (Marek Kowalski) received currency (+25)' },
    ];

    for (const c of cases) {
      const item = { id: 1, type: c.type, accountId: 42, value: JSON.stringify({ ...baseIdentity, ...c.payload }) };
      expect(formatBacklogNotification(groupId, item, false, 'polish').title).toBe(c.expectedPl);
      expect(formatBacklogNotification(groupId, item, false, 'english').title).toBe(c.expectedEn);
    }

    const otherItem = {
      id: 2,
      type: 'OTHER',
      accountId: 42,
      value: JSON.stringify({ ...baseIdentity, message: 'Ręczny wpis' }),
    };
    const formattedOther = formatBacklogNotification(groupId, otherItem, false, 'polish');
    expect(formattedOther.message).toContain('Marek99 (Marek Kowalski)');
  });

  it('reads student full name from top-level item fields when historical value only contains nickname', () => {
    const historicalItem = {
      id: 10,
      type: 'SHOP_PURCHASE',
      accountId: 42,
      value: JSON.stringify({ itemName: 'Eliksir', price: 20, studentNickname: 'Ania' }),
      studentNickname: 'Ania',
      studentName: 'Anna',
      studentSurname: 'Nowak',
    };

    const formatted = formatBacklogNotification(groupId, historicalItem, false, 'polish');
    expect(formatted.title).toBe('Ania (Anna Nowak) kupił(a): Eliksir (20)');
  });

  it('handles deduplication, partial legal names, missing nickname, and student view properly', () => {
    const identical = formatBacklogNotification(groupId, {
      id: 1,
      type: 'STUDENT_JOINED',
      accountId: 42,
      value: JSON.stringify({ studentNickname: 'Anna Nowak', studentName: 'Anna', studentSurname: 'Nowak' }),
    }, false, 'polish');
    expect(identical.title).toBe('Anna Nowak dołączył(a) do grupy');

    const firstNameOnly = formatBacklogNotification(groupId, {
      id: 2,
      type: 'STUDENT_JOINED',
      accountId: 42,
      value: JSON.stringify({ studentNickname: 'Ania', studentName: 'Anna' }),
    }, false, 'polish');
    expect(firstNameOnly.title).toBe('Ania (Anna) dołączył(a) do grupy');

    const surnameOnly = formatBacklogNotification(groupId, {
      id: 3,
      type: 'STUDENT_JOINED',
      accountId: 42,
      value: JSON.stringify({ studentNickname: 'Ania', studentSurname: 'Nowak' }),
    }, false, 'polish');
    expect(surnameOnly.title).toBe('Ania (Nowak) dołączył(a) do grupy');

    const nicknameOnly = formatBacklogNotification(groupId, {
      id: 4,
      type: 'STUDENT_JOINED',
      accountId: 42,
      value: JSON.stringify({ studentNickname: 'Ania' }),
    }, false, 'polish');
    expect(nicknameOnly.title).toBe('Ania dołączył(a) do grupy');

    const noNickname = formatBacklogNotification(groupId, {
      id: 5,
      type: 'STUDENT_JOINED',
      accountId: 42,
      value: JSON.stringify({ studentName: 'Anna', studentSurname: 'Nowak' }),
    }, false, 'polish');
    expect(noNickname.title).toBe('Anna Nowak dołączył(a) do grupy');

    const studentView = formatBacklogNotification(groupId, {
      id: 6,
      type: 'BADGE_EARNED',
      accountId: 42,
      value: JSON.stringify({ badgeName: 'Mistrz', studentNickname: 'Ania', studentName: 'Anna', studentSurname: 'Nowak' }),
    }, true, 'polish');
    expect(studentView.title).toBe('Zdobyto odznakę: Mistrz');
    expect(studentView.message).not.toContain('Anna Nowak');
  });
});
