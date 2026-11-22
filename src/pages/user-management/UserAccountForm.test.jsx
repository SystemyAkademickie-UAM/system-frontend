import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import UserAccountForm from './UserAccountForm.jsx';

const COPY = {
  email: 'Adres e-mail',
  name: 'Imię',
  surname: 'Nazwisko',
  nickname: 'Pseudonim',
  role: 'Rola',
  student: 'Osoba studiująca',
  lecturer: 'Osoba prowadząca',
  administrator: 'Osoba administrująca',
  superadmin: 'Osoba nadzorująca',
  atLeastOneRoleRequired: 'Wybierz co najmniej jedną rolę.',
  exit: 'Anuluj',
  remove: 'Usuń tę rolę',
  link: 'Wyślij łącze',
  saveAnother: 'Zapisz i dodaj kolejną',
  save: 'Zapisz',
};

describe('UserAccountForm', () => {
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

  it('renders vertical list of roles with checkboxes in edit mode and checks current roles', () => {
    const form = {
      name: 'Jan',
      surname: 'Kowalski',
      nickname: 'jank',
      roles: ['lecturer', 'administrator'],
    };

    act(() => {
      root.render(
        createElement(UserAccountForm, {
          mode: 'edit',
          form,
          copy: COPY,
          onChange: vi.fn(),
          onSave: vi.fn(),
          onExit: vi.fn(),
        }),
      );
    });

    const checkboxes = container.querySelectorAll('.maq-checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(3);

    const lecturerCb = container.querySelector('#account-role-lecturer');
    const adminCb = container.querySelector('#account-role-administrator');
    const studentCb = container.querySelector('#account-role-student');

    expect(lecturerCb.checked).toBe(true);
    expect(adminCb.checked).toBe(true);
    expect(studentCb.checked).toBe(false);
  });

  it('calls onChange with updated roles when a checkbox is toggled', () => {
    const onChange = vi.fn();
    const form = {
      name: 'Jan',
      surname: 'Kowalski',
      nickname: 'jank',
      roles: ['student'],
    };

    act(() => {
      root.render(
        createElement(UserAccountForm, {
          mode: 'edit',
          form,
          copy: COPY,
          onChange,
          onSave: vi.fn(),
          onExit: vi.fn(),
        }),
      );
    });

    const lecturerCb = container.querySelector('#account-role-lecturer');
    expect(lecturerCb.checked).toBe(false);

    act(() => {
      lecturerCb.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });

    expect(onChange).toHaveBeenCalledWith('roles', ['student', 'lecturer']);
  });

  it('disables save and saveAnother buttons when no roles are selected', () => {
    const form = {
      name: 'Jan',
      surname: 'Kowalski',
      nickname: 'jank',
      roles: [],
    };

    act(() => {
      root.render(
        createElement(UserAccountForm, {
          mode: 'create',
          form,
          copy: COPY,
          onChange: vi.fn(),
          onSave: vi.fn(),
          onSaveAnother: vi.fn(),
          onExit: vi.fn(),
        }),
      );
    });

    const saveButton = [...container.querySelectorAll('button')].find((btn) => btn.textContent === 'Zapisz');
    const saveAnotherButton = [...container.querySelectorAll('button')].find((btn) => btn.textContent === 'Zapisz i dodaj kolejną');

    expect(saveButton.disabled).toBe(true);
    expect(saveAnotherButton.disabled).toBe(true);
    expect(container.textContent).toContain(COPY.atLeastOneRoleRequired);
  });

  it('disables superadmin role checkbox and hides remove role button when editing self', () => {
    const form = {
      name: 'Super',
      surname: 'Admin',
      nickname: 'super',
      roles: ['super', 'lecturer'],
    };

    act(() => {
      root.render(
        createElement(UserAccountForm, {
          mode: 'edit',
          form,
          copy: COPY,
          allowSuper: true,
          isSelf: true,
          onChange: vi.fn(),
          onSave: vi.fn(),
          onRemove: vi.fn(),
          onExit: vi.fn(),
        }),
      );
    });

    const superCb = container.querySelector('#account-role-super');
    expect(superCb).not.toBeNull();
    expect(superCb.disabled).toBe(true);
    expect(superCb.checked).toBe(true);

    const lecturerCb = container.querySelector('#account-role-lecturer');
    expect(lecturerCb.disabled).toBe(false);

    const removeBtn = [...container.querySelectorAll('button')].find((btn) => btn.textContent === COPY.remove);
    expect(removeBtn).toBeUndefined();
  });
});
