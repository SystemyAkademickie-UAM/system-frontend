import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { Button, Divider } from '../../../components/ui/index.js';
import { publicIconPath } from '../../../utils/publicAssetUrl.js';
import { SHOW_ACTIVITIES_SUMMARY_CREATOR } from '../../../constants/featureFlags.js';
import '../group-settings/GroupSettingsForm.css';
import './ToolsContent.css';

const exportusersicon = publicIconPath('upload-02-svgrepo-com.svg');

const REPORT_TOOLS = [
  { id: 'group', label: 'Generuj raport GRUPY' },
  { id: 'stage', label: 'Generuj raport ETAPU' },
  { id: 'participant', label: 'Generuj raport UCZESTNIKA' },
];

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
        data = null;
      }

      setStages((data?.stages ?? []).map((stage) => ({
        id: stage.id,
        name: stage.name,
      })));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
    }
  }

  useEffect(() => {
    onFetchStages();
  }, [groupId]);

  return (
    <div className="activities-tools-page__body">
      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="group-settings-form group-settings-form--drive-layout">
        <section className="group-settings-form__panel" aria-labelledby="activities-tools-csv-title">
          <h2 id="activities-tools-csv-title" className="group-settings-form__panel-title">Pliki CSV</h2>
          <p className="group-settings-form__hint">Skróty do generowania raportów.</p>
          <div className="activities-tools-page__tool-grid">
            {REPORT_TOOLS.map((tool) => (
              <button key={tool.id} type="button" className="activities-tools-page__tool-btn">
                <img
                  src={exportusersicon}
                  alt=""
                  className="activities-tools-page__tool-icon activities-tools-page__tool-icon--flipped"
                />
                <span>{tool.label}</span>
              </button>
            ))}
          </div>
        </section>

        {SHOW_ACTIVITIES_SUMMARY_CREATOR ? (
          <>
            <Divider />
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
          </>
        ) : null}
      </div>
    </div>
  );
}
