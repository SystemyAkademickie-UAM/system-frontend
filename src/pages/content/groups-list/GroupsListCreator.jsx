import { useState } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import GroupBannerPicker from '../group-shared/GroupBannerPicker/GroupBannerPicker.jsx';
import { CharacterLimitedField, useToast } from '../../../components/ui/index.js';
import {
  GROUP_NAME_MAX_LENGTH,
  GROUP_SUBJECT_NAME_MAX_LENGTH,
  GROUP_DESCRIPTION_MAX_LENGTH,
} from '../../../constants/fieldLimits.js';
import {
  buildBannerImageRefPayload,
  createDefaultBannerPickerValue,
} from '../../../utils/groupBannerRef.js';
import './GroupsListCreator.css';

const GROUP_NAME_MAX = GROUP_NAME_MAX_LENGTH;
const SUBJECT_NAME_MAX = GROUP_SUBJECT_NAME_MAX_LENGTH;
const GROUP_DESCRIPTION_MAX = GROUP_DESCRIPTION_MAX_LENGTH;

export default function GroupsListCreator({ onClose, onCreated }) {
  const { showError } = useToast();
  const [step, setStep] = useState(1);
  const [slideDirection, setSlideDirection] = useState('forward');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [bannerSelection, setBannerSelection] = useState(createDefaultBannerPickerValue);

  function onGroupnamechange(value) {
    const trimmed = value.length > GROUP_NAME_MAX ? value.slice(0, GROUP_NAME_MAX) : value;
    if (trimmed.length < 1) {
      setGroupnamevalueerror('musi zawierać minimum 1 znak.');
    } else if (value.length > GROUP_NAME_MAX) {
      setGroupnamevalueerror(`maks. ${GROUP_NAME_MAX} znaków.`);
    } else {
      setGroupnamevalueerror('');
    }
    setGroupnamevalue(trimmed);
  }

  function onSubjectnamechange(value) {
    const trimmed = value.length > SUBJECT_NAME_MAX ? value.slice(0, SUBJECT_NAME_MAX) : value;
    if (value.length > SUBJECT_NAME_MAX) {
      setSubjectnamevalueerror(`maks. ${SUBJECT_NAME_MAX} znaków.`);
    } else {
      setSubjectnamevalueerror('');
    }
    setSubjectnamevalue(trimmed);
  }

  function onGroupdescriptionchange(value) {
    const trimmed = value.length > GROUP_DESCRIPTION_MAX
      ? value.slice(0, GROUP_DESCRIPTION_MAX)
      : value;
    setGroupdescriptionvalue(trimmed);
  }

  function resetForm() {
    setStep(1);
    setSlideDirection('forward');
    setGroupnamevalue('');
    setSubjectnamevalue('');
    setGroupdescriptionvalue('');
    setBannerSelection(createDefaultBannerPickerValue());
    setGroupnamevalueerror('');
    setSubjectnamevalueerror('');
  }

  function onRejectclick() {
    resetForm();
    onClose?.();
  }

  function validateStep1() {
    const validationErrors = [];
    let hasError = false;

    if (groupnamevalue.trim().length < 1) {
      setGroupnamevalueerror('musi zawierać minimum 1 znak.');
      validationErrors.push('Nazwa grupy musi zawierać minimum 1 znak.');
      hasError = true;
    }

    if (subjectnamevalue.trim().length < 1) {
      setSubjectnamevalueerror('musi zawierać minimum 1 znak.');
      validationErrors.push('Nazwa przedmiotu musi zawierać minimum 1 znak.');
      hasError = true;
    }

    if (groupdescriptionvalue.trim().length < 1) {
      validationErrors.push('Opis grupy jest wymagany.');
      hasError = true;
    }

    if (hasError) {
      showError(validationErrors.join(' '));
    }

    return !hasError;
  }

  function onNextStep() {
    if (!validateStep1()) {
      return;
    }
    setSlideDirection('forward');
    setStep(2);
  }

  function onPreviousStep() {
    setSlideDirection('back');
    setStep(1);
  }

  async function uploadBannerToDrive(url, browserid, file) {
    const formdata = new FormData();
    const drivejson = {
      drive: { method: 'post', driveRef: '', size: file.size },
    };
    formdata.append('json', JSON.stringify(drivejson));
    formdata.append('banner', file, file.name);

    const driveresponse = await fetch(`${url}/drive`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Browser-ID': browserid },
      body: formdata,
    });

    const drivetext = await driveresponse.text();
    let drivedata;
    try {
      drivedata = JSON.parse(drivetext);
    } catch {
      throw new Error('/drive not JSON: ' + drivetext);
    }
    if (!driveresponse.ok || drivedata.statusCode === 403) {
      throw new Error('Błąd /drive.');
    }
    if (typeof drivedata.driveRef !== 'string' || drivedata.driveRef.trim() === '') {
      throw new Error('Pusty driveRef.');
    }
    return drivedata.driveRef.trim();
  }

  async function resolveImageRefForSave(base, browserid) {
    if (bannerSelection.mode === 'file' && bannerSelection.file) {
      return uploadBannerToDrive(base, browserid, bannerSelection.file);
    }
    return buildBannerImageRefPayload(bannerSelection);
  }

  async function onSavegroupclick() {
    if (!validateStep1()) {
      setSlideDirection('back');
      setStep(1);
      return;
    }

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const imageref = await resolveImageRefForSave(base, browserid);

      const datatopost = {
        group: {
          name: groupnamevalue,
          subjectName: subjectnamevalue,
          description: groupdescriptionvalue,
        },
      };
      if (imageref !== undefined) {
        datatopost.group.imageRef = imageref;
      }

      const response = await fetch(`${base}/groups/new`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
        body: JSON.stringify(datatopost),
      });

      const responsetext = await response.text();
      let data;
      try {
        data = JSON.parse(responsetext);
      } catch {
        throw new Error('/groups/new not JSON: ' + responsetext);
      }

      if (!response.ok) {
        throw new Error('Error ' + response.status + ': ' + responsetext);
      }
      if (data.group === -1 || data.group === 1) {
        showError('Brak uprawnień do tworzenia grup.');
        return;
      }
      if (data.group === -2 || data.group === 0) {
        showError('Nie udało się utworzyć grupy.');
        return;
      }

      onCreated?.();
      resetForm();
      onClose?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
    }
  }

  return (
    <article
      className={[
        'groups-list-creator',
        step === 2 ? 'groups-list-creator--banner-step' : '',
      ]
        .filter(Boolean)
        .join(' ')}
      role="dialog"
      aria-modal="true"
      aria-labelledby="groups-list-creator-title"
      onClick={(event) => event.stopPropagation()}
    >
      <div className="groups-list-creator__body">
        <header className="groups-list-creator__header">
          <div className="groups-list-creator__titles">
            <div className="groups-list-creator__heading-row">
              <h2 id="groups-list-creator-title" className="groups-list-creator__title">
                Kreator grupy
              </h2>
              <span className="groups-list-creator__step-badge" aria-live="polite">
                {step}/2
              </span>
            </div>
            <p className="groups-list-creator__subtitle">
              {step === 1
                ? 'Nazwa, przedmiot i opis na jednej planszy.'
                : 'Wybierz baner: gotowy wzór, własny plik lub kolor tła.'}
            </p>
          </div>
          {step === 2 ? (
            <button
              type="button"
              className="groups-list-creator__btn groups-list-creator__btn--ghost groups-list-creator__back-btn"
              onClick={onPreviousStep}
              aria-label="Wróć do danych grupy"
            >
              ← Wróć
            </button>
          ) : null}
        </header>

        <div className="groups-list-creator__steps-viewport">
          <div
            className={[
              'groups-list-creator__steps-track',
              step === 2 ? 'groups-list-creator__steps-track--step-2' : '',
              slideDirection === 'back' ? 'groups-list-creator__steps-track--back' : '',
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <section className="groups-list-creator__step" aria-label="Dane grupy" aria-hidden={step !== 1}>
              <div className="groups-list-creator__panel groups-list-creator__panel--compact">
                <div className="groups-list-creator__fields">
                  <div className="groups-list-creator__field">
                    <label className="groups-list-creator__label" htmlFor="groups-list-creator-name">
                      Nazwa grupy
                      {groupnamevalueerror ? (
                        <span className="groups-list-creator__label-error">{groupnamevalueerror}</span>
                      ) : null}
                    </label>
                    <CharacterLimitedField value={groupnamevalue} maxLength={GROUP_NAME_MAX}>
                      <input
                        id="groups-list-creator-name"
                        className="groups-list-creator__input groups-list-creator__input--compact"
                        type="text"
                        value={groupnamevalue}
                        onChange={(event) => onGroupnamechange(event.target.value)}
                        maxLength={GROUP_NAME_MAX}
                        autoComplete="off"
                      />
                    </CharacterLimitedField>
                  </div>
                  <div className="groups-list-creator__field">
                    <label className="groups-list-creator__label" htmlFor="groups-list-creator-subject">
                      Nazwa przedmiotu
                      {subjectnamevalueerror ? (
                        <span className="groups-list-creator__label-error">{subjectnamevalueerror}</span>
                      ) : null}
                    </label>
                    <CharacterLimitedField value={subjectnamevalue} maxLength={SUBJECT_NAME_MAX}>
                      <input
                        id="groups-list-creator-subject"
                        className="groups-list-creator__input groups-list-creator__input--compact"
                        type="text"
                        value={subjectnamevalue}
                        onChange={(event) => onSubjectnamechange(event.target.value)}
                        maxLength={SUBJECT_NAME_MAX}
                        autoComplete="off"
                      />
                    </CharacterLimitedField>
                  </div>
                  <div className="groups-list-creator__field">
                    <label className="groups-list-creator__label" htmlFor="groups-list-creator-description">
                      Opis grupy
                    </label>
                    <CharacterLimitedField value={groupdescriptionvalue} maxLength={GROUP_DESCRIPTION_MAX}>
                      <textarea
                        id="groups-list-creator-description"
                        className="groups-list-creator__textarea groups-list-creator__textarea--compact"
                        value={groupdescriptionvalue}
                        maxLength={GROUP_DESCRIPTION_MAX}
                        onChange={(event) => onGroupdescriptionchange(event.target.value)}
                        placeholder="Krótko opisz tło fabularne i cele grupy…"
                        rows={4}
                      />
                    </CharacterLimitedField>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="groups-list-creator__step groups-list-creator__step--banner"
              aria-label="Baner grupy"
              aria-hidden={step !== 2}
            >
              <div className="groups-list-creator__panel groups-list-creator__panel--banner">
                <GroupBannerPicker
                  value={bannerSelection}
                  onChange={setBannerSelection}
                  className="groups-list-creator__banner-picker"
                />
              </div>
            </section>
          </div>
        </div>

      </div>

      <footer className="groups-list-creator__footer groups-list-creator__footer--sticky">
        <div className="groups-list-creator__footer-spacer" />
        <div className="groups-list-creator__footer-actions">
          <button
            type="button"
            className="groups-list-creator__btn groups-list-creator__btn--ghost"
            onClick={onRejectclick}
          >
            Odrzuć
          </button>
          {step === 1 ? (
            <button
              type="button"
              className="groups-list-creator__btn groups-list-creator__btn--primary"
              onClick={onNextStep}
            >
              Dalej
            </button>
          ) : (
            <button
              type="button"
              className="groups-list-creator__btn groups-list-creator__btn--primary"
              onClick={onSavegroupclick}
            >
              Stwórz
            </button>
          )}
        </div>
      </footer>
    </article>
  );
}
