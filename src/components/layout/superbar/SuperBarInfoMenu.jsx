/**
 * @file SuperBarInfoMenu.jsx
 * @description Komponent menu rozwijanego informacji, pomocy i dokumentacji w pasku SuperBar.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { IconInfo } from './ShellIcons.jsx';
import { useFloatingPanelPosition } from '../../../hooks/useFloatingPanelPosition.js';
import { positionDropdownMenu } from '../../../utils/ui/positionTooltipInViewport.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import { authLegalDocumentUrl } from '../../../constants/authLegalDocuments.constants.js';
import {
  appHelpPath,
  faqPath,
  patchNotesPath,
} from '../../../routes/pathRegistry.js';
import './SuperBar.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const MENU_TITLE__TEXTLABEL = {
  polish: 'Informacje i pomoc',
  english: 'Information and Help',
};

const PATCH_NOTES__TEXTLABEL = {
  polish: 'Informacje o aktualizacji',
  english: 'Patch Notes',
};

const FAQ__TEXTLABEL = {
  polish: 'FAQ',
  english: 'FAQ',
};

const DOCUMENTATION__TEXTLABEL = {
  polish: 'Dokumentacja',
  english: 'Documentation',
};

const PRIVACY_POLICY__TEXTLABEL = {
  polish: 'Polityka prywatności',
  english: 'Privacy Policy',
};

const HELP_CENTER__TEXTLABEL = {
  polish: 'Centrum pomocy',
  english: 'Help Center',
};

// === KOMPONENT ROZWIJANEGO MENU INFORMACJI ===
export default function SuperBarInfoMenu({ onNavigate }) {
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const getMenuLayout = useCallback(
    ({ triggerRect, panelRect }) =>
      positionDropdownMenu({
        triggerRect,
        panelRect,
        align: 'end',
      }),
    [],
  );

  const menuLayout = useFloatingPanelPosition({
    open,
    triggerRef,
    panelRef,
    getLayout: getMenuLayout,
    deps: [],
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event) => {
      const target = event.target;
      if (
        rootRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) {
        return;
      }
      setOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const handleItemClick = () => {
    setOpen(false);
    onNavigate?.();
  };

  // === RENDEROWANIE WIDOKU ===
  return (
    <div className="super-bar-info-menu" ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="super-bar-settings"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={MENU_TITLE__TEXTLABEL[LANGUAGE]}
        onClick={() => setOpen((value) => !value)}
      >
        <IconInfo className="super-bar-settings__icon" />
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <ul
              ref={panelRef}
              id={menuId}
              className="super-bar-user-menu__dropdown super-bar-user-menu__dropdown--portal"
              role="menu"
              style={{
                visibility: menuLayout ? 'visible' : 'hidden',
                left: menuLayout ? `${menuLayout.left}px` : 0,
                top: menuLayout ? `${menuLayout.top}px` : 0,
              }}
            >
              <li role="none">
                <Link
                  to={patchNotesPath()}
                  className="super-bar-user-menu__dropdown-item"
                  role="menuitem"
                  onClick={handleItemClick}
                >
                  {PATCH_NOTES__TEXTLABEL[LANGUAGE]}
                </Link>
              </li>
              <li role="none">
                <Link
                  to={faqPath()}
                  className="super-bar-user-menu__dropdown-item"
                  role="menuitem"
                  onClick={handleItemClick}
                >
                  {FAQ__TEXTLABEL[LANGUAGE]}
                </Link>
              </li>
              <li role="none">
                <a
                  href={authLegalDocumentUrl('documentation')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="super-bar-user-menu__dropdown-item"
                  role="menuitem"
                  onClick={handleItemClick}
                >
                  {DOCUMENTATION__TEXTLABEL[LANGUAGE]}
                </a>
              </li>
              <li role="none">
                <a
                  href={authLegalDocumentUrl('privacyPolicy')}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="super-bar-user-menu__dropdown-item"
                  role="menuitem"
                  onClick={handleItemClick}
                >
                  {PRIVACY_POLICY__TEXTLABEL[LANGUAGE]}
                </a>
              </li>
              <li role="none">
                <Link
                  to={appHelpPath()}
                  className="super-bar-user-menu__dropdown-item"
                  role="menuitem"
                  onClick={handleItemClick}
                >
                  {HELP_CENTER__TEXTLABEL[LANGUAGE]}
                </Link>
              </li>
            </ul>,
            document.body,
          )
        : null}
    </div>
  );
}

