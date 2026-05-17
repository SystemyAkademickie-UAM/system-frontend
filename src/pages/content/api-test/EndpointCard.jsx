import { useCallback, useState } from 'react';

import { buildFullUrl, postJson } from '../../../services/api-client.js';

/**
 * Reusable card for a single API endpoint with copy URL, example payload, and send button.
 *
 * @param {{ method: string, path: string, description: string, payload: Record<string, unknown> }} props
 */
export default function EndpointCard({ method, path, description, payload }) {
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);

  const fullUrl = buildFullUrl(path);
  const payloadJson = JSON.stringify(payload, null, 2);

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
    } catch {
      /* clipboard API may be blocked in some contexts */
    }
  }, [fullUrl]);

  const handleCopyPayload = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(payloadJson);
    } catch {
      /* clipboard API may be blocked */
    }
  }, [payloadJson]);

  const handleSend = useCallback(async () => {
    setLoading(true);
    setResponse(null);
    try {
      const result = await postJson(path, payload);
      setResponse(result);
    } catch (err) {
      setResponse({ ok: false, status: 0, data: err.message });
    } finally {
      setLoading(false);
    }
  }, [path, payload]);

  return (
    <article className="endpoint-card">
      <div className="endpoint-card__header">
        <span className="endpoint-card__method">{method}</span>
        <span className="endpoint-card__path">{path}</span>
      </div>

      <p className="endpoint-card__description">{description}</p>

      <p className="endpoint-card__payload-label">Przykładowy payload (JSON)</p>
      <pre className="endpoint-card__payload">{payloadJson}</pre>

      <div className="endpoint-card__actions">
        <button
          id={`copy-url-${path.replaceAll('/', '-')}`}
          type="button"
          className="endpoint-card__btn endpoint-card__btn--copy"
          onClick={handleCopyUrl}
        >
          📋 Kopiuj URL
        </button>
        <button
          id={`copy-payload-${path.replaceAll('/', '-')}`}
          type="button"
          className="endpoint-card__btn endpoint-card__btn--copy"
          onClick={handleCopyPayload}
        >
          📋 Kopiuj Payload
        </button>
        <button
          id={`send-${path.replaceAll('/', '-')}`}
          type="button"
          className="endpoint-card__btn endpoint-card__btn--send"
          onClick={handleSend}
          disabled={loading}
        >
          {loading ? '⏳ Wysyłanie…' : '🚀 Wyślij testowy request'}
        </button>
      </div>

      {response && (
        <pre
          className={`endpoint-card__response ${response.ok ? 'endpoint-card__response--ok' : 'endpoint-card__response--error'}`}
        >
          {`HTTP ${response.status}\n${typeof response.data === 'string' ? response.data : JSON.stringify(response.data, null, 2)}`}
        </pre>
      )}
    </article>
  );
}
