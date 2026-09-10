import { useState, useEffect, useCallback } from 'react';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import GroupBannerPicker from '../group-shared/GroupBannerPicker/GroupBannerPicker.jsx';
import { Button, CharacterLimitedField, Modal, useToast } from '../../../components/ui/index.js';
import {
  GROUP_NAME_MAX_LENGTH,
  GROUP_SUBJECT_NAME_MAX_LENGTH,
  GROUP_DESCRIPTION_MAX_LENGTH,
} from '../../../constants/fieldLimits.js';
import {
  buildBannerImageRefPayload,
  createDefaultBannerPickerValue,
} from '../../../utils/groupBannerRef.js';
import { validateGroupBannerFile } from '../../../utils/groupBannerUpload.js';
import { createGroup } from '../../../services/groups.api.js';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
import GroupCreatorUnsavedModal from './modals/GroupCreatorUnsavedModal.jsx';
import GroupCreatorDraftPromptModal from './modals/GroupCreatorDraftPromptModal.jsx';
import './GroupsListCreator.css';

const DRAFT_STORAGE_KEY = 'maq_group_creator_draft';
const TOTAL_STEPS = 2;

const CREATORTITLE__TEXTLABEL = {
  polish: 'Kreator grupy',
  english: 'Group Creator',
};

const STAGE_TITLES = {
  1: { polish: 'Informacje', english: 'Information' },
  2: { polish: 'Baner grupy', english: 'Group Banner' },
};

const GROUPNAMEMIN__TEXTLABEL = {
  polish: 'Nazwa grupy musi zawierać minimum 1 znak.',
  english: 'Group name must contain minimum 1 character.',
};

const SUBJECTNAMEMIN__TEXTLABEL = {
  polish: 'Nazwa przedmiotu musi zawierać minimum 1 znak.',
  english: 'Subject name must contain minimum 1 character.',
};

const DESCRIPTIONREQUIRED__TEXTLABEL = {
  polish: 'Opis grupy jest wymagany.',
  english: 'Group description is required.',
};

const CREATIONFAILED__TEXTLABEL = {
  polish: 'Nie udało się utworzyć grupy.',
  english: 'Failed to create group.',
};

const GROUPNAME__TEXTLABEL = {
  polish: 'Nazwa grupy*',
  english: 'Group Name*',
};

const SUBJECTNAME__TEXTLABEL = {
  polish: 'Nazwa przedmiotu*',
  english: 'Subject Name*',
};

const GROUPDESCRIPTION__TEXTLABEL = {
  polish: 'Opis grupy*',
  english: 'Group Description*',
};

const DESCRIPTIONPLACEHOLDER__TEXTLABEL = {
  polish: 'Krótko opisz tło fabularne i cele grupy...',
  english: 'Briefly describe the background and goals of the group...',
};

const CANCELBUTTON__TEXTLABEL = {
  polish: 'Anuluj',
  english: 'Cancel',
};

const PREVBUTTON__TEXTLABEL = {
  polish: 'Cofnij',
  english: 'Back',
};

const NEXTBUTTON__TEXTLABEL = {
  polish: 'Dalej',
  english: 'Next',
};

const CREATEBUTTON__TEXTLABEL = {
  polish: 'Stwórz grupę',
  english: 'Create Group',
};

const CREATINGBUTTON__TEXTLABEL = {
  polish: 'Tworzenie...',
  english: 'Creating...',
};

const GROUP_NAME_MAX = GROUP_NAME_MAX_LENGTH;
const SUBJECT_NAME_MAX = GROUP_SUBJECT_NAME_MAX_LENGTH;
const GROUP_DESCRIPTION_MAX = GROUP_DESCRIPTION_MAX_LENGTH;

export default function GroupsListCreator({
  isOpen,
  onClose,
  onCreated,
}) {
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);
  const { showSuccess, showError } = useToast();

  const [step, setStep] = useState(1);
  const [groupName, setGroupName] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [bannerSelection, setBannerSelection] = useState(createDefaultBannerPickerValue);

  const [groupNameError, setGroupNameError] = useState('');
  const [subjectNameError, setSubjectNameError] = useState('');
  const [groupDescriptionError, setGroupDescriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modale pomocnicze
  const [isUnsavedModalOpen, setIsUnsavedModalOpen] = useState(false);
  const [isDraftPromptOpen, setIsDraftPromptOpen] = useState(false);

  // Sprawdzanie wersji roboczej przy otwarciu
  useEffect(() => {
    if (!isOpen) return;

    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        if (parsed && (parsed.groupName || parsed.subjectName || parsed.groupDescription || parsed.step > 1)) {
          setIsDraftPromptOpen(true);
        }
      }
    } catch {
      // ignore
    }
  }, [isOpen]);

  const hasUserChanges = Boolean(
    groupName.trim()
    || subjectName.trim()
    || groupDescription.trim()
    || step > 1
  );

  const resetForm = useCallback(() => {
    setStep(1);
    setGroupName('');
    setSubjectName('');
    setGroupDescription('');
    setBannerSelection(createDefaultBannerPickerValue());
    setGroupNameError('');
    setSubjectNameError('');
    setGroupDescriptionError('');
    setIsSubmitting(false);
  }, []);

  const handleAttemptClose = useCallback(() => {
    if (hasUserChanges) {
      setIsUnsavedModalOpen(true);
    } else {
      resetForm();
      onClose?.();
    }
  }, [hasUserChanges, onClose, resetForm]);

  // Obsługa wersji roboczej (Drafts)
  const handleLoadDraft = () => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        const data = JSON.parse(savedDraft);
        if (data.groupName != null) setGroupName(data.groupName);
        if (data.subjectName != null) setSubjectName(data.subjectName);
        if (data.groupDescription != null) setGroupDescription(data.groupDescription);
        if (data.bannerSelection != null) setBannerSelection(data.bannerSelection);
        if (data.step != null) setStep(Math.min(TOTAL_STEPS, Math.max(1, data.step)));
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        showSuccess('Wczytano wersję roboczą.');
      }
    } catch {
      showError('Nie udało się wczytać wersji roboczej.');
    } finally {
      setIsDraftPromptOpen(false);
    }
  };

  const handleDiscardDraftAndNew = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsDraftPromptOpen(false);
  };

  const handleSaveDraftAndExit = () => {
    try {
      const draftData = {
        step,
        groupName,
        subjectName,
        groupDescription,
        bannerSelection: bannerSelection.mode === 'file' ? createDefaultBannerPickerValue() : bannerSelection,
        timestamp: Date.now(),
      };
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draftData));
      showSuccess('Wersja robocza została zapisana.');
    } catch {
      showError('Nie udało się zapisać wersji roboczej.');
    }
    setIsUnsavedModalOpen(false);
    resetForm();
    onClose?.();
  };

  const handleDiscardAndExit = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setIsUnsavedModalOpen(false);
    resetForm();
    onClose?.();
  };

  // Walidacja
  const validateStep1 = () => {
    let isValid = true;
    setGroupNameError('');
    setSubjectNameError('');
    setGroupDescriptionError('');

    if (!groupName.trim()) {
      setGroupNameError(GROUPNAMEMIN__TEXTLABEL[LANGUAGE]);
      isValid = false;
    }

    if (!subjectName.trim()) {
      setSubjectNameError(SUBJECTNAMEMIN__TEXTLABEL[LANGUAGE]);
      isValid = false;
    }

    if (!groupDescription.trim()) {
      setGroupDescriptionError(DESCRIPTIONREQUIRED__TEXTLABEL[LANGUAGE]);
      isValid = false;
    }

    return isValid;
  };

  const handleNextStep = () => {
    if (!validateStep1()) return;
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  // Upload banera
  const uploadBannerToDrive = async (url, browserid, file) => {
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
      throw new Error('Błąd przesyłania banera.');
    }
    if (typeof drivedata.driveRef !== 'string' || drivedata.driveRef.trim() === '') {
      throw new Error('Pusty driveRef banera.');
    }
    return drivedata.driveRef.trim();
  };

  const resolveImageRefForSave = async (base, browserid) => {
    if (bannerSelection.mode === 'file' && bannerSelection.file) {
      const validation = validateGroupBannerFile(bannerSelection.file);
      if (!validation.valid) {
        throw new Error(validation.error ?? 'Plik banera jest nieprawidłowy.');
      }
      return uploadBannerToDrive(base, browserid, bannerSelection.file);
    }
    return buildBannerImageRefPayload(bannerSelection);
  };

  const handleSaveGroup = async () => {
    if (!validateStep1()) {
      setStep(1);
      return;
    }

    setIsSubmitting(true);
    try {
      const base = getApiBaseUrl();
      const browserid = getOrCreateBrowserId();
      const imageref = await resolveImageRefForSave(base, browserid);

      const payload = {
        name: groupName.trim(),
        subjectName: subjectName.trim(),
        description: groupDescription.trim(),
      };
      if (imageref !== undefined) {
        payload.imageRef = imageref;
      }

      const result = await createGroup(payload);
      if (!result.ok) {
        showError(result.error || CREATIONFAILED__TEXTLABEL[LANGUAGE]);
        setIsSubmitting(false);
        return;
      }

      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
      } catch {
        // ignore
      }

      if (onCreated) {
        onCreated({
          groupId: result.groupId,
          groupName: groupName.trim(),
          subjectName: subjectName.trim(),
        });
      } else {
        showSuccess('Grupa została pomyślnie utworzona.');
      }
      resetForm();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      showError(message);
      setIsSubmitting(false);
    }
  };

  const stageTitle = STAGE_TITLES[step]?.[LANGUAGE] ?? '';

  const modalTitle = (
    <span className="group-creator-modal-title">
      <span className="group-creator-modal-title__main">{CREATORTITLE__TEXTLABEL[LANGUAGE]}</span>
      <span className="group-creator-modal-title__divider">•</span>
      <span className="group-creator-modal-title__stage">{stageTitle}</span>
      <span className="group-creator-modal-title__badge">{step}/{TOTAL_STEPS}</span>
    </span>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={handleAttemptClose}
        title={modalTitle}
        size={step === 2 ? 'xl' : 'lg'}
        showFooter={false}
        className="group-creator-form-modal"
      >
        <div className="group-creator-wizard">
          <div className="group-creator-wizard__content">
            {step === 1 && (
              <div className="group-creator-step group-creator-step--info">
                <div className="group-creator__section">
                  <div className="group-creator__field">
                    <label className="group-creator__label" htmlFor="group-name-input">
                      {GROUPNAME__TEXTLABEL[LANGUAGE]}
                      {groupNameError ? (
                        <span className="group-creator__label-error">{groupNameError}</span>
                      ) : null}
                    </label>
                    <CharacterLimitedField value={groupName} maxLength={GROUP_NAME_MAX}>
                      <input
                        id="group-name-input"
                        className={[
                          'group-creator__input',
                          groupNameError ? 'group-creator__input--error' : '',
                        ].filter(Boolean).join(' ')}
                        type="text"
                        value={groupName}
                        onChange={(e) => {
                          setGroupName(e.target.value.slice(0, GROUP_NAME_MAX));
                          if (groupNameError) setGroupNameError('');
                        }}
                        maxLength={GROUP_NAME_MAX}
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </CharacterLimitedField>
                  </div>

                  <div className="group-creator__field">
                    <label className="group-creator__label" htmlFor="group-subject-input">
                      {SUBJECTNAME__TEXTLABEL[LANGUAGE]}
                      {subjectNameError ? (
                        <span className="group-creator__label-error">{subjectNameError}</span>
                      ) : null}
                    </label>
                    <CharacterLimitedField value={subjectName} maxLength={SUBJECT_NAME_MAX}>
                      <input
                        id="group-subject-input"
                        className={[
                          'group-creator__input',
                          subjectNameError ? 'group-creator__input--error' : '',
                        ].filter(Boolean).join(' ')}
                        type="text"
                        value={subjectName}
                        onChange={(e) => {
                          setSubjectName(e.target.value.slice(0, SUBJECT_NAME_MAX));
                          if (subjectNameError) setSubjectNameError('');
                        }}
                        maxLength={SUBJECT_NAME_MAX}
                        autoComplete="off"
                        disabled={isSubmitting}
                      />
                    </CharacterLimitedField>
                  </div>

                  <div className="group-creator__field">
                    <label className="group-creator__label" htmlFor="group-desc-input">
                      {GROUPDESCRIPTION__TEXTLABEL[LANGUAGE]}
                      {groupDescriptionError ? (
                        <span className="group-creator__label-error">{groupDescriptionError}</span>
                      ) : null}
                    </label>
                    <CharacterLimitedField value={groupDescription} maxLength={GROUP_DESCRIPTION_MAX}>
                      <textarea
                        id="group-desc-input"
                        className={[
                          'group-creator__textarea',
                          groupDescriptionError ? 'group-creator__textarea--error' : '',
                        ].filter(Boolean).join(' ')}
                        value={groupDescription}
                        maxLength={GROUP_DESCRIPTION_MAX}
                        onChange={(e) => {
                          setGroupDescription(e.target.value.slice(0, GROUP_DESCRIPTION_MAX));
                          if (groupDescriptionError) setGroupDescriptionError('');
                        }}
                        placeholder={DESCRIPTIONPLACEHOLDER__TEXTLABEL[LANGUAGE]}
                        rows={4}
                        disabled={isSubmitting}
                      />
                    </CharacterLimitedField>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="group-creator-step group-creator-step--banner">
                <div className="group-creator__section group-creator__section--banner">
                  <GroupBannerPicker
                    value={bannerSelection}
                    onChange={setBannerSelection}
                    className="group-creator__banner-picker"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="group-creator-wizard__footer">
            <div className="group-creator-wizard__footer-left">
              <Button
                type="button"
                variant="ghost"
                size="md"
                onClick={handleAttemptClose}
                disabled={isSubmitting}
              >
                {CANCELBUTTON__TEXTLABEL[LANGUAGE]}
              </Button>
            </div>

            <div className="group-creator-wizard__footer-right">
              {step === 2 && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={handlePrevStep}
                  disabled={isSubmitting}
                >
                  {PREVBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              )}

              {step === 1 ? (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleNextStep}
                  disabled={isSubmitting}
                >
                  {NEXTBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  size="md"
                  onClick={handleSaveGroup}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? CREATINGBUTTON__TEXTLABEL[LANGUAGE] : CREATEBUTTON__TEXTLABEL[LANGUAGE]}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Modal>

      <GroupCreatorUnsavedModal
        isOpen={isUnsavedModalOpen}
        onClose={() => setIsUnsavedModalOpen(false)}
        onDiscard={handleDiscardAndExit}
        onSaveDraft={handleSaveDraftAndExit}
      />

      <GroupCreatorDraftPromptModal
        isOpen={isDraftPromptOpen}
        onClose={() => setIsDraftPromptOpen(false)}
        onLoadDraft={handleLoadDraft}
        onDiscardDraftAndNew={handleDiscardDraftAndNew}
      />
    </>
  );
}
