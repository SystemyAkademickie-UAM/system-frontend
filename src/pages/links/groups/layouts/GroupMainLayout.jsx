import { useEffect } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';

import { useToast } from '../../../../components/ui/index.js';

import './GroupMainLayout.css';

const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';

/** Blokuje drugi toast po remouncie (StrictMode) lub ponownym uruchomieniu efektu. */
let joinSuccessToastHandledKey = null;

export default function GroupMainLayout() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();

  useEffect(() => {
    const joinSuccessMessage = location.state?.[GROUP_JOIN_SUCCESS_STATE_KEY];
    if (!joinSuccessMessage) {
      joinSuccessToastHandledKey = null;
      return;
    }

    const toastKey = `${location.pathname}:${joinSuccessMessage}`;
    navigate(location.pathname, { replace: true, state: null });

    if (joinSuccessToastHandledKey === toastKey) {
      return;
    }

    joinSuccessToastHandledKey = toastKey;
    showSuccess(joinSuccessMessage);
  }, [location.pathname, location.state, navigate, showSuccess]);

  return (
    <div className="group-main-layout group-main-layout--no-sub-nav">
      <GroupBannerSection groupId={groupId} />

      <div className="group-main-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
