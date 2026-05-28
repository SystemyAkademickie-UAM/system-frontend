import { Outlet } from 'react-router-dom';
import './GroupMainLayout.css';

export default function RankingLayout() {
  return (
    <div className="group-main-layout">
      <Outlet />
    </div>
  );
}
