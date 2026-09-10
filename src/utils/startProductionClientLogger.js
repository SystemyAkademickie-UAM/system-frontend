import { CLIENT_LOG_MESSAGE_MAX_CHARS } from '../constants/productionLogs.constants.js';
import { ingestClientLog } from '../services/productionLogs.api.js';

/**
 * Forwards window errors to the backend daily log (session cookie, if any).
 */
export function startProductionClientLogger() {
  window.addEventListener('error', (event) => {
    ingestClientLog({
      level: 'error',
      message: truncateMessage(event.message || String(event.error)),
      source: event.filename || 'window.error',
    });
  });
  window.addEventListener('unhandledrejection', (event) => {
    ingestClientLog({
      level: 'error',
      message: truncateMessage(`unhandledrejection ${String(event.reason)}`),
      source: 'window.unhandledrejection',
    });
  });
}

/**
 * @param {string} message
 * @returns {string}
 */
function truncateMessage(message) {
  if (message.length <= CLIENT_LOG_MESSAGE_MAX_CHARS) {
    return message;
  }
  return message.slice(0, CLIENT_LOG_MESSAGE_MAX_CHARS);
}
