import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, PageHeader } from '../../../components/ui/index.js';
import { ENROLLMENT_ENTRY_CODE_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import { validateAlphanumericInput } from '../../../utils/validation/alphanumericValidation.js';
import { useGroupPreview } from '../../../hooks/groups/useGroupPreview.js';
import { enrollByCode } from '../../../services/enrollment.api.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import '../../../components/page/PageUnavailable.css';
import './GroupJoinContent.css';

const GROUPJOINSUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Pomyślnie dołączono do grupy.',
  english: 'Successfully joined the group.',
};

const PAGETITLE__TEXTLABEL = {
  polish: 'Dołączenie do grupy',
  english: 'Join Group',
};

const PAGEDESCRIPTIONSTUDENT__TEXTLABEL = {
  polish: 'Wpisz kod dostępu, aby wejść do wybranej grupy.',
  english: 'Enter the access code to join the selected group.',
};

const PAGEDESCRIPTIONNONSTUDENT__TEXTLABEL = {
  polish: 'Ta grupa nie należy do Twoich kursów.',
  english: 'This group does not belong to your courses.',
};

const LOADINGMESSAGE__TEXTLABEL = {
  polish: 'Wczytywanie danych grupy...',
  english: 'Loading group data...',
};

const NOACCESSMESSAGE__TEXTLABEL = {
  polish: 'Nie masz dostępu do tej grupy. Możesz zarządzać wyłącznie własnymi kursami.',
  english: 'You do not have access to this group. You can only manage your own courses.',
};

const GROUPINFOLEAD__TEXTLABEL = {
  polish: 'Próbujesz dołączyć do grupy:',
  english: 'You are trying to join the group:',
};

const STORYNAME__TEXTLABEL = {
  polish: 'Nazwa fabularna',
  english: 'Story Name',
};

const SUBJECT__TEXTLABEL = {
  polish: 'Przedmiot',
  english: 'Subject',
};

const LECTURER__TEXTLABEL = {
  polish: 'Osoba prowadząca',
  english: 'Lecturer',
};

const GROUPID__TEXTLABEL = {
  polish: 'Identyfikator grupy',
  english: 'Group ID',
};

const ACCESSCODE__TEXTLABEL = {
  polish: 'Kod dostępu',
  english: 'Access Code',
};

const INPUTPLACEHOLDER__TEXTLABEL = {
  polish: 'Wpisz 6-znakowy kod',
  english: 'Enter 6-character code',
};

const JOINBUTTON__TEXTLABEL = {
  polish: 'Dołącz',
  english: 'Join',
};

const JOININGBUTTON__TEXTLABEL = {
  polish: 'Dołączanie...',
  english: 'Joining...',
};

const REDIRECTMESSAGE__TEXTLABEL = {
  polish: 'Przekierowywanie do grupy...',
  english: 'Redirecting to group...',
};

const MISSINGGROUPID__TEXTLABEL = {
  polish: 'Brak identyfikatora grupy.',
  english: 'Missing group ID.',
};

const PASTEBUTTON__TEXTLABEL = {
  polish: 'Wklej kod ze schowka',
  english: 'Paste code from clipboard',
};

function PasteIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
    </svg>
  );
}

const CODE_LENGTH = 6;

export default function GroupJoinContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { role } = useAppRole();
  const { group, hasAccess, isLoading, errorMessage } = useGroupPreview(groupId);
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useMemo(() => Array.from({ length: CODE_LENGTH }, () => ({ current: null })), []);

  const isStudent = role === APP_ROLE.STUDENT;
  const codeInput = digits.join('');
  const validation = useMemo(
    () => validateAlphanumericInput(codeInput, ENROLLMENT_ENTRY_CODE_MAX_LENGTH),
    [codeInput],
  );

  const isCodeComplete = codeInput.length > 0 && validation.valid;
  const showValidationError = codeInput.trim() !== '' && !validation.valid && codeInput.length > 0;

  useEffect(() => {
    if (isLoading || !group || !hasAccess || !groupId) {
      return;
    }
    navigate(groupMainPath(groupId), { replace: true });
  }, [isLoading, group, hasAccess, groupId, navigate]);

  const handleDigitChange = (index, value) => {
    setSubmitError('');
    const cleanChar = value.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    if (cleanChar.length === 0) {
      setDigits((prev) => {
        const next = [...prev];
        next[index] = '';
        return next;
      });
      return;
    }

    // If more than 1 char was pasted/typed into this slot
    if (cleanChar.length > 1) {
      handlePastedString(cleanChar, index);
      return;
    }

    const nextChar = cleanChar.slice(-1);
    setDigits((prev) => {
      const next = [...prev];
      next[index] = nextChar;
      return next;
    });

    // Auto-advance to next input
    if (index < CODE_LENGTH - 1) {
      inputRefs[index + 1].current?.focus();
      inputRefs[index + 1].current?.select();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace') {
      setSubmitError('');
      if (digits[index] === '') {
        if (index > 0) {
          inputRefs[index - 1].current?.focus();
          setDigits((prev) => {
            const next = [...prev];
            next[index - 1] = '';
            return next;
          });
        }
      } else {
        setDigits((prev) => {
          const next = [...prev];
          next[index] = '';
          return next;
        });
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      event.preventDefault();
      inputRefs[index - 1].current?.focus();
      inputRefs[index - 1].current?.select();
    } else if (event.key === 'ArrowRight' && index < CODE_LENGTH - 1) {
      event.preventDefault();
      inputRefs[index + 1].current?.focus();
      inputRefs[index + 1].current?.select();
    }
  };

  const handlePastedString = (rawText, startIndex = 0) => {
    const clean = rawText.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    if (clean.length === 0) return;

    setSubmitError('');
    setDigits((prev) => {
      const next = [...prev];
      for (let i = 0; i < clean.length && startIndex + i < CODE_LENGTH; i += 1) {
        next[startIndex + i] = clean[i];
      }
      return next;
    });

    const nextFocusIndex = Math.min(startIndex + clean.length, CODE_LENGTH - 1);
    inputRefs[nextFocusIndex].current?.focus();
    inputRefs[nextFocusIndex].current?.select();
  };

  const handlePasteEvent = (index, event) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData('text');
    handlePastedString(pasted, index);
  };

  const handleClipboardPasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        handlePastedString(text, 0);
      }
    } catch {
      // Clipboard access might be blocked by browser permissions
    }
  };

  const handleSubmit = async (event) => {
    if (event) event.preventDefault();
    setSubmitError('');

    if (!isCodeComplete || !validation.value) {
      return;
    }

    if (!groupId) {
      setSubmitError(MISSINGGROUPID__TEXTLABEL[LANGUAGE]);
      return;
    }

    setIsSubmitting(true);

    const result = await enrollByCode(groupId, validation.value.toUpperCase());

    setIsSubmitting(false);

    if (result.ok) {
      navigate(groupMainPath(groupId), {
        replace: true,
        state: { joinSuccessMessage: GROUPJOINSUCCESSMESSAGE__TEXTLABEL[LANGUAGE] },
      });
    } else {
      setSubmitError(result.error || INVALIDCODE__TEXTLABEL[LANGUAGE]);
    }
  };

  if (!isLoading && hasAccess && group) {
    return <p className="group-join__message" role="status">{REDIRECTMESSAGE__TEXTLABEL[LANGUAGE]}</p>;
  }

  return (
    <section className="page-unavailable group-join" aria-label={PAGETITLE__TEXTLABEL[LANGUAGE]}>
      <PageHeader
        title={PAGETITLE__TEXTLABEL[LANGUAGE]}
        description={
          isStudent
            ? undefined
            : PAGEDESCRIPTIONNONSTUDENT__TEXTLABEL[LANGUAGE]
        }
      />

      {isLoading ? (
        <p className="group-join__message" role="status">{LOADINGMESSAGE__TEXTLABEL[LANGUAGE]}</p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p className="group-join__message group-join__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && group && !hasAccess && !isStudent ? (
        <p className="group-join__message group-join__message--error" role="alert">
          {NOACCESSMESSAGE__TEXTLABEL[LANGUAGE]}
        </p>
      ) : null}

      {!isLoading && group && !hasAccess && isStudent ? (
        <div className="group-join__content-card">
          <div className="group-join__info">
            <p className="group-join__lead">
              {GROUPINFOLEAD__TEXTLABEL[LANGUAGE]}
            </p>

            <dl className="group-join__details">
              <div className="group-join__detail">
                <dt>{STORYNAME__TEXTLABEL[LANGUAGE]}</dt>
                <dd>{group.storyName}</dd>
              </div>
              <div className="group-join__detail">
                <dt>{SUBJECT__TEXTLABEL[LANGUAGE]}</dt>
                <dd>{group.subject}</dd>
              </div>
              <div className="group-join__detail">
                <dt>{LECTURER__TEXTLABEL[LANGUAGE]}</dt>
                <dd>{group.lecturer}</dd>
              </div>
              <div className="group-join__detail">
                <dt>{GROUPID__TEXTLABEL[LANGUAGE]}</dt>
                <dd>{group.id}</dd>
              </div>
            </dl>
          </div>

          <form className="group-join__form" onSubmit={handleSubmit}>
            <div className="group-join__field">
              <label className="group-join__label">
                {ACCESSCODE__TEXTLABEL[LANGUAGE]}
              </label>

              <div className="group-join__tiles-row">
                <div className="group-join__tiles" role="group" aria-label={ACCESSCODE__TEXTLABEL[LANGUAGE]}>
                  {digits.map((digit, index) => (
                    <input
                      key={`code-tile-${index}`}
                      ref={(el) => { inputRefs[index].current = el; }}
                      type="text"
                      inputMode="text"
                      autoComplete="off"
                      spellCheck={false}
                      maxLength={1}
                      className={[
                        'group-join__tile',
                        showValidationError || submitError ? 'group-join__tile--error' : '',
                        digit ? 'group-join__tile--filled' : '',
                      ].filter(Boolean).join(' ')}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={(e) => handlePasteEvent(index, e)}
                      aria-label={`Znak ${index + 1} z ${CODE_LENGTH}`}
                    />
                  ))}

                  <button
                    type="button"
                    className="group-join__paste-btn"
                    onClick={handleClipboardPasteClick}
                    title={PASTEBUTTON__TEXTLABEL[LANGUAGE]}
                    aria-label={PASTEBUTTON__TEXTLABEL[LANGUAGE]}
                  >
                    <PasteIcon className="group-join__paste-icon" />
                  </button>
                </div>
              </div>

              {showValidationError || submitError ? (
                <p id="group-join-code-error" className="group-join__error" role="alert">
                  {showValidationError ? validation.error : submitError}
                </p>
              ) : null}

              <div className="group-join__actions">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={!isCodeComplete || isSubmitting}
                  className="group-join__submit-btn"
                >
                  {isSubmitting ? JOININGBUTTON__TEXTLABEL[LANGUAGE] : JOINBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </div>
          </form>
        </div>
      ) : null}
    </section>
  );
}
