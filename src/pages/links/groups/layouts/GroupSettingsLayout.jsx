import { Outlet } from 'react-router-dom';
import './GroupMainLayout.css';

export default function GroupSettingsLayout() {
  return (
    <div className="group-main-layout">
      <Outlet />
    </div>
  );
}
