export const LOGIN_FLOW_STEP_PIONIER = 'pionier';
export const LOGIN_FLOW_STEP_INSTITUTION = 'institution';
export const LOGIN_FLOW_STEP_REGISTER = 'register';
export const LOGIN_FLOW_STEP_EULA = 'eula';

/** Wizard order for slide transitions on `/login`. */
export const LOGIN_FLOW_STEP_ORDER = {
  [LOGIN_FLOW_STEP_PIONIER]: 0,
  [LOGIN_FLOW_STEP_INSTITUTION]: 1,
  [LOGIN_FLOW_STEP_REGISTER]: 2,
  [LOGIN_FLOW_STEP_EULA]: 3,
};
