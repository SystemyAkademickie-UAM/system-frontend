/**
 * Szablony nawigacji (widoki) — pojedyncze miejsce do definiowania przycisków paska bocznego per rola.
 *
 * Jak dodać nową pozycję we „widoku Studenta”:
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
  GROUPS_LIST: () => paths.groupsListPath(),
  GROUP_MAIN: (ctx) => (ctx.groupId ? paths.groupMainPath(ctx.groupId) : null),
  GROUP_PROFILE: (ctx) => (ctx.groupId ? paths.groupProfilePath(ctx.groupId) : null),
  GROUP_SHOP: (ctx) => (ctx.groupId ? paths.groupShopPath(ctx.groupId) : null),
  GROUP_RANKING: (ctx) => (ctx.groupId ? paths.groupRankingPath(ctx.groupId) : null),
  GROUP_CONTROL_PANEL: (ctx) => (ctx.groupId ? paths.groupControlPath(ctx.groupId) : null),
  APP_SETTINGS: () => paths.appSettingsPath(),
  USER_MANAGEMENT: () => paths.userManagementPath(),
  COURSE_MANAGEMENT: () => paths.courseManagementPath(),
  STATISTICS: () => paths.statisticsPath(),
  ORG_MANAGEMENT: () => paths.organizationsPath(),
};

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
      matchEnd: true,
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
    {
      id: 'wyloguj',
      enabled: true,
      kind: 'logout',
      label: 'Wyloguj',
      iconId: 'nav-wyloguj',
      requiresGroup: false,
    },
  ],
};

const lecturerView = {
  ctaItems: [...studentView.ctaItems],
  primaryNavItems: [
    studentView.primaryNavItems[0],
    {
      id: 'panel-zarzadzania',
      enabled: true,
      kind: 'navlink',
      label: 'Panel zarządzania',
      iconId: 'nav-panel',
      hrefKey: 'GROUP_CONTROL_PANEL',
      requiresGroup: true,
      matchEnd: true,
    },
    ...studentView.primaryNavItems.slice(2),
  ],
  footerItems: [...studentView.footerItems],
};

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
      label: 'Zarządzanie kursami',
      iconId: 'nav-courses',
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
  footerItems: [studentView.footerItems[1]],
};

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
  footerItems: [studentView.footerItems[1]],
};

export const SHELL_VIEWS = {
  [APP_ROLE.STUDENT]: studentView,
  [APP_ROLE.LECTURER]: lecturerView,
  [APP_ROLE.ADMIN]: adminView,
  [APP_ROLE.SUPERADMIN]: superadminView,
};

/**
 * @param {string} role
 * @param {{ groupId: string | null }} context
 */
/** Eksport szkieletów do rozszerzania (np. skopiuj `studentView` i zmodyfikuj kopię). */
export const SHELL_TEMPLATE_BLUEPRINTS = {
  student: studentView,
  lecturer: lecturerView,
  admin: adminView,
  superadmin: superadminView,
};

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
