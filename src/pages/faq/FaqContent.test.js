/**
 * @file FaqContent.test.js
 * @description Zestaw testów jednostkowych weryfikujących odczyt oraz edycję strony FAQ przez osobę nadzorującą.
 */

// === IMPORTY I ŚRODOWISKO TESTOWE ===
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const mockUseAppRoleOptional = vi.fn();

vi.mock('../../context/AppRoleContext.jsx', () => ({
  useAppRoleOptional: () => mockUseAppRoleOptional(),
}));

vi.mock('../../services/faq.api.js', () => ({
  fetchPublicFaqs: vi.fn(),
  fetchAdminFaqs: vi.fn(),
  replaceAllFaqs: vi.fn(),
}));

import { ToastProvider } from '../../components/ui/index.js';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';
import {
  fetchAdminFaqs,
  fetchPublicFaqs,
  replaceAllFaqs,
} from '../../services/faq.api.js';
import FaqContent from './FaqContent.jsx';

const SAMPLE_FAQS = [
  {
    id: 1,
    category: 'Logowanie i konto',
    question: 'Jak zalogować się do systemu MyAcademyQuest?',
    answer: 'Osoby studiujące oraz osoby prowadzące logują się przez SSO lub Magic Link.',
    orderIndex: 0,
    isPublished: true,
  },
  {
    id: 2,
    category: 'Sklep i waluta',
    question: 'Jak działa sklep grupy?',
    answer: 'Osoba studiująca wymienia walutę na bonusy zdefiniowane przez osobę prowadzącą.',
    orderIndex: 1,
    isPublished: true,
  },
];

// === SCENARIUSZE TESTOWE (SUITE) ===
describe('FaqContent', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    document.cookie = 'CURRENTLANGUAGE=polish';
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
    vi.clearAllMocks();
    fetchPublicFaqs.mockResolvedValue(SAMPLE_FAQS);
    fetchAdminFaqs.mockResolvedValue(SAMPLE_FAQS);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  async function renderFaqPage() {
    await act(async () => {
      root.render(createElement(ToastProvider, null, createElement(FaqContent)));
    });
  }

  it('renders FAQ categories, questions, and answers in read mode without Edit button for student role', async () => {
    mockUseAppRoleOptional.mockReturnValue({ role: APP_ROLE.STUDENT });
    await renderFaqPage();

    expect(container.textContent).toContain('Najczęściej zadawane pytania (FAQ)');
    expect(container.textContent).toContain('Jak zalogować się do systemu MyAcademyQuest?');
    expect(container.textContent).toContain('Jak działa sklep grupy?');

    const editBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent === 'Edytuj',
    );
    expect(editBtn).toBeUndefined();
  });

  it('allows osoba nadzorująca (superadmin) to click Edytuj, edit questions, and click Zapisz', async () => {
    mockUseAppRoleOptional.mockReturnValue({ role: APP_ROLE.SUPERADMIN });
    replaceAllFaqs.mockImplementation(async (items) =>
      items.map((item, idx) => ({ id: idx + 1, ...item })),
    );

    await renderFaqPage();

    const editBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent === 'Edytuj',
    );
    expect(editBtn).toBeDefined();

    await act(async () => {
      editBtn.click();
    });

    expect(fetchAdminFaqs).toHaveBeenCalledOnce();

    const questionInputs = [...container.querySelectorAll('input.maq-text-field__control')];
    expect(questionInputs.length).toBeGreaterThanOrEqual(2);

    const firstQuestionInput = questionInputs[1];
    await act(async () => {
      const nativeValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        'value',
      ).set;
      nativeValueSetter.call(firstQuestionInput, 'Zaktualizowane pytanie przez osobę nadzorującą?');
      firstQuestionInput.dispatchEvent(new Event('input', { bubbles: true }));
    });

    const saveButtons = [...container.querySelectorAll('button')].filter(
      (btn) => btn.textContent === 'Zapisz',
    );
    expect(saveButtons.length).toBeGreaterThan(0);

    await act(async () => {
      saveButtons[0].click();
    });

    expect(replaceAllFaqs).toHaveBeenCalledOnce();
    expect(replaceAllFaqs.mock.calls[0][0][0].question).toBe(
      'Zaktualizowane pytanie przez osobę nadzorującą?',
    );
    expect(container.textContent).toContain(
      'Zaktualizowane pytanie przez osobę nadzorującą?',
    );
  });

  it('validates empty question or answer before saving in edit mode', async () => {
    mockUseAppRoleOptional.mockReturnValue({ role: APP_ROLE.SUPERADMIN });
    await renderFaqPage();

    const editBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent === 'Edytuj',
    );
    await act(async () => {
      editBtn.click();
    });

    const addBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent === 'Dodaj pytanie',
    );
    await act(async () => {
      addBtn.click();
    });

    const saveBtn = [...container.querySelectorAll('button')].find(
      (btn) => btn.textContent === 'Zapisz',
    );
    await act(async () => {
      saveBtn.click();
    });

    expect(replaceAllFaqs).not.toHaveBeenCalled();
    expect(container.textContent).toContain('Treść pytania jest wymagana.');
    expect(container.textContent).toContain('Treść odpowiedzi jest wymagana.');
  });
});
