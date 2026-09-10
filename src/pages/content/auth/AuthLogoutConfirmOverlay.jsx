import { useState } from 'react';
import { Button, Modal } from '../../../components/ui/index.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './AuthLogoutConfirmOverlay.css';

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title={DIALOGTITLE__TEXTLABEL[LANGUAGE]}
      size="sm"
      showFooter={false}
      className="auth-logout-confirm-modal"
    >
      <div className="auth-logout-confirm">
        <p className="auth-logout-confirm__message">
          {DIALOGMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>

        {errorMessage && (
          <p className="auth-logout-confirm__error" role="alert">
            {errorMessage}
          </p>
        )}

        <div className="auth-logout-confirm__actions">
          <Button
            type="button"
            variant="ghost"
            size="md"
            onClick={onCancel}
            disabled={isBusy}
          >
            {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
          <Button
            type="button"
            variant="primary"
            size="md"
            onClick={onConfirm}
            disabled={isBusy}
          >
            {isBusy ? CONFIRMBUSY__TEXTLABEL[LANGUAGE] : CONFIRMIDLE__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
