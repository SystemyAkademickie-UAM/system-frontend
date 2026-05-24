import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, PageHeader } from '../../../components/ui/index.js';
import { groupMainPath } from '../../../routes/pathRegistry.js';
import { validateAlphanumericInput } from '../group-shared/alphanumericValidation.js';
import { getGroupAccessCode } from '../group-shared/groupAccessCodeStorage.js';
import { useGroupDetails } from '../group-shared/useGroupDetails.js';
import '../../../components/page/PageUnavailable.css';
import './GroupJoinContent.css';

export default function GroupJoinContent() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);
  const [codeInput, setCodeInput] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validation = useMemo(() => validateAlphanumericInput(codeInput), [codeInput]);
  const showValidationError = codeInput.trim() !== '' && !validation.valid;

  const handleSubmit = (event) => {
    event.preventDefault();
    setSubmitError('');

    if (!validation.valid || !validation.value) {
      return;
    }

    const expectedCode = getGroupAccessCode(groupId);

    if (!expectedCode || validation.value.toUpperCase() !== expectedCode.toUpperCase()) {
      setSubmitError('Nieprawidłowy kod dostępu.');
      return;
    }

    navigate(groupMainPath(groupId), { replace: true });
  };

  return (
    <section className="page-unavailable group-join" aria-label="Dołączenie do grupy">
      <PageHeader
        title="Dołączenie do grupy"
        description="Wpisz kod dostępu, aby wejść do wybranej grupy."
      />

      {isLoading ? (
        <p className="group-join__message" role="status">Ładowanie danych grupy…</p>
      ) : null}

      {!isLoading && errorMessage ? (
        <p className="group-join__message group-join__message--error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      {!isLoading && group ? (
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
                  placeholder="Wpisz kod dostępu"
                  aria-invalid={showValidationError}
                  aria-describedby={
                    showValidationError || submitError ? 'group-join-code-error' : undefined
                  }
                />
                <Button
                  type="submit"
                  variant="primary"
                  disabled={!validation.valid}
                >
                  Dołącz
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
