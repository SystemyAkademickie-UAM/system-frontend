import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SettingsSectionHeader from '../../../components/layout/sectionPage/SettingsSectionHeader.jsx';
import { Button, Divider, CharacterLimitedField, useToast } from '../../../components/ui/index.js';
import {
  GROUP_NAME_MAX_LENGTH,
  GROUP_SUBJECT_NAME_MAX_LENGTH,
  GROUP_DESCRIPTION_MAX_LENGTH,
} from '../../../constants/fieldLimits.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import {
  buildBannerImageRefPayload,
  createDefaultBannerPickerValue,
  parseImageRefToBannerPickerValue,
  serializeBannerPickerValue,
} from '../../../utils/groupBannerRef.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import GroupBannerPicker from '../group-shared/GroupBannerPicker/GroupBannerPicker.jsx';
import { createGroup, fetchGroupById, updateGroup } from '../../../services/groups.api.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import './GroupSettingsForm.css';

const GROUP_NAME_MAX = GROUP_NAME_MAX_LENGTH;
const SUBJECT_NAME_MAX = GROUP_SUBJECT_NAME_MAX_LENGTH;
const GROUP_DESCRIPTION_MAX = GROUP_DESCRIPTION_MAX_LENGTH;

const GROUPNAMEMINERROR__TEXTLABEL = {
  polish: 'musi zawierać minimum 1 znak.',
  english: 'must contain at least 1 character.',
};

const GROUPNAMEMAXERROR__TEXTLABEL = {
  polish: 'maks. {max} znaków.',
  english: 'max. {max} characters.',
};

const SUBJECTNAMEMAXERROR__TEXTLABEL = {
  polish: 'maks. {max} znaków.',
  english: 'max. {max} characters.',
};

const BANNERUPLOADERROR__TEXTLABEL = {
  polish: 'Nie udało się przesłać banera.',
  english: 'Failed to upload banner.',
};

const DRIVEREFERERROR__TEXTLABEL = {
  polish: 'Brak driveRef w odpowiedzi serwera.',
  english: 'Missing driveRef in server response.',
};

const SAVEGROUPERROR__TEXTLABEL = {
  polish: 'Nie udało się zapisać grupy.',
  english: 'Failed to save group.',
};

const SAVEDSUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Zmiany zostały zapisane.',
  english: 'Changes have been saved.',
};

const CREATEDSUCCESSMESSAGE__TEXTLABEL = {
  polish: 'Grupa została utworzona.',
  english: 'Group has been created.',
};

const GENERALSECTION__TEXTLABEL = {
  polish: 'Ogólne',
  english: 'General',
};

const BANNERSECTION__TEXTLABEL = {
  polish: 'Baner',
  english: 'Banner',
};

const LOADMESSAGE__TEXTLABEL = {
  polish: 'Ładowanie danych grupy…',
  english: 'Loading group data…',
};

const GROUPNAMETITLE__TEXTLABEL = {
  polish: 'Nazwa grupy*',
  english: 'Group name*',
};

const SUBJECTNAMETITLE__TEXTLABEL = {
  polish: 'Nazwa przedmiotu',
  english: 'Subject name',
};

const GROUPDESCRIPTIONTITLE__TEXTLABEL = {
  polish: 'Opis grupy',
  english: 'Group description',
};

const GROUPDESCRIPTIONPLACEHOLDER__TEXTLABEL = {
  polish: 'Krótko opisz tło fabularne i cele grupy…',
  english: 'Briefly describe the plot background and goals of the group…',
};

const SAVEDGROUPBUTTON__TEXTLABEL = {
  polish: 'Zapisz zmiany',
  english: 'Save changes',
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel',
};

const GROUPSETTINGS__TEXTLABEL = {
  polish: 'Ustawienia grupy',
  english: 'Group settings',
};

export default function TemporaryGroupsListCreator({ popupclose }) {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [bannerSelection, setBannerSelection] = useState(createDefaultBannerPickerValue);
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);

  useEffect(() => {
    if (!groupId) return;

    let cancelled = false;
    setIsLoadingGroup(true);
    fetchGroupById(groupId)
      .then((group) => {
        if (cancelled || !group) return;
        setGroupnamevalue(group.storyName ?? '');
        setSubjectnamevalue(group.subject ?? '');
        setGroupdescriptionvalue(group.description ?? '');
        setBannerSelection(parseImageRefToBannerPickerValue(group.imageRef, group.bannerUrl));
      })
      .finally(() => {
        if (!cancelled) setIsLoadingGroup(false);
      });

    return () => { cancelled = true; };
  }, [groupId]);

  function onGroupnamechange(value) {
    const trimmed = value.length > GROUP_NAME_MAX ? value.slice(0, GROUP_NAME_MAX) : value;
    if (trimmed.length < 1) {
      setGroupnamevalueerror(GROUPNAMEMINERROR__TEXTLABEL[LANGUAGE]);
    } else if (value.length > GROUP_NAME_MAX) {
      setGroupnamevalueerror(GROUPNAMEMAXERROR__TEXTLABEL[LANGUAGE].replace('{max}', GROUP_NAME_MAX));
    } else {
      setGroupnamevalueerror('');
    }
    setGroupnamevalue(trimmed);
  }

  function onSubjectnamechange(value) {
    const trimmed = value.length > SUBJECT_NAME_MAX ? value.slice(0, SUBJECT_NAME_MAX) : value;
    if (value.length > SUBJECT_NAME_MAX) {
      setSubjectnamevalueerror(SUBJECTNAMEMAXERROR__TEXTLABEL[LANGUAGE].replace('{max}', SUBJECT_NAME_MAX));
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

  async function uploadBannerToDrive(url, browserid, file) {
    const formdata = new FormData();
    const drivejson = {
      drive: {
        method: 'post',
        driveRef: '',
        size: file.size,
      },
    };
    formdata.append('json', JSON.stringify(drivejson));
    formdata.append('banner', file, file.name);

    const driveresponse = await fetch(`${url}/drive`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'X-Browser-ID': browserid },
      body: formdata,
    });

    const drivetest = await driveresponse.text();
    let drivedata;
    try {
      drivedata = JSON.parse(drivetest);
    } catch {
      throw new Error('/drive not JSON: ' + drivetest);
    }

    if (!driveresponse.ok || drivedata.statusCode === 403) {
      throw new Error(BANNERUPLOADERROR__TEXTLABEL[LANGUAGE]);
    }
    if (typeof drivedata.driveRef !== 'string' || drivedata.driveRef.trim() === '') {
      throw new Error(DRIVEREFERERROR__TEXTLABEL[LANGUAGE]);
    }

    return drivedata.driveRef.trim();
  }

  async function resolveImageRefForSave(base, browserid) {
    if (bannerSelection.mode === 'file' && bannerSelection.file) {
      return uploadBannerToDrive(base, browserid, bannerSelection.file);
    }
    return buildBannerImageRefPayload(bannerSelection);
  }

  const persistGroupSettings = useCallback(async () => {
    if (groupnamevalue.length < 1) {
      setGroupnamevalueerror(GROUPNAMEMINERROR__TEXTLABEL[LANGUAGE]);
      return;
    }

    setErrorMessage('');
    setIsSaving(true);

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const imageref = await resolveImageRefForSave(base, browserid);

      const payload = {
        name: groupnamevalue.trim(),
        subjectName: subjectnamevalue.trim(),
        description: groupdescriptionvalue.trim(),
      };
      if (imageref !== undefined) {
        payload.imageRef = imageref;
      }

      const result = groupId
        ? await updateGroup(groupId, payload)
        : await createGroup(payload);

      if (!result.ok) {
        showError(result.error ?? SAVEGROUPERROR__TEXTLABEL[LANGUAGE]);
        return;
      }

      if (groupId) {
        const refreshed = await fetchGroupById(groupId);
        if (refreshed) {
          setGroupnamevalue(refreshed.storyName ?? '');
          setSubjectnamevalue(refreshed.subject ?? '');
          setGroupdescriptionvalue(refreshed.description ?? '');
          setBannerSelection(parseImageRefToBannerPickerValue(refreshed.imageRef, refreshed.bannerUrl));
        }
      }

      showSuccess(groupId ? SAVEDSUCCESSMESSAGE__TEXTLABEL[LANGUAGE] : CREATEDSUCCESSMESSAGE__TEXTLABEL[LANGUAGE]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsSaving(false);
    }
  }, [
    bannerSelection,
    groupId,
    groupdescriptionvalue,
    groupnamevalue,
    showError,
    showSuccess,
    subjectnamevalue,
  ]);


  function onRejectclick() {
    setGroupnamevalue('');
    setSubjectnamevalue('');
    setGroupdescriptionvalue('');
    setBannerSelection(createDefaultBannerPickerValue());
    setGroupnamevalueerror('');
    setSubjectnamevalueerror('');
    setErrorMessage('');
    setIsvisible(false);
    popupclose?.();
  }

  if (!isVisible) {
    return null;
  }

  return (
    <div className="group-settings-form group-settings-form--drive-layout">
      <section className="group-settings-form__panel" aria-label={GROUPSETTINGS__TEXTLABEL[LANGUAGE]}>
        <SettingsSectionHeader title={GENERALSECTION__TEXTLABEL[LANGUAGE]} id="group-settings-general-title" />
        {isLoadingGroup ? (
          <p className="group-settings-form__hint">{LOADMESSAGE__TEXTLABEL[LANGUAGE]}</p>
        ) : null}

        <div className="group-settings-form__stack">
          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-name">
              {GROUPNAMETITLE__TEXTLABEL[LANGUAGE]}
              {groupnamevalueerror ? (
                <span className="group-settings-form__label-error">{groupnamevalueerror}</span>
              ) : null}
            </label>
            <CharacterLimitedField value={groupnamevalue} maxLength={GROUP_NAME_MAX}>
              <input
                id="group-settings-name"
                className="group-settings-form__input"
                value={groupnamevalue}
                maxLength={GROUP_NAME_MAX}
                onChange={(event) => onGroupnamechange(event.target.value)}
                disabled={isSaving || isLoadingGroup}
              />
            </CharacterLimitedField>
          </div>

          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-subject">
              {SUBJECTNAMETITLE__TEXTLABEL[LANGUAGE]}
              {subjectnamevalueerror ? (
                <span className="group-settings-form__label-error">{subjectnamevalueerror}</span>
              ) : null}
            </label>
            <CharacterLimitedField value={subjectnamevalue} maxLength={SUBJECT_NAME_MAX}>
              <input
                id="group-settings-subject"
                className="group-settings-form__input"
                value={subjectnamevalue}
                maxLength={SUBJECT_NAME_MAX}
                onChange={(event) => onSubjectnamechange(event.target.value)}
                disabled={isSaving || isLoadingGroup}
              />
            </CharacterLimitedField>
          </div>

          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-description">
              {GROUPDESCRIPTIONTITLE__TEXTLABEL[LANGUAGE]}
            </label>
            <CharacterLimitedField value={groupdescriptionvalue} maxLength={GROUP_DESCRIPTION_MAX}>
              <textarea
                id="group-settings-description"
                className="group-settings-form__textarea"
                value={groupdescriptionvalue}
                maxLength={GROUP_DESCRIPTION_MAX}
                onChange={(event) => onGroupdescriptionchange(event.target.value)}
                placeholder={GROUPDESCRIPTIONPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                disabled={isSaving || isLoadingGroup}
              />
            </CharacterLimitedField>
          </div>
        </div>

        <Divider className="group-settings-form__section-divider" />

        <SettingsSectionHeader title={BANNERSECTION__TEXTLABEL[LANGUAGE]} id="group-settings-banner-title" />
        <div className="group-settings-form__field group-settings-form__field--banner">
          <GroupBannerPicker
            value={bannerSelection}
            onChange={setBannerSelection}
            className="group-settings-form__banner-picker"
          />
        </div>
      </section>

      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      {groupId ? (
        <Button
          type="button"
          variant="primary"
          size="md"
          className="group-settings-form__save-fab"
          onClick={persistGroupSettings}
          disabled={isSaving || isLoadingGroup}
        >
          {SAVEDGROUPBUTTON__TEXTLABEL[LANGUAGE]}
        </Button>
      ) : null}

      {popupclose ? (
        <div className="group-settings-form__footer">
          <Button variant="ghost" size="md" onClick={onRejectclick}>
            {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
