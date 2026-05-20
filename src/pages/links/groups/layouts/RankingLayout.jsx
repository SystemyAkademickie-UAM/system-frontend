import { Outlet } from 'react-router-dom';
import { SubNav } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const RANKING_NAV_ITEMS = [
  { id: 'info', label: 'Twoje informacje', to: '.', end: true },
  { id: 'group', label: 'Ranking grupy', to: 'group' },
  { id: 'activities', label: 'Ranking aktywności', to: 'activities' },
];

export default function RankingLayout() {
  return (
    <div className="group-main-layout">
      <SubNav ariaLabel="Nawigacja rankingu" items={RANKING_NAV_ITEMS} className="group-main-layout__sub-nav" />
      <Outlet />
    </div>
  );
}
