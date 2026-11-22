/**
 * @file faq.constants.js
 * @description Zestaw stałych konfiguracyjnych i limitów pól dla modułu FAQ.
 */

// === PUNKTY KOŃCOWE REST API ===
export const FAQ_PUBLIC_PATH = '/faq';
export const FAQ_ADMIN_PATH = '/admin/faq';
export const FAQ_ADMIN_REORDER_PATH = '/admin/faq/reorder';

// === LIMITY DŁUGOŚCI PÓL I PARAMETRY FORMULARZA ===
export const FAQ_QUESTION_MAX_LENGTH = 300;
export const FAQ_ANSWER_MAX_LENGTH = 10000;
export const FAQ_CATEGORY_MAX_LENGTH = 100;
export const FAQ_ANSWER_TEXTAREA_ROWS = 4;

// === DOMYŚLNE WARTOŚCI KATEGORII ===
export const DEFAULT_FAQ_CATEGORY = {
  polish: 'Ogólne',
  english: 'General',
};

