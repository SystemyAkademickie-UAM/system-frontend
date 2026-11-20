import { BYTES_PER_MEGABYTE, FILE_SIZE_FRACTION_DIGITS } from '../../constants/organizationAdmin.constants.js';

const ROLE_LABEL = {
  pl: {
    student: 'osoba studiująca',
    lecturer: 'osoba prowadząca',
    administrator: 'osoba administrująca',
  },
  en: {
    student: 'studying person',
    lecturer: 'leading person',
    administrator: 'administering person',
  },
};

function roleLabel(roleName, language) {
  return ROLE_LABEL[language]?.[roleName] ?? roleName ?? '';
}

function fileSizeLabel(bytes) {
  const value = Number(bytes);
  if (!Number.isFinite(value) || value < 0) {
    return '0';
  }
  return (value / BYTES_PER_MEGABYTE).toFixed(FILE_SIZE_FRACTION_DIGITS);
}

function detailText(detail, key) {
  const value = detail?.[key];
  return typeof value === 'string' ? value : '';
}

/**
 * Builds the visible sentence from stored fields. The page never prints a stored message as HTML.
 * @param {Record<string, unknown>} item
 * @param {'pl' | 'en'} language
 */
export function organizationLogSentence(item, language) {
  const person = String(item.subjectName || item.actorName || '');
  const actor = String(item.actorName || '');
  const group = String(item.groupName || '');
  const role = roleLabel(String(item.roleName || ''), language);
  const fileWord = item.fileKind === 'image'
    ? (language === 'pl' ? 'Obraz' : 'Image')
    : (language === 'pl' ? 'Plik' : 'File');
  const size = fileSizeLabel(item.fileSizeBytes);
  const polish = language === 'pl';

  switch (item.kind) {
    case 'role_granted':
      return polish
        ? `Nadano rolę ${role} osobie ${person}.`
        : `${person} was granted the ${role} role.`;
    case 'role_revoked':
      return polish
        ? `Odebrano rolę ${role} osobie ${person}.`
        : `The ${role} role was revoked from ${person}.`;
    case 'login_link_sent':
      return polish
        ? `Wysłano łącze logowania do osoby ${person}.`
        : `A login link was sent to ${person}.`;
    case 'signed_in':
      return polish ? `Zalogowano osobę ${person}.` : `${person} signed in.`;
    case 'group_created':
      return polish
        ? `Utworzono grupę „${group}”. Osoba: ${actor}.`
        : `New group “${group}” was created by ${actor}.`;
    case 'removed_from_group':
      return polish
        ? `Usunięto osobę ${person} z grupy ${group}.`
        : `${person} was removed from ${group}.`;
    case 'badge_revoked':
      return polish
        ? `Odebrano odznakę ${detailText(item.detail, 'badgeName')} osobie ${person} w grupie ${group}.`
        : `${person} lost the badge ${detailText(item.detail, 'badgeName')} in ${group}.`;
    case 'activity_completion_removed':
      return polish
        ? `Usunięto ukończenie ${detailText(item.detail, 'activityName')} osobie ${person} w grupie ${group}.`
        : `Completion of ${detailText(item.detail, 'activityName')} was removed for ${person} in ${group}.`;
    case 'file_stored':
      return polish
        ? `Wczytano ${fileWord.toLowerCase()} „${item.fileName}” (${size} MB).`
        : `${fileWord} “${item.fileName}” was loaded with ${size} MB.`;
    case 'file_removed':
      return polish
        ? `Usunięto ${fileWord.toLowerCase()} „${item.fileName}” (${size} MB).`
        : `${fileWord} “${item.fileName}” was removed (${size} MB).`;
    case 'student_joined':
      return polish ? `Do grupy ${group} dołączyła osoba ${person}.` : `${person} joined ${group}.`;
    case 'activity_completed':
      return polish
        ? `Ukończono ${detailText(item.detail, 'activityName')}. Osoba: ${person}. Grupa: ${group}.`
        : `${person} completed ${detailText(item.detail, 'activityName')} in ${group}.`;
    case 'badge_earned':
      return polish
        ? `Przyznano odznakę ${detailText(item.detail, 'badgeName')} osobie ${person} w grupie ${group}.`
        : `${person} received the badge ${detailText(item.detail, 'badgeName')} in ${group}.`;
    case 'rank_up':
      return polish
        ? `Osiągnięto rangę ${detailText(item.detail, 'rankName')}. Osoba: ${person}. Grupa: ${group}.`
        : `${person} reached the rank ${detailText(item.detail, 'rankName')} in ${group}.`;
    default:
      return polish
        ? `${actor || person} — ${item.kind} — ${group}`
        : `${actor || person} — ${item.kind} — ${group}`;
  }
}

const SAFE_LINK = /^\/(groups\/\d+(?:\/student-profile\/\d+)?|users\?accountId=\d+)$/;

export function safeOrganizationLogLink(path) {
  return typeof path === 'string' && SAFE_LINK.test(path) ? path : null;
}
