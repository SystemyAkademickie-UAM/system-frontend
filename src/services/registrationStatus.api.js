import { getJson } from './api-client.js';
import { AUTH_LOGIN_REGISTRATION_STATUS_PATH } from '../constants/authPaths.constants.js';
import {
  LOGIN_FLOW_STEP_EULA,
  LOGIN_FLOW_STEP_REGISTER,
} from '../constants/loginFlow.constants.js';

/**
 * @typedef {Object} RegistrationStatus
 * @property {number} [userId]
 * @property {string} [email]
 * @property {string} [nickname]
 * @property {number} [avatarId]
 * @property {boolean} [registrationCompleted]
 * @property {boolean} [eulaAccepted]
 */

/**
 * @returns {Promise<RegistrationStatus | null>}
 */
export async function fetchRegistrationStatus() {
  const result = await getJson(AUTH_LOGIN_REGISTRATION_STATUS_PATH);
  if (!result.ok || !result.data || typeof result.data !== 'object') {
    return null;
  }
  return /** @type {RegistrationStatus} */ (result.data);
}

/**
 * @param {RegistrationStatus | null | undefined} status
 * @returns {boolean}
 */
export function isRegistrationComplete(status) {
  return status?.registrationCompleted === true && status?.eulaAccepted === true;
}

/**
 * @param {RegistrationStatus | null | undefined} status
 * @returns {string}
 */
export function resolveRegistrationWizardStep(status) {
  if (!status?.registrationCompleted) {
    return LOGIN_FLOW_STEP_REGISTER;
  }
  if (!status.eulaAccepted) {
    return LOGIN_FLOW_STEP_EULA;
  }
  return LOGIN_FLOW_STEP_REGISTER;
}
