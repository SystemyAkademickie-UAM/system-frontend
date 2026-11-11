/**
 * @file faq.api.test.js
 * @description Zestaw testów jednostkowych weryfikujących metody komunikacji z API FAQ.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./api-client.js', () => ({
  getJson: vi.fn(),
  postJson: vi.fn(),
  putJson: vi.fn(),
  patchJson: vi.fn(),
  deleteJson: vi.fn(),
}));

import {
  deleteJson,
  getJson,
  patchJson,
  postJson,
  putJson,
} from './api-client.js';
import {
  createFaq,
  deleteFaq,
  fetchAdminFaqs,
  fetchPublicFaqs,
  reorderFaqs,
  replaceAllFaqs,
  updateFaq,
} from './faq.api.js';

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('faq.api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches public FAQs with optional query parameters', async () => {
    const sample = [{ id: 1, question: 'Q?', answer: 'A.', category: 'Ogólne', orderIndex: 0, isPublished: true }];
    getJson.mockResolvedValue({ ok: true, status: 200, data: sample });

    const actual = await fetchPublicFaqs({ category: 'Ogólne', grouped: true });
    expect(getJson).toHaveBeenCalledWith('/faq?category=Og%C3%B3lne&grouped=true');
    expect(actual).toEqual(sample);
  });

  it('fetches admin FAQs with search and category filters', async () => {
    const sample = [{ id: 2, question: 'Logowanie?', answer: 'SSO', category: 'Konto', orderIndex: 0, isPublished: true }];
    getJson.mockResolvedValue({ ok: true, status: 200, data: sample });

    const actual = await fetchAdminFaqs({ category: 'Konto', search: 'SSO' });
    expect(getJson).toHaveBeenCalledWith('/admin/faq?category=Konto&search=SSO');
    expect(actual).toEqual(sample);
  });

  it('replaces all FAQs via PUT /admin/faq', async () => {
    const draftItems = [{ question: 'Nowe pytanie?', answer: 'Nowa odpowiedź.', category: 'Ogólne', orderIndex: 0, isPublished: true }];
    putJson.mockResolvedValue({ ok: true, status: 200, data: [{ id: 10, ...draftItems[0] }] });

    const actual = await replaceAllFaqs(draftItems);
    expect(putJson).toHaveBeenCalledWith('/admin/faq', { items: draftItems });
    expect(actual).toHaveLength(1);
    expect(actual[0].id).toBe(10);
  });

  it('creates, updates, reorders, and deletes FAQ entries', async () => {
    postJson.mockResolvedValue({ ok: true, status: 201, data: { id: 3, question: 'Q3?', answer: 'A3.' } });
    putJson.mockResolvedValueOnce({ ok: true, status: 200, data: { id: 3, question: 'Q3-upd?', answer: 'A3.' } });
    patchJson.mockResolvedValueOnce({ ok: true, status: 200, data: [{ id: 3, orderIndex: 0 }] });
    deleteJson.mockResolvedValue({ ok: true, status: 200, data: { deleted: true, id: 3 } });

    expect(await createFaq({ question: 'Q3?', answer: 'A3.' })).toEqual({ id: 3, question: 'Q3?', answer: 'A3.' });
    expect(await updateFaq(3, { question: 'Q3-upd?' })).toEqual({ id: 3, question: 'Q3-upd?', answer: 'A3.' });
    expect(putJson).toHaveBeenCalledWith('/admin/faq/3', { question: 'Q3-upd?' });
    expect(await reorderFaqs([{ id: 3, orderIndex: 0 }])).toEqual([{ id: 3, orderIndex: 0 }]);
    expect(await deleteFaq(3)).toEqual({ deleted: true, id: 3 });
  });

  it('throws readable Error when API call fails', async () => {
    getJson.mockResolvedValue({ ok: false, status: 500, data: { message: 'Błąd serwera FAQ' } });
    await expect(fetchPublicFaqs()).rejects.toThrow('Błąd serwera FAQ');
  });
});

