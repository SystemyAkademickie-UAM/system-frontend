/**
 * @file Badge.test.jsx
 * @description Testy komponentu Badge, w tym ukrywania szczegółów niezdobytej sekretnej odznaki z zachowaniem koloru rzadkości.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../utils/LANGUAGECOOKIE.js', () => ({
  READLANGUAGECOOKIE: () => 'polish',
}));

vi.mock('../Currency/CurrencyDisplay.jsx', () => ({
  default: ({ amount }) => createElement('span', { 'data-testid': 'currency-display' }, String(amount)),
}));

import Badge, { BADGE_RARITY } from './Badge.jsx';

describe('Badge — secret badge rendering', () => {
  let container;
  let root;

  beforeEach(() => {
    globalThis.IS_REACT_ACT_ENVIRONMENT = true;
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it('hides name, icon, descriptions, and reward while preserving rarity colour when isSecretHidden is true', () => {
    act(() => {
      root.render(
        createElement(Badge, {
          rarity: BADGE_RARITY.epic,
          name: 'Tajny mistrz',
          iconFile: '🦉',
          storyDescription: 'Ukryta fabuła',
          didacticDescription: 'Ukryty opis dydaktyczny',
          rewardAmount: 250,
          isLocked: true,
          isSecretHidden: true,
        }),
      );
    });

    const article = container.querySelector('article.maq-badge');
    expect(article).not.toBeNull();
    expect(article.getAttribute('data-rarity')).toBe('epic');
    expect(article.getAttribute('data-secret-hidden')).toBe('true');
    expect(article.style.getPropertyValue('--badge-rarity-color')).toBe('var(--color-badge-rarity-epic)');

    const text = container.textContent ?? '';
    expect(text).toContain('Sekretna odznaka');
    expect(text).toContain('?');
    expect(text).not.toContain('Tajny mistrz');
    expect(text).not.toContain('🦉');
    expect(text).not.toContain('Ukryta fabuła');
    expect(text).not.toContain('Ukryty opis dydaktyczny');
    expect(text).not.toContain('250');
    expect(container.querySelector('[data-testid="currency-display"]')).toBeNull();
  });

  it('renders full details normally once the secret badge is earned (isSecretHidden is false)', () => {
    act(() => {
      root.render(
        createElement(Badge, {
          rarity: BADGE_RARITY.epic,
          name: 'Tajny mistrz',
          iconFile: '🦉',
          storyDescription: 'Odkryta fabuła',
          didacticDescription: 'Odkryty opis dydaktyczny',
          rewardAmount: 250,
          isLocked: false,
          isSecretHidden: false,
        }),
      );
    });

    const text = container.textContent ?? '';
    expect(text).toContain('Tajny mistrz');
    expect(text).toContain('🦉');
    expect(text).toContain('Odkryta fabuła');
    expect(text).toContain('Odkryty opis dydaktyczny');
    expect(container.querySelector('[data-testid="currency-display"]')?.textContent).toBe('250');
  });
});
