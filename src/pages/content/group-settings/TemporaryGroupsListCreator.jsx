import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Button, useToast } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import { createGroup, fetchGroupById, updateGroup } from '../groups-list/groupsList.api.js';
import './GroupSettingsForm.css';

const GROUP_NAME_MAX = 64;
const SUBJECT_NAME_MAX = 64;

export default function TemporaryGroupsListCreator({ popupclose }) {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();

  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [bannerfile, setBannerfile] = useState(null);
  const [bannerpreview, setBannerpreview] = useState(null);
  const [existingBannerUrl, setExistingBannerUrl] = useState(null);
  const [bannerRemoved, setBannerRemoved] = useState(false);
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
        setExistingBannerUrl(group.bannerUrl ?? null);
        setBannerRemoved(false);
      })
      .finally(() => {
        if (!cancelled) setIsLoadingGroup(false);
      });

    return () => { cancelled = true; };
  }, [groupId]);

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

  function onUploadbannerclick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (!file) return;
      setBannerfile(file);
      setBannerRemoved(false);
      const reader = new FileReader();
      reader.onload = () => {
        setBannerpreview(reader.result);
      };
      reader.readAsDataURL(file);
    };
    input.click();
  }

  function onRemovebannerclick() {
    setBannerfile(null);
    setBannerpreview(null);
    setExistingBannerUrl(null);
    setBannerRemoved(true);
  }

  async function uploadBannerToDrive(url, browserid) {
    const formdata = new FormData();
    const drivejson = {
      drive: {
        method: 'post',
        driveRef: '',
        size: bannerfile.size,
      },
    };
    formdata.append('json', JSON.stringify(drivejson));
    formdata.append('banner', bannerfile, bannerfile.name);

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
      throw new Error('Nie udało się przesłać banera.');
    }
    if (typeof drivedata.driveRef !== 'string' || drivedata.driveRef.trim() === '') {
      throw new Error('Brak driveRef w odpowiedzi serwera.');
    }

    return drivedata.driveRef.trim();
  }

  async function onSavegroupclick() {
    if (groupnamevalue.length < 1) {
      setGroupnamevalueerror('musi zawierać minimum 1 znak.');
      return;
    }

    setErrorMessage('');
    setIsSaving(true);

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      let imageref = null;
      if (bannerfile) {
        imageref = await uploadBannerToDrive(base, browserid);
      }

      const payload = {
        name: groupnamevalue.trim(),
        subjectName: subjectnamevalue.trim(),
        description: groupdescriptionvalue.trim(),
      };
      if (imageref) {
        payload.imageRef = imageref;
      } else if (bannerRemoved && groupId) {
        payload.imageRef = '';
      }

      const result = groupId
        ? await updateGroup(groupId, payload)
        : await createGroup(payload);

      if (!result.ok) {
        showError(result.error ?? 'Nie udało się zapisać grupy.');
        return;
      }

      if (groupId) {
        const refreshed = await fetchGroupById(groupId);
        if (refreshed) {
          setGroupnamevalue(refreshed.storyName ?? '');
          setSubjectnamevalue(refreshed.subject ?? '');
          setGroupdescriptionvalue(refreshed.description ?? '');
          setExistingBannerUrl(refreshed.bannerUrl ?? null);
          setBannerfile(null);
          setBannerpreview(null);
          setBannerRemoved(false);
        }
      }

      showSuccess(groupId ? 'Zmiany zostały zapisane.' : 'Grupa została utworzona.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsSaving(false);
    }
  }

  function onRejectclick() {
    setGroupnamevalue('');
    setSubjectnamevalue('');
    setGroupdescriptionvalue('');
    setBannerfile(null);
    setBannerpreview(null);
    setGroupnamevalueerror('');
    setSubjectnamevalueerror('');
    setErrorMessage('');
    setIsvisible(false);
    popupclose?.();
  }

  const displayedBanner = bannerpreview || existingBannerUrl;

  if (!isVisible) {
    return null;
  }

  return (
    <div className="group-settings-form">
      <div className="group-settings-form__panel">
        <h2 className="group-settings-form__panel-title">Edytor grupy</h2>
        {isLoadingGroup ? (
          <p className="group-settings-form__hint">Ładowanie danych grupy…</p>
        ) : null}
        <div className="group-settings-form__grid">
          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-name">
              Nazwa grupy
              {groupnamevalueerror ? (
                <span className="group-settings-form__label-error">{groupnamevalueerror}</span>
              ) : null}
            </label>
            <input
              id="group-settings-name"
              className="group-settings-form__input"
              value={groupnamevalue}
              maxLength={GROUP_NAME_MAX}
              onChange={(event) => onGroupnamechange(event.target.value)}
            />
          </div>
          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-subject">
              Nazwa przedmiotu
              {subjectnamevalueerror ? (
                <span className="group-settings-form__label-error">{subjectnamevalueerror}</span>
              ) : null}
            </label>
            <input
              id="group-settings-subject"
              className="group-settings-form__input"
              value={subjectnamevalue}
              maxLength={SUBJECT_NAME_MAX}
              onChange={(event) => onSubjectnamechange(event.target.value)}
            />
          </div>
          <div className="group-settings-form__field group-settings-form__field--banner">
            <span className="group-settings-form__label">Baner grupy</span>
            <button type="button" className="group-settings-form__banner" onClick={onUploadbannerclick}>
              {displayedBanner ? (
                <img src={displayedBanner} alt="Podgląd banera" />
              ) : (
                'Dodaj baner'
              )}
            </button>
            {displayedBanner ? (
              <Button variant="secondary" size="sm" onClick={onRemovebannerclick}>
                Usuń baner
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="group-settings-form__panel">
        <h2 className="group-settings-form__panel-title">Opis grupy</h2>
        <div className="group-settings-form__field">
          <label className="group-settings-form__label" htmlFor="group-settings-description">
            Opis fabularny i organizacyjny
          </label>
          <textarea
            id="group-settings-description"
            className="group-settings-form__textarea"
            value={groupdescriptionvalue}
            onChange={(event) => setGroupdescriptionvalue(event.target.value)}
            placeholder="Krótko opisz tło fabularne i cele grupy…"
          />
        </div>
      </div>

      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="group-settings-form__footer">
        {popupclose ? (
          <Button variant="ghost" size="md" onClick={onRejectclick}>
            Anuluj
          </Button>
        ) : null}
        <Button variant="primary" size="md" onClick={onSavegroupclick} disabled={isSaving || isLoadingGroup}>
          {isSaving ? 'Zapisywanie…' : 'Zapisz zmiany'}
        </Button>
      </div>
    </div>
  );
}
