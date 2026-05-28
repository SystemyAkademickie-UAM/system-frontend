import { useCallback, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl, getSamlLoginUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';

import { publicIconPath } from '../../../utils/publicAssetUrl.js';

const loadusersicon = publicIconPath('download-01-svgrepo-com.svg');
const loadresultsicon = publicIconPath('download-02-svgrepo-com.svg');
const exportusersicon = publicIconPath('upload-02-svgrepo-com.svg');
import '../shared/LegacyContentLayout.css';

export default function App() {

  const {groupId} = useParams();
  const [errorMessage, setErrorMessage] = useState('');
  const [groupnamevalue, setGroupnamevalue] = useState('');
  const [subjectnamevalue, setSubjectnamevalue] = useState('');
  const [groupnamevalueerror, setGroupnamevalueerror] = useState('');
  const [subjectnamevalueerror, setSubjectnamevalueerror] = useState('');
  const [groupdescriptionvalue, setGroupdescriptionvalue] = useState('');
  const [isVisible, setIsvisible] = useState(true);

  const [bannerFile, setBannerfile] = useState(null);
  const [bannerPreview, setBannerpreview] = useState(null);

  const [stages, setStages] = useState([]);



  async function onFetchStages() {

    setErrorMessage('');

    try {

      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();

      const url = base + '/stages';

      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-Browser-ID': browserid
        },
        body: JSON.stringify({
          method: 'retrieve',
          groupId: Number(groupId)
        })
      });

      const responsetext = await response.text();

      console.log('POST /stages retrieve: ', response.status);
      console.log('POST /stages retrieve: ', responsetext);

      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages retrieve not JSON: ' + responsetext);
      }

      console.log('POST /stages retrieve JSON:', data);

      let receiveddata = data;

      const receivedstages = [];

      let i = 0;

      while (i < receiveddata.stages.length) {

        receivedstages.push({
          id: receiveddata.stages[i].id,
          name: receiveddata.stages[i].name
        });

        i = i + 1;
      }

      setStages(receivedstages);

    } catch (error) {

      let message;

      if (error instanceof Error) {
        message = error.message;
      } else {
        message = String(error);
      }

      setErrorMessage(message);
    }
  }





  useEffect(() => {
    onFetchStages();
  }, []);





  return (
    <section className="legacy-content" aria-label="Narzędzia aktywności">
      {errorMessage ? <p className="legacy-content__error" role="alert">{errorMessage}</p> : null}

      <div className="legacy-content__stack">
        <div className="legacy-content__panel">
          <h2 className="legacy-content__panel-title">Pliki CSV</h2>
          <p className="legacy-content__panel-description">Skróty do najważniejszych funkcji:</p>
          <div className="legacy-content__tool-grid">
            <button type="button" className="legacy-content__tool-tile">
              <img src={loadusersicon} alt="" />
              <span>Wczytaj graczy z pliku</span>
            </button>
            <button type="button" className="legacy-content__tool-tile">
              <img src={loadresultsicon} alt="" />
              <span>Wczytaj wyniki z pliku</span>
            </button>
            <button type="button" className="legacy-content__tool-tile">
              <img src={exportusersicon} alt="" />
              <span>Eksportuj wyniki do pliku</span>
            </button>
          </div>
        </div>

        <div className="legacy-content__panel">
          <h2 className="legacy-content__panel-title">Kreator podsumowania</h2>
          <p className="legacy-content__panel-description">Prosimy o zaznaczenie elementów, których podsumowanie zostanie wygenerowane.</p>

          {stages.map((stage) => (
            <div key={`checkbox${stage.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0' }}>
              <input type="checkbox" id={`checkbox-${stage.id}`} style={{ cursor: 'pointer' }} />
              <label htmlFor={`checkbox-${stage.id}`} style={{ color: 'rgb(227, 224, 247)', fontSize: '14px', fontWeight: 500 }}>
                {stage.name}
              </label>
            </div>
          ))}

          <button type="button" style={{ alignSelf: 'center', marginTop: '0.5rem', padding: '0.85rem 1.5rem', border: 0, borderRadius: '8px', background: 'rgba(66, 243, 125, 1)', color: 'rgb(0, 57, 21)', fontWeight: 900, cursor: 'pointer' }}>
            Wygeneruj podsumowanie
          </button>
        </div>
      </div>
    </section>
  );
}




