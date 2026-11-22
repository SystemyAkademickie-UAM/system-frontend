/**
 * @file GroupLayouts.jsx
 * @description Komponent układu strony (layout) dla sekcji GroupLayouts.
 */

// === IMPORTY I ZALEŻNOŚCI ===
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import GroupBannerSection from '../../../components/layout/GroupBannerSection.jsx';
import { useToast } from '../../../components/ui/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import './GroupLayout.css';

// === STAŁE I ETYKIETY JĘZYKOWE ===
const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';
let joinSuccessToastHandledKey = null;

// === GŁÓWNY KOMPONENT WIDOKU ===
export function GroupSimpleLayout() {
  return (
    <div className="group-main-layout">
      <Outlet />
    </div>
  );
}

export function GroupMainLayout() {
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

export function GroupBannerLayout() {

const { groupId } = useParams();
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <div
      className={[
        'group-main-layout',
        isStudentView ? 'group-main-layout--no-sub-nav' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isStudentView ? <GroupBannerSection groupId={groupId} /> : null}
      <div className="group-main-layout__content">
        <Outlet />
      </div>
    </div>
  );
}

export function GroupShopRedirect() {
  const { groupId } = useParams();

// === RENDEROWANIE WIDOKU ===
  return <Navigate to={`/groups/${groupId}/shop`} replace />;
}
