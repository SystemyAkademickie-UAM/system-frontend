import { useEffect, useMemo } from 'react';

import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';

import { useAppRole } from '../../../../context/AppRoleContext.jsx';

import { APP_ROLE } from '../../../../navigation/shellTemplates.config.js';

import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';

import { SubNav, useToast } from '../../../../components/ui/index.js';

import useGroupSubNav from '../../../../navigation/useGroupSubNav.js';

import './GroupMainLayout.css';



const GROUP_JOIN_SUCCESS_STATE_KEY = 'joinSuccessMessage';



function resolveLecturerSubNavKey(pathname) {
  if (/\/home\/(ranks|badges)\/?$/u.test(pathname)) {
    return 'group-preview';
  }

  return null;
}



export default function GroupMainLayout() {

  const { groupId } = useParams();

  const location = useLocation();

  const navigate = useNavigate();

  const { showSuccess } = useToast();

  const { role } = useAppRole();

  const isStudentView = role === APP_ROLE.STUDENT;



  const subNavKey = useMemo(() => {

    if (isStudentView) {

      return null;

    }

    return resolveLecturerSubNavKey(location.pathname);

  }, [isStudentView, location.pathname]);



  const nav = useGroupSubNav(subNavKey ?? 'group-preview');



  useEffect(() => {

    const joinSuccessMessage = location.state?.[GROUP_JOIN_SUCCESS_STATE_KEY];

    if (!joinSuccessMessage) return;



    showSuccess(joinSuccessMessage);

    navigate(location.pathname, { replace: true, state: null });

  }, [location.pathname, location.state, navigate, showSuccess]);



  return (

    <div

      className={[

        'group-main-layout',

        isStudentView || !subNavKey ? 'group-main-layout--no-sub-nav' : '',

      ]

        .filter(Boolean)

        .join(' ')}

    >

      <GroupBannerSection groupId={groupId} />



      {subNavKey ? (

        <div className="group-main-layout__sub-nav-wrap">

          <SubNav ariaLabel={nav.ariaLabel} items={nav.items} className="group-main-layout__sub-nav" />

        </div>

      ) : null}



      <div className="group-main-layout__content">

        <Outlet />

      </div>

    </div>

  );

}


