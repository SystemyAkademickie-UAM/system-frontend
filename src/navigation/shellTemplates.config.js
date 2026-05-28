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
 * - kind: 'navlink' | 'cta' | 'logout'
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

  // Ekran główny + podstrony
  GROUP_MAIN: (ctx) => (ctx.groupId ? paths.groupMainPath(ctx.groupId) : null),
  GROUP_MAIN_ACTIVITIES: (ctx) => (ctx.groupId ? paths.groupMainActivitiesPath(ctx.groupId) : null),
  GROUP_MAIN_RANKS: (ctx) => (ctx.groupId ? paths.groupMainRanksPath(ctx.groupId) : null),
  GROUP_MAIN_BADGES: (ctx) => (ctx.groupId ? paths.groupMainBadgesPath(ctx.groupId) : null),

  // Profil studenta + podstrony
  GROUP_PROFILE: (ctx) => (ctx.groupId ? paths.groupProfilePath(ctx.groupId) : null),
  GROUP_PROFILE_LOG: (ctx) => (ctx.groupId ? paths.groupProfileLogPath(ctx.groupId) : null),
  GROUP_PROFILE_EQ: (ctx) => (ctx.groupId ? paths.groupProfileEqPath(ctx.groupId) : null),

  // Użytkownicy (lecturer) + podstrony
  GROUP_MEMBERS: (ctx) => (ctx.groupId ? paths.groupMembersPath(ctx.groupId) : null),
  GROUP_MEMBERS_LOG: (ctx) => (ctx.groupId ? paths.groupMembersLogPath(ctx.groupId) : null),
  GROUP_MEMBERS_CODE: (ctx) => (ctx.groupId ? paths.groupMembersCodePath(ctx.groupId) : null),

  // Korzeń grupy
  GROUP_ROOT: (ctx) => (ctx.groupId ? paths.groupRootPath(ctx.groupId) : null),

  // Aktywności (lecturer) + podstrony
  GROUP_ACTIVITIES: (ctx) => (ctx.groupId ? paths.groupActivitiesPath(ctx.groupId) : null),
  GROUP_ACTIVITIES_TOOLS: (ctx) => (ctx.groupId ? paths.groupActivitiesToolsPath(ctx.groupId) : null),

  // Wpisy (lecturer)
  GROUP_POSTS: (ctx) => (ctx.groupId ? paths.groupPostsPath(ctx.groupId) : null),

  // Systemy nagród (lecturer) + podstrony
  GROUP_REWARDS: (ctx) => (ctx.groupId ? paths.groupRewardsPath(ctx.groupId) : null),
  GROUP_REWARDS_BADGES: (ctx) => (ctx.groupId ? paths.groupRewardsBadgesPath(ctx.groupId) : null),
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
      id: 'ekran-glowny',
      enabled: true,
      kind: 'navlink',
      label: 'Ekran główny',
      iconId: 'nav-ekran-glowny',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
    },
    {
      id: 'profil',
      enabled: true,
      kind: 'navlink',
      label: 'Profil',
      iconId: 'nav-profil',
      hrefKey: 'GROUP_PROFILE',
      requiresGroup: true,
    },
    {
      id: 'sklep',
      enabled: true,
      kind: 'navlink',
      label: 'Sklep',
      iconId: 'nav-sklep',
      hrefKey: 'GROUP_SHOP',
      requiresGroup: true,
    },
    {
      id: 'ranking',
      enabled: true,
      kind: 'navlink',
      label: 'Ranking',
      iconId: 'nav-ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: 'Ustawienia',
      iconId: 'nav-ustawienia',
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
      id: 'ekran-glowny',
      enabled: true,
      kind: 'navlink',
      label: 'Ekran główny',
      iconId: 'nav-ekran-glowny',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
    },
    {
      id: 'uzytkownicy',
      enabled: true,
      kind: 'navlink',
      label: 'Użytkownicy',
      iconId: 'nav-users',
      hrefKey: 'GROUP_MEMBERS',
      requiresGroup: true,
    },
    {
      id: 'aktywnosci',
      enabled: true,
      kind: 'navlink',
      label: 'Aktywności',
      iconId: 'nav-activity',
      hrefKey: 'GROUP_ACTIVITIES',
      requiresGroup: true,
    },
    {
      id: 'wpisy',
      enabled: true,
      kind: 'navlink',
      label: 'Wpisy',
      iconId: 'nav-posts',
      hrefKey: 'GROUP_POSTS',
      requiresGroup: true,
    },
    {
      id: 'systemy-nagrod',
      enabled: true,
      kind: 'navlink',
      label: 'Systemy nagród',
      iconId: 'nav-rewards',
      hrefKey: 'GROUP_REWARDS',
      requiresGroup: true,
    },
    {
      id: 'ustawienia-grupy',
      enabled: true,
      kind: 'navlink',
      label: 'Ustawienia grupy',
      iconId: 'nav-settings-group',
      hrefKey: 'GROUP_SETTINGS',
      requiresGroup: true,
    },
    {
      id: 'sklep',
      enabled: true,
      kind: 'navlink',
      label: 'Sklep',
      iconId: 'nav-sklep',
      hrefKey: 'GROUP_SHOP',
      requiresGroup: true,
    },
    {
      id: 'ranking',
      enabled: true,
      kind: 'navlink',
      label: 'Ranking',
      iconId: 'nav-ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: 'Ustawienia',
      iconId: 'nav-ustawienia',
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
      iconId: 'nav-users',
      hrefKey: 'USER_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'zarzadzanie-kursami',
      enabled: true,
      kind: 'navlink',
      label: 'Zarządzanie grupami',
      iconId: 'nav-groups',
      hrefKey: 'COURSE_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: 'Statystyki',
      iconId: 'nav-stats',
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
      iconId: 'nav-org',
      hrefKey: 'ORG_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: 'Statystyki',
      iconId: 'nav-stats',
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
  'group-main': { title: 'Ekran główny', ariaLabel: 'Nawigacja sekcji grupy' },
  'group-profile': { title: 'Profil', ariaLabel: 'Nawigacja profilu' },
  'group-members': { title: 'Użytkownicy', ariaLabel: 'Nawigacja użytkowników' },
  'group-activities': { title: 'Aktywności', ariaLabel: 'Nawigacja aktywności' },
  'group-rewards': { title: 'Systemy nagród', ariaLabel: 'Nawigacja systemów nagród' },
  'group-settings': { title: 'Ustawienia grupy', ariaLabel: 'Nawigacja ustawień grupy' },
  'group-ranking': { title: 'Ranking', ariaLabel: 'Nawigacja rankingu' },
};

/**
 * Konfiguracja SubNav dla stron z podstronami.
 * Klucz = id strony głównej, wartość = tablica pozycji SubNav.
 */
export const SUB_NAV_CONFIG = {
  // Ekran główny (student + lecturer)
  'group-main': [
    { id: 'home', label: 'Strona główna', hrefKey: 'GROUP_MAIN', end: true },
    { id: 'activities', label: 'Lista aktywności', hrefKey: 'GROUP_MAIN_ACTIVITIES' },
    { id: 'ranks', label: 'Rangi', hrefKey: 'GROUP_MAIN_RANKS' },
    { id: 'badges', label: 'Odznaki', hrefKey: 'GROUP_MAIN_BADGES' },
  ],

  // Profil studenta
  'group-profile': [
    { id: 'badges', label: 'Odznaki', hrefKey: 'GROUP_PROFILE', end: true },
    { id: 'log', label: 'Aktywności', hrefKey: 'GROUP_PROFILE_LOG' },
    { id: 'eq', label: 'Ekwipunek', hrefKey: 'GROUP_PROFILE_EQ' },
  ],

  // Użytkownicy (lecturer)
  'group-members': [
    { id: 'list', label: 'Uczestnicy', hrefKey: 'GROUP_MEMBERS', end: true },
    { id: 'code', label: 'Kody dostępu', hrefKey: 'GROUP_MEMBERS_CODE' },
    { id: 'log', label: 'Log aktywności', hrefKey: 'GROUP_MEMBERS_LOG' },
  ],

  // Aktywności (lecturer)
  'group-activities': [
    { id: 'stages', label: 'Etapy', hrefKey: 'GROUP_ACTIVITIES', end: true },
    { id: 'tools', label: 'Narzędzia', hrefKey: 'GROUP_ACTIVITIES_TOOLS' },
  ],

  // Systemy nagród (lecturer)
  'group-rewards': [
    { id: 'ranks', label: 'Rangi', hrefKey: 'GROUP_REWARDS', end: true },
    { id: 'badges', label: 'Odznaki', hrefKey: 'GROUP_REWARDS_BADGES' },
    { id: 'shopitems', label: 'Przedmioty sklepowe', hrefKey: 'GROUP_SHOP_ITEMS' },
  ],

  // Ustawienia grupy (lecturer)
  'group-settings': [
    { id: 'creator', label: 'Kreator grupy', hrefKey: 'GROUP_SETTINGS', end: true },
    { id: 'currency', label: 'Waluta', hrefKey: 'GROUP_SETTINGS_CURRENCY' },
    { id: 'health', label: 'System żyć', hrefKey: 'GROUP_SETTINGS_HEALTH' },
  ],

  // Ranking (student + lecturer)
  'group-ranking': [
    { id: 'info', label: 'Twoje informacje', hrefKey: 'GROUP_RANKING', end: true },
    { id: 'group', label: 'Ranking grupy', hrefKey: 'GROUP_RANKING_GROUP' },
    { id: 'activities', label: 'Ranking aktywności', hrefKey: 'GROUP_RANKING_ACTIVITIES' },
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
 * @param {string} role
 * @param {{ groupId: string | null }} context
 */
export function resolveShellView(role, context) {
  const view = SHELL_VIEWS[role] ?? SHELL_VIEWS[APP_ROLE.STUDENT];

  const mapSection = (items) => {
    return items
      .filter((item) => item.enabled)
      .map((item) => {
        if (item.kind === 'logout') {
          return { ...item, to: null };
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
      })
      .filter(Boolean);
  };

  return {
    ctaItems: mapSection(view.ctaItems),
    primaryNavItems: mapSection(view.primaryNavItems),
    footerItems: mapSection(view.footerItems),
  };
}
