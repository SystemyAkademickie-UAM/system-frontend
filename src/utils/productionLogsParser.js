/**
 * @file productionLogsParser.js
 * @description Narzędzie do parsowania, kategoryzacji, filtrowania i sortowania logów systemowych dla osoby nadzorującej.
 */

const SEVERITY_WEIGHT = {
  FATAL: 5,
  ERROR: 4,
  WARN: 3,
  LOG: 2,
  INFO: 2,
  DEBUG: 1,
  VERBOSE: 1,
};

const SYSTEM_CONTEXTS = new Set([
  'BackupService',
  'BackupController',
  'BackupSchedulerService',
  'SuperAdminBootstrapService',
  'MaintenanceModeService',
  'PatchNotesService',
  'DocumentsService',
  'Nest',
  'LogStoreService',
]);

/**
 * Parses raw text of logs into structured log entry objects.
 * @param {string} rawText
 * @param {Array<{ id: number, name: string }>} organizationsList
 * @returns {{ entries: Array<object>, stats: object, detectedOrgs: Array<object> }}
 */
export function parseLogLines(rawText, organizationsList = []) {
  if (!rawText || typeof rawText !== 'string') {
    return {
      entries: [],
      stats: {
        total: 0,
        httpCount: 0,
        avgDurationMs: 0,
        errorCount: 0,
        warnCount: 0,
        uniqueOrgsCount: 0,
      },
      detectedOrgs: [],
    };
  }

  const orgMap = new Map();
  for (const org of organizationsList) {
    orgMap.set(String(org.id), org.name);
  }

  const lines = rawText.split(/\r?\n/);
  const entries = [];
  const orgCounts = new Map();

  let totalDuration = 0;
  let httpCount = 0;
  let errorCount = 0;
  let warnCount = 0;

  let currentEntry = null;

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim()) {
      continue;
    }

    const headerMatch = line.match(
      /^(\d{4}-\d{2}-\d{2}\s\d{2}:\d{2}:\d{2})\s+\[([A-Za-z]+)\]\s+\[([^\]]+)\]\s+(.*)$/,
    );

    if (headerMatch) {
      const [, timestamp, rawLevel, context, rest] = headerMatch;
      const level = rawLevel.toUpperCase();

      if (level === 'ERROR' || level === 'FATAL') {
        errorCount += 1;
      } else if (level === 'WARN') {
        warnCount += 1;
      }

      // Detect organization tag
      let orgId = 'system';
      const orgTagMatch = rest.match(/\[org:([^\]]+)\]/i);
      const orgIdMatch = rest.match(/organizationId[=:\s]+(\d+)/i);

      if (orgTagMatch) {
        orgId = orgTagMatch[1].toLowerCase();
      } else if (orgIdMatch) {
        orgId = orgIdMatch[1];
      } else if (SYSTEM_CONTEXTS.has(context)) {
        orgId = 'system';
      }

      let orgName = 'System';
      if (orgId === 'system') {
        orgName = 'System / Globalne';
      } else if (orgId === 'public') {
        orgName = 'Ruch publiczny';
      } else if (orgMap.has(orgId)) {
        orgName = orgMap.get(orgId);
      } else {
        orgName = `Organizacja #${orgId}`;
      }

      orgCounts.set(orgId, (orgCounts.get(orgId) || 0) + 1);

      // Parse HTTP request details
      let isHttp = context === 'HTTP';
      let httpMethod = null;
      let httpPath = null;
      let httpStatus = null;
      let httpDurationMs = null;
      let user = null;
      let role = null;
      let ip = null;

      const httpDetailsMatch = rest.match(
        /(?:\[org:[^\]]+\]\s+)?(GET|POST|PUT|PATCH|DELETE)\s+([^\s]+)\s+(\d{3})\s+(\d+)ms(?:\s*-\s*user:([^\s]+)\s+role:([^\s]+)\s+ip:([^\s]+))?/,
      );

      if (httpDetailsMatch) {
        isHttp = true;
        httpCount += 1;
        httpMethod = httpDetailsMatch[1];
        httpPath = httpDetailsMatch[2];
        httpStatus = Number(httpDetailsMatch[3]);
        httpDurationMs = Number(httpDetailsMatch[4]);
        user = httpDetailsMatch[5] || null;
        role = httpDetailsMatch[6] || null;
        ip = httpDetailsMatch[7] || null;
        totalDuration += httpDurationMs;
      }

      // Clean message for display
      const displayMessage = rest.replace(/\[org:[^\]]+\]\s*/i, '').trim();

      currentEntry = {
        id: `log-${i}`,
        timestamp,
        level,
        context,
        orgId,
        orgName,
        message: displayMessage,
        isHttp,
        httpMethod,
        httpPath,
        httpStatus,
        httpDurationMs,
        user,
        role,
        ip,
        details: '',
        raw: line,
      };

      entries.push(currentEntry);
    } else if (currentEntry) {
      // Continuation line (e.g. error stack trace)
      currentEntry.details = currentEntry.details
        ? `${currentEntry.details}\n${line}`
        : line;
      currentEntry.raw += `\n${line}`;
    }
  }

  const detectedOrgs = Array.from(orgCounts.keys()).map((id) => {
    let name = 'System';
    if (id === 'system') {
      name = 'System / Globalne';
    } else if (id === 'public') {
      name = 'Ruch publiczny';
    } else if (orgMap.has(id)) {
      name = orgMap.get(id);
    } else {
      name = `Organizacja #${id}`;
    }
    return {
      id,
      name,
      count: orgCounts.get(id) || 0,
    };
  });

  const stats = {
    total: entries.length,
    httpCount,
    avgDurationMs: httpCount > 0 ? Math.round(totalDuration / httpCount) : 0,
    errorCount,
    warnCount,
    uniqueOrgsCount: detectedOrgs.length,
  };

  return {
    entries,
    stats,
    detectedOrgs,
  };
}

/**
 * Filters and sorts log entries based on user selection.
 * @param {Array<object>} entries
 * @param {object} criteria
 * @returns {Array<object>}
 */
export function filterAndSortLogs(entries, {
  organizationId = 'all',
  level = 'all',
  category = 'all',
  searchPhrase = '',
  sortBy = 'time_desc',
} = {}) {
  const normalizedSearch = searchPhrase.trim().toLowerCase();

  const filtered = entries.filter((entry) => {
    // 1. Organization filter
    if (organizationId !== 'all') {
      if (entry.orgId !== organizationId) {
        return false;
      }
    }

    // 2. Level filter
    if (level !== 'all') {
      if (level === 'error' && entry.level !== 'ERROR' && entry.level !== 'FATAL') {
        return false;
      }
      if (level === 'warn' && entry.level !== 'WARN') {
        return false;
      }
      if (level === 'log' && entry.level !== 'LOG' && entry.level !== 'INFO') {
        return false;
      }
      if (level === 'debug' && entry.level !== 'DEBUG' && entry.level !== 'VERBOSE') {
        return false;
      }
    }

    // 3. Category filter
    if (category !== 'all') {
      if (category === 'http' && !entry.isHttp) {
        return false;
      }
      if (category === 'backup' && !entry.context.toLowerCase().includes('backup')) {
        return false;
      }
      if (category === 'auth' && !entry.context.toLowerCase().match(/auth|login|saml|session|magic/)) {
        return false;
      }
      if (category === 'system' && entry.orgId !== 'system') {
        return false;
      }
    }

    // 4. Search phrase
    if (normalizedSearch) {
      const inMessage = entry.message.toLowerCase().includes(normalizedSearch);
      const inContext = entry.context.toLowerCase().includes(normalizedSearch);
      const inOrg = entry.orgName.toLowerCase().includes(normalizedSearch);
      const inPath = entry.httpPath?.toLowerCase().includes(normalizedSearch);
      const inUser = entry.user?.toLowerCase().includes(normalizedSearch);
      const inIp = entry.ip?.toLowerCase().includes(normalizedSearch);
      const inDetails = entry.details?.toLowerCase().includes(normalizedSearch);

      if (!inMessage && !inContext && !inOrg && !inPath && !inUser && !inIp && !inDetails) {
        return false;
      }
    }

    return true;
  });

  // Sorting
  return filtered.sort((a, b) => {
    switch (sortBy) {
      case 'time_asc':
        return a.timestamp.localeCompare(b.timestamp);
      case 'org_asc':
        return a.orgName.localeCompare(b.orgName, 'pl');
      case 'org_desc':
        return b.orgName.localeCompare(a.orgName, 'pl');
      case 'level_desc':
        return (SEVERITY_WEIGHT[b.level] || 0) - (SEVERITY_WEIGHT[a.level] || 0);
      case 'duration_desc':
        return (b.httpDurationMs || 0) - (a.httpDurationMs || 0);
      case 'time_desc':
      default:
        return b.timestamp.localeCompare(a.timestamp);
    }
  });
}
