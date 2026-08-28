import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { STAGE_NAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
import { READLANGUAGECOOKIE } from '../../../utils/LANGUAGECOOKIE.js';
async function postJson(path, body) {
  const base = getApiBaseUrl();
  const browserid = getOrCreateBrowserId();

  const response = await fetch(`${base}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-Browser-ID': browserid,
    },
    body: JSON.stringify(body),
  });

  const text = await response.text();
  let data;

  try {
    data = JSON.parse(text);
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(data?.message || `Błąd HTTP ${response.status}`);
  }

  return data;
}

const ACTIVITY_ERROR_IDS = {
  NOT_CREATED: -1,
  NOT_AUTHORIZED: -2,
  NOT_FOUND: -3,
};

const NAMEVALIDATION__TEXTLABEL = {
  polish: 'Podaj nazwę etapu.',
  english: 'Please provide a stage name.'
};
const NAMETOOLONG__TEXTLABEL = {
  polish: 'Nazwa etapu może mieć maksymalnie',
  english: 'Stage name can have maximum'
};
const CHARACTERS__TEXTLABEL = {
  polish: 'znaków.',
  english: 'characters.'
};
const NOAUTH__TEXTLABEL = {
  polish: 'Brak uprawnień do wykonania tej operacji.',
  english: 'No permission to perform this operation.'
};

function assertStageName(name, language) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, message: NAMEVALIDATION__TEXTLABEL[language] };
  }
  if (trimmed.length > STAGE_NAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `${NAMETOOLONG__TEXTLABEL[language]} ${STAGE_NAME_MAX_LENGTH} ${CHARACTERS__TEXTLABEL[language]}`,
    };
  }
  return { ok: true, value: trimmed };
}

function assertActivityResponse(data, failureMessage, language) {
  const activityId = data?.activity;
  if (typeof activityId !== 'number' || activityId <= 0) {
    if (activityId === ACTIVITY_ERROR_IDS.NOT_AUTHORIZED) {
      throw new Error(NOAUTH__TEXTLABEL[language]);
    }
    throw new Error(failureMessage);
  }
  return data;
}

function mapActivity(raw) {
  return {
    id: raw.id,
    name: raw.name,
    description0: raw.storyDescription,
    description1: raw.educationalDescription,
    reward: raw.currency,
    completionCount: raw.completionCount ?? 0,
  };
}

function sortByNewestFirst(items) {
  return [...items].sort((a, b) => b.id - a.id);
}

function mapStage(raw) {
  return {
    id: raw.id,
    name: raw.name,
    visibilityStatus: raw.visibilityStatus ?? 0,
    activities: [],
    expanded: false,
  };
}

export function useGroupActivities() {
  const { groupId } = useParams();
  const { showSuccess, showError } = useToast();
  const [LANGUAGE] = useState(READLANGUAGECOOKIE);

  const HTTPERROR__TEXTLABEL = {
    polish: 'Błąd HTTP',
    english: 'HTTP error'
  };
  const NOGROUPID__TEXTLABEL = {
    polish: 'Brak ID grupy',
    english: 'Group ID missing'
  };
  const STAGEADDED__TEXTLABEL = {
    polish: 'Etap został dodany.',
    english: 'Stage has been added.'
  };
  const STAGEUPDATED__TEXTLABEL = {
    polish: 'Etap został zaktualizowany.',
    english: 'Stage has been updated.'
  };
  const STAGEDELETED__TEXTLABEL = {
    polish: 'Etap został usunięty.',
    english: 'Stage has been deleted.'
  };
  const STAGECOPIED__TEXTLABEL = {
    polish: 'Etap został skopiowany.',
    english: 'Stage has been copied.'
  };
  const ACTIVITYADDED__TEXTLABEL = {
    polish: 'Aktywność została dodana.',
    english: 'Activity has been added.'
  };
  const ACTIVITYUPDATED__TEXTLABEL = {
    polish: 'Aktywność została zaktualizowana.',
    english: 'Activity has been updated.'
  };
  const ACTIVITYDELETEFAILED__TEXTLABEL = {
    polish: 'Nie udało się usunąć aktywności.',
    english: 'Failed to delete activity.'
  };
  const ACTIVITYDELETED__TEXTLABEL = {
    polish: 'Aktywność została usunięta.',
    english: 'Activity has been deleted.'
  };

  const [stages, setStages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchActivitiesForStage = useCallback(async (stageId) => {
    const data = await postJson('/activities', {
      method: 'retrieve',
      stageId,
    });

      const activities = sortByNewestFirst((data?.activities ?? []).map(mapActivity));

      setStages((prev) => prev.map((stage) => (
        stage.id === stageId
          ? { ...stage, activities }
          : stage
      )));

      return activities;
  }, []);

  const fetchStages = useCallback(async () => {
    if (!groupId) {
      setError(NOGROUPID__TEXTLABEL[LANGUAGE]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await postJson('/stages', {
        method: 'retrieve',
        groupId: Number(groupId),
      });

      const receivedStages = (data?.stages ?? []).map(mapStage);
      setStages(receivedStages);
      setIsLoading(false);

      await Promise.all(
        receivedStages.map((stage) => fetchActivitiesForStage(stage.id)),
      );

      return receivedStages;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
      showError(message);
      setIsLoading(false);

    }
  }, [groupId, fetchActivitiesForStage, showError]);

  useEffect(() => {
    fetchStages();
  }, [fetchStages]);

  const toggleStageExpanded = useCallback((stageId) => {
    setStages((prev) => prev.map((stage) => (
      stage.id === stageId
        ? { ...stage, expanded: !stage.expanded }
        : stage
    )));
  }, []);

  const createStage = useCallback(async (name, { visibilityStatus = 1 } = {}) => {
    const nameCheck = assertStageName(name, LANGUAGE);
    if (!nameCheck.ok) {
      showError(nameCheck.message);
      return { ok: false };
    }

    try {
      const data = await postJson('/stages', {
        method: 'post',
        groupId: Number(groupId),
        name: nameCheck.value,
        visibilityStatus,
      });

      const newStageId = data?.stage;
      if (typeof newStageId === 'number' && newStageId > 0) {
        const orderedStageIds = [newStageId, ...stages.map((stage) => stage.id)];
        await postJson('/stages', {
          method: 'reorder',
          groupId: Number(groupId),
          stageIds: orderedStageIds,
        });
      }

      showSuccess(STAGEADDED__TEXTLABEL[LANGUAGE]);
      await fetchStages();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, stages, fetchStages, showSuccess, showError]);

  const updateStage = useCallback(async (stageId, payload) => {
    const values = typeof payload === 'string'
      ? { name: payload }
      : payload;

    let trimmed;
    if (values.name !== undefined) {
      const nameCheck = assertStageName(values.name, LANGUAGE);
      if (!nameCheck.ok) {
        showError(nameCheck.message);
        return { ok: false };
      }
      trimmed = nameCheck.value;
    }

    try {
      const body = {
        method: 'modify',
        stageId,
      };
      if (trimmed) {
        body.name = trimmed;
      }
      if (values.visibilityStatus !== undefined) {
        body.visibilityStatus = values.visibilityStatus;
      }

      await postJson('/stages', body);
      setStages((prev) => prev.map((stage) => (
        stage.id === stageId
          ? {
            ...stage,
            ...(trimmed ? { name: trimmed } : {}),
            ...(values.visibilityStatus !== undefined
              ? { visibilityStatus: values.visibilityStatus }
              : {}),
          }
          : stage
      )));
      showSuccess(STAGEUPDATED__TEXTLABEL[LANGUAGE]);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [showSuccess, showError]);

  const deleteStage = useCallback(async (stageId) => {
    try {
      var activities = await fetchActivitiesForStage(stageId);
      var i = 0;
      while (i < activities.length) {
        await postJson('/activities', {
          method: 'remove',
          activityId: activities[i].id,
        });
        i = i + 1;
      }
      await postJson('/stages', {
        method: 'remove',
        stageId: stageId,
      });
      await fetchStages();
      showSuccess(STAGEDELETED__TEXTLABEL[LANGUAGE]);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [fetchStages, fetchActivitiesForStage, showSuccess, showError]);

  const copyStage = useCallback(async (stageId, cloneName) => {
    const sourceStage = stages.find((stage) => stage.id === stageId);
    if (!sourceStage) {
      return { ok: false };
    }

    const trimmedName = cloneName?.trim() || sourceStage.name;
    const nameCheck = assertStageName(trimmedName, LANGUAGE);
    if (!nameCheck.ok) {
      showError(nameCheck.message);
      return { ok: false };
    }

    try {
      const data = await postJson('/stages', {
        method: 'post',
        groupId: Number(groupId),
        name: nameCheck.value,
        visibilityStatus: sourceStage.visibilityStatus ?? 0,
      });

      const newStageId = data?.stage;
      if (typeof newStageId === 'number' && newStageId > 0) {
        await Promise.all(
          sourceStage.activities.map((activity) => postJson('/activities', {
            method: 'post',
            stageId: newStageId,
            name: activity.name,
            currency: activity.reward,
            educationalDescription: activity.description1,
            storyDescription: activity.description0,
          })),
        );

        const orderedStageIds = [newStageId, ...stages.map((stage) => stage.id)];
        await postJson('/stages', {
          method: 'reorder',
          groupId: Number(groupId),
          stageIds: orderedStageIds,
        });
      }

      showSuccess(STAGECOPIED__TEXTLABEL[LANGUAGE]);
      await fetchStages();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, stages, fetchStages, showSuccess, showError]);

  const reorderStages = useCallback(async (orderedStageIds) => {
    try {
      await postJson('/stages', {
        method: 'reorder',
        groupId: Number(groupId),
        stageIds: orderedStageIds,
      });

      setStages((prev) => {
        const byId = new Map(prev.map((stage) => [stage.id, stage]));
        return orderedStageIds
          .map((stageId) => byId.get(stageId))
          .filter(Boolean);
      });
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [groupId, showError]);
  const createActivity = useCallback(async (stageId, values) => {
    try {
      await postJson('/activities', {
        method: 'post',
        stageId,
        name: values.name,
        currency: values.reward,
        educationalDescription: values.description1,
        storyDescription: values.description0,
      });
      showSuccess(ACTIVITYADDED__TEXTLABEL[LANGUAGE]);
      await fetchActivitiesForStage(stageId);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [fetchActivitiesForStage, showSuccess, showError]);

  const updateActivity = useCallback(async (stageId, activityId, values) => {
    try {
      await postJson('/activities', {
        method: 'modify',
        activityId,
        name: values.name,
        currency: Number(values.reward),
        educationalDescription: values.description1,
        storyDescription: values.description0,
      });
      showSuccess(ACTIVITYUPDATED__TEXTLABEL[LANGUAGE]);
      await fetchActivitiesForStage(stageId);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [fetchActivitiesForStage, showSuccess, showError]);

  const deleteActivity = useCallback(async (stageId, activityId) => {
    try {
      const data = await postJson('/activities', {
        method: 'remove',
        activityId,
      });
      assertActivityResponse(data, ACTIVITYDELETEFAILED__TEXTLABEL[LANGUAGE], LANGUAGE);
      showSuccess(ACTIVITYDELETED__TEXTLABEL[LANGUAGE]);
      await fetchActivitiesForStage(stageId);
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [fetchActivitiesForStage, showSuccess, showError]);

  return {
    stages,
    isLoading,
    error,
    refetch: fetchStages,
    toggleStageExpanded,
    createStage,
    updateStage,
    deleteStage,
    copyStage,
    reorderStages,
    createActivity,
    updateActivity,
    deleteActivity,
  };
}
