import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { STAGE_NAME_MAX_LENGTH } from '../../../constants/fieldLimits.js';
import { getApiBaseUrl } from '../../../constants/api.constants.js';
import { getOrCreateBrowserId } from '../../../auth/browserIdStorage.js';
import { useToast } from '../../../components/ui/Toast/Toast.jsx';
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

function assertStageName(name) {
  const trimmed = name.trim();
  if (!trimmed) {
    return { ok: false, message: 'Podaj nazwę etapu.' };
  }
  if (trimmed.length > STAGE_NAME_MAX_LENGTH) {
    return {
      ok: false,
      message: `Nazwa etapu może mieć maksymalnie ${STAGE_NAME_MAX_LENGTH} znaków.`,
    };
  }
  return { ok: true, value: trimmed };
}

function assertActivityResponse(data, failureMessage) {
  const activityId = data?.activity;
  if (typeof activityId !== 'number' || activityId <= 0) {
    if (activityId === ACTIVITY_ERROR_IDS.NOT_AUTHORIZED) {
      throw new Error('Brak uprawnień do wykonania tej operacji.');
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
      setError('Brak ID grupy');
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
    const nameCheck = assertStageName(name);
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

      showSuccess('Etap został dodany.');
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
      const nameCheck = assertStageName(values.name);
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
      showSuccess('Etap został zaktualizowany.');
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [showSuccess, showError]);

  const deleteStage = useCallback(async (stageId) => {
    try {
      await postJson('/stages', {
        method: 'remove',
        stageId,
      });
      showSuccess('Etap został usunięty.');
      await fetchStages();
      return { ok: true };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      showError(message);
      return { ok: false, error: message };
    }
  }, [fetchStages, showSuccess, showError]);

  const copyStage = useCallback(async (stageId, cloneName) => {
    const sourceStage = stages.find((stage) => stage.id === stageId);
    if (!sourceStage) {
      return { ok: false };
    }

    const trimmedName = cloneName?.trim() || sourceStage.name;
    const nameCheck = assertStageName(trimmedName);
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

      showSuccess('Etap został skopiowany.');
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
      showSuccess('Aktywność została dodana.');
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
      showSuccess('Aktywność została zaktualizowana.');
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
      assertActivityResponse(data, 'Nie udało się usunąć aktywności.');
      showSuccess('Aktywność została usunięta.');
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
