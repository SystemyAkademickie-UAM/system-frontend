import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { Button, Divider, useToast } from '../../../components/ui/index.js';
import { publicIconPath } from '../../../utils/publicAssetUrl.js';
import { SHOW_ACTIVITIES_SUMMARY_CREATOR } from '../../../constants/featureFlags.js';
import {
  downloadGroupReport,
  downloadStageReport,
  downloadStudentReport,
} from '../../../services/groupReports.api.js';
import { fetchGroupStudents } from '../../../services/students.api.js';
import ReportSelectModal from './modals/ReportSelectModal.jsx';
import { formatReportParticipantLabel } from './reportParticipantLabel.js';
import '../group-settings/GroupSettingsForm.css';
import './ToolsContent.css';

const exportusersicon = publicIconPath('upload-02-svgrepo-com.svg');

const REPORT_TOOLS = [
  { id: 'group', label: 'Generuj raport GRUPY' },
  { id: 'stage', label: 'Generuj raport ETAPU' },
  { id: 'participant', label: 'Generuj raport UCZESTNIKA' },
];

async function fetchStagesForGroup(groupId) {
  const base = getApiBaseUrl();
  const browserid = getOrCreateBrowserId();
  const response = await fetch(`${base}/stages`, {
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

  const responseText = await response.text();
  let data;

  try {
    data = JSON.parse(responseText);
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Błąd HTTP ${response.status}`);
  }

  return (data?.stages ?? []).map((stage) => ({
    id: stage.id,
    name: stage.name,
  }));
}

export default function ToolsContent() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [errorMessage, setErrorMessage] = useState('');
  const [stages, setStages] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [activeModal, setActiveModal] = useState(null);
  const [downloading, setDownloading] = useState(null);

  const loadPageData = useCallback(async () => {
    if (!groupId) {
      setStages([]);
      setParticipants([]);
      setIsLoadingData(false);
      return;
    }

    setIsLoadingData(true);
    setErrorMessage('');

    try {
      const [nextStages, nextParticipants] = await Promise.all([
        fetchStagesForGroup(groupId),
        fetchGroupStudents(groupId),
      ]);
      setStages(nextStages);
      setParticipants(nextParticipants);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      showError(message);
    } finally {
      setIsLoadingData(false);
    }
  }, [groupId, showError]);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const stageItems = useMemo(
    () => stages.map((stage) => ({ id: stage.id, label: stage.name })),
    [stages],
  );

  const participantItems = useMemo(
    () => participants.map((student) => ({
      id: student.accountId,
      label: formatReportParticipantLabel(student),
    })),
    [participants],
  );

  const runDownload = useCallback(async (scope, downloadFn) => {
    setErrorMessage('');
    setDownloading(scope);

    try {
      await downloadFn();
      showSuccess('Raport został pobrany.');
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      setErrorMessage(message);
      showError(message);
    } finally {
      setDownloading(null);
    }
  }, [showSuccess, showError]);

  const handleToolClick = useCallback((toolId) => {
    if (downloading) {
      return;
    }

    if (toolId === 'group') {
      runDownload('group', () => downloadGroupReport(groupId));
      return;
    }

    if (toolId === 'stage') {
      if (stages.length === 0) {
        const message = 'Brak etapów w tej grupie.';
        setErrorMessage(message);
        showError(message);
        return;
      }
      setActiveModal('stage');
      return;
    }

    if (toolId === 'participant') {
      if (participants.length === 0) {
        const message = 'Brak uczestników w tej grupie.';
        setErrorMessage(message);
        showError(message);
        return;
      }
      setActiveModal('participant');
    }
  }, [downloading, groupId, participants.length, runDownload, showError, stages.length]);

  const handleStageReportConfirm = useCallback(async (stageId) => {
    setActiveModal(null);
    await runDownload('stage', () => downloadStageReport(groupId, stageId));
  }, [groupId, runDownload]);

  const handleParticipantReportConfirm = useCallback(async (accountId) => {
    setActiveModal(null);
    await runDownload('participant', () => downloadStudentReport(groupId, accountId));
  }, [groupId, runDownload]);

  const closeModal = useCallback(() => {
    if (!downloading) {
      setActiveModal(null);
    }
  }, [downloading]);

  return (
    <div className="activities-tools-page__body">
      {errorMessage ? (
        <p className="group-settings-form__error" role="alert">{errorMessage}</p>
      ) : null}

      <div className="group-settings-form group-settings-form--drive-layout">
        <section className="group-settings-form__panel" aria-labelledby="activities-tools-csv-title">
          <h2 id="activities-tools-csv-title" className="group-settings-form__panel-title">Pliki CSV</h2>
          <p className="group-settings-form__hint">Skróty do generowania raportów postępu uczestników.</p>
          <div className="activities-tools-page__tool-grid">
            {REPORT_TOOLS.map((tool) => (
              <button
                key={tool.id}
                type="button"
                className="activities-tools-page__tool-btn"
                disabled={Boolean(downloading) || isLoadingData}
                onClick={() => handleToolClick(tool.id)}
              >
                <img
                  src={exportusersicon}
                  alt=""
                  className="activities-tools-page__tool-icon activities-tools-page__tool-icon--flipped"
                />
                <span>
                  {downloading === tool.id ? 'Generowanie raportu…' : tool.label}
                </span>
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

      <ReportSelectModal
        isOpen={activeModal === 'stage'}
        title="Wybierz etap"
        subtitle="Raport obejmie wszystkich uczestników i aktywności z wybranego etapu."
        items={stageItems}
        onClose={closeModal}
        onConfirm={handleStageReportConfirm}
        isLoading={downloading === 'stage'}
        searchPlaceholder="Szukaj etapu…"
        emptyMessage="Brak etapów w tej grupie."
      />

      <ReportSelectModal
        isOpen={activeModal === 'participant'}
        title="Wybierz uczestnika"
        subtitle="Raport obejmie postęp wybranego uczestnika we wszystkich etapach."
        items={participantItems}
        onClose={closeModal}
        onConfirm={handleParticipantReportConfirm}
        isLoading={downloading === 'participant'}
        searchPlaceholder="Szukaj uczestnika…"
        emptyMessage="Brak uczestników w tej grupie."
      />
    </div>
  );
}
