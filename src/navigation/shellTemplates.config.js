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
 * - requiresGroupOwner: true — tylko właściciel grupy (Game Master), nie gość-prowadzący.
 * - hrefKey: klucz z HREF_BUILDERS (oprócz kind === 'logout').
 * - kind: 'navlink' | 'cta' | 'logout' | 'spacer' | 'unavailable' | 'tree-item' | 'tree-group' | 'tree-expandable'
 * - matchEnd: przekazywane do NavLink `end` (np. lista grup).
 * - visibleFor: tablica ról dla których element jest widoczny (puste = wszystkie)
 */
import * as paths from '../routes/pathRegistry.js';
import { READLANGUAGECOOKIE } from '../utils/LANGUAGECOOKIE.js';

const LANGUAGE = READLANGUAGECOOKIE();


const STUDENT__TEXTLABEL = {
  polish: 'Osoba studiująca',
  english: 'Student',
};

const LECTURER__TEXTLABEL = {
  polish: 'Osoba prowadząca',
  english: 'Lecturer',
};

const ADMINISTRATOR__TEXTLABEL = {
  polish: 'Osoba administrująca',
  english: 'Administrator',
};

const SUPERADMINISTRATOR__TEXTLABEL = {
  polish: 'Nadrzędna osoba administrująca',
  english: 'Superadmin',
};

const YOURGROUPS__TEXTLABEL = {
  polish: 'Twoje grupy',
  english: 'Your Groups',
};

const NAVIGATIONMAIN_PAGE__TEXTLABEL = {
  polish: 'Strona Główna',
  english: 'Main Page',
};

const NAVIGATIONPOSTS__TEXTLABEL = {
  polish: 'Wpisy',
  english: 'Posts',
};

const NAVIGATIONPROFILE__TEXTLABEL = {
  polish: 'Profil',
  english: 'Profile',
};

const NAVIGATIONPROFILEACTIVITYLOG__TEXTLABEL = {
  polish: 'Dziennik aktywności',
  english: 'Activity Log',
};

const NAVIGATIONPROFILEBADGES__TEXTLABEL = {
  polish: 'Zdobyte odznaki',
  english: 'Earned Badges',
};

const NAVIGATIONPROFILEINVENTORY__TEXTLABEL = {
  polish: 'Ekwipunek',
  english: 'Inventory',
};

const NAVIGATIONPROFILEPURCHASES__TEXTLABEL = {
  polish: 'Historia zakupów',
  english: 'Purchase History',
};

const NAVIGATIONACTIVITYLIST__TEXTLABEL = {
  polish: 'Lista aktywności',
  english: 'Activity List',
};

const NAVIGATIONBADGES__TEXTLABEL = {
  polish: 'Odznaki',
  english: 'Badges',
};

const NAVIGATIONRANKS__TEXTLABEL = {
  polish: 'Rangi',
  english: 'Ranks',
};

const NAVIGATIONSHOP__TEXTLABEL = {
  polish: 'Sklep',
  english: 'Shop',
};

const NAVIGATIONPARTICIPANTS__TEXTLABEL = {
  polish: 'Osoby uczestniczące',
  english: 'Participants',
};

const RANKINGUNAVAILABLE__TEXTLABEL = {
  polish: 'Ranking',
  english: 'Ranking',
};

const RANKINGHINT__TEXTLABEL = {
  polish: 'Ranking — funkcja w przygotowaniu.',
  english: 'Ranking — coming soon.',
};

const NAVIGATIONSETTINGS__TEXTLABEL = {
  polish: 'Ustawienia',
  english: 'Settings',
};

const NAVIGATIONUSERS__TEXTLABEL = {
  polish: 'Osoby korzystające z systemu',
  english: 'Users',
};

const NAVIGATIONMEMBERS__TEXTLABEL = {
  polish: 'Osoby uczestniczące',
  english: 'Members',
};

const NAVIGATIONACCESSCODES__TEXTLABEL = {
  polish: 'Kody dostępu',
  english: 'Access Codes',
};

const NAVIGATIONACTIVITIES__TEXTLABEL = {
  polish: 'Aktywności',
  english: 'Activities',
};

const NAVIGATIONSTAGES__TEXTLABEL = {
  polish: 'Etapy',
  english: 'Stages',
};

const NAVIGATIONREPORTS__TEXTLABEL = {
  polish: 'Raporty',
  english: 'Reports',
};

const NAVIGATIONREWARDS__TEXTLABEL = {
  polish: 'Systemy nagród',
  english: 'Rewards',
};

const NAVIGATIONREWARDSBADGES__TEXTLABEL = {
  polish: 'Odznaki',
  english: 'Badges',
};


const NAVIGATIONREWARDSRANKS__TEXTLABEL = {
  polish: 'Rangi',
  english: 'Ranks',
};

const NAVIGATIONREWARDSITEMS__TEXTLABEL = {
  polish: 'Sklep',
  english: 'Shop',
};

const NAVIGATIONGROUPSETTINGS__TEXTLABEL = {
  polish: 'Ustawienia grupy',
  english: 'Group Settings',
};

const NAVIGATIONEDITOR__TEXTLABEL = {
  polish: 'Edytor',
  english: 'Editor',
};

const NAVIGATIONCURRENCY__TEXTLABEL = {
  polish: 'Waluta',
  english: 'Currency',
};

const NAVIGATIONLIVESSYSTEM__TEXTLABEL = {
  polish: 'System żyć',
  english: 'Lives System',
};

const NAVIGATIONRANKING__TEXTLABEL = {
  polish: 'Ranking',
  english: 'Ranking',
};

const NAVIGATIONACCESSMANAGEMENT__TEXTLABEL = {
  polish: 'Zarządzanie dostępem',
  english: 'Access Management',
};

const NAVIGATIONGROUPMANAGEMENT__TEXTLABEL = {
  polish: 'Zarządzanie grupami',
  english: 'Group Management',
};

const NAVIGATIONSTATISTICS__TEXTLABEL = {
  polish: 'Statystyki',
  english: 'Statistics',
};

const NAVIGATIONORGANIZATIONS__TEXTLABEL = {
  polish: 'Zarządzanie organizacjami',
  english: 'Organization Management',
};

const NAVIGATIONPRODUCTIONLOGS__TEXTLABEL = {
  polish: 'Logi produkcyjne',
  english: 'Production Logs',
};

const SUBNAVIGATIONMAINPAGE__TEXTLABEL = {
  polish: 'Strona główna',
  english: 'Main Page',
};

const SUBNAVIGATIONMAINPAGESUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja strony głównej',
  english: 'Main Page Navigation',
};

const SUBNAVIGATIONPROFILE__TEXTLABEL = {
  polish: 'Profil',
  english: 'Profile',
};

const SUBNAVIGATIONPROFILESUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja profilu',
  english: 'Profile Navigation',
};

const SUBNAVIGATIONSTUDENTPROFILE__TEXTLABEL = {
  polish: 'Profil',
  english: 'Student Profile',
};

const SUBNAVIGATIONSTUDENTPROFILESUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja profilu',
  english: 'Student Profile Navigation',
};

const SUBNAVIGATIONMEMBERS__TEXTLABEL = {
  polish: 'Osoby korzystające z systemu',
  english: 'Users',
};

const SUBNAVIGATIONMEMBERSSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja',
  english: 'Users Navigation',
};

const SUBNAVIGATIONACTIVITIES__TEXTLABEL = {
  polish: 'Aktywności',
  english: 'Activities',
};

const SUBNAVIGATIONACTIVITIESSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja aktywności',
  english: 'Activities Navigation',
};

const SUBNAVIGATIONREWARDS__TEXTLABEL = {
  polish: 'Systemy nagród',
  english: 'Rewards',
};

const SUBNAVIGATIONREWARDSSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja systemów nagród',
  english: 'Rewards Navigation',
};

const SUBNAVIGATIONSETTINGS__TEXTLABEL = {
  polish: 'Ustawienia grupy',
  english: 'Group Settings',
};

const SUBNAVIGATIONSETTINGSSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja ustawień grupy',
  english: 'Group Settings Navigation',
};

const SUBNAVIGATIONRANKING__TEXTLABEL = {
  polish: 'Ranking',
  english: 'Ranking',
};

const SUBNAVIGATIONRANKINGSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja rankingu',
  english: 'Ranking Navigation',
};

const SUBNAVIGATIONTEMPLATES__TEXTLABEL = {
  polish: 'Szablony',
  english: 'Templates',
};

const SUBNAVIGATIONTEMPLATESSUBTITLE__TEXTLABEL = {
  polish: 'Nawigacja szablonów',
  english: 'Templates Navigation',
};

const SUBNAVIGATIONINFORMATION__TEXTLABEL = {
  polish: 'Twoje informacje',
  english: 'Your Information',
};

const SUBNAVIGATIONGROUPRANKING__TEXTLABEL = {
  polish: 'Ranking grupy',
  english: 'Group Ranking',
};

const SUBNAVIGATIONACTIVITYRANKING__TEXTLABEL = {
  polish: 'Ranking aktywności',
  english: 'Activity Ranking',
};

const SUBNAVIGATIONGALLERY__TEXTLABEL = {
  polish: 'Galeria szablonów',
  english: 'Template Gallery',
};

const SUBNAVIGATIONMYTEMPLATES__TEXTLABEL = {
  polish: 'Moje szablony',
  english: 'My Templates',
};

const SUBNAVIGATIONACTIVITYLOG__TEXTLABEL = {
  polish: 'Dziennik aktywności',
  english: 'Activity Log',
};

const SUBNAVIGATIONEARNEDBADGES__TEXTLABEL = {
  polish: 'Zdobyte odznaki',
  english: 'Earned Badges',
};

const SUBNAVIGATIONINVENTORY__TEXTLABEL = {
  polish: 'Ekwipunek',
  english: 'Inventory',
};

const SUBNAVIGATIONPURCHASEHISTORY__TEXTLABEL = {
  polish: 'Historia zakupów',
  english: 'Purchase History',
};

const SUBNAVIGATIONMEMBERSLIST__TEXTLABEL = {
  polish: 'Osoby uczestniczące',
  english: 'Members',
};

const SUBNAVIGATIONACCESSCODES__TEXTLABEL = {
  polish: 'Kody dostępu',
  english: 'Access Codes',
};

const SUBNAVIGATIONSTAGES__TEXTLABEL = {
  polish: 'Etapy',
  english: 'Stages',
};

const SUBNAVIGATIONPOSTS__TEXTLABEL = {
  polish: 'Wpisy',
  english: 'Posts',
};

const SUBNAVIGATIONREPORTS__TEXTLABEL = {
  polish: 'Raporty',
  english: 'Reports',
};

const SUBNAVIGATIONSHOPITEMS__TEXTLABEL = {
  polish: 'Sklep',
  english: 'Shop',
};

const SUBNAVIGATIONCREATOR__TEXTLABEL = {
  polish: 'Edytor',
  english: 'Editor',
};

const SUBNAVIGATIONCURRENCY__TEXTLABEL = {
  polish: 'Waluta',
  english: 'Currency',
};

const SUBNAVIGATIONLIVES__TEXTLABEL = {
  polish: 'System żyć',
  english: 'Lives',
};

export const APP_ROLE = {
  STUDENT: 'student',
  LECTURER: 'lecturer',
  ADMIN: 'admin',
  SUPERADMIN: 'superadmin',
};

export const ROLE_UI_LABEL = {
  [APP_ROLE.STUDENT]: STUDENT__TEXTLABEL[LANGUAGE],
  [APP_ROLE.LECTURER]: LECTURER__TEXTLABEL[LANGUAGE],
  [APP_ROLE.ADMIN]: ADMINISTRATOR__TEXTLABEL[LANGUAGE],
  [APP_ROLE.SUPERADMIN]: SUPERADMINISTRATOR__TEXTLABEL[LANGUAGE],
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
  GROUP_STUDENT_PROFILE_BADGES: (ctx) =>
    ctx.groupId && ctx.studentId ? paths.groupStudentProfileBadgesPath(ctx.groupId, ctx.studentId) : null,
  GROUP_STUDENT_PROFILE_EQ: (ctx) =>
    ctx.groupId && ctx.studentId ? paths.groupStudentProfileEqPath(ctx.groupId, ctx.studentId) : null,
  GROUP_STUDENT_PROFILE_PURCHASES: (ctx) =>
    ctx.groupId && ctx.studentId ? paths.groupStudentProfilePurchasesPath(ctx.groupId, ctx.studentId) : null,
  GROUP_PROFILE_LOG: (ctx) => (ctx.groupId ? paths.groupProfileActivityPath(ctx.groupId) : null),
  GROUP_PROFILE_EQ: (ctx) => (ctx.groupId ? paths.groupProfileEqPath(ctx.groupId) : null),
  GROUP_PROFILE_PURCHASES: (ctx) => (ctx.groupId ? paths.groupProfilePurchasesPath(ctx.groupId) : null),

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
  SYSTEM_LOGS: () => paths.superadminLogsPath(),
  ADMIN_BACKUP: () => paths.adminBackupPath(),
  TEMPLATES_MY: () => paths.templatesMyPath(),
  TEMPLATES_GALLERY: () => paths.templatesPath(),

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
      label: YOURGROUPS__TEXTLABEL[LANGUAGE],
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
      label: NAVIGATIONMAIN_PAGE__TEXTLABEL[LANGUAGE],
      iconId: 'nav/group-main',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'wpisy',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONPOSTS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/posts',
      hrefKey: 'GROUP_STUDENT_FEED',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'profil',
      enabled: true,
      kind: 'tree-group',
      label: NAVIGATIONPROFILE__TEXTLABEL[LANGUAGE],
      iconId: 'nav/profile',
      requiresGroup: true,
      children: [
        {
          id: 'profil-aktywnosci',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPROFILEACTIVITYLOG__TEXTLABEL[LANGUAGE],
          iconId: 'nav/activity',
          hrefKey: 'GROUP_PROFILE',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'profil-odznaki',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPROFILEBADGES__TEXTLABEL[LANGUAGE],
          iconId: 'nav/profile-badges',
          hrefKey: 'GROUP_PROFILE_LOG',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'profil-ekwipunek',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPROFILEINVENTORY__TEXTLABEL[LANGUAGE],
          iconId: 'nav/profile-inventory',
          hrefKey: 'GROUP_PROFILE_EQ',
          requiresGroup: true,
          matchEnd: true,
        },
        {
          id: 'profil-zakupy',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPROFILEPURCHASES__TEXTLABEL[LANGUAGE],
          iconId: 'nav/shop',
          hrefKey: 'GROUP_PROFILE_PURCHASES',
          requiresGroup: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'lista-aktywnosci',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONACTIVITYLIST__TEXTLABEL[LANGUAGE],
      iconId: 'nav/activity',
      hrefKey: 'GROUP_STUDENT_ACTIVITY_LIST',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'odznaki',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONBADGES__TEXTLABEL[LANGUAGE],
      iconId: 'nav/badges',
      hrefKey: 'GROUP_STUDENT_BADGES',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'rangi',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONRANKS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/ranks',
      hrefKey: 'GROUP_STUDENT_RANKS',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'sklep',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONSHOP__TEXTLABEL[LANGUAGE],
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
      id: 'osoby uczestniczące',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONPARTICIPANTS__TEXTLABEL[LANGUAGE],
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
      label: RANKINGUNAVAILABLE__TEXTLABEL[LANGUAGE],
      iconId: 'nav/ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
      clickable: false,
      hint: RANKINGHINT__TEXTLABEL[LANGUAGE],
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONSETTINGS__TEXTLABEL[LANGUAGE],
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
      label: YOURGROUPS__TEXTLABEL[LANGUAGE],
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
      label: NAVIGATIONMAIN_PAGE__TEXTLABEL[LANGUAGE],
      iconId: 'nav/group-main',
      hrefKey: 'GROUP_MAIN',
      requiresGroup: true,
      matchEnd: true,
    },
    {
      id: 'uzytkownicy',
      enabled: true,
      kind: 'tree-group',
      label: NAVIGATIONUSERS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/users',
      requiresGroup: true,
      children: [
        {
          id: 'uzytkownicy-uczestnicy',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONMEMBERS__TEXTLABEL[LANGUAGE],
          iconId: 'nav/members',
          hrefKey: 'GROUP_MEMBERS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'uzytkownicy-log',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPROFILEACTIVITYLOG__TEXTLABEL[LANGUAGE],
          iconId: 'nav/activity',
          hrefKey: 'GROUP_MEMBERS_LOG',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'uzytkownicy-kody',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONACCESSCODES__TEXTLABEL[LANGUAGE],
          iconId: 'nav/access-codes',
          hrefKey: 'GROUP_MEMBERS_CODE',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'aktywnosci',
      enabled: true,
      kind: 'tree-group',
      label: NAVIGATIONACTIVITIES__TEXTLABEL[LANGUAGE],
      iconId: 'nav/activity',
      requiresGroup: true,
      children: [
        {
          id: 'aktywnosci-etapy',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONSTAGES__TEXTLABEL[LANGUAGE],
          iconId: 'nav/activity',
          hrefKey: 'GROUP_ACTIVITIES',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'aktywnosci-wpisy',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONPOSTS__TEXTLABEL[LANGUAGE],
          iconId: 'nav/posts',
          hrefKey: 'GROUP_POSTS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'aktywnosci-raporty',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONREPORTS__TEXTLABEL[LANGUAGE],
          iconId: 'nav/reports',
          hrefKey: 'GROUP_ACTIVITIES_TOOLS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'systemy-nagrod',
      enabled: true,
      kind: 'tree-group',
      label: NAVIGATIONREWARDS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/rewards',
      requiresGroup: true,
      children: [
        {
          id: 'nagrody-odznaki',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONREWARDSBADGES__TEXTLABEL[LANGUAGE],
          iconId: 'nav/badges',
          hrefKey: 'GROUP_REWARDS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'nagrody-rangi',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONREWARDSRANKS__TEXTLABEL[LANGUAGE],
          iconId: 'nav/ranks',
          hrefKey: 'GROUP_REWARDS_RANKS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'nagrody-przedmioty',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONREWARDSITEMS__TEXTLABEL[LANGUAGE],
          iconId: 'nav/shop',
          hrefKey: 'GROUP_SHOP_ITEMS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
      ],
    },
    {
      id: 'ustawienia-grupy',
      enabled: true,
      kind: 'tree-group',
      label: NAVIGATIONGROUPSETTINGS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/group-settings',
      requiresGroup: true,
      children: [
        {
          id: 'ustawienia-edytor',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONEDITOR__TEXTLABEL[LANGUAGE],
          iconId: 'nav/group-settings',
          hrefKey: 'GROUP_SETTINGS',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'ustawienia-waluta',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONCURRENCY__TEXTLABEL[LANGUAGE],
          iconId: 'nav/currency',
          hrefKey: 'GROUP_SETTINGS_CURRENCY',
          requiresGroup: true,
          requiresGroupOwner: true,
          matchEnd: true,
        },
        {
          id: 'ustawienia-zycia',
          enabled: true,
          kind: 'tree-item',
          label: NAVIGATIONLIVESSYSTEM__TEXTLABEL[LANGUAGE],
          iconId: 'nav/lives',
          hrefKey: 'GROUP_SETTINGS_HEALTH',
          requiresGroup: true,
          requiresGroupOwner: true,
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
      label: NAVIGATIONRANKING__TEXTLABEL[LANGUAGE],
      iconId: 'nav/ranking',
      hrefKey: 'GROUP_RANKING',
      requiresGroup: true,
      clickable: false,

      hint: RANKINGHINT__TEXTLABEL[LANGUAGE],
    },
  ],
  footerItems: [
    {
      id: 'ustawienia',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONSETTINGS__TEXTLABEL[LANGUAGE],
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
      label: NAVIGATIONACCESSMANAGEMENT__TEXTLABEL[LANGUAGE],
      iconId: 'nav/users',
      hrefKey: 'USER_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'zarzadzanie-kursami',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONGROUPMANAGEMENT__TEXTLABEL[LANGUAGE],
      iconId: 'nav/groups',
      hrefKey: 'COURSE_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONSTATISTICS__TEXTLABEL[LANGUAGE],
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
      label: NAVIGATIONORGANIZATIONS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/organization',
      hrefKey: 'ORG_MANAGEMENT',
      requiresGroup: false,
    },
    {
      id: 'statystyki',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONSTATISTICS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/stats',
      hrefKey: 'STATISTICS',
      requiresGroup: false,
    },
    {
      id: 'logi-produkcyjne',
      enabled: true,
      kind: 'navlink',
      label: NAVIGATIONPRODUCTIONLOGS__TEXTLABEL[LANGUAGE],
      iconId: 'nav/stats',
      hrefKey: 'SYSTEM_LOGS',
      requiresGroup: false,
    },
    {
      id: 'backup-bazy',
      enabled: true,
      kind: 'navlink',
      label: 'Kopia zapasowa',
      iconId: 'nav/stats',
      hrefKey: 'ADMIN_BACKUP',
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
  'group-main': { title: SUBNAVIGATIONMAINPAGE__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONMAINPAGESUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-profile': { title: SUBNAVIGATIONPROFILE__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONPROFILESUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-student-profile': { title: SUBNAVIGATIONSTUDENTPROFILE__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONSTUDENTPROFILESUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-members': { title: SUBNAVIGATIONMEMBERS__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONMEMBERSSUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-activities': { title: SUBNAVIGATIONACTIVITIES__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONACTIVITIESSUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-rewards': { title: SUBNAVIGATIONREWARDS__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONREWARDSSUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-settings': { title: SUBNAVIGATIONSETTINGS__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONSETTINGSSUBTITLE__TEXTLABEL[LANGUAGE] },
  'group-ranking': { title: SUBNAVIGATIONRANKING__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONRANKINGSUBTITLE__TEXTLABEL[LANGUAGE] },
  'app-templates': { title: SUBNAVIGATIONTEMPLATES__TEXTLABEL[LANGUAGE], ariaLabel: SUBNAVIGATIONTEMPLATESSUBTITLE__TEXTLABEL[LANGUAGE] },
};

/**
 * Konfiguracja SubNav dla stron z podstronami.
 * Klucz = id strony głównej, wartość = tablica pozycji SubNav.
 */
export const SUB_NAV_CONFIG = {
  // Ekran główny (student + lecturer)
  'group-main': [
    { id: 'home', label: SUBNAVIGATIONMAINPAGE__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_MAIN', end: true },
  ],

  // Profil studenta
  'group-profile': [
    { id: 'log', label: SUBNAVIGATIONACTIVITYLOG__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_PROFILE', end: true },
    { id: 'badges', label: SUBNAVIGATIONEARNEDBADGES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_PROFILE_LOG', end: true },
    { id: 'eq', label: SUBNAVIGATIONINVENTORY__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_PROFILE_EQ', end: true },
    { id: 'purchases', label: SUBNAVIGATIONPURCHASEHISTORY__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_PROFILE_PURCHASES', end: true },
  ],

  // Profil studenta (podgląd prowadzącego)
  'group-student-profile': [
    { id: 'badges', label: SUBNAVIGATIONEARNEDBADGES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_STUDENT_PROFILE_BADGES', end: true },
    { id: 'eq', label: SUBNAVIGATIONINVENTORY__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_STUDENT_PROFILE_EQ', end: true },
    { id: 'purchases', label: SUBNAVIGATIONPURCHASEHISTORY__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_STUDENT_PROFILE_PURCHASES', end: true },
  ],

  // Użytkownicy (lecturer)
  'group-members': [
    { id: 'list', label: SUBNAVIGATIONMEMBERSLIST__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_MEMBERS', end: true },
    { id: 'log', label: SUBNAVIGATIONACTIVITYLOG__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_MEMBERS_LOG', end: true },
    { id: 'code', label: SUBNAVIGATIONACCESSCODES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_MEMBERS_CODE', end: true },
  ],

  // Aktywności (lecturer)
  'group-activities': [
    { id: 'stages', label: SUBNAVIGATIONSTAGES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_ACTIVITIES', end: true },
    { id: 'posts', label: SUBNAVIGATIONPOSTS__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_POSTS', end: true },
    { id: 'reports', label: SUBNAVIGATIONREPORTS__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_ACTIVITIES_TOOLS', end: true },
  ],

  // Systemy nagród (lecturer)
  'group-rewards': [
    { id: 'badges', label: NAVIGATIONREWARDSBADGES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_REWARDS', end: true },
    { id: 'ranks', label: NAVIGATIONREWARDSRANKS__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_REWARDS_RANKS', end: true },
    { id: 'shop-items', label: NAVIGATIONREWARDSITEMS__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_SHOP_ITEMS', end: true },
  ],

  // Ustawienia grupy (lecturer)
  'group-settings': [
    { id: 'creator', label: SUBNAVIGATIONCREATOR__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_SETTINGS', end: true },
    { id: 'currency', label: SUBNAVIGATIONCURRENCY__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_SETTINGS_CURRENCY' },
    { id: 'health', label: SUBNAVIGATIONLIVES__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_SETTINGS_HEALTH' },
  ],

  // Ranking (student + lecturer)
  'group-ranking': [
    { id: 'info', label: SUBNAVIGATIONINFORMATION__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_RANKING', end: true },
    { id: 'group', label: SUBNAVIGATIONGROUPRANKING__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_RANKING_GROUP' },
    { id: 'activities', label: SUBNAVIGATIONACTIVITYRANKING__TEXTLABEL[LANGUAGE], hrefKey: 'GROUP_RANKING_ACTIVITIES' },
  ],

  'app-templates': [
    { id: 'gallery', label: SUBNAVIGATIONGALLERY__TEXTLABEL[LANGUAGE], hrefKey: 'TEMPLATES_GALLERY', end: true },
    { id: 'mine', label: SUBNAVIGATIONMYTEMPLATES__TEXTLABEL[LANGUAGE], hrefKey: 'TEMPLATES_MY', end: true },
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

  if (item.requiresGroupOwner && !context.isGroupOwner) {
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
 * @param {{ groupId: string | null, isGroupOwner?: boolean }} context
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
