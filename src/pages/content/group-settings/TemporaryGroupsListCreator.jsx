import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SubNav, useToast } from '../../../components/ui/index.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import { createGroup, fetchGroupById, updateGroup } from '../groups-list/groupsList.api.js';
import './GroupSettingsForm.css';

export default function App({ popupclose, subNav }) {
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
      })
      .finally(() => {
        if (!cancelled) setIsLoadingGroup(false);
      });

    return () => { cancelled = true; };
  }, [groupId]);

  const GROUP_NAME_MAX = 64;
  const SUBJECT_NAME_MAX = 64;

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
  function onGroupdescriptionchange(stringvalue) {
    setGroupdescriptionvalue(stringvalue);
  }
  function onTemplatesgalleryclick() {
    // Templates gallery placeholder.
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
    if (popupclose) {
      popupclose();
    }
  }
  function onUploadbannerclick() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setBannerfile(file);
        const reader = new FileReader();
        reader.onload = () => {
          setBannerpreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
  async function onTryFetchGroupsList() {
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const url = base + '/groups';
      await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid,
        },
      });
    } catch (error) {
      console.log('GET /groups error:', error instanceof Error ? error.message : String(error));
    }
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

    const driveurl = url + '/drive';
    const driveresponse = await fetch(driveurl, {
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

    if (!driveresponse.ok || drivedata.status == 403) {
      throw new Error('Error.');
    }
    if (typeof drivedata.driveRef != 'string' || drivedata.driveRef.trim() == '') {
      throw new Error('Error driveRef.');
    }

    return drivedata.driveRef.trim();
  }

  async function onSavegroupclick() {
    if (groupnamevalue.length < 1) {
      setGroupnamevalueerror('musi zawierać minimum 1 znak.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setIsSaving(true);

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      let imageref = null;
      if (bannerfile) {
        imageref = await uploadBannerToDrive(base, browserid);
      }

      const payload = {
        name: groupnamevalue,
        subjectName: subjectnamevalue,
        description: groupdescriptionvalue,
      };
      if (imageref) {
        payload.imageRef = imageref;
      }

      const result = groupId
        ? await updateGroup(groupId, payload)
        : await createGroup(payload);

      if (!result.ok) {
        showError(result.error ?? 'Nie udało się zapisać grupy.');
        return;
      }

      await onTryFetchGroupsList();
      showSuccess(groupId ? 'Zmiany zostały zapisane.' : 'Grupa została utworzona.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
    } finally {
      setIsSaving(false);
    }
  }
  function onRemovebannerclick() {
    setBannerfile(null);
    setBannerpreview(null);
    setExistingBannerUrl(null);
  }

  const displayedBanner = bannerpreview || existingBannerUrl;

  return isVisible ? (
    <div className="group-settings-form">
      <div className="group-settings-form__nav-row">
        {subNav && subNav.items?.length > 0 ? (
          <SubNav
            ariaLabel={subNav.ariaLabel}
            items={subNav.items}
            className="group-settings-form__sub-nav"
          />
        ) : <div />}
        <button
          type="button"
          className="group-settings-form__btn group-settings-form__btn--primary"
          onClick={onTemplatesgalleryclick}
        >
          Gotowy wzór
        </button>
      </div>

      <div className="group-settings-form__panel">
        <h3 className="group-settings-form__panel-title">{groupId ? 'Edytor grupy' : 'Grupa'}</h3>
        {isLoadingGroup ? (
          <p className="group-settings-form__label">Ładowanie danych grupy…</p>
        ) : null}
        <div className="group-settings-form__grid">
          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-name">
              Nazwa grupy
              {groupnamevalueerror ? <span className="group-settings-form__label-error"> {groupnamevalueerror}</span> : null}
            </label>
            <input id="group-settings-name" className="group-settings-form__input" value={groupnamevalue} onChange={(event) => onGroupnamechange(event.target.value)} />
          </div>
          <div className="group-settings-form__field">
            <label className="group-settings-form__label" htmlFor="group-settings-subject">
              Nazwa przedmiotu
              {subjectnamevalueerror ? <span className="group-settings-form__label-error"> {subjectnamevalueerror}</span> : null}
            </label>
            <input id="group-settings-subject" className="group-settings-form__input" value={subjectnamevalue} onChange={(event) => onSubjectnamechange(event.target.value)} />
          </div>
          <div className="group-settings-form__field">
            <label className="group-settings-form__label">Baner grupy</label>
            <button type="button" className="group-settings-form__banner" onClick={onUploadbannerclick}>
              {displayedBanner ? <img src={displayedBanner} alt="Podgląd banera" /> : 'Dodaj baner'}
            </button>
            {displayedBanner ? (
              <button type="button" className="group-settings-form__btn group-settings-form__btn--secondary" onClick={onRemovebannerclick}>
                Usuń baner
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="group-settings-form__panel">
        <h3 className="group-settings-form__panel-title">Opis grupy</h3>
        <div className="group-settings-form__field">
          <label className="group-settings-form__label" htmlFor="group-settings-description">
            Opis fabularny i organizacyjny
          </label>
          <textarea
            id="group-settings-description"
            className="group-settings-form__textarea"
            value={groupdescriptionvalue}
            onChange={(event) => onGroupdescriptionchange(event.target.value)}
            placeholder="Krótko opisz tło fabularne i cele grupy…"
          />
        </div>
      </div>

      {errorMessage ? <p className="group-settings-form__error" role="alert">{errorMessage}</p> : null}

      <div className="group-settings-form__footer">
        <button type="button" className="group-settings-form__btn group-settings-form__btn--primary" onClick={onSavegroupclick} disabled={isSaving}>
          {isSaving ? 'Zapisywanie…' : 'Zapisz'}
        </button>
      </div>
    </div>
  ) : null;
}
