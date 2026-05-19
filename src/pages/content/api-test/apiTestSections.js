import {
  ACTIVITIES_PATH,
  DRIVE_PATH,
  getGroupEnrollPath,
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
 */

/** @type {ApiTestSection[]} */
export const API_TEST_SECTIONS = [
  {
    id: 'login',
    label: 'Login',
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
    label: 'Force enroll',
    title: 'POST /groups/:id/enroll (Student)',
    kind: 'api',
    method: 'POST',
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
];

/**
 * @param {string} sectionId
 * @returns {ApiTestSection | undefined}
 */
export function findSection(sectionId) {
  return API_TEST_SECTIONS.find((section) => section.id === sectionId);
}
