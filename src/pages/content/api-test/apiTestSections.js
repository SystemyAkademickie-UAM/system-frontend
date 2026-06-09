import {
  ACTIVITIES_PATH,
  DRIVE_PATH,
  getGroupEnrollmentCodeByIdPath,
  getGroupEnrollmentCodesPath,
  getGroupBadgeByIdPath,
  getGroupBadgesPath,
  getGroupEnrollPath,
  getGroupInvitePath,
  getGroupPreviewPath,
  getGroupRankByIdPath,
  getGroupRanksPath,
  getGroupStudentProfilePath,
  getGroupStudentsPath,
  getGroupStudentsBulkUpdatePath,
  getGroupStudentDeletePath,
  getGroupStudentBadgesPath,
  getGroupStudentBadgeTogglePath,
  getGroupStudentProgressPath,
  getGroupStudentActivityTogglePath,
  GROUPS_CATALOG_PATH,
  ENROLLMENT_CODE_MAX_LENGTH,
  ENROLLMENT_CODE_MIN_LENGTH,
  GROUPS_NEW_PATH,
  GROUPS_PATH,
  STAGES_PATH,
  PROFILE_PATH,
  PROFILE_AVATARS_PATH,
  PROFILE_SETTINGS_PATH,
  SMOKE_TEST_DEFAULT_CURRENCY_ICON,
  SMOKE_TEST_DEFAULT_LIFE_ICON,
} from './mock/mockConstants.js';

/** @typedef {'login' | 'api' | 'multipart' | 'get'} ApiTestSectionKind */

/**
 * @typedef {Object} ApiTestField
 * @property {string} key
 * @property {string} label
 * @property {'text' | 'number' | 'textarea' | 'select' | 'file' | 'readonly'} [type]
 * @property {string} [placeholder]
 * @property {Array<{ value: string, label: string }>} [options]
 */

/**
 * @typedef {Object} ApiTestSection
 * @property {string} id
 * @property {string} label
 * @property {string} title
 * @property {ApiTestSectionKind} kind
 * @property {string} [method]
 * @property {string} [group] - Optional nav group header (renders a separator in sidebar)
 * @property {(values: Record<string, unknown>) => string} [buildPath]
 * @property {boolean} [needsBrowserId]
 * @property {ApiTestField[]} [fields]
 * @property {() => Record<string, unknown>} [defaultValues]
 * @property {(values: Record<string, unknown>) => Record<string, unknown>} [buildPayload]
 * @property {(payload: Record<string, unknown>) => Record<string, unknown>} [parsePayload]
 * @property {(values: Record<string, unknown>) => string[]} [requiredKeysForValues]
 * @property {(values: Record<string, unknown>, payload: Record<string, unknown>) => string[]} [allowEmptyKeysForValues]
 * @property {string} [hint]
 */

/** @type {ApiTestSection[]} */
export const API_TEST_SECTIONS = [
  {
    id: 'login',
    label: 'Moduł logowania Nikita',
    title: 'Session & auth',
    kind: 'login',
  },
  {
    id: 'newGroup',
    label: 'New Group',
    title: 'POST /groups/new',
    group: 'Groups',
    kind: 'api',
    method: 'POST',
    buildPath: () => GROUPS_NEW_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      groupName: 'Smoke test group',
      groupDescription: 'Created from dev API test page',
      groupCurrency: 'Coin',
      groupCurrencyIcon: SMOKE_TEST_DEFAULT_CURRENCY_ICON,
      groupLives: 'Lives',
      groupLivesIcon: SMOKE_TEST_DEFAULT_LIFE_ICON,
      groupImageRef: '',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {
        group: {
          name: values.groupName,
          description: values.groupDescription,
          currency: values.groupCurrency,
          currencyIcon: Number(values.groupCurrencyIcon),
          lives: values.groupLives,
          livesIcon: Number(values.groupLivesIcon),
        },
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      if (typeof values.groupImageRef === 'string' && values.groupImageRef.trim() !== '') {
        payload.group.imageRef = values.groupImageRef.trim();
      }
      return payload;
    },
    parsePayload: (payload) => {
      const group = payload.group;
      const groupObj = typeof group === 'object' && group !== null ? group : {};
      return {
        auth: typeof payload.auth === 'string' ? payload.auth : '',
        groupName: typeof groupObj.name === 'string' ? groupObj.name : '',
        groupDescription: typeof groupObj.description === 'string' ? groupObj.description : '',
        groupCurrency: typeof groupObj.currency === 'string' ? groupObj.currency : '',
        groupCurrencyIcon: groupObj.currencyIcon ?? SMOKE_TEST_DEFAULT_CURRENCY_ICON,
        groupLives: typeof groupObj.lives === 'string' ? groupObj.lives : String(groupObj.lives ?? ''),
        groupLivesIcon: groupObj.livesIcon ?? SMOKE_TEST_DEFAULT_LIFE_ICON,
        groupImageRef: typeof groupObj.imageRef === 'string' ? groupObj.imageRef : '',
      };
    },
    requiredKeysForValues: () => ['group', 'group.name'],
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'groupName', label: 'group.name', type: 'text' },
      { key: 'groupDescription', label: 'group.description', type: 'text' },
      { key: 'groupCurrency', label: 'group.currency', type: 'text' },
      { key: 'groupCurrencyIcon', label: 'group.currencyIcon', type: 'number' },
      { key: 'groupLives', label: 'group.lives', type: 'text' },
      { key: 'groupLivesIcon', label: 'group.livesIcon', type: 'number' },
      { key: 'groupImageRef', label: 'group.imageRef (optional)', type: 'text' },
    ],
  },
  {
    id: 'getUserGroups',
    label: 'List My Groups',
    title: 'GET /groups',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => {
      const auth = String(values.auth ?? '').trim();
      return auth ? `${GROUPS_PATH}?auth=${encodeURIComponent(auth)}` : GROUPS_PATH;
    },
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
    }),
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'getGroupsCatalog',
    label: 'Groups Catalog',
    title: 'GET /groups/catalog',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => {
      const auth = String(values.auth ?? '').trim();
      return auth ? `${GROUPS_CATALOG_PATH}?auth=${encodeURIComponent(auth)}` : GROUPS_CATALOG_PATH;
    },
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
    }),
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'getGroupPreview',
    label: 'Group Preview',
    title: 'GET /groups/:groupId/preview',
    kind: 'get',
    method: 'GET',
    buildPath: (values) =>
      getGroupPreviewPath(String(values.groupId ?? ''), String(values.auth ?? '')),
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'listEnrollmentCodes',
    label: 'List Codes',
    title: 'GET /groups/:groupId/enrollment-codes',
    group: 'Enrollment codes',
    kind: 'get',
    method: 'GET',
    hint:
      'Lecturer only. Lists all codes for the group (newest first). Pick the latest active row to see the current invite code.',
    buildPath: (values) =>
      getGroupEnrollmentCodesPath(String(values.groupId ?? ''), String(values.auth ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'groupId (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'getEnrollmentCode',
    label: 'Get Code',
    title: 'GET /groups/:groupId/enrollment-codes/:codeId',
    kind: 'get',
    method: 'GET',
    buildPath: (values) =>
      getGroupEnrollmentCodeByIdPath(
        String(values.groupId ?? ''),
        String(values.codeId ?? ''),
        String(values.auth ?? ''),
      ),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      codeId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'groupId (public)', type: 'number' },
      { key: 'codeId', label: 'codeId (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'createEnrollmentCode',
    label: 'Generate Code',
    title: 'POST /groups/:groupId/enrollment-codes',
    kind: 'api',
    method: 'POST',
    hint:
      'Lecturer only. Primary way to mint a code — omit `code` to auto-generate a 6-char hex value. Optional expiresAt (ISO-8601) and maxUses (≥1). Returns 201 with the created row.',
    buildPath: (values) => `/groups/${String(values.groupId ?? '').trim()}/enrollment-codes`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      code: '',
      expiresAt: '',
      maxUses: '',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const code = String(values.code ?? '').trim();
      if (code !== '') {
        payload.code = code.toUpperCase();
      }
      const expiresAt = String(values.expiresAt ?? '').trim();
      if (expiresAt !== '') {
        payload.expiresAt = expiresAt;
      }
      if (values.maxUses !== '' && values.maxUses !== null && values.maxUses !== undefined) {
        payload.maxUses = Number(values.maxUses);
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      code: typeof payload.code === 'string' ? payload.code : '',
      expiresAt: typeof payload.expiresAt === 'string' ? payload.expiresAt : '',
      maxUses: payload.maxUses ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      {
        key: 'code',
        label: `code (optional, ${ENROLLMENT_CODE_MIN_LENGTH}-${ENROLLMENT_CODE_MAX_LENGTH} chars)`,
        type: 'text',
        placeholder: 'Leave empty to auto-generate',
      },
      { key: 'expiresAt', label: 'expiresAt (optional ISO-8601)', type: 'text', placeholder: '2026-12-31T23:59:59.000Z' },
      { key: 'maxUses', label: 'maxUses (optional, ≥1)', type: 'number' },
    ],
  },
  {
    id: 'updateEnrollmentCode',
    label: 'Update Code',
    title: 'PATCH /groups/:groupId/enrollment-codes/:codeId',
    kind: 'api',
    method: 'PATCH',
    buildPath: (values) =>
      `/groups/${String(values.groupId ?? '').trim()}/enrollment-codes/${String(values.codeId ?? '').trim()}`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      codeId: '1',
      expiresAt: '',
      maxUses: '',
      isActive: 'true',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const expiresAtRaw = String(values.expiresAt ?? '').trim();
      if (expiresAtRaw === 'null') {
        payload.expiresAt = null;
      } else if (expiresAtRaw !== '') {
        payload.expiresAt = expiresAtRaw;
      }
      const maxUsesRaw = String(values.maxUses ?? '').trim();
      if (maxUsesRaw === 'null') {
        payload.maxUses = null;
      } else if (maxUsesRaw !== '') {
        payload.maxUses = Number(maxUsesRaw);
      }
      if (values.isActive === 'true') {
        payload.isActive = true;
      } else if (values.isActive === 'false') {
        payload.isActive = false;
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      expiresAt:
        payload.expiresAt === null
          ? 'null'
          : typeof payload.expiresAt === 'string'
            ? payload.expiresAt
            : '',
      maxUses:
        payload.maxUses === null ? 'null' : payload.maxUses ?? '',
      isActive:
        payload.isActive === true ? 'true' : payload.isActive === false ? 'false' : 'true',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'codeId', label: 'codeId (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'expiresAt', label: 'expiresAt (optional; "null" clears)', type: 'text' },
      { key: 'maxUses', label: 'maxUses (optional; "null" = unlimited)', type: 'text' },
      {
        key: 'isActive',
        label: 'isActive',
        type: 'select',
        options: [
          { value: 'true', label: 'true' },
          { value: 'false', label: 'false' },
        ],
      },
    ],
  },
  {
    id: 'deleteEnrollmentCode',
    label: 'Delete Code',
    title: 'DELETE /groups/:groupId/enrollment-codes/:codeId',
    kind: 'get',
    method: 'DELETE',
    buildPath: (values) =>
      getGroupEnrollmentCodeByIdPath(
        String(values.groupId ?? ''),
        String(values.codeId ?? ''),
        String(values.auth ?? ''),
      ),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      codeId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'groupId (public)', type: 'number' },
      { key: 'codeId', label: 'codeId', type: 'number' },
      { key: 'auth', label: 'auth (optional query / cookie)', type: 'textarea' },
    ],
  },
  {
    id: 'enroll',
    label: 'Group Enroll',
    title: 'POST /groups/:groupId/enroll (Student)',
    kind: 'api',
    method: 'POST',
    hint:
      'Student identity comes from auth token / session — there is no userId field. Log in as a student, then send groupId in the URL path.',
    buildPath: (values) => getGroupEnrollPath(String(values.enrollGroupId ?? '')),
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      enrollGroupId: '100001',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'enrollGroupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'enrollByCode',
    label: 'Enroll by code',
    title: 'GET /groups/:groupId/invite (Student)',
    kind: 'api',
    method: 'GET',
    hint:
      'Student: validates a code from education.enrollment_codes and enrolls. enrollmentId: >0 success; -1 unauthorized; -2 group not found; -4 invalid/inactive/expired/exhausted code.',
    buildPath: (values) =>
      getGroupInvitePath(
        String(values.inviteGroupId ?? '').trim(),
        String(values.code ?? '').trim(),
        String(values.auth ?? ''),
      ),
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      inviteGroupId: '100001',
      code: 'A1B2C3',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {
        groupId: Number(values.inviteGroupId),
        code: String(values.code ?? '').trim(),
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      inviteGroupId: payload.groupId ?? '',
      code: typeof payload.code === 'string' ? payload.code : '',
    }),
    requiredKeysForValues: () => ['groupId', 'code'],
    fields: [
      { key: 'inviteGroupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'code', label: `code (query, ${ENROLLMENT_CODE_MIN_LENGTH}-${ENROLLMENT_CODE_MAX_LENGTH} chars)`, type: 'text' },
      { key: 'auth', label: 'auth (optional query / cookie)', type: 'textarea' },
    ],
  },
  {
    id: 'getStudentProfile',
    label: 'Student Profile',
    title: 'GET /groups/:groupId/student-profile',
    group: 'Student Profile',
    kind: 'get',
    method: 'GET',
    hint: 'Student only. Returns nickname, avatar, rank, currency stats and earned badges for the authenticated student in the given group.',
    buildPath: (values) => getGroupStudentProfilePath(String(values.groupId ?? '')),
    needsBrowserId: true,
    defaultValues: () => ({
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
    ],
  },
  {
    id: 'drive',
    label: 'Drive',
    title: 'POST /drive (multipart)',
    group: 'Course content',
    kind: 'multipart',
    method: 'POST',
    buildPath: () => DRIVE_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      driveMethod: 'post',
      driveRef: '',
      driveSize: 0,
      driveFileName: '',
    }),
    buildPayload: (values) => {
      const driveMethod = values.driveMethod === 'remove' ? 'remove' : 'post';
      /** @type {Record<string, unknown>} */
      const payload = {
        drive: {
          method: driveMethod,
          driveRef: driveMethod === 'post' ? '' : String(values.driveRef ?? ''),
          size: Number(values.driveSize) || 0,
        },
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      return payload;
    },
    parsePayload: (payload) => {
      const drive = payload.drive;
      const driveObj = typeof drive === 'object' && drive !== null ? drive : {};
      return {
        auth: typeof payload.auth === 'string' ? payload.auth : '',
        driveMethod: driveObj.method === 'remove' ? 'remove' : 'post',
        driveRef: typeof driveObj.driveRef === 'string' ? driveObj.driveRef : '',
        driveSize: driveObj.size ?? 0,
        driveFileName: '',
      };
    },
    requiredKeysForValues: () => ['drive', 'drive.method', 'drive.driveRef', 'drive.size'],
    allowEmptyKeysForValues: (values, payload) => {
      const drive =
        typeof payload.drive === 'object' && payload.drive !== null ? payload.drive : {};
      const method = drive.method === 'remove' ? 'remove' : values.driveMethod === 'remove' ? 'remove' : 'post';
      return method === 'post' ? ['drive.driveRef'] : [];
    },
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      {
        key: 'driveMethod',
        label: 'drive.method',
        type: 'select',
        options: [
          { value: 'post', label: 'post' },
          { value: 'remove', label: 'remove' },
        ],
      },
      { key: 'driveRef', label: 'drive.driveRef', type: 'text' },
      { key: 'driveSize', label: 'drive.size', type: 'number' },
      { key: 'driveFile', label: 'banner file (post only)', type: 'file' },
    ],
  },
  {
    id: 'stages',
    label: 'Stages',
    title: 'POST /stages (Lecturer)',
    kind: 'api',
    method: 'POST',
    buildPath: () => STAGES_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      method: 'post',
      stageId: '',
      groupId: '100001',
      name: 'Test Stage',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = { method: values.method };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      if (values.stageId !== '' && values.stageId !== null && values.stageId !== undefined) {
        payload.stageId = Number(values.stageId);
      }
      if (values.groupId !== '' && values.groupId !== null && values.groupId !== undefined) {
        payload.groupId = Number(values.groupId);
      }
      if (typeof values.name === 'string' && values.name.trim() !== '') {
        payload.name = values.name.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      method: payload.method === 'modify' || payload.method === 'remove' || payload.method === 'retrieve' ? payload.method : 'post',
      stageId: payload.stageId ?? '',
      groupId: payload.groupId ?? '',
      name: typeof payload.name === 'string' ? payload.name : '',
    }),
    requiredKeysForValues: (values) => {
      if (values.method === 'post') {
        return ['method', 'groupId', 'name'];
      }
      if (values.method === 'modify' || values.method === 'remove') {
        return ['method', 'stageId'];
      }
      return ['method'];
    },
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      {
        key: 'method',
        label: 'method',
        type: 'select',
        options: [
          { value: 'post', label: 'post' },
          { value: 'modify', label: 'modify' },
          { value: 'remove', label: 'remove' },
          { value: 'retrieve', label: 'retrieve' },
        ],
      },
      { key: 'groupId', label: 'groupId (public, post)', type: 'number' },
      { key: 'name', label: 'name', type: 'text' },
      { key: 'stageId', label: 'stageId (modify/remove/retrieve)', type: 'number' },
    ],
  },
  {
    id: 'getProfile',
    label: 'Get Profile',
    title: 'GET /profile',
    group: 'Profile Settings',
    kind: 'get',
    method: 'GET',
    buildPath: () => PROFILE_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
    }),
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'getAvatars',
    label: 'List Avatars',
    title: 'GET /profile/avatars',
    kind: 'get',
    method: 'GET',
    buildPath: () => PROFILE_AVATARS_PATH,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
    }),
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'updateProfile',
    label: 'Update Profile',
    title: 'PATCH /profile/settings',
    kind: 'api',
    method: 'PATCH',
    buildPath: () => PROFILE_SETTINGS_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      nickname: 'New Nickname',
      avatarId: 1,
    }),
    buildPayload: (values) => {
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      if (typeof values.nickname === 'string' && values.nickname.trim() !== '') {
        payload.nickname = values.nickname.trim();
      }
      if (values.avatarId !== '' && values.avatarId !== null && values.avatarId !== undefined) {
        payload.avatarId = Number(values.avatarId);
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      nickname: typeof payload.nickname === 'string' ? payload.nickname : '',
      avatarId: payload.avatarId ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'nickname', label: 'nickname (optional)', type: 'text' },
      { key: 'avatarId', label: 'avatarId (optional)', type: 'number' },
    ],
  },
  {
    id: 'activities',
    label: 'Activities',
    title: 'POST /activities (Lecturer)',
    kind: 'api',
    method: 'POST',
    buildPath: () => ACTIVITIES_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      method: 'post',
      activityId: '',
      stageId: '1',
      name: 'Test Activity',
      currency: 100,
      educationalDescription: 'Educational description',
      storyDescription: 'Story description',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = { method: values.method };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      if (values.activityId !== '' && values.activityId !== null && values.activityId !== undefined) {
        payload.activityId = Number(values.activityId);
      }
      if (values.stageId !== '' && values.stageId !== null && values.stageId !== undefined) {
        payload.stageId = Number(values.stageId);
      }
      if (typeof values.name === 'string' && values.name.trim() !== '') {
        payload.name = values.name.trim();
      }
      if (values.currency !== '' && values.currency !== null && values.currency !== undefined) {
        payload.currency = Number(values.currency);
      }
      if (typeof values.educationalDescription === 'string') {
        payload.educationalDescription = values.educationalDescription;
      }
      if (typeof values.storyDescription === 'string') {
        payload.storyDescription = values.storyDescription;
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      method: payload.method === 'modify' || payload.method === 'remove' || payload.method === 'retrieve' ? payload.method : 'post',
      activityId: payload.activityId ?? '',
      stageId: payload.stageId ?? '',
      name: typeof payload.name === 'string' ? payload.name : '',
      currency: payload.currency ?? 0,
      educationalDescription: typeof payload.educationalDescription === 'string' ? payload.educationalDescription : '',
      storyDescription: typeof payload.storyDescription === 'string' ? payload.storyDescription : '',
    }),
    requiredKeysForValues: (values) => {
      if (values.method === 'post') {
        return ['method', 'stageId', 'name', 'currency'];
      }
      if (values.method === 'modify' || values.method === 'remove') {
        return ['method', 'activityId'];
      }
      return ['method'];
    },
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      {
        key: 'method',
        label: 'method',
        type: 'select',
        options: [
          { value: 'post', label: 'post' },
          { value: 'modify', label: 'modify' },
          { value: 'remove', label: 'remove' },
          { value: 'retrieve', label: 'retrieve' },
        ],
      },
      { key: 'stageId', label: 'stageId (DB id)', type: 'number' },
      { key: 'name', label: 'name', type: 'text' },
      { key: 'currency', label: 'currency', type: 'number' },
      { key: 'educationalDescription', label: 'educationalDescription', type: 'textarea' },
      { key: 'storyDescription', label: 'storyDescription', type: 'textarea' },
      { key: 'activityId', label: 'activityId (modify/remove/retrieve)', type: 'number' },
    ],
  },
  {
    id: 'listBadges',
    label: 'List Badges',
    title: 'GET /groups/:groupId/badges',
    group: 'Gamification',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => {
      const path = getGroupBadgesPath(String(values.groupId ?? ''));
      const auth = String(values.auth ?? '').trim();
      return auth ? `${path}?auth=${encodeURIComponent(auth)}` : path;
    },
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'badges',
    label: 'Create Badge',
    title: 'POST /groups/:groupId/badges',
    kind: 'api',
    method: 'POST',
    buildPath: (values) => getGroupBadgesPath(String(values.groupId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      name: 'Odznaka Pierwszych Kroków',
      icon: '🏅',
      educationalDescription: 'Przyznawana za ukończenie pierwszego etapu kursu.',
      storyDescription: 'Bohater stawia pierwsze kroki w Akademii Magii...',
      rewardAmount: 50,
      rarity: 'common',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {
        name: String(values.name ?? '').trim(),
        icon: String(values.icon ?? '').trim(),
        educationalDescription: String(values.educationalDescription ?? '').trim(),
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const storyDescription = String(values.storyDescription ?? '').trim();
      if (storyDescription !== '') {
        payload.storyDescription = storyDescription;
      }
      if (values.rewardAmount !== '' && values.rewardAmount !== null && values.rewardAmount !== undefined) {
        payload.rewardAmount = Number(values.rewardAmount);
      }
      if (typeof values.rarity === 'string' && values.rarity.trim() !== '') {
        payload.rarity = values.rarity.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      icon: typeof payload.icon === 'string' ? payload.icon : '',
      educationalDescription:
        typeof payload.educationalDescription === 'string' ? payload.educationalDescription : '',
      storyDescription: typeof payload.storyDescription === 'string' ? payload.storyDescription : '',
      rewardAmount: payload.rewardAmount ?? '',
      rarity: typeof payload.rarity === 'string' ? payload.rarity : 'common',
    }),
    requiredKeysForValues: () => ['name', 'icon', 'educationalDescription'],
    fields: [
      { key: 'groupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name', type: 'text' },
      { key: 'icon', label: 'icon', type: 'text' },
      { key: 'educationalDescription', label: 'educationalDescription', type: 'textarea' },
      { key: 'storyDescription', label: 'storyDescription (optional)', type: 'textarea' },
      { key: 'rewardAmount', label: 'rewardAmount (optional)', type: 'number' },
      {
        key: 'rarity',
        label: 'rarity',
        type: 'select',
        options: [
          { value: 'common', label: 'common (zwykła)' },
          { value: 'uncommon', label: 'uncommon (niezwykła)' },
          { value: 'rare', label: 'rare (rzadka)' },
          { value: 'epic', label: 'epic (epicka)' },
        ],
      },
    ],
  },
  {
    id: 'updateBadge',
    label: 'Update Badge',
    title: 'PATCH /groups/:groupId/badges/:badgeId',
    kind: 'api',
    method: 'PATCH',
    buildPath: (values) =>
      getGroupBadgeByIdPath(String(values.groupId ?? ''), String(values.badgeId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      badgeId: '1',
      name: 'Updated badge name',
      rewardAmount: 75,
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const name = String(values.name ?? '').trim();
      if (name !== '') {
        payload.name = name;
      }
      if (values.rewardAmount !== '' && values.rewardAmount !== null && values.rewardAmount !== undefined) {
        payload.rewardAmount = Number(values.rewardAmount);
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      rewardAmount: payload.rewardAmount ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'badgeId', label: 'Badge ID (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name (optional)', type: 'text' },
      { key: 'rewardAmount', label: 'rewardAmount (optional)', type: 'number' },
    ],
  },
  {
    id: 'deleteBadge',
    label: 'Delete Badge',
    title: 'DELETE /groups/:groupId/badges/:badgeId',
    kind: 'get',
    method: 'DELETE',
    buildPath: (values) =>
      getGroupBadgeByIdPath(String(values.groupId ?? ''), String(values.badgeId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      badgeId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'badgeId', label: 'Badge ID', type: 'number' },
    ],
  },
  {
    id: 'listRanks',
    label: 'List Ranks',
    title: 'GET /groups/:groupId/ranks',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => {
      const path = getGroupRanksPath(String(values.groupId ?? ''));
      const auth = String(values.auth ?? '').trim();
      return auth ? `${path}?auth=${encodeURIComponent(auth)}` : path;
    },
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'ranks',
    label: 'Create Rank',
    title: 'POST /groups/:groupId/ranks',
    kind: 'api',
    method: 'POST',
    buildPath: (values) => getGroupRanksPath(String(values.groupId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      name: 'Adept',
      icon: '⭐',
      requiredPoints: 100,
      storyDescription: 'Adept to ktoś, kto opanował podstawy magii arkanowej.',
      storeDiscount: 5,
      uniqueStoreItemsText: 'Zwój Mądrości\nEliksir Skupienia',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {
        name: String(values.name ?? '').trim(),
        icon: String(values.icon ?? '').trim(),
        requiredPoints: Number(values.requiredPoints) || 0,
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const storyDescription = String(values.storyDescription ?? '').trim();
      if (storyDescription !== '') {
        payload.storyDescription = storyDescription;
      }
      if (values.storeDiscount !== '' && values.storeDiscount !== null && values.storeDiscount !== undefined) {
        payload.storeDiscount = Number(values.storeDiscount);
      }
      const itemsText = String(values.uniqueStoreItemsText ?? '').trim();
      if (itemsText !== '') {
        payload.uniqueStoreItems = itemsText
          .split('\n')
          .map((line) => line.trim())
          .filter((line) => line.length > 0);
      }
      return payload;
    },
    parsePayload: (payload) => {
      let uniqueStoreItemsText = '';
      if (Array.isArray(payload.uniqueStoreItems)) {
        uniqueStoreItemsText = payload.uniqueStoreItems.map(String).join('\n');
      }
      return {
        auth: typeof payload.auth === 'string' ? payload.auth : '',
        name: typeof payload.name === 'string' ? payload.name : '',
        icon: typeof payload.icon === 'string' ? payload.icon : '',
        requiredPoints: payload.requiredPoints ?? 0,
        storyDescription: typeof payload.storyDescription === 'string' ? payload.storyDescription : '',
        storeDiscount: payload.storeDiscount ?? '',
        uniqueStoreItemsText,
      };
    },
    requiredKeysForValues: () => ['name', 'icon', 'requiredPoints'],
    fields: [
      { key: 'groupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name', type: 'text' },
      { key: 'icon', label: 'icon', type: 'text' },
      { key: 'requiredPoints', label: 'requiredPoints', type: 'number' },
      { key: 'storyDescription', label: 'storyDescription (optional)', type: 'textarea' },
      { key: 'storeDiscount', label: 'storeDiscount (optional)', type: 'number' },
      {
        key: 'uniqueStoreItemsText',
        label: 'uniqueStoreItems (optional, one per line)',
        type: 'textarea',
      },
    ],
  },
  {
    id: 'updateRank',
    label: 'Update Rank',
    title: 'PATCH /groups/:groupId/ranks/:rankId',
    kind: 'api',
    method: 'PATCH',
    buildPath: (values) =>
      getGroupRankByIdPath(String(values.groupId ?? ''), String(values.rankId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      rankId: '1',
      name: 'Updated rank name',
      requiredPoints: 150,
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const name = String(values.name ?? '').trim();
      if (name !== '') {
        payload.name = name;
      }
      if (values.requiredPoints !== '' && values.requiredPoints !== null && values.requiredPoints !== undefined) {
        payload.requiredPoints = Number(values.requiredPoints);
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      requiredPoints: payload.requiredPoints ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'rankId', label: 'Rank ID (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name (optional)', type: 'text' },
      { key: 'requiredPoints', label: 'requiredPoints (optional)', type: 'number' },
    ],
  },
  {
    id: 'deleteRank',
    label: 'Delete Rank',
    title: 'DELETE /groups/:groupId/ranks/:rankId',
    kind: 'get',
    method: 'DELETE',
    buildPath: (values) =>
      getGroupRankByIdPath(String(values.groupId ?? ''), String(values.rankId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      rankId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'rankId', label: 'Rank ID', type: 'number' },
    ],
  },

  // ── Student Management ──────────────────────────────────────────

  {
    id: 'smGetStudents',
    label: 'List Students',
    title: 'GET /groups/:groupId/students',
    group: 'Student Management',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => getGroupStudentsPath(String(values.groupId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
    ],
  },
  {
    id: 'smBulkUpdate',
    label: 'Bulk Update',
    title: 'PATCH /groups/:groupId/students/bulk-update',
    kind: 'api',
    method: 'PATCH',
    buildPath: (values) => getGroupStudentsBulkUpdatePath(String(values.groupId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      studentsJson: JSON.stringify([
        { enrollmentId: 1, rankId: 2, currency: 150, totalEarned: 200 },
      ], null, 2),
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      try {
        payload.students = JSON.parse(String(values.studentsJson ?? '[]'));
      } catch {
        payload.students = [];
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      studentsJson: Array.isArray(payload.students)
        ? JSON.stringify(payload.students, null, 2)
        : '[]',
    }),
    requiredKeysForValues: () => ['students'],
    fields: [
      { key: 'groupId', label: 'Group ID (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'studentsJson', label: 'students (JSON array)', type: 'textarea' },
    ],
  },
  {
    id: 'smDeleteStudent',
    label: 'Delete Student',
    title: 'DELETE /groups/:groupId/students/:accountId',
    kind: 'get',
    method: 'DELETE',
    buildPath: (values) => getGroupStudentDeletePath(String(values.groupId ?? ''), String(values.accountId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      accountId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'accountId', label: 'Account ID', type: 'number' },
    ],
  },

  {
    id: 'smGetBadges',
    label: 'Student Badges',
    title: 'GET /groups/:groupId/students/:accountId/badges',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => getGroupStudentBadgesPath(String(values.groupId ?? ''), String(values.accountId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      accountId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'accountId', label: 'Account ID', type: 'number' },
    ],
  },
  {
    id: 'smToggleBadge',
    label: 'Toggle Badge',
    title: 'POST /groups/:groupId/students/:accountId/badges/:badgeId/toggle',
    kind: 'get',
    method: 'POST',
    buildPath: (values) => getGroupStudentBadgeTogglePath(
      String(values.groupId ?? ''),
      String(values.accountId ?? ''),
      String(values.badgeId ?? ''),
    ),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      accountId: '1',
      badgeId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'accountId', label: 'Account ID', type: 'number' },
      { key: 'badgeId', label: 'Badge ID', type: 'number' },
    ],
  },

  {
    id: 'smGetProgress',
    label: 'Student Progress',
    title: 'GET /groups/:groupId/students/:accountId/progress',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => getGroupStudentProgressPath(String(values.groupId ?? ''), String(values.accountId ?? '')),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      accountId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'accountId', label: 'Account ID', type: 'number' },
    ],
  },
  {
    id: 'smToggleActivity',
    label: 'Toggle Activity',
    title: 'POST /groups/:groupId/students/:accountId/activities/:activityId/toggle',
    kind: 'get',
    method: 'POST',
    buildPath: (values) => getGroupStudentActivityTogglePath(
      String(values.groupId ?? ''),
      String(values.accountId ?? ''),
      String(values.activityId ?? ''),
    ),
    needsBrowserId: false,
    defaultValues: () => ({
      groupId: '100001',
      accountId: '1',
      activityId: '1',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'accountId', label: 'Account ID', type: 'number' },
      { key: 'activityId', label: 'Activity ID', type: 'number' },
    ],
  },

  // ── Profile Settings ────────────────────────────────────────────

  {
    id: 'profileGetMe',
    label: 'Get Profile',
    title: 'GET /profile',
    group: 'Profile Settings',
    kind: 'get',
    method: 'GET',
    buildPath: () => PROFILE_PATH,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
    }),
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'profileGetAvatars',
    label: 'Get Avatars',
    title: 'GET /profile/avatars',
    kind: 'get',
    method: 'GET',
    buildPath: () => PROFILE_AVATARS_PATH,
    needsBrowserId: false,
    defaultValues: () => ({}),
    fields: [],
  },
  {
    id: 'profileUpdateSettings',
    label: 'Update Profile',
    title: 'PATCH /profile/settings',
    kind: 'api',
    method: 'PATCH',
    buildPath: () => PROFILE_SETTINGS_PATH,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      nickname: 'SuperStudent',
      avatarId: 2,
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      const nickname = String(values.nickname ?? '').trim();
      if (nickname !== '') {
        payload.nickname = nickname;
      }
      if (values.avatarId !== '' && values.avatarId !== null && values.avatarId !== undefined) {
        payload.avatarId = Number(values.avatarId);
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      nickname: typeof payload.nickname === 'string' ? payload.nickname : '',
      avatarId: payload.avatarId ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'nickname', label: 'nickname (optional)', type: 'text' },
      { key: 'avatarId', label: 'avatarId (optional)', type: 'number' },
    ],
  },
  {
    id: 'getShopTemplates',
    label: 'Get Shop Templates',
    title: 'GET /shop-templates',
    group: 'Shop Items',
    kind: 'get',
    method: 'GET',
    buildPath: () => '/shop-templates',
    needsBrowserId: false,
    defaultValues: () => ({}),
    fields: [],
  },
  {
    id: 'getShopItems',
    label: 'Get Shop Items',
    title: 'GET /groups/:groupId/shop-items',
    kind: 'get',
    method: 'GET',
    buildPath: (values) => {
      const path = `/groups/${String(values.groupId ?? '').trim()}/shop-items`;
      const auth = String(values.auth ?? '').trim();
      return auth ? `${path}?auth=${encodeURIComponent(auth)}` : path;
    },
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    fields: [
      { key: 'groupId', label: 'Group ID (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'createShopItem',
    label: 'Create Shop Item',
    title: 'POST /groups/:groupId/shop-items',
    kind: 'api',
    method: 'POST',
    buildPath: (values) => `/groups/${String(values.groupId ?? '').trim()}/shop-items`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      name: 'Magiczny napój',
      storyDescription: 'Regeneruje 5 punktów many.',
      educationalDescription: 'Pozwala na ponowne podejście do testu.',
      imageRef: '',
      categoryId: '',
      basePrice: '5',
      stockQuantity: '',
      perStudentLimit: '1',
    }),
    buildPayload: (values) => {
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      payload.name = String(values.name ?? '').trim();
      if (typeof values.storyDescription === 'string' && values.storyDescription.trim() !== '') payload.storyDescription = values.storyDescription.trim();
      if (typeof values.educationalDescription === 'string' && values.educationalDescription.trim() !== '') payload.educationalDescription = values.educationalDescription.trim();
      if (typeof values.imageRef === 'string' && values.imageRef.trim() !== '') payload.imageRef = values.imageRef.trim();
      if (values.categoryId !== '' && values.categoryId !== null && values.categoryId !== undefined) payload.categoryId = Number(values.categoryId);
      if (values.basePrice !== '' && values.basePrice !== null && values.basePrice !== undefined) payload.basePrice = Number(values.basePrice);
      if (values.stockQuantity !== '' && values.stockQuantity !== null && values.stockQuantity !== undefined) payload.stockQuantity = Number(values.stockQuantity);
      if (values.perStudentLimit !== '' && values.perStudentLimit !== null && values.perStudentLimit !== undefined) payload.perStudentLimit = Number(values.perStudentLimit);
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      storyDescription: typeof payload.storyDescription === 'string' ? payload.storyDescription : '',
      educationalDescription: typeof payload.educationalDescription === 'string' ? payload.educationalDescription : '',
      imageRef: typeof payload.imageRef === 'string' ? payload.imageRef : '',
      categoryId: payload.categoryId ?? '',
      basePrice: payload.basePrice ?? '',
      stockQuantity: payload.stockQuantity ?? '',
      perStudentLimit: payload.perStudentLimit ?? '',
    }),
    requiredKeysForValues: () => ['name', 'basePrice'],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name', type: 'text' },
      { key: 'storyDescription', label: 'storyDescription', type: 'textarea' },
      { key: 'educationalDescription', label: 'educationalDescription', type: 'textarea' },
      { key: 'imageRef', label: 'imageRef', type: 'text' },
      { key: 'categoryId', label: 'categoryId (optional)', type: 'number' },
      { key: 'basePrice', label: 'basePrice', type: 'number' },
      { key: 'stockQuantity', label: 'stockQuantity (optional)', type: 'number' },
      { key: 'perStudentLimit', label: 'perStudentLimit (optional)', type: 'number' },
    ],
  },
  {
    id: 'createShopItemFromTemplate',
    label: 'Create Item From Template',
    title: 'POST /groups/:groupId/shop-items/from-template',
    kind: 'api',
    method: 'POST',
    buildPath: (values) => `/groups/${String(values.groupId ?? '').trim()}/shop-items/from-template`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      templateId: '1',
      categoryId: '',
      basePrice: '',
      stockQuantity: '',
      perStudentLimit: '',
    }),
    buildPayload: (values) => {
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      payload.templateId = Number(values.templateId);
      if (values.categoryId !== '' && values.categoryId !== null && values.categoryId !== undefined) payload.categoryId = Number(values.categoryId);
      if (values.basePrice !== '' && values.basePrice !== null && values.basePrice !== undefined) payload.basePrice = Number(values.basePrice);
      if (values.stockQuantity !== '' && values.stockQuantity !== null && values.stockQuantity !== undefined) payload.stockQuantity = Number(values.stockQuantity);
      if (values.perStudentLimit !== '' && values.perStudentLimit !== null && values.perStudentLimit !== undefined) payload.perStudentLimit = Number(values.perStudentLimit);
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      templateId: payload.templateId ?? '',
      categoryId: payload.categoryId ?? '',
      basePrice: payload.basePrice ?? '',
      stockQuantity: payload.stockQuantity ?? '',
      perStudentLimit: payload.perStudentLimit ?? '',
    }),
    requiredKeysForValues: () => ['templateId'],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'templateId', label: 'templateId', type: 'number' },
      { key: 'categoryId', label: 'categoryId (optional)', type: 'number' },
      { key: 'basePrice', label: 'basePrice (optional)', type: 'number' },
      { key: 'stockQuantity', label: 'stockQuantity (optional)', type: 'number' },
      { key: 'perStudentLimit', label: 'perStudentLimit (optional)', type: 'number' },
    ],
  },
  {
    id: 'updateShopItem',
    label: 'Update Shop Item',
    title: 'PATCH /groups/:groupId/shop-items/:itemId',
    kind: 'api',
    method: 'PATCH',
    buildPath: (values) => `/groups/${String(values.groupId ?? '').trim()}/shop-items/${String(values.itemId ?? '').trim()}`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      itemId: '1',
      name: '',
      storyDescription: '',
      educationalDescription: '',
      imageRef: '',
      categoryId: '',
      basePrice: '',
      stockQuantity: '',
      perStudentLimit: '',
    }),
    buildPayload: (values) => {
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      if (typeof values.name === 'string' && values.name.trim() !== '') payload.name = values.name.trim();
      if (typeof values.storyDescription === 'string' && values.storyDescription.trim() !== '') payload.storyDescription = values.storyDescription.trim();
      if (typeof values.educationalDescription === 'string' && values.educationalDescription.trim() !== '') payload.educationalDescription = values.educationalDescription.trim();
      if (typeof values.imageRef === 'string' && values.imageRef.trim() !== '') payload.imageRef = values.imageRef.trim();
      if (values.categoryId !== '' && values.categoryId !== null && values.categoryId !== undefined) payload.categoryId = Number(values.categoryId);
      if (values.basePrice !== '' && values.basePrice !== null && values.basePrice !== undefined) payload.basePrice = Number(values.basePrice);
      if (values.stockQuantity !== '' && values.stockQuantity !== null && values.stockQuantity !== undefined) payload.stockQuantity = Number(values.stockQuantity);
      if (values.perStudentLimit !== '' && values.perStudentLimit !== null && values.perStudentLimit !== undefined) payload.perStudentLimit = Number(values.perStudentLimit);
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      name: typeof payload.name === 'string' ? payload.name : '',
      storyDescription: typeof payload.storyDescription === 'string' ? payload.storyDescription : '',
      educationalDescription: typeof payload.educationalDescription === 'string' ? payload.educationalDescription : '',
      imageRef: typeof payload.imageRef === 'string' ? payload.imageRef : '',
      categoryId: payload.categoryId ?? '',
      basePrice: payload.basePrice ?? '',
      stockQuantity: payload.stockQuantity ?? '',
      perStudentLimit: payload.perStudentLimit ?? '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'itemId', label: 'itemId (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
      { key: 'name', label: 'name (optional)', type: 'text' },
      { key: 'storyDescription', label: 'storyDescription (optional)', type: 'textarea' },
      { key: 'educationalDescription', label: 'educationalDescription (optional)', type: 'textarea' },
      { key: 'imageRef', label: 'imageRef (optional)', type: 'text' },
      { key: 'categoryId', label: 'categoryId (optional)', type: 'number' },
      { key: 'basePrice', label: 'basePrice (optional)', type: 'number' },
      { key: 'stockQuantity', label: 'stockQuantity (optional)', type: 'number' },
      { key: 'perStudentLimit', label: 'perStudentLimit (optional)', type: 'number' },
    ],
  },
  {
    id: 'deleteShopItem',
    label: 'Delete Shop Item',
    title: 'DELETE /groups/:groupId/shop-items/:itemId',
    kind: 'api',
    method: 'DELETE',
    buildPath: (values) => `/groups/${String(values.groupId ?? '').trim()}/shop-items/${String(values.itemId ?? '').trim()}`,
    needsBrowserId: false,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
      itemId: '1',
    }),
    buildPayload: (values) => {
      const payload = {};
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
    }),
    requiredKeysForValues: () => [],
    fields: [
      { key: 'groupId', label: 'groupId (public, URL path)', type: 'number' },
      { key: 'itemId', label: 'itemId (URL path)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  }
];

/**
 * @param {string} sectionId
 * @returns {ApiTestSection | undefined}
 */
export function findSection(sectionId) {
  return API_TEST_SECTIONS.find((section) => section.id === sectionId);
}
