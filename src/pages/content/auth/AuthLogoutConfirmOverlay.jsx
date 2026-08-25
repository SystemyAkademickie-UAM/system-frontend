import { useState } from 'react';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthLogoutConfirmOverlay.css';

const BACKDROP_ARIALABEL__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

const DIALOGTITLE__TEXTLABEL = {
  polish: 'Wylogować się?',
  english: 'Log out?'
};

const DIALOGMESSAGE__TEXTLABEL = {
  polish: 'Wrócisz do ekranu logowania. Twoja sesja zostanie zakończona.',
  english: 'You will return to the login screen. Your session will end.'
};

const CONFIRMIDLE__TEXTLABEL = {
  polish: 'Wyloguj',
  english: 'Log out'
};

const CONFIRMBUSY__TEXTLABEL = {
  polish: 'Wylogowywanie...',
  english: 'Logging out...'
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel'
};

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {boolean} props.isBusy
 * @param {string | null} props.errorMessage
 * @param {() => void} props.onConfirm
 * @param {() => void} props.onCancel
 */
export default function AuthLogoutConfirmOverlay({
  isOpen,
  isBusy,
  errorMessage,
  onConfirm,
  onCancel,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="auth-logout-confirm" role="presentation">
      <button
        type="button"
        className="auth-logout-confirm__backdrop"
        aria-label={BACKDROP_ARIALABEL__TEXTLABEL[LANGUAGE]}
        onClick={onCancel}
        disabled={isBusy}
      />

      <div
        className="auth-logout-confirm__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-logout-confirm-title"
        aria-describedby="auth-logout-confirm-message"
      >
        <h2 id="auth-logout-confirm-title" className="auth-logout-confirm__title">
          {DIALOGTITLE__TEXTLABEL[LANGUAGE]}
        </h2>

        <p id="auth-logout-confirm-message" className="auth-logout-confirm__message">
          {DIALOGMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>

        {errorMessage && (
          <p className="auth-logout-confirm__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="auth-logout-confirm__actions">
          <button
            type="button"
            className="auth-logout-confirm__confirm"
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? CONFIRMBUSY__TEXTLABEL[LANGUAGE] : CONFIRMIDLE__TEXTLABEL[LANGUAGE]}
          </button>
          <button
            type="button"
            className="auth-logout-confirm__cancel"
            onClick={onCancel}
            disabled={isBusy}
          >
            {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
          </button>
        </div>
      </div>
    </div>
  );
}
