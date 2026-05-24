import {
  ACTIVITIES_PATH,
  DRIVE_PATH,
  getGroupBadgesPath,
  getGroupEnrollPath,
  getGroupInvitePath,
  getGroupRanksPath,
  GROUPS_GENERATE_CODE_PATH,
  GROUPS_NEW_PATH,
  STAGES_PATH,
} from './mock/mockConstants.js';
import {
  SMOKE_TEST_DEFAULT_CURRENCY_ICON,
  SMOKE_TEST_DEFAULT_LIFE_ICON,
} from './mock/mockConstants.js';

/** @typedef {'login' | 'api' | 'multipart'} ApiTestSectionKind */

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
    id: 'enroll',
    label: 'Group enroll',
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
      'Requires public groupId in the URL and a matching 6-character entry code. Same response shape as Group enroll: enrollmentId (-1 = not authorized, -2 = invalid group/code, -3 = DB error), groupId on success.',
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
      code: 'ABCDEF',
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
      { key: 'code', label: 'code (query, 6 chars)', type: 'text' },
      { key: 'auth', label: 'auth (optional query / cookie)', type: 'textarea' },
    ],
  },
  {
    id: 'generateCode',
    label: 'Generate code',
    title: 'POST /groups/generate-code (Lecturer)',
    kind: 'api',
    method: 'POST',
    hint:
      'Lecturer only. Generates a 6-character code and saves it to education.groups.entry_code for the given group. Response groupId: -1 = not authorized, -2 = group not found, -3 = DB error.',
    buildPath: () => GROUPS_GENERATE_CODE_PATH,
    needsBrowserId: true,
    defaultValues: () => ({
      auth: '',
      groupId: '100001',
    }),
    buildPayload: (values) => {
      /** @type {Record<string, unknown>} */
      const payload = {
        groupId: Number(values.groupId),
      };
      if (typeof values.auth === 'string' && values.auth.trim() !== '') {
        payload.auth = values.auth.trim();
      }
      return payload;
    },
    parsePayload: (payload) => ({
      auth: typeof payload.auth === 'string' ? payload.auth : '',
      groupId: payload.groupId ?? '',
    }),
    requiredKeysForValues: () => ['groupId'],
    fields: [
      { key: 'groupId', label: 'groupId (public)', type: 'number' },
      { key: 'auth', label: 'auth (optional if cookie set)', type: 'textarea' },
    ],
  },
  {
    id: 'drive',
    label: 'Drive',
    title: 'POST /drive (multipart)',
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
    id: 'badges',
    label: 'Badges',
    title: 'POST /groups/:id/badges',
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
    ],
  },
  {
    id: 'ranks',
    label: 'Ranks',
    title: 'POST /groups/:id/ranks',
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
];

/**
 * @param {string} sectionId
 * @returns {ApiTestSection | undefined}
 */
export function findSection(sectionId) {
  return API_TEST_SECTIONS.find((section) => section.id === sectionId);
}
