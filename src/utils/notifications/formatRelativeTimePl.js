const SECOND_MS = 1000;
const MINUTE_MS = 60 * SECOND_MS;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;
const WEEK_MS = 7 * DAY_MS;

/**
 * @param {number} count
 * @param {[string, string, string]} forms — [1, 2–4, 5+]
 * @returns {string}
 */
function pluralPl(count, forms) {
  const absolute = Math.abs(count);
  if (absolute === 1) {
    return forms[0];
  }

  const mod10 = absolute % 10;
  const mod100 = absolute % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return forms[1];
  }

  return forms[2];
}

/**
 * @param {number} count
 * @param {[string, string, string]} unitForms
 * @returns {string}
 */
function agoLabel(count, unitForms) {
  return `${count} ${pluralPl(count, unitForms)} temu`;
}

/**
 * @param {string | Date | number} value
 * @param {number} [nowMs=Date.now()]
 * @returns {string}
 */
export function formatRelativeTimePl(value, nowMs = Date.now()) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  const diffMs = nowMs - date.getTime();
  if (diffMs < 45 * SECOND_MS) {
    return 'przed chwilą';
  }

  if (diffMs < MINUTE_MS) {
    const seconds = Math.max(1, Math.floor(diffMs / SECOND_MS));
    return agoLabel(seconds, ['sekundę', 'sekundy', 'sekund']);
  }

  if (diffMs < HOUR_MS) {
    const minutes = Math.max(1, Math.floor(diffMs / MINUTE_MS));
    return agoLabel(minutes, ['minutę', 'minuty', 'minut']);
  }

  if (diffMs < DAY_MS) {
    const hours = Math.max(1, Math.floor(diffMs / HOUR_MS));
    return agoLabel(hours, ['godzinę', 'godziny', 'godzin']);
  }

  if (diffMs < 2 * DAY_MS) {
    return 'wczoraj';
  }

  if (diffMs < WEEK_MS) {
    const days = Math.max(2, Math.floor(diffMs / DAY_MS));
    return agoLabel(days, ['dzień', 'dni', 'dni']);
  }

  if (diffMs < 4 * WEEK_MS) {
    const weeks = Math.max(1, Math.floor(diffMs / WEEK_MS));
    return agoLabel(weeks, ['tydzień', 'tygodnie', 'tygodni']);
  }

  return date.toLocaleString('pl-PL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
