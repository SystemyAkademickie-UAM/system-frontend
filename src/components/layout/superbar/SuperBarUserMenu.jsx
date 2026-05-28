import { useEffect, useId, useRef, useState } from 'react';
import { logoutUser } from '../../../services/authService.js';
import { IconUserPlaceholder } from './ShellIcons.jsx';
import SuperBarUserIdentity from './SuperBarUserIdentity.jsx';
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
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onPointerDown = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
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
    const didLogout = logoutUser(() => {
      setIsLoggingOut(false);
      setLogoutError('Nie udało się wylogować.');
      setOpen(true);
    });
    if (!didLogout) {
      setLogoutError('Nie udało się wylogować.');
      return;
    }
    setOpen(false);
    onNavigate?.();
    setIsLoggingOut(true);
  };

  return (
    <div className="super-bar-user-menu" ref={rootRef}>
      <SuperBarUserIdentity displayName={displayName} roleLabel={roleLabel} isLoading={isLoading} />
      <button
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
            <img src={avatarUrl} alt="" className="super-bar-user-menu__avatar-img" />
          ) : (
            <IconUserPlaceholder />
          )}
        </span>
      </button>
      {open ? (
        <ul id={menuId} className="super-bar-user-menu__dropdown" role="menu">
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
        </ul>
      ) : null}
    </div>
  );
}
