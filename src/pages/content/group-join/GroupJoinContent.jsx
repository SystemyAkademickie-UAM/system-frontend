import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, PageHeader, CharacterLimitedField } from '../../../components/ui/index.js';
import { ENROLLMENT_ENTRY_CODE_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import { validateAlphanumericInput } from '../group-shared/alphanumericValidation.js';
import { useGroupPreview } from '../group-shared/useGroupPreview.js';
import { enrollByCode } from '../../../services/enrollment.api.js';
import '../../../components/page/PageUnavailable.css';
import './GroupJoinContent.css';

const GROUP_JOIN_SUCCESS_MESSAGE = 'Pomyślnie dołączono do grupy.';

export default function GroupJoinContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { role } = useAppRole();
  const { group, hasAccess, isLoading, errorMessage } = useGroupPreview(groupId);
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
      setSubmitError('Brak identyfikatora grupy.');
      return;
    }

    setIsSubmitting(true);

    const result = await enrollByCode(groupId, validation.value.toUpperCase());

    setIsSubmitting(false);

    if (result.ok) {
      navigate(groupMainPath(groupId), {
        replace: true,
        state: { joinSuccessMessage: GROUP_JOIN_SUCCESS_MESSAGE },
      });
    } else {
      setSubmitError(result.error || 'Nieprawidłowy kod dostępu.');
    }
  };

  if (!isLoading && hasAccess && group) {
    return <p className="group-join__message" role="status">Przekierowywanie do grupy…</p>;
  }

  return (
    <section className="page-unavailable group-join" aria-label="Dołączenie do grupy">
      <PageHeader
        title="Dołączenie do grupy"
        description={
          isStudent
            ? 'Wpisz kod dostępu, aby wejść do wybranej grupy.'
            : 'Ta grupa nie należy do Twoich kursów.'
        }
      />

      {isLoading ? (
        <p className="group-join__message" role="status">Ładowanie danych grupy…</p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p className="group-join__message group-join__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && group && !hasAccess && !isStudent ? (
        <p className="group-join__message group-join__message--error" role="alert">
          Nie masz dostępu do tej grupy. Możesz zarządzać wyłącznie własnymi kursami.
        </p>
      ) : null}

      {!isLoading && group && !hasAccess && isStudent ? (
        <>
          <div className="group-join__info">
            <p className="group-join__lead">
              Próbujesz dołączyć do grupy:
            </p>

            <dl className="group-join__details">
              <div className="group-join__detail">
                <dt>Nazwa fabularna</dt>
                <dd>{group.storyName}</dd>
              </div>
              <div className="group-join__detail">
                <dt>Przedmiot</dt>
                <dd>{group.subject}</dd>
              </div>
              <div className="group-join__detail">
                <dt>Prowadzący</dt>
                <dd>{group.lecturer}</dd>
              </div>
              <div className="group-join__detail">
                <dt>Identyfikator grupy</dt>
                <dd>{group.id}</dd>
              </div>
            </dl>
          </div>

          <form className="group-join__form" onSubmit={handleSubmit}>
            <div className="group-join__field">
              <label htmlFor="group-join-code" className="group-join__label">
                Kod dostępu
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
                    placeholder="Wpisz 6-znakowy kod"
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
                  {isSubmitting ? 'Dołączanie...' : 'Dołącz'}
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
