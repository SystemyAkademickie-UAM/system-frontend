import { useEffect, useRef } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';

import { useToast } from '../../../../components/ui/index.js';

import './GroupMainLayout.css';

const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';

export default function GroupMainLayout() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const joinedGroupId = useRef(null);

  useEffect(() => {
    const joinSuccessMessage = location.state?.[GROUP_JOIN_SUCCESS_STATE_KEY];
    if (!joinSuccessMessage) return;

    if (joinedGroupId.current == groupId) {
      return;
    }

    showSuccess(joinSuccessMessage);
    joinedGroupId.current = groupId;
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, groupId]);

  return (
    <div className="group-main-layout group-main-layout--no-sub-nav">
      <GroupBannerSection groupId={groupId} />

      <div className="group-main-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
