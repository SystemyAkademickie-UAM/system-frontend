import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const GROUP_SETTINGS_NAV_ITEMS = [
  { id: 'creator', label: 'Kreator grupy', to: '.', end: true },
  { id: 'currency', label: 'Waluta', to: 'currency' },
  { id: 'health', label: 'System żyć', to: 'health' },
];

export default function GroupSettingsLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja ustawień grupy" items={GROUP_SETTINGS_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
