import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../api-test/mock/browserIdStorage.js';
import { Button } from '../../../components/ui/index.js';
import { publicIconPath } from '../../../utils/publicAssetUrl.js';
import '../group-settings/GroupSettingsForm.css';
import './ToolsContent.css';

const loadresultsicon = publicIconPath('download-02-svgrepo-com.svg');
const exportusersicon = publicIconPath('upload-02-svgrepo-com.svg');

export default function ToolsContent() {
  const { groupId } = useParams();
  const [errorMessage, setErrorMessage] = useState('');
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
          'X-Browser-ID': browserid,
        },
        body: JSON.stringify({
          method: 'retrieve',
          groupId: Number(groupId),
        }),
      });

      const responsetext = await response.text();
      let data;

      try {
        data = JSON.parse(responsetext);
      } catch {
        console.log('/stages retrieve not JSON: ' + responsetext);
      }

      const receivedstages = [];
      let i = 0;

      while (i < data.stages.length) {
        receivedstages.push({
          id: data.stages[i].id,
          name: data.stages[i].name,
        });
        i += 1;
      }

      setStages(receivedstages);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  useEffect(() => {
    onFetchStages();
  }, []);

  return (
    <div className="activities-tools-page__body">
      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="group-settings-form">
        <section className="group-settings-form__panel" aria-labelledby="activities-tools-csv-title">
          <h2 id="activities-tools-csv-title" className="group-settings-form__panel-title">Pliki CSV</h2>
          <p className="group-settings-form__hint">Skróty do importu danych i generowania raportów.</p>
          <div className="activities-tools-page__tool-grid">
            <button type="button" className="activities-tools-page__tool-btn">
              <img src={loadresultsicon} alt="" />
              <span>Wczytaj aktywności z pliku</span>
            </button>
            <button type="button" className="activities-tools-page__tool-btn">
              <img src={exportusersicon} alt="" />
              <span>Generuj raport GRUPY</span>
            </button>
            <button type="button" className="activities-tools-page__tool-btn">
              <img src={exportusersicon} alt="" />
              <span>Generuj raport ETAPU</span>
            </button>
            <button type="button" className="activities-tools-page__tool-btn">
              <img src={exportusersicon} alt="" />
              <span>Generuj raport UCZESTNIKA</span>
            </button>
          </div>
        </section>

        <section className="group-settings-form__panel" aria-labelledby="activities-tools-summary-title">
          <h2 id="activities-tools-summary-title" className="group-settings-form__panel-title">Kreator podsumowania</h2>
          <p className="group-settings-form__hint">
            Prosimy o zaznaczenie elementów, których podsumowanie zostanie wygenerowane.
          </p>

          {stages.map((stage) => (
            <label
              key={`checkbox${stage.id}`}
              className="activities-tools-page__checkbox-row"
              htmlFor={`checkbox-${stage.id}`}
            >
              <input type="checkbox" id={`checkbox-${stage.id}`} className="activities-tools-page__checkbox" />
              <span>{stage.name}</span>
            </label>
          ))}

          <div className="group-settings-form__footer">
            <Button type="button" variant="primary" size="md">
              Wygeneruj podsumowanie
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
