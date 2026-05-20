import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const MEMBERS_NAV_ITEMS = [
  { id: 'list', label: 'Uczestnicy', to: '.', end: true },
  { id: 'log', label: 'Log aktywności', to: 'log' },
];

export default function MembersLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja użytkowników" items={MEMBERS_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
