import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './ControlPanelLayout.css';

const CONTROL_PANEL_NAV_ITEMS = [
  { id: 'home', label: 'Strona główna', to: '.', end: true },
  { id: 'users', label: 'Użytkownicy', to: 'users' },
  { id: 'activity', label: 'Etapy i aktywności', to: 'activity' },
  { id: 'posts', label: 'Wpisy', to: 'posts' },
  { id: 'ranks', label: 'Odznaki i rangi', to: 'ranks' },
  { id: 'shopitems', label: 'Przedmioty sklepowe', to: 'shopitems' },
  { id: 'currency', label: 'Waluta', to: 'currency' },
  { id: 'health', label: 'System żyć', to: 'health' },
];

export default function ControlPanelLayout() {
  return (
    <div className="control-panel-layout">
      <SubNav
        ariaLabel="Nawigacja panelu prowadzącego"
        items={CONTROL_PANEL_NAV_ITEMS}
        className="control-panel-layout__sub-nav"
      />
      <Outlet />
    </div>
  );
}
