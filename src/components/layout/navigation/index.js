/**
 * Nawigacja aplikacji — eksport komponentów do rozszerzania.
 *
 * Sidebar: logo, CTA „Twoje grupy”, pozycje z shellTemplates.config.js
 * SuperBar: statystyki, ustawienia, menu konta
 */
export { default as Sidebar } from '../Sidebar.jsx';
export { default as SidebarBrand } from '../sidebar/SidebarBrand.jsx';
export { default as SidebarGroupsCtaButton } from '../sidebar/SidebarGroupsCtaButton.jsx';
export { default as SidebarNavItem } from '../sidebar/SidebarNavLinkButton.jsx';
export { default as SidebarNavList } from '../sidebar/SidebarNavRail.jsx';

export { default as SuperBar } from '../superbar/SuperBar.jsx';
export { default as SuperBarStat } from '../superbar/SuperBarStat.jsx';
export { default as SuperBarStatBadge } from '../superbar/SuperBarStatBadge.jsx';
export { default as SuperBarSettingsButton } from '../superbar/SuperBarSettingsButton.jsx';
export { default as SuperBarUserIdentity } from '../superbar/SuperBarUserIdentity.jsx';
export { default as SuperBarUserMenu } from '../superbar/SuperBarUserMenu.jsx';
