import SidebarNavLinkButton from './SidebarNavLinkButton.jsx';
import SidebarNavSpacer from './SidebarNavSpacer.jsx';
import SidebarNavTreeExpandableButton from './SidebarNavTreeExpandableButton.jsx';
import SidebarNavTreeGroupButton from './SidebarNavTreeGroupButton.jsx';
import SidebarNavTreeItemButton from './SidebarNavTreeItemButton.jsx';
import SidebarNavUnavailableButton from './SidebarNavUnavailableButton.jsx';

/**
 * Renderuje pojedynczą pozycję paska nawigacji (w tym zagnieżdżone drzewka).
 *
 * @param {Object} props
 * @param {Object} props.item — pozycja po `resolveShellView`
 * @param {() => void} [props.onNavigate]
 */
export default function SidebarNavItem({ item, onNavigate }) {
  if (!item) {
    return null;
  }

  if (!item.enabled && item.kind !== 'spacer') {
    return null;
  }

  switch (item.kind) {
    case 'spacer':
      return <SidebarNavSpacer key={item.id} />;

    case 'unavailable':
      return (
        <SidebarNavUnavailableButton
          key={item.id}
          label={item.label}
          iconId={item.iconId}
          hint={item.hint}
          clickable={item.clickable}
          to={item.to}
          onNavigate={onNavigate}
        />
      );

    case 'tree-item':
      return (
        <SidebarNavTreeItemButton
          key={item.id}
          to={item.to}
          label={item.label}
          iconId={item.iconId}
          matchEnd={item.matchEnd}
          onNavigate={onNavigate}
        />
      );

    case 'tree-group':
      return (
        <li key={item.id} className="sidebar-nav__item sidebar-nav__item--tree-block">
          <SidebarNavTreeGroupButton
            label={item.label}
            iconId={item.iconId}
            children={item.children}
            onNavigate={onNavigate}
          />
          <ul className="sidebar-nav sidebar-nav--tree-children sidebar-nav--tree-children-expanded" aria-label={`${item.label} — podsekcje`}>
            {item.children?.map((child) => (
              <SidebarNavItem key={child.id} item={child} onNavigate={onNavigate} />
            ))}
          </ul>
        </li>
      );

    case 'tree-expandable':
      return (
        <SidebarNavTreeExpandableButton
          key={item.id}
          label={item.label}
          iconId={item.iconId}
          defaultExpanded={item.defaultExpanded}
          childItems={item.children}
        >
          {item.children?.map((child) => (
            <SidebarNavItem key={child.id} item={child} onNavigate={onNavigate} />
          ))}
        </SidebarNavTreeExpandableButton>
      );

    case 'navlink':
    default:
      return (
        <SidebarNavLinkButton
          key={item.id}
          to={item.to}
          label={item.label}
          iconId={item.iconId}
          enabled={item.enabled}
          matchEnd={item.matchEnd}
          onNavigate={onNavigate}
        />
      );
  }
}
