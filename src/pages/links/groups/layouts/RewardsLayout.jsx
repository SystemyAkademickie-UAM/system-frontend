import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const REWARDS_NAV_ITEMS = [
  { id: 'ranks', label: 'Rangi', to: '.', end: true },
  { id: 'badges', label: 'Odznaki', to: 'badges' },
  { id: 'shopitems', label: 'Przedmioty sklepowe', to: 'shopitems' },
];

export default function RewardsLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja systemów nagród" items={REWARDS_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
