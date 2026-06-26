/**
 * Szablony nawigacji (widoki) — pojedyncze miejsce do definiowania przycisków paska bocznego per rola.
 *
 * Jak dodać nową pozycję we „widoku Studenta":
 * 1. Dodaj wpis do tablicy `studentView.primaryNavItems` (lub ctaItems / footerItems).
 * 2. Jeśli to nowy adres — dopisz funkcję w `pathRegistry.js` oraz klucz w `HREF_BUILDERS`.
 * 3. Zarejestruj stronę w `routeTable.js` i `createAppRouter.jsx`.
 *
 * Pola wpisu:
 * - id: stabilny identyfikator (telemetria, testy).
 * - enabled: false — przycisk ukryty bez usuwania konfiguracji.
 * - requiresGroup: true — widoczny dopiero po wyborze grupy (ścieżka /groups/:groupId/...).
 * - hrefKey: klucz z HREF_BUILDERS (oprócz kind === 'logout').
 * - kind: 'navlink' | 'cta' | 'logout' | 'spacer' | 'unavailable' | 'tree-item' | 'tree-group' | 'tree-expandable'
 * - matchEnd: przekazywane do NavLink `end` (np. lista grup).
 * - visibleFor: tablica ról dla których element jest widoczny (puste = wszystkie)
 */
import * as paths from '../routes/pathRegistry.js';

export const APP_ROLE = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

export const ROLE_UI_LABEL = {
  [APP_ROLE.STUDENT]: 'Student',
  [APP_ROLE.LECTURER]: 'Prowadzący',
  [APP_ROLE.ADMIN]: 'Administrator',
  [APP_ROLE.SUPERADMIN]: 'Superadministrator',
};

/** Buduje href na podstawie kontekstu (groupId z URL). */
export const HREF_BUILDERS = {
  // Lista grup
  GROUPS_LIST: () => paths.groupsListPath(),

  // Ekran główny
  GROUP_MAIN: (ctx) => (ctx.groupId ? paths.groupMainPath(ctx.groupId) : null),

  // Student — płaskie trasy (poza /home)
  GROUP_STUDENT_FEED: (ctx) => (ctx.groupId ? paths.groupStudentPostsPath(ctx.groupId) : null),
  GROUP_STUDENT_PARTICIPANTS: (ctx) =>
    ctx.groupId ? paths.groupStudentUsersPath(ctx.groupId) : null,
  GROUP_STUDENT_ACTIVITY_LIST: (ctx) =>
    ctx.groupId ? paths.groupStudentActivityListPath(ctx.groupId) : null,
  GROUP_STUDENT_RANKS: (ctx) => (ctx.groupId ? paths.groupStudentRanksPath(ctx.groupId) : null),
  GROUP_STUDENT_BADGES: (ctx) => (ctx.groupId ? paths.groupStudentBadgesPath(ctx.groupId) : null),

  // Profil studenta + podstrony
  GROUP_PROFILE: (ctx) => (ctx.groupId ? paths.groupProfilePath(ctx.groupId) : null),
  GROUP_STUDENT_PROFILE: (ctx) =>
    ctx.groupId && ctx.studentId ? paths.groupStudentProfilePath(ctx.groupId, ctx.studentId) : null,
  GROUP_PROFILE_LOG: (ctx) => (ctx.groupId ? paths.groupProfileActivityPath(ctx.groupId) : null),
  GROUP_PROFILE_EQ: (ctx) => (ctx.groupId ? paths.groupProfileEqPath(ctx.groupId) : null),

  // Użytkownicy (lecturer) + podstrony
  GROUP_MEMBERS: (ctx) => (ctx.groupId ? paths.groupMembersPath(ctx.groupId) : null),
  GROUP_MEMBERS_LOG: (ctx) => (ctx.groupId ? paths.groupMembersLogPath(ctx.groupId) : null),
  GROUP_MEMBERS_CODE: (ctx) => (ctx.groupId ? paths.groupMembersCodesPath(ctx.groupId) : null),

  // Korzeń grupy
  GROUP_ROOT: (ctx) => (ctx.groupId ? paths.groupRootPath(ctx.groupId) : null),

  // Aktywności (lecturer) + podstrony
  GROUP_ACTIVITIES: (ctx) => (ctx.groupId ? paths.groupActivitiesPath(ctx.groupId) : null),
  GROUP_ACTIVITIES_TOOLS: (ctx) => (ctx.groupId ? paths.groupActivitiesToolsPath(ctx.groupId) : null),

  // Wpisy (lecturer)
  GROUP_POSTS: (ctx) => (ctx.groupId ? paths.groupPostsPath(ctx.groupId) : null),

  // Systemy nagród (lecturer) + podstrony
  GROUP_REWARDS: (ctx) => (ctx.groupId ? paths.groupRewardsPath(ctx.groupId) : null),
  GROUP_REWARDS_BADGES: (ctx) => (ctx.groupId ? paths.groupRewardsPath(ctx.groupId) : null),
  GROUP_REWARDS_RANKS: (ctx) => (ctx.groupId ? paths.groupRewardsRanksPath(ctx.groupId) : null),
  GROUP_SHOP_ITEMS: (ctx) => (ctx.groupId ? paths.groupShopItemsPath(ctx.groupId) : null),

  // Ustawienia grupy (lecturer) + podstrony
  GROUP_SETTINGS: (ctx) => (ctx.groupId ? paths.groupSettingsPath(ctx.groupId) : null),
  GROUP_SETTINGS_CURRENCY: (ctx) => (ctx.groupId ? paths.groupSettingsCurrencyPath(ctx.groupId) : null),
  GROUP_SETTINGS_HEALTH: (ctx) => (ctx.groupId ? paths.groupSettingsHealthPath(ctx.groupId) : null),

  // Sklep
  GROUP_SHOP: (ctx) => (ctx.groupId ? paths.groupShopPath(ctx.groupId) : null),
  GROUP_SHOP_ADD: (ctx) => (ctx.groupId ? paths.groupShopAddPath(ctx.groupId) : null),

  // Ranking + podstrony
  GROUP_RANKING: (ctx) => (ctx.groupId ? paths.groupRankingPath(ctx.groupId) : null),
  GROUP_RANKING_GROUP: (ctx) => (ctx.groupId ? paths.groupRankingGroupPath(ctx.groupId) : null),
  GROUP_RANKING_ACTIVITIES: (ctx) => (ctx.groupId ? paths.groupRankingActivitiesPath(ctx.groupId) : null),

  // App-level
  APP_SETTINGS: () => paths.appSettingsPath(),
  USER_MANAGEMENT: () => paths.userManagementPath(),
  COURSE_MANAGEMENT: () => paths.courseManagementPath(),
  STATISTICS: () => paths.statisticsPath(),
  ORG_MANAGEMENT: () => paths.organizationsPath(),
  TEMPLATES_MY: () => paths.templatesPath(),
  TEMPLATES_GALLERY: () => paths.templatesGalleryPath(),

  // Legacy
  GROUP_CONTROL_PANEL: (ctx) => (ctx.groupId ? paths.groupControlPath(ctx.groupId) : null),
};

// ============================================================================
// STUDENT VIEW
// ============================================================================

const studentView = {
  ctaItems: [
    {
      id: 'twoje-kursy',
      enabled: true,
      kind: 'cta',
      label: 'Twoje grupy',
      hrefKey: 'GROUPS_LIST',
      requiresGroup: false,
      matchEnd: true,
    },
  ],
  primaryNavItems: [
    {
      id: 'strona-glowna',
      enabled: true,
      kind: 'navlink',
      label: 'Strona Główna',
      iconId: 'nav/group-main',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'wpisy',
      enabled: true,
      kind: 'navlink',
      label: 'Wpisy',
      iconId: 'nav/posts',
      hrefKey: 'GROUP_STUDENT_FEED',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'profil',
      enabled: true,
      kind: 'tree-group',
      label: 'Profil',
      iconId: 'nav/profile',
      requiresGroup: true,
      children: [
        {
          id: 'profil-odznaki',
          enabled: true,
          kind: 'tree-item',
          label: 'Zdobyte odznaki',
          iconId: 'nav/profile-badges',
          hrefKey: 'GROUP_PROFILE',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'profil-aktywnosci',
          enabled: true,
          kind: 'tree-item',
          label: 'Dziennik aktywności',
          iconId: 'nav/activity',
          hrefKey: 'GROUP_PROFILE_LOG',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'profil-ekwipunek',
          enabled: true,
          kind: 'tree-item',
          label: 'Ekwipunek',
          iconId: 'nav/profile-inventory',
          hrefKey: 'GROUP_PROFILE_EQ',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'lista-aktywnosci',
      enabled: true,
      kind: 'navlink',
      label: 'Lista aktywności',
      iconId: 'nav/activity',
      hrefKey: 'GROUP_STUDENT_ACTIVITY_LIST',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'odznaki',
      enabled: true,
      kind: 'navlink',
      label: 'Odznaki',
      iconId: 'nav/badges',
      hrefKey: 'GROUP_STUDENT_BADGES',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'rangi',
      enabled: true,
      kind: 'navlink',
      label: 'Rangi',
      iconId: 'nav/ranks',
      hrefKey: 'GROUP_STUDENT_RANKS',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'sklep',
      enabled: true,
      kind: 'navlink',
      label: 'Sklep',
      iconId: 'nav/shop',
      hrefKey: 'GROUP_SHOP',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'student-nav-spacer-1',
      enabled: true,
      kind: 'spacer',
    },
    {
      id: 'uczestnicy',
      enabled: true,
      kind: 'navlink',
      label: 'Uczestnicy',
      iconId: 'nav/users',
      hrefKey: 'GROUP_STUDENT_PARTICIPANTS',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'student-nav-spacer-2',
      enabled: true,
      kind: 'spacer',
    },
    {
      id: 'student-nav-spacer-3',
      enabled: true,
      kind: 'spacer',
    },
    {
      id: 'ranking',
      enabled: true,
      kind: 'unavailable',
      label: 'Ranking',
      iconId: 'nav/ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
      clickable: true,
      hint: 'Ranking — funkcja w przygotowaniu.',
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: 'Ustawienia',
      iconId: 'nav/settings',
      hrefKey: 'APP_SETTINGS',
      requiresGroup: false,
      matchEnd: true,
    },
  ],
};

// ============================================================================
// LECTURER VIEW - Zupełnie nowe menu
// ============================================================================

const lecturerView = {
  ctaItems: [
    {
      id: 'twoje-kursy',
      enabled: true,
      kind: 'cta',
      label: 'Twoje grupy',
      hrefKey: 'GROUPS_LIST',
      requiresGroup: false,
      matchEnd: true,
    },
  ],
  primaryNavItems: [
    {
      id: 'strona-glowna',
      enabled: true,
      kind: 'navlink',
      label: 'Strona Główna',
      iconId: 'nav/group-main',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'uzytkownicy',
      enabled: true,
      kind: 'tree-group',
      label: 'Użytkownicy',
      iconId: 'nav/users',
      requiresGroup: true,
      children: [
        {
          id: 'uzytkownicy-uczestnicy',
          enabled: true,
          kind: 'tree-item',
          label: 'Uczestnicy',
          iconId: 'nav/members',
          hrefKey: 'GROUP_MEMBERS',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'uzytkownicy-log',
          enabled: true,
          kind: 'tree-item',
          label: 'Dziennik aktywności',
          iconId: 'nav/activity',
          hrefKey: 'GROUP_MEMBERS_LOG',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'uzytkownicy-kody',
          enabled: true,
          kind: 'tree-item',
          label: 'Kody dostępu',
          iconId: 'nav/access-codes',
          hrefKey: 'GROUP_MEMBERS_CODE',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'aktywnosci',
      enabled: true,
      kind: 'tree-group',
      label: 'Aktywności',
      iconId: 'nav/activity',
      requiresGroup: true,
      children: [
        {
          id: 'aktywnosci-etapy',
          enabled: true,
          kind: 'tree-item',
          label: 'Etapy',
          iconId: 'nav/activity',
          hrefKey: 'GROUP_ACTIVITIES',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'aktywnosci-wpisy',
          enabled: true,
          kind: 'tree-item',
          label: 'Wpisy',
          iconId: 'nav/posts',
          hrefKey: 'GROUP_POSTS',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'aktywnosci-raporty',
          enabled: true,
          kind: 'tree-item',
          label: 'Raporty',
          iconId: 'nav/reports',
          hrefKey: 'GROUP_ACTIVITIES_TOOLS',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'systemy-nagrod',
      enabled: true,
      kind: 'tree-group',
      label: 'Systemy nagród',
      iconId: 'nav/rewards',
      requiresGroup: true,
      children: [
        {
          id: 'nagrody-odznaki',
          enabled: true,
          kind: 'tree-item',
          label: 'Odznaki',
          iconId: 'nav/badges',
          hrefKey: 'GROUP_REWARDS',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'nagrody-rangi',
          enabled: true,
          kind: 'tree-item',
          label: 'Rangi',
          iconId: 'nav/ranks',
          hrefKey: 'GROUP_REWARDS_RANKS',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'nagrody-przedmioty',
          enabled: true,
          kind: 'tree-item',
          label: 'Sklep',
          iconId: 'nav/shop',
          hrefKey: 'GROUP_SHOP_ITEMS',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'ustawienia-grupy',
      enabled: true,
      kind: 'tree-group',
      label: 'Ustawienia grupy',
      iconId: 'nav/group-settings',
      requiresGroup: true,
      children: [
        {
          id: 'ustawienia-edytor',
          enabled: true,
          kind: 'tree-item',
          label: 'Edytor',
          iconId: 'nav/group-settings',
          hrefKey: 'GROUP_SETTINGS',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'ustawienia-waluta',
          enabled: true,
          kind: 'tree-item',
          label: 'Waluta',
          iconId: 'nav/currency',
          hrefKey: 'GROUP_SETTINGS_CURRENCY',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'ustawienia-zycia',
          enabled: true,
          kind: 'tree-item',
          label: 'System żyć',
          iconId: 'nav/lives',
          hrefKey: 'GROUP_SETTINGS_HEALTH',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'lecturer-nav-spacer-1',
      enabled: true,
      kind: 'spacer',
    },
    {
      id: 'lecturer-nav-spacer-2',
      enabled: true,
      kind: 'spacer',
    },
    {
      id: 'ranking',
      enabled: true,
      kind: 'unavailable',
      label: 'Ranking',
      iconId: 'nav/ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
      clickable: true,
      hint: 'Ranking — funkcja w przygotowaniu.',
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: 'Ustawienia',
      iconId: 'nav/settings',
      hrefKey: 'APP_SETTINGS',
      requiresGroup: false,
      matchEnd: true,
    },
  ],
};

// ============================================================================
// ADMIN VIEW
// ============================================================================

const adminView = {
  ctaItems: [],
  primaryNavItems: [
    {
      id: 'zarzadzanie-dostepem',
      enabled: true,
      kind: 'navlink',
      label: 'Zarządzanie dostępem',
      iconId: 'nav/users',
      hrefKey: 'USER_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'zarzadzanie-kursami',
      enabled: true,
      kind: 'navlink',
      label: 'Zarządzanie grupami',
      iconId: 'nav/groups',
      hrefKey: 'COURSE_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: 'Statystyki',
      iconId: 'nav/stats',
      hrefKey: 'STATISTICS',
      requiresGroup: false,
    },
  ],
  footerItems: [],
};

// ============================================================================
// SUPERADMIN VIEW
// ============================================================================

const superadminView = {
  ctaItems: [],
  primaryNavItems: [
    {
      id: 'zarzadzanie-organizacjami',
      enabled: true,
      kind: 'navlink',
      label: 'Zarządzanie organizacjami',
      iconId: 'nav/organization',
      hrefKey: 'ORG_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: 'Statystyki',
      iconId: 'nav/stats',
      hrefKey: 'STATISTICS',
      requiresGroup: false,
    },
  ],
  footerItems: [],
};

// ============================================================================
// EXPORTS
// ============================================================================

export const SHELL_VIEWS = {
  [APP_ROLE.STUDENT]: studentView,
  [APP_ROLE.LECTURER]: lecturerView,
  [APP_ROLE.ADMIN]: adminView,
  [APP_ROLE.SUPERADMIN]: superadminView,
};

/** Eksport szkieletów do rozszerzania (np. skopiuj `studentView` i zmodyfikuj kopię). */
export const SHELL_TEMPLATE_BLUEPRINTS = {
  student: studentView,
  lecturer: lecturerView,
  admin: adminView,
  superadmin: superadminView,
};

/**
 * Metadane sekcji z podstronami (nagłówek strony + aria-label SubNav).
 * Klucz = klucz z SUB_NAV_CONFIG.
 */
export const SUB_NAV_META = {
  'group-main': { title: 'Strona główna', ariaLabel: 'Nawigacja strony głównej' },
  'group-profile': { title: 'Profil', ariaLabel: 'Nawigacja profilu' },
  'group-members': { title: 'Użytkownicy', ariaLabel: 'Nawigacja użytkowników' },
  'group-activities': { title: 'Aktywności', ariaLabel: 'Nawigacja aktywności' },
  'group-rewards': { title: 'Systemy nagród', ariaLabel: 'Nawigacja systemów nagród' },
  'group-settings': { title: 'Ustawienia grupy', ariaLabel: 'Nawigacja ustawień grupy' },
  'group-ranking': { title: 'Ranking', ariaLabel: 'Nawigacja rankingu' },
  'app-templates': { title: 'Szablony', ariaLabel: 'Nawigacja szablonów' },
};

/**
 * Konfiguracja SubNav dla stron z podstronami.
 * Klucz = id strony głównej, wartość = tablica pozycji SubNav.
 */
export const SUB_NAV_CONFIG = {
  // Ekran główny (student + lecturer)
  'group-main': [
    { id: 'home', label: 'Strona główna', hrefKey: 'GROUP_MAIN', end: true },
  ],

  // Profil studenta
  'group-profile': [
    { id: 'badges', label: 'Zdobyte odznaki', hrefKey: 'GROUP_PROFILE', end: true },
    { id: 'log', label: 'Dziennik aktywności', hrefKey: 'GROUP_PROFILE_LOG', end: true },
    { id: 'eq', label: 'Ekwipunek', hrefKey: 'GROUP_PROFILE_EQ', end: true },
  ],

  // Użytkownicy (lecturer)
  'group-members': [
    { id: 'list', label: 'Uczestnicy', hrefKey: 'GROUP_MEMBERS', end: true },
    { id: 'log', label: 'Dziennik aktywności', hrefKey: 'GROUP_MEMBERS_LOG', end: true },
    { id: 'code', label: 'Kody dostępu', hrefKey: 'GROUP_MEMBERS_CODE', end: true },
  ],

  // Aktywności (lecturer)
  'group-activities': [
    { id: 'stages', label: 'Etapy', hrefKey: 'GROUP_ACTIVITIES', end: true },
    { id: 'posts', label: 'Wpisy', hrefKey: 'GROUP_POSTS', end: true },
    { id: 'reports', label: 'Raporty', hrefKey: 'GROUP_ACTIVITIES_TOOLS', end: true },
  ],

  // Systemy nagród (lecturer)
  'group-rewards': [
    { id: 'badges', label: 'Odznaki', hrefKey: 'GROUP_REWARDS', end: true },
    { id: 'ranks', label: 'Rangi', hrefKey: 'GROUP_REWARDS_RANKS', end: true },
    { id: 'shop-items', label: 'Sklep', hrefKey: 'GROUP_SHOP_ITEMS', end: true },
  ],

  // Ustawienia grupy (lecturer)
  'group-settings': [
    { id: 'creator', label: 'Edytor', hrefKey: 'GROUP_SETTINGS', end: true },
    { id: 'currency', label: 'Waluta', hrefKey: 'GROUP_SETTINGS_CURRENCY' },
    { id: 'health', label: 'System żyć', hrefKey: 'GROUP_SETTINGS_HEALTH' },
  ],

  // Ranking (student + lecturer)
  'group-ranking': [
    { id: 'info', label: 'Twoje informacje', hrefKey: 'GROUP_RANKING', end: true },
    { id: 'group', label: 'Ranking grupy', hrefKey: 'GROUP_RANKING_GROUP' },
    { id: 'activities', label: 'Ranking aktywności', hrefKey: 'GROUP_RANKING_ACTIVITIES' },
  ],

  'app-templates': [
    { id: 'mine', label: 'Moje szablony', hrefKey: 'TEMPLATES_MY', end: true },
    { id: 'gallery', label: 'Galeria szablonów', hrefKey: 'TEMPLATES_GALLERY', end: true },
  ],
};

/**
 * Pomocnik do budowania items dla SubNav z HREF_BUILDERS.
 * @param {string} configKey - klucz z SUB_NAV_CONFIG
 * @param {{ groupId: string | null }} context
 */
export function buildSubNavItems(configKey, context) {
  const config = SUB_NAV_CONFIG[configKey];
  if (!config) return [];

  return config.map((item) => {
    const builder = HREF_BUILDERS[item.hrefKey];
    const to = builder ? builder(context) : null;
    return {
      id: item.id,
      label: item.label,
      to,
      end: item.end,
    };
  }).filter((item) => item.to !== null);
}

/**
 * @param {Object} item
 * @param {{ groupId: string | null }} context
 */
function resolveNavItem(item, context) {
  if (!item.enabled) {
    return null;
  }

  if (item.kind === 'spacer') {
    return { ...item };
  }

  if (item.kind === 'unavailable') {
    let to = null;
    if (item.clickable && item.hrefKey) {
      if (!item.requiresGroup || context.groupId) {
        to = HREF_BUILDERS[item.hrefKey]?.(context) ?? null;
      }
    }
    return { ...item, to };
  }

  if (item.kind === 'logout') {
    return { ...item, to: null };
  }

  if (item.kind === 'tree-group' || item.kind === 'tree-expandable') {
    const children = (item.children ?? [])
      .map((child) => resolveNavItem(child, context))
      .filter(Boolean);

    if (children.length === 0) {
      return null;
    }

    return {
      ...item,
      to: null,
      children,
    };
  }

  if (item.requiresGroup && !context.groupId) {
    return null;
  }

  const builder = HREF_BUILDERS[item.hrefKey];
  const to = builder ? builder(context) : null;

  if (!to) {
    return null;
  }

  return { ...item, to };
}

/**
 * @param {string} role
 * @param {{ groupId: string | null }} context
 */
export function resolveShellView(role, context) {
  const view = SHELL_VIEWS[role] ?? SHELL_VIEWS[APP_ROLE.STUDENT];

  const mapSection = (items) => {
    return items
      .map((item) => resolveNavItem(item, context))
      .filter(Boolean);
  };

  return {
    ctaItems: mapSection(view.ctaItems),
    primaryNavItems: mapSection(view.primaryNavItems),
    footerItems: mapSection(view.footerItems),
  };
}
