import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox.jsx';

describe('Checkbox', () => {
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

  it('renders unchecked checkbox with label', () => {
    act(() => {
      root.render(
        createElement(Checkbox, {
          id: 'test-cb',
          label: 'Test Label',
          checked: false,
        }),
      );
    });

    const input = container.querySelector('input[type="checkbox"]');
    expect(input).not.toBeNull();
    expect(input.checked).toBe(false);
    expect(container.textContent).toContain('Test Label');
  });

  it('renders checked checkbox and triggers onChange', () => {
    const onChange = vi.fn();
    act(() => {
      root.render(
        createElement(Checkbox, {
          id: 'test-cb',
          label: 'Danger Checkbox',
          checked: true,
          variant: 'danger',
          onChange,
        }),
      );
    });

    const label = container.querySelector('.maq-checkbox');
    expect(label.classList.contains('maq-checkbox--danger')).toBe(true);
    expect(label.classList.contains('maq-checkbox--checked')).toBe(true);

    const input = container.querySelector('input');
    expect(input.checked).toBe(true);

    act(() => {
      input.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(onChange).toHaveBeenCalled();
  });
});
