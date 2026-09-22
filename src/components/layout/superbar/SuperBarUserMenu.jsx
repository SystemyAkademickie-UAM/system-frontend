import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { logoutUser, isLogoutAvailable } from '../../../services/authService.js';
import { IconUserPlaceholder } from './ShellIcons.jsx';
import SuperBarUserIdentity from './SuperBarUserIdentity.jsx';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useFloatingPanelPosition } from '../../../hooks/useFloatingPanelPosition.js';
import { positionDropdownMenu } from '../../../utils/ui/positionTooltipInViewport.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './SuperBar.css';

/**
 * Awatar + rozwijane menu (Wyloguj → /login).
 */
const LOGOUTERROR__TEXTLABEL = {
  polish: 'Nie udało się wylogować.',
  english: 'Logout failed.',
};

const LOGOUTBUTTONTEXT__TEXTLABEL = {
  polish: {
    logging: 'Wylogowywanie…',
    logged: 'Wyloguj',
  },
  english: {
    logging: 'Logging out…',
    logged: 'Log out',
  },
};

const ACCOUNTMENU__TEXTLABEL = {
  polish: 'Menu konta użytkownika',
  english: 'User account menu',
};

export default function SuperBarUserMenu({
  displayName,
  roleLabel,
  avatarUrl = null,
  onNavigate,
  isLoading = false,
}) {
  const menuId = useId();
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelRef = useRef(null);
  const navigate = useNavigate();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  const getMenuLayout = useCallback(({ triggerRect, panelRect }) => positionDropdownMenu({
    triggerRect,
    panelRect,
    align: 'end',
  }), []);

  const menuLayout = useFloatingPanelPosition({
    open,
    triggerRef,
    panelRef,
    getLayout: getMenuLayout,
    deps: [logoutError, isLoggingOut],
  });

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event) => {
      const target = event.target;
      if (
        rootRef.current?.contains(target)
        || panelRef.current?.contains(target)
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

  const handleLogout = () => {
    setLogoutError(null);
    if (!isLogoutAvailable()) {
      setLogoutError(LOGOUTERROR__TEXTLABEL[LANGUAGE]);
      return;
    }
    setIsLoggingOut(true);
    setOpen(false);
    onNavigate?.();
    void logoutUser(() => {
      setIsLoggingOut(false);
      setLogoutError(LOGOUTERROR__TEXTLABEL[LANGUAGE]);
      setOpen(true);
    }, { navigate });
  };

  return (
    <div className="super-bar-user-menu" ref={rootRef}>
      <SuperBarUserIdentity displayName={displayName} roleLabel={roleLabel} isLoading={isLoading} />
      <button
        ref={triggerRef}
        type="button"
        className="super-bar-user-menu__avatar-btn"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="menu"
        aria-label={ACCOUNTMENU__TEXTLABEL[LANGUAGE]}
        onClick={() => {
          setLogoutError(null);
          setOpen((value) => !value);
        }}
      >
        <span className="super-bar-user-menu__avatar" aria-hidden="true">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className={getAvatarImageClassName(avatarUrl, 'super-bar-user-menu__avatar-img')}
            />
          ) : (
            <IconUserPlaceholder />
          )}
        </span>
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
            {logoutError ? (
              <li className="super-bar-user-menu__dropdown-error" role="alert">
                {logoutError}
              </li>
            ) : null}
            <li role="none">
              <button
                type="button"
                className="super-bar-user-menu__dropdown-item"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? LOGOUTBUTTONTEXT__TEXTLABEL[LANGUAGE].logging : LOGOUTBUTTONTEXT__TEXTLABEL[LANGUAGE].logged}
              </button>
            </li>
          </ul>,
          document.body,
        )
        : null}
    </div>
  );
}
