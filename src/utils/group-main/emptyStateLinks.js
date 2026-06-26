import { groupActivitiesPath, groupRewardsPath, groupRewardsRanksPath } from '../../routes/pathRegistry.js';
import { APP_ROLE } from '../../navigation/shellTemplates.config.js';

export const GROUP_MAIN_EMPTY_LINKS = {
  ranks: {
    message: 'Nie dodano jeszcze rang.',
    studentMessage: 'Nie dodano jeszcze rang w tej grupie.',
    linkLabel: 'Dodaj je w systemie nagród',
    path: groupRewardsRanksPath,
  },
  badges: {
    message: 'Nie dodano jeszcze odznak.',
    studentMessage: 'Nie dodano jeszcze odznak w tej grupie.',
    linkLabel: 'Dodaj je w systemie nagród',
    path: groupRewardsPath,
  },
  activities: {
    message: 'Nie dodano jeszcze aktywności.',
    studentMessage: 'Nie dodano jeszcze aktywności w tej grupie.',
    linkLabel: 'Dodaj je w module aktywności',
    path: groupActivitiesPath,
  },
};

/**
 * @param {string} role
 * @param {typeof GROUP_MAIN_EMPTY_LINKS[keyof typeof GROUP_MAIN_EMPTY_LINKS]} linkConfig
 * @param {string} groupId
 */
export function resolveGroupMainEmptyLinkForRole(role, linkConfig, groupId) {
  if (role === APP_ROLE.STUDENT) {
    return {
      message: linkConfig.studentMessage ?? linkConfig.message,
      linkLabel: null,
      linkTo: null,
    };
  }

  return {
    message: linkConfig.message,
    linkLabel: linkConfig.linkLabel,
    linkTo: linkConfig.path(groupId),
  };
}
