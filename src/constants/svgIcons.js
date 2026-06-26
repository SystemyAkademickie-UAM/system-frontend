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
    copy: 'actions/copy.svg',
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
    /** Domek w breadcrumb SuperBar — nie używać w sidebarze. */
    breadcrumbHome: 'nav/breadcrumb-home.svg',
    /** Legacy alias; preferuj breadcrumbHome w breadcrumb. */
    home: 'nav/breadcrumb-home.svg',
    /** Siatka „Strona główna” w sidebarze (student / prowadzący). */
    groupMain: 'nav/group-main.svg',
    notifications: 'nav/notifications.svg',
    profile: 'nav/profile.svg',
    profileBadges: 'nav/profile-badges.svg',
    profileInventory: 'nav/profile-inventory.svg',
    shop: 'nav/shop.svg',
    ranking: 'nav/ranking.svg',
    settings: 'nav/settings.svg',
    users: 'nav/users.svg',
    members: 'nav/members.svg',
    accessCodes: 'nav/access-codes.svg',
    activity: 'nav/activity.svg',
    stages: 'nav/stages.svg',
    reports: 'nav/reports.svg',
    posts: 'nav/posts.svg',
    rewards: 'nav/rewards.svg',
    badges: 'nav/badges.svg',
    ranks: 'nav/ranks.svg',
    groupSettings: 'nav/group-settings.svg',
    currency: 'nav/currency.svg',
    lives: 'nav/lives.svg',
    groups: 'nav/groups.svg',
    stats: 'nav/stats.svg',
    organization: 'nav/organization.svg',
    courses: 'nav/courses.svg',
    logout: 'nav/logout.svg',
  },
};

/** Domyślny placeholder — jedyny plik zastępczy w całej aplikacji. */
export const SVG_PLACEHOLDER = SVG_ICONS.shared.placeholder;
