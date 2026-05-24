import { useEffect, useState } from 'react';
import { getApiBaseUrl } from '../constants/api.constants.js';
import { AUTH_SAML_BYPASS_STATUS_PATH } from '../constants/authPaths.constants.js';
import { isNodeProduction } from '../utils/nodeEnv.js';

/**
 * Dev-only: reads whether SAML bypass is enabled and which personas exist.
 * When `NODE_ENV=production`, returns `{ enabled: false, personas: [] }` without calling the API.
 */
export function useDevBypassStatus() {
  const nodeProduction = isNodeProduction();
  const [isLoading, setIsLoading] = useState(!nodeProduction);
  const [enabled, setEnabled] = useState(false);
  const [personas, setPersonas] = useState([]);

  useEffect(() => {
    if (nodeProduction) {
      setEnabled(false);
      setPersonas([]);
      setIsLoading(false);
      return undefined;
    }

    let cancelled = false;

    async function loadBypassStatus() {
      setIsLoading(true);
      const baseUrl = getApiBaseUrl();
      if (baseUrl.length === 0) {
        if (!cancelled) {
          setEnabled(false);
          setPersonas([]);
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch(`${baseUrl}${AUTH_SAML_BYPASS_STATUS_PATH}`, {
          credentials: 'include',
        });
        if (!response.ok) {
          if (!cancelled) {
            setEnabled(false);
            setPersonas([]);
          }
          return;
        }
        const data = await response.json();
        if (!cancelled) {
          setEnabled(data.enabled === true);
          setPersonas(Array.isArray(data.personas) ? data.personas : []);
        }
      } catch {
        if (!cancelled) {
          setEnabled(false);
          setPersonas([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    loadBypassStatus();

    return () => {
      cancelled = true;
    };
  }, []);

  return {
    devBypassQuery: {
      isLoading,
      enabled,
      personas,
    },
  };
}
