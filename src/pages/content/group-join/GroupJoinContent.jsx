import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, PageHeader, CharacterLimitedField } from '../../../components/ui/index.js';
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
  polish: 'Prowadzący',
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

const INVALIDCODE__TEXTLABEL = {
  polish: 'Nieprawidłowy kod dostępu.',
  english: 'Invalid access code.',
};

export default function GroupJoinContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { role } = useAppRole();
  const { group, hasAccess, isLoading, errorMessage } = useGroupPreview(groupId);
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const [codeInput, setCodeInput] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isStudent = role === APP_ROLE.STUDENT;
  const validation = useMemo(
    () => validateAlphanumericInput(codeInput, ENROLLMENT_ENTRY_CODE_MAX_LENGTH),
    [codeInput],
  );
  const showValidationError = codeInput.trim() !== '' && !validation.valid;

  useEffect(() => {
    if (isLoading || !group || !hasAccess || !groupId) {
      return;
    }
    navigate(groupMainPath(groupId), { replace: true });
  }, [isLoading, group, hasAccess, groupId, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validation.valid || !validation.value) {
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
            ? PAGEDESCRIPTIONSTUDENT__TEXTLABEL[LANGUAGE]
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
        <>
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
              <label htmlFor="group-join-code" className="group-join__label">
                {ACCESSCODE__TEXTLABEL[LANGUAGE]}
              </label>
              <div className="group-join__input-row">
                <CharacterLimitedField
                  value={codeInput}
                  maxLength={ENROLLMENT_ENTRY_CODE_MAX_LENGTH}
                  className="group-join__input-field"
                >
                  <input
                    id="group-join-code"
                    type="text"
                    inputMode="text"
                    autoComplete="off"
                    spellCheck={false}
                    className={[
                      'group-join__input',
                      showValidationError ? 'group-join__input--error' : '',
                    ].filter(Boolean).join(' ')}
                    value={codeInput}
                    onChange={(event) => {
                      setCodeInput(event.target.value);
                      setSubmitError('');
                    }}
                    placeholder={INPUTPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                    maxLength={ENROLLMENT_ENTRY_CODE_MAX_LENGTH}
                    aria-invalid={showValidationError}
                    aria-describedby={
                      showValidationError || submitError ? 'group-join-code-error' : undefined
                    }
                  />
                </CharacterLimitedField>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!validation.valid || isSubmitting}
                >
                  {isSubmitting ? JOININGBUTTON__TEXTLABEL[LANGUAGE] : JOINBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>

              {showValidationError || submitError ? (
                <p id="group-join-code-error" className="group-join__error" role="alert">
                  {showValidationError ? validation.error : submitError}
                </p>
              ) : null}
            </div>
          </form>
        </>
      ) : null}
    </section>
  );
}
