/**
 * Ścieżki względne do plików SVG w public/assets/svg/.
 * Używaj z AssetSvg: <AssetSvg name={SVG_ICONS.actions.add} />
 */

/** @typedef {string} SvgAssetPath */

export const SVG_ICONS = {
  shared: {
    placeholder: 'shared/placeholder.svg',
  },
  actions: {
    add: 'actions/add.svg',
    assign: 'actions/assign.svg',
    grant: 'actions/grant.svg',
    delete: 'actions/delete.svg',
    manageBadges: 'actions/manage-badges.svg',
    manageProgress: 'actions/manage-progress.svg',
  },
  controls: {
    close: 'controls/close.svg',
    search: 'controls/search.svg',
    more: 'controls/more.svg',
    chevronLeft: 'controls/chevron-left.svg',
    chevronRight: 'controls/chevron-right.svg',
  },
  content: {
    star: 'content/star.svg',
    money: 'content/money.svg',
    settings: 'content/settings.svg',
    user: 'content/user.svg',
  },
  status: {
    check: 'status/check.svg',
    lock: 'status/lock.svg',
    checkCircle: 'status/check-circle.svg',
    info: 'status/info.svg',
  },
  nav: {
    home: 'nav/home.svg',
    profile: 'nav/profile.svg',
    shop: 'nav/shop.svg',
    ranking: 'nav/ranking.svg',
    settings: 'nav/settings.svg',
    users: 'nav/users.svg',
    activity: 'nav/activity.svg',
    posts: 'nav/posts.svg',
    rewards: 'nav/rewards.svg',
    groupSettings: 'nav/group-settings.svg',
    groups: 'nav/groups.svg',
    stats: 'nav/stats.svg',
    organization: 'nav/organization.svg',
    courses: 'nav/courses.svg',
    logout: 'nav/logout.svg',
  },
};

/** Domyślny placeholder — jedyny plik zastępczy w całej aplikacji. */
export const SVG_PLACEHOLDER = SVG_ICONS.shared.placeholder;
