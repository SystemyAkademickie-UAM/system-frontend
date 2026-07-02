import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { logoutUser, isLogoutAvailable } from '../../../services/authService.js';
import { IconUserPlaceholder } from './ShellIcons.jsx';
import SuperBarUserIdentity from './SuperBarUserIdentity.jsx';
import { getAvatarImageClassName } from '../../../utils/avatarDisplay.js';
import { useFloatingPanelPosition } from '../../../hooks/useFloatingPanelPosition.js';
import { positionDropdownMenu } from '../../../utils/ui/positionTooltipInViewport.js';
import './SuperBar.css';

/**
 * Awatar + rozwijane menu (Wyloguj → /login).
 */
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
      setLogoutError('Nie udało się wylogować.');
      return;
    }
    setIsLoggingOut(true);
    setOpen(false);
    onNavigate?.();
    void logoutUser(() => {
      setIsLoggingOut(false);
      setLogoutError('Nie udało się wylogować.');
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
        aria-label="Menu konta użytkownika"
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
                {isLoggingOut ? 'Wylogowywanie…' : 'Wyloguj'}
              </button>
            </li>
          </ul>,
          document.body,
        )
        : null}
    </div>
  );
}
