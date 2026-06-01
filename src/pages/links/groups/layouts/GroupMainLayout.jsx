import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useToast } from '../../../../components/ui/index.js';
import './GroupMainLayout.css';

const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';

export default function GroupMainLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  useEffect(() => {
    const joinSuccessMessage = location.state?.[GROUP_JOIN_SUCCESS_STATE_KEY];
    if (!joinSuccessMessage) return;

    showSuccess(joinSuccessMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, showSuccess]);

  return (
    <div className="group-main-layout">
      <Outlet />
    </div>
  );
}
