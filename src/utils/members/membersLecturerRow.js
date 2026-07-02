import { APP_ROLE } from '../../navigation/shellTemplates.config.js';

import { resolveGroupLecturerDisplay } from '../resolveGroupLecturerDisplay.js';



const AVATAR_BASE = 'https://api.dicebear.com/7.x/adventurer/svg?seed=';



export function generateMemberAvatarFallback(seed) {

  const normalized = String(seed || 'lecturer').trim() || 'lecturer';

  return `${AVATAR_BASE}${encodeURIComponent(normalized)}`;

}



/**

 * Awatar prowadzącego: z profilu zalogowanego prowadzącego (własna grupa) lub fallback.

 * Backend w preview zwraca tylko pole `lecturers` (tekst) — bez URL awatara.

 */

export function resolveLecturerAvatarUrl({

  isOwnGroup,

  role,

  profileAvatarUrl,

  lecturerDisplayName,

  lecturerAvatarUrl,

}) {

  if (isOwnGroup && role === APP_ROLE.LECTURER && profileAvatarUrl) {

    return profileAvatarUrl;

  }



  if (lecturerAvatarUrl) {

    return lecturerAvatarUrl;

  }



  return generateMemberAvatarFallback(lecturerDisplayName);

}



export function buildLecturerMemberRow({

  group,

  isOwnGroup = false,

  role,

  profileAvatarUrl,

  position = 1,

}) {

  const lecturerDisplayName = group ? resolveGroupLecturerDisplay(group) : '';



  if (!lecturerDisplayName.trim()) {

    return null;

  }



  const avatar = resolveLecturerAvatarUrl({

    isOwnGroup: isOwnGroup || Boolean(group?.isMine),

    role,

    profileAvatarUrl,

    lecturerDisplayName,

    lecturerAvatarUrl: group?.lecturerAvatarUrl ?? null,

  });



  return {

    id: 'member-lecturer',

    isLecturer: true,

    enrollmentId: null,

    accountId: null,

    position,

    name: lecturerDisplayName.trim(),

    nickname: '',

    legalName: '',

    email: '',

    avatar,

    rankId: null,

    rank: 'Prowadzący',

    currency: null,

    totalCurrency: null,

    badgesCount: null,

  };

}

