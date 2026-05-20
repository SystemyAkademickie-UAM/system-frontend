import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const GROUP_MAIN_NAV_ITEMS = [
  { id: 'home', label: 'Strona główna', to: '.', end: true },
  { id: 'activity', label: 'Lista aktywności', to: 'activity' },
  { id: 'ranks', label: 'Rangi i odznaki', to: 'ranks' },
];

export default function GroupMainLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja sekcji grupy" items={GROUP_MAIN_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
