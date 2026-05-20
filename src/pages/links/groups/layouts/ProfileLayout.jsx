import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const PROFILE_NAV_ITEMS = [
  { id: 'badges', label: 'Odznaki', to: '.', end: true },
  { id: 'log', label: 'Aktywności', to: 'log' },
  { id: 'eq', label: 'Ekwipunek', to: 'eq' },
];

export default function ProfileLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja profilu" items={PROFILE_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
