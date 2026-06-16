import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { SubNav, useToast } from '../../../../components/ui/index.js';
import useGroupSubNav from '../../../../navigation/useGroupSubNav.js';
import GroupBanner from '../../../content/group-shared/GroupBanner/GroupBanner.jsx';
import { useGroupDetails } from '../../../content/group-shared/useGroupDetails.js';
import './GroupMainLayout.css';

const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';

export default function GroupMainLayout() {
  const { groupId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showSuccess } = useToast();
  const { group, isLoading, errorMessage } = useGroupDetails(groupId);
  const nav = useGroupSubNav('group-main');

  useEffect(() => {
    const joinSuccessMessage = location.state?.[GROUP_JOIN_SUCCESS_STATE_KEY];
    if (!joinSuccessMessage) return;

    showSuccess(joinSuccessMessage);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, showSuccess]);

  return (
    <div className="group-main-layout">
      <GroupBanner
        storyName={group?.storyName}
        description={group?.description}
        bannerUrl={group?.bannerUrl}
        isLoading={isLoading}
        showDescription={false}
      />

      {errorMessage ? (
        <p className="group-main-layout__error" role="alert">
          {errorMessage}
        </p>
      ) : null}

      <div className="group-main-layout__sub-nav-wrap">
        <SubNav ariaLabel={nav.ariaLabel} items={nav.items} className="group-main-layout__sub-nav" />
      </div>

      <div className="group-main-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
