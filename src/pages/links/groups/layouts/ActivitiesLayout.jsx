import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const ACTIVITIES_NAV_ITEMS = [
  { id: 'stages', label: 'Etapy', to: '.', end: true },
  { id: 'tools', label: 'Narzędzia', to: 'tools' },
];

export default function ActivitiesLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja aktywności" items={ACTIVITIES_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
