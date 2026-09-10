export const LOGIN_FLOW_STEP_PIONIER = 'pionier';
export const LOGIN_FLOW_STEP_EMAIL = 'email';
export const LOGIN_FLOW_STEP_INSTITUTION = 'institution';
export const LOGIN_FLOW_STEP_REGISTER = 'register';
export const LOGIN_FLOW_STEP_AVATAR = 'avatar';
export const LOGIN_FLOW_STEP_SETTINGS = 'settings';
export const LOGIN_FLOW_STEP_EULA = 'settings';

/** Wizard order for slide transitions on `/login`. */
export const LOGIN_FLOW_STEP_ORDER = {
  [LOGIN_FLOW_STEP_PIONIER]: 0,
  [LOGIN_FLOW_STEP_EMAIL]: 1,
  [LOGIN_FLOW_STEP_INSTITUTION]: 1,
  [LOGIN_FLOW_STEP_REGISTER]: 2,
  [LOGIN_FLOW_STEP_AVATAR]: 3,
  [LOGIN_FLOW_STEP_SETTINGS]: 4,
};

