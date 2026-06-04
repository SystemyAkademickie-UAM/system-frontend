export function formatLocalDateInput(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatLocalTimeInput(date) {
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${hour}:${minute}`;
}

export function parseLocalExpireDateTime(expireDate, expireTime) {
  const [year, month, day] = expireDate.split('-').map(Number);
  const [hour, minute] = expireTime.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

export function isExpireDateTimeInPast(expireDate, expireTime, now = new Date()) {
  if (!expireDate || !expireTime) {
    return false;
  }

  return parseLocalExpireDateTime(expireDate, expireTime).getTime() < now.getTime();
}

export function clampExpireDateTime(expireDate, expireTime, now = new Date()) {
  const minDate = formatLocalDateInput(now);
  const minTime = formatLocalTimeInput(now);

  let nextDate = expireDate || minDate;
  if (nextDate < minDate) {
    nextDate = minDate;
  }

  let nextTime = expireTime || minTime;
  if (nextDate === minDate && nextTime < minTime) {
    nextTime = minTime;
  }

  return { date: nextDate, time: nextTime };
}

export const EXPIRE_IN_PAST_MESSAGE = 'Data wygaśnięcia nie może być wcześniejsza niż aktualna data i godzina.';
