import { useCallback, useEffect, useMemo, useState } from 'react';

import { parseJsonObject, validateRequiredKeys } from './validatePayload.js';

/**
 * @param {string} sectionId
 * @param {import('./apiTestSections.js').ApiTestSection | undefined} section
 * @param {Record<string, unknown>} initialValues
 */
export function useSyncedPayload(sectionId, section, initialValues) {
  const [values, setValues] = useState(initialValues);
  const [jsonText, setJsonText] = useState(() => {
    if (!section?.buildPayload) {
      return '{}';
    }
    return JSON.stringify(section.buildPayload(initialValues), null, 2);
  });
  const [jsonSyntaxError, setJsonSyntaxError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  useEffect(() => {
    if (!section?.defaultValues) {
      return;
    }
    const defaults = section.defaultValues();
    setValues(defaults);
    if (section.buildPayload) {
      const nextPayload = section.buildPayload(defaults);
      setJsonText(JSON.stringify(nextPayload, null, 2));
      setJsonSyntaxError(null);
      setValidationError(
        section.requiredKeysForValues
          ? validateRequiredKeys(
              nextPayload,
              section.requiredKeysForValues(defaults),
              section.allowEmptyKeysForValues?.(defaults, nextPayload) ?? [],
            )
          : null,
      );
    }
  }, [sectionId, section]);

  const payload = useMemo(() => {
    if (!section?.buildPayload) {
      return {};
    }
    return section.buildPayload(values);
  }, [section, values]);

  const validatePayload = useCallback(
    (payloadToValidate, sourceValues = values) => {
      if (!section?.requiredKeysForValues) {
        return null;
      }
      const keys = section.requiredKeysForValues(sourceValues);
      const allowEmptyKeys = section.allowEmptyKeysForValues?.(sourceValues, payloadToValidate) ?? [];
      return validateRequiredKeys(payloadToValidate, keys, allowEmptyKeys);
    },
    [section, values],
  );

  const syncJsonFromValues = useCallback(
    (nextValues) => {
      if (!section?.buildPayload) {
        return;
      }
      const nextPayload = section.buildPayload(nextValues);
      setJsonText(JSON.stringify(nextPayload, null, 2));
      setJsonSyntaxError(null);
      setValidationError(validatePayload(nextPayload, nextValues));
    },
    [section, validatePayload],
  );

  const updateField = useCallback(
    (key, value) => {
      setValues((prev) => {
        const next = { ...prev, [key]: value };
        syncJsonFromValues(next);
        return next;
      });
    },
    [syncJsonFromValues],
  );

  const updateJsonText = useCallback(
    (text) => {
      setJsonText(text);
      if (!section?.buildPayload || !section.parsePayload) {
        return;
      }
      const { parsed, error } = parseJsonObject(text);
      if (error) {
        setJsonSyntaxError(error);
        setValidationError(null);
        return;
      }
      setJsonSyntaxError(null);
      const parsedValues = section.parsePayload(parsed);
      setValues((prev) => {
        const next = { ...prev, ...parsedValues };
        setValidationError(validatePayload(parsed, next));
        return next;
      });
    },
    [section, validatePayload],
  );

  const resetSection = useCallback(
    (defaults) => {
      setValues(defaults);
      syncJsonFromValues(defaults);
    },
    [syncJsonFromValues],
  );

  const canSend = jsonSyntaxError === null && validationError === null;

  return {
    values,
    jsonText,
    payload,
    jsonSyntaxError,
    validationError,
    canSend,
    updateField,
    updateJsonText,
    resetSection,
    setValidationError,
  };
}
