import { buildFullUrl } from './api-client.js';

function parseAttachmentFilename(contentDisposition) {
  if (!contentDisposition) {
    return null;
  }

  const utf8Match = /filename\*=UTF-8''([^;]+)/i.exec(contentDisposition);
  if (utf8Match?.[1]) {
    try {
      return decodeURIComponent(utf8Match[1]);
    } catch {
      return utf8Match[1];
    }
  }

  const match = /filename="?([^";]+)"?/i.exec(contentDisposition);
  return match?.[1] ?? null;
}

/**
 * @param {string} resourcePath
 * @param {string} defaultFilename
 * @returns {Promise<void>}
 */
async function downloadCsvReport(resourcePath, defaultFilename) {
  const response = await fetch(buildFullUrl(resourcePath), {
    method: 'GET',
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    let message = `Błąd HTTP ${response.status}`;

    try {
      const data = JSON.parse(text);
      if (typeof data?.message === 'string' && data.message.trim()) {
        message = data.message;
      }
    } catch {
      if (text.trim()) {
        message = text.trim();
      }
    }

    throw new Error(message);
  }

  const blob = await response.blob();
  const filename = parseAttachmentFilename(response.headers.get('Content-Disposition'))
    ?? defaultFilename;
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

/**
 * GET /groups/:groupId/reports/group
 * @param {string | number} groupId
 */
export function downloadGroupReport(groupId) {
  return downloadCsvReport(`/groups/${groupId}/reports/group`, 'report-group.csv');
}

/**
 * GET /groups/:groupId/reports/stage/:stageId
 * @param {string | number} groupId
 * @param {number} stageId
 */
export function downloadStageReport(groupId, stageId) {
  return downloadCsvReport(
    `/groups/${groupId}/reports/stage/${stageId}`,
    'report-stage.csv',
  );
}

/**
 * GET /groups/:groupId/reports/student/:accountId
 * @param {string | number} groupId
 * @param {number} accountId
 */
export function downloadStudentReport(groupId, accountId) {
  return downloadCsvReport(
    `/groups/${groupId}/reports/student/${accountId}`,
    'report-student.csv',
  );
}
