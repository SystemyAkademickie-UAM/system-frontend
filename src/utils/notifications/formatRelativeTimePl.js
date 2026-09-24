import { READLANGUAGECOOKIE } from '../LANGUAGECOOKIE.js';

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
function pluralForm(count, polishForms, englishForms, language) {
  const absolute = Math.abs(count);

  if (language === 'english') {
    if (absolute === 1) {
      return englishForms[0];
    }
    return englishForms[1];
  } else if (language === 'polish') {

    if (absolute === 1) {
      return polishForms[0];
    }

    const mod10 = absolute % 10;
    const mod100 = absolute % 100;
    if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
      return polishForms[1];
    }

    return polishForms[2];
  }
}

/**
 * @param {number} count
 * @param {[string, string, string]} unitForms
 * @returns {string}
 */
function timeLabel(count, polishUnitForms, englishUnitForms, language) {
  if (language === 'english') {
    return `${count} ${pluralForm(count, englishUnitForms, englishUnitForms, language)} ago`;
  }
  return `${count} ${pluralForm(count, polishUnitForms, englishUnitForms, language)} temu`;
}

/**
 * @param {string | Date | number} value
 * @param {number} [nowMs=Date.now()]
 * @returns {string}
 */
export function formatRelativeTimePl(value, nowMs = Date.now(), language) {
  const languageSelected = READLANGUAGECOOKIE();

  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  const diffMs = nowMs - date.getTime();
  if (diffMs < 45 * SECOND_MS) {
    if (languageSelected === 'english') {
      return 'just now';
    } else if (languageSelected === 'polish') {
      return 'przed chwilą';
    }
  }

  if (diffMs < MINUTE_MS) {
    const seconds = Math.max(1, Math.floor(diffMs / SECOND_MS));
    return timeLabel(seconds, ['sekundę', 'sekundy', 'sekund'], ['second', 'seconds'], languageSelected);
  }

  if (diffMs < HOUR_MS) {
    const minutes = Math.max(1, Math.floor(diffMs / MINUTE_MS));
    return timeLabel(minutes, ['minutę', 'minuty', 'minut'], ['minute', 'minutes'], languageSelected);
  }

  if (diffMs < DAY_MS) {
    const hours = Math.max(1, Math.floor(diffMs / HOUR_MS));
    return timeLabel(hours, ['godzinę', 'godziny', 'godzin'], ['hour', 'hours'], languageSelected);
  }

  if (diffMs < 2 * DAY_MS) {
    if (languageSelected === 'english') {
      return 'yesterday';
    } else if (languageSelected === 'polish') {
      return 'wczoraj';
    }
  }

  if (diffMs < WEEK_MS) {
    const days = Math.max(2, Math.floor(diffMs / DAY_MS));
    return timeLabel(days, ['dzień', 'dni', 'dni'], ['day', 'days'], languageSelected);
  }

  if (diffMs < 4 * WEEK_MS) {
    const weeks = Math.max(1, Math.floor(diffMs / WEEK_MS));
    return timeLabel(weeks, ['tydzień', 'tygodnie', 'tygodni'], ['week', 'weeks'], languageSelected);
  }

  if (languageSelected === 'english') {
    return date.toLocaleString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } else if (languageSelected === 'polish') {
    return date.toLocaleString('pl-PL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
