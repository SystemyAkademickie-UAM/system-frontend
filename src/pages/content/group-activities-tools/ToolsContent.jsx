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
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import ReportSelectModal from './modals/ReportSelectModal.jsx';
import { formatReportParticipantLabel } from './reportParticipantLabel.js';
import '../group-settings/GroupSettingsForm.css';
import './ToolsContent.css';

const exportusersicon = publicIconPath('upload-02-svgrepo-com.svg');

const REPORTTOOLSLABELS__TEXTLABEL = {
  polish: [
    { id: 'group', label: 'Generuj raport GRUPY' },
    { id: 'stage', label: 'Generuj raport ETAPU' },
    { id: 'participant', label: 'Generuj raport UCZESTNIKA' },
  ],
  english: [
    { id: 'group', label: 'Generate GROUP report' },
    { id: 'stage', label: 'Generate STAGE report' },
    { id: 'participant', label: 'Generate PARTICIPANT report' },
  ],
};

const SUCCESSDOWNLOAD__TEXTLABEL = {
  polish: 'Raport został pobrany.',
  english: 'Report has been downloaded.',
};

const NOSTAGES__TEXTLABEL = {
  polish: 'Brak etapów w tej grupie.',
  english: 'No stages in this group.',
};

const NOPARTICIPANTS__TEXTLABEL = {
  polish: 'Brak uczestników w tej grupie.',
  english: 'No participants in this group.',
};

const GENERATING__TEXTLABEL = {
  polish: 'Generowanie raportu...',
  english: 'Generating report...',
};

const CSVTITLE__TEXTLABEL = {
  polish: 'Pliki CSV',
  english: 'CSV Files',
};

const CSVHINT__TEXTLABEL = {
  polish: 'Skróty do generowania raportów postępu uczestników.',
  english: 'Shortcuts to generate participant progress reports.',
};

const SUMMARYCREATORTITLE__TEXTLABEL = {
  polish: 'Kreator podsumowania',
  english: 'Summary Creator',
};

const SUMMARYCREATORHINT__TEXTLABEL = {
  polish: 'Prosimy o zaznaczenie elementów, których podsumowanie zostanie wygenerowane.',
  english: 'Please select the elements which summary shall be generated.',
};

const GENERATESUMMARYBUTTON__TEXTLABEL = {
  polish: 'Wygeneruj podsumowanie',
  english: 'Generate Summary',
};

const STAGEMODALTITLE__TEXTLABEL = {
  polish: 'Wybierz etap',
  english: 'Select Stage',
};

const STAGEMODALSUBTITLE__TEXTLABEL = {
  polish: 'Raport obejmie wszystkich uczestników i aktywności z wybranego etapu.',
  english: 'Report will include all participants and activities from the selected stage.',
};

const STAGEMODALSEARCH__TEXTLABEL = {
  polish: 'Szukaj etapu...',
  english: 'Search stage...',
};

const PARTICIPANTTITLE__TEXTLABEL = {
  polish: 'Wybierz uczestnika',
  english: 'Select Participant',
};

const PARTICIPANTSUBTITLE__TEXTLABEL = {
  polish: 'Raport obejmie postęp wybranego uczestnika we wszystkich etapach.',
  english: 'Report will include the progress of the selected participant in all stages.',
};

const PARTICIPANTMODALSEARCH__TEXTLABEL = {
  polish: 'Szukaj uczestnika...',
  english: 'Search participant...',
};

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
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
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
      showSuccess(SUCCESSDOWNLOAD__TEXTLABEL[LANGUAGE]);
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
        const message = NOSTAGES__TEXTLABEL[LANGUAGE];
        setErrorMessage(message);
        showError(message);
        return;
      }
      setActiveModal('stage');
      return;
    }

    if (toolId === 'participant') {
      if (participants.length === 0) {
        const message = NOPARTICIPANTS__TEXTLABEL[LANGUAGE];
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
          <h2 id="activities-tools-csv-title" className="group-settings-form__panel-title">{CSVTITLE__TEXTLABEL[LANGUAGE]}</h2>
          <p className="group-settings-form__hint">{CSVHINT__TEXTLABEL[LANGUAGE]}</p>
          <div className="activities-tools-page__tool-grid">
            {REPORTTOOLSLABELS__TEXTLABEL[LANGUAGE].map((tool) => (
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
                  {downloading === tool.id ? GENERATING__TEXTLABEL[LANGUAGE] : tool.label}
                </span>
              </button>
            ))}
          </div>
        </section>

        {SHOW_ACTIVITIES_SUMMARY_CREATOR ? (
          <>
            <Divider />
            <section className="group-settings-form__panel" aria-labelledby="activities-tools-summary-title">
              <h2 id="activities-tools-summary-title" className="group-settings-form__panel-title">{SUMMARYCREATORTITLE__TEXTLABEL[LANGUAGE]}</h2>
              <p className="group-settings-form__hint">
                {SUMMARYCREATORHINT__TEXTLABEL[LANGUAGE]}
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
                  {GENERATESUMMARYBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              </div>
            </section>
          </>
        ) : null}
      </div>

      <ReportSelectModal
        isOpen={activeModal === 'stage'}
        title={STAGEMODALTITLE__TEXTLABEL[LANGUAGE]}
        subtitle={STAGEMODALSUBTITLE__TEXTLABEL[LANGUAGE]}
        items={stageItems}
        onClose={closeModal}
        onConfirm={handleStageReportConfirm}
        isLoading={downloading === 'stage'}
        searchPlaceholder={STAGEMODALSEARCH__TEXTLABEL[LANGUAGE]}
        emptyMessage={NOSTAGES__TEXTLABEL[LANGUAGE]}
      />

      <ReportSelectModal
        isOpen={activeModal === 'participant'}
        title={PARTICIPANTTITLE__TEXTLABEL[LANGUAGE]}
        subtitle={PARTICIPANTSUBTITLE__TEXTLABEL[LANGUAGE]}
        items={participantItems}
        onClose={closeModal}
        onConfirm={handleParticipantReportConfirm}
        isLoading={downloading === 'participant'}
        searchPlaceholder={PARTICIPANTMODALSEARCH__TEXTLABEL[LANGUAGE]}
        emptyMessage={NOPARTICIPANTS__TEXTLABEL[LANGUAGE]}
      />
    </div>
  );
}
