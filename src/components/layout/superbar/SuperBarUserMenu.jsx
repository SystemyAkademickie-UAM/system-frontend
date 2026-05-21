import { useEffect, useId, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSession } from '../../../context/SessionContext.jsx';
import { loginPath } from '../../../routes/pathRegistry.js';
import { logoutUser } from '../../../services/authService.js';
import { IconUserPlaceholder } from './ShellIcons.jsx';
import SuperBarUserIdentity from './SuperBarUserIdentity.jsx';
import './SuperBar.css';

/**
 * Awatar + rozwijane menu (Wyloguj → /login).
 */
export default function SuperBarUserMenu({ displayName, roleLabel, onNavigate, isLoading = false }) {
  const menuId = useId();
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const { refetchSession } = useSession();

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

  const handleLogout = async () => {
    setOpen(false);
    setIsLoggingOut(true);
    try {
      await logoutUser();
      await refetchSession();
    } finally {
      setIsLoggingOut(false);
    }
    onNavigate?.();
    navigate(loginPath());
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
        onClick={() => setOpen((value) => !value)}
      >
        <span className="super-bar-user-menu__avatar" aria-hidden="true">
          <IconUserPlaceholder />
        </span>
      </button>
      {open ? (
        <ul id={menuId} className="super-bar-user-menu__dropdown" role="menu">
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
