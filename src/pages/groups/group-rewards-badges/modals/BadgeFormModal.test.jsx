/**
 * @file BadgeFormModal.test.jsx
 * @description Testy formularza dodawania i edycji odznaki z 3-stanową listą widoczności.
 */

import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('../../../../utils/LANGUAGECOOKIE.js', () => ({
  READLANGUAGECOOKIE: () => 'polish',
}));

vi.mock('../../../../components/ui/index.js', () => ({
  BADGE_RARITY: { common: 'common', uncommon: 'uncommon', rare: 'rare', epic: 'epic' },
  BADGE_RARITY_LABELS: { common: 'Zwykła', uncommon: 'Niezwykła', rare: 'Rzadka', epic: 'Epicka' },
  Divider: () => createElement('hr'),
  InfoTooltip: () => null,
  Modal: ({ isOpen, title, onConfirm, confirmDisabled, children }) => (
    isOpen
      ? createElement(
        'div',
        { 'data-testid': 'badge-modal' },
        createElement('h2', null, title),
        children,
        createElement('button', { type: 'button', 'data-testid': 'confirm-btn', disabled: confirmDisabled, onClick: onConfirm }, 'Zapisz'),
      )
      : null
  ),
  TextField: ({ id, label, value, onChange }) => (
    createElement(
      'div',
      null,
      createElement('label', { htmlFor: id }, label),
      createElement('input', { id, value, onChange }),
    )
  ),
}));

vi.mock('../../../../components/ui/EmojiPickerField/EmojiPickerField.jsx', () => ({
  default: ({ label }) => createElement('div', null, label),
}));

vi.mock('../../group-rewards/shared/RewardsCurrencyLabel.jsx', () => ({
  default: ({ htmlFor, children }) => createElement('label', { htmlFor }, children),
}));

import BadgeFormModal from './BadgeFormModal.jsx';

function setInputValue(element, value) {
  const proto = element.tagName === 'SELECT' ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set;
  setter?.call(element, value);
  element.dispatchEvent(new Event('input', { bubbles: true }));
  element.dispatchEvent(new Event('change', { bubbles: true }));
}

describe('BadgeFormModal — visibility dropdown', () => {
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

  it('renders the three visibility options in required order and submits secret badge flags', () => {
    const onConfirm = vi.fn();

    act(() => {
      root.render(createElement(BadgeFormModal, { isOpen: true, onClose: vi.fn(), onConfirm }));
    });

    const select = container.querySelector('#badge-visibility');
    expect(select).not.toBeNull();
    const optionTexts = Array.from(select.options).map((option) => option.textContent);
    expect(optionTexts).toEqual(['Odznaka widoczna', 'Odznaka ukryta', 'Odznaka sekretna']);

    act(() => {
      setInputValue(container.querySelector('#badge-name'), 'Nocny marek');
      setInputValue(container.querySelector('#badge-reward'), '50');
      setInputValue(container.querySelector('#badge-story'), 'Fabuła');
      setInputValue(container.querySelector('#badge-edu'), 'Dydaktyka');
      setInputValue(select, 'secret');
    });

    act(() => {
      container.querySelector('[data-testid="confirm-btn"]').click();
    });

    expect(onConfirm).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Nocny marek',
      rewardAmount: 50,
      isPublished: true,
      isSecret: true,
    }));
  });

  it('preselects secret mode and submits updated flags when switching to visible or hidden', () => {
    const onConfirm = vi.fn();
    const secretBadge = {
      name: 'Nocny marek',
      icon: '🦉',
      rarity: 'epic',
      storyDescription: 'Fabuła',
      didacticDescription: 'Dydaktyka',
      rewardAmount: 50,
      isPublished: true,
      isSecret: true,
    };

    act(() => {
      root.render(createElement(BadgeFormModal, {
        isOpen: true,
        badge: secretBadge,
        onClose: vi.fn(),
        onConfirm,
      }));
    });

    const select = container.querySelector('#badge-visibility');
    expect(select.value).toBe('secret');

    act(() => {
      setInputValue(select, 'visible');
    });
    act(() => {
      container.querySelector('[data-testid="confirm-btn"]').click();
    });
    expect(onConfirm).toHaveBeenLastCalledWith(expect.objectContaining({ isPublished: true, isSecret: false }));

    act(() => {
      setInputValue(select, 'hidden');
    });
    act(() => {
      container.querySelector('[data-testid="confirm-btn"]').click();
    });
    expect(onConfirm).toHaveBeenLastCalledWith(expect.objectContaining({ isPublished: false, isSecret: false }));
  });
});
