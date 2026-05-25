import { useState } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import './GroupsListCreator.css';

const GROUP_NAME_MAX = 64;
const SUBJECT_NAME_MAX = 64;

export default function GroupsListCreator({ onClose, onCreated }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');

  const [bannerfile, setBannerfile] = useState(null);
  const [bannerpreview, setBannerpreview] = useState(null);

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
    setGroupdescriptionvalue(value);
  }

  function onTemplatesgalleryclick() {
    // Galeria szablonów — placeholder.
  }

  function resetForm() {
    setGroupnamevalue('');
    setSubjectnamevalue('');
    setGroupdescriptionvalue('');
    setBannerfile(null);
    setBannerpreview(null);
    setGroupnamevalueerror('');
    setSubjectnamevalueerror('');
    setErrorMessage('');
  }

  function onRejectclick() {
    resetForm();
    onClose?.();
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

  function onRemovebannerclick() {
    setBannerfile(null);
    setBannerpreview(null);
  }

  async function uploadBannerToDrive(url, browserid) {
    const formdata = new FormData();
    const drivejson = {
      drive: { method: 'post', driveRef: '', size: bannerfile.size },
    };
    formdata.append('json', JSON.stringify(drivejson));
    formdata.append('banner', bannerfile, bannerfile.name);

    const driveresponse = await fetch(url + '/drive', {
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
    if (!driveresponse.ok || drivedata.status == 403) {
      throw new Error('Błąd /drive.');
    }
    if (typeof drivedata.driveRef != 'string' || drivedata.driveRef.trim() == '') {
      throw new Error('Pusty driveRef.');
    }
    return drivedata.driveRef.trim();
  }

  async function onSavegroupclick() {
    if (groupnamevalue.length < 1) {
      setGroupnamevalueerror('musi zawierać minimum 1 znak.');
      return;
    }
    setErrorMessage('');

    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      let imageref = null;
      if (bannerfile) {
        imageref = await uploadBannerToDrive(base, browserid);
      }

      const datatopost = {
        group: {
          name: groupnamevalue,
          subjectName: subjectnamevalue,
          description: groupdescriptionvalue,
        },
      };
      if (imageref) {
        datatopost.group.imageRef = imageref;
      }

      const response = await fetch(base + '/groups/new', {
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
        setErrorMessage('Brak uprawnień do tworzenia grup.');
        return;
      }
      if (data.group === -2 || data.group === 0) {
        setErrorMessage('Nie udało się utworzyć grupy.');
        return;
      }

      onCreated?.();
      resetForm();
      onClose?.();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  return (
    <article
      className="groups-list-creator"
      role="dialog"
      aria-modal="true"
      aria-labelledby="groups-list-creator-title"
      onClick={(event) => event.stopPropagation()}
    >
      <header className="groups-list-creator__header">
        <div className="groups-list-creator__titles">
          <h2 id="groups-list-creator-title" className="groups-list-creator__title">
            Kreator grupy
          </h2>
          <p className="groups-list-creator__subtitle">
            W celu utworzenia nowej grupy wprowadź nazwę i opis.
          </p>
        </div>
        <button
          type="button"
          className="groups-list-creator__btn groups-list-creator__btn--primary"
          onClick={onTemplatesgalleryclick}
        >
          Gotowy wzór
        </button>
      </header>

      <section className="groups-list-creator__panel">
        <h3 className="groups-list-creator__panel-title">Grupa</h3>
        <div className="groups-list-creator__grid">
          <div className="groups-list-creator__field">
            <label className="groups-list-creator__label" htmlFor="groups-list-creator-name">
              Nazwa grupy
              {groupnamevalueerror ? (
                <span className="groups-list-creator__label-error">{groupnamevalueerror}</span>
              ) : null}
            </label>
            <input
              id="groups-list-creator-name"
              className="groups-list-creator__input"
              type="text"
              value={groupnamevalue}
              onChange={(event) => onGroupnamechange(event.target.value)}
              maxLength={GROUP_NAME_MAX}
              autoComplete="off"
            />
          </div>
          <div className="groups-list-creator__field">
            <label className="groups-list-creator__label" htmlFor="groups-list-creator-subject">
              Nazwa przedmiotu
              {subjectnamevalueerror ? (
                <span className="groups-list-creator__label-error">{subjectnamevalueerror}</span>
              ) : null}
            </label>
            <input
              id="groups-list-creator-subject"
              className="groups-list-creator__input"
              type="text"
              value={subjectnamevalue}
              onChange={(event) => onSubjectnamechange(event.target.value)}
              maxLength={SUBJECT_NAME_MAX}
              autoComplete="off"
            />
          </div>
          <div className="groups-list-creator__field" style={{ gridColumn: '1 / -1' }}>
            <label className="groups-list-creator__label">Baner grupy</label>
            <button
              type="button"
              className="groups-list-creator__banner"
              onClick={onUploadbannerclick}
            >
              {bannerpreview ? (
                <img src={bannerpreview} alt="Podgląd banera" />
              ) : (
                'Dodaj baner'
              )}
            </button>
            {bannerpreview ? (
              <button
                type="button"
                className="groups-list-creator__btn groups-list-creator__btn--secondary"
                onClick={onRemovebannerclick}
              >
                Usuń baner
              </button>
            ) : null}
          </div>
        </div>
      </section>

      <section className="groups-list-creator__panel">
        <h3 className="groups-list-creator__panel-title">Opis grupy</h3>
        <textarea
          className="groups-list-creator__textarea"
          value={groupdescriptionvalue}
          onChange={(event) => onGroupdescriptionchange(event.target.value)}
          placeholder="Krótko opisz tło fabularne i cele grupy…"
        />
      </section>

      {errorMessage ? (
        <p className="groups-list-creator__error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <footer className="groups-list-creator__footer">
        <div className="groups-list-creator__footer-spacer" />
        <button
          type="button"
          className="groups-list-creator__btn groups-list-creator__btn--ghost"
          onClick={onRejectclick}
        >
          Odrzuć
        </button>
        <button
          type="button"
          className="groups-list-creator__btn groups-list-creator__btn--primary"
          onClick={onSavegroupclick}
        >
          Zapisz
        </button>
      </footer>
    </article>
  );
}
