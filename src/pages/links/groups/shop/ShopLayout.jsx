import { Outlet, useParams } from 'react-router-dom';
import { useAppRole } from '../../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../../navigation/shellTemplates.config.js';
import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';
import '../layouts/GroupMainLayout.css';

/** Layout: lista sklepu studenta */
export default function ShopLayout() {
  const { groupId } = useParams();
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <div className="group-main-layout group-main-layout--no-sub-nav">
      {isStudentView ? <GroupBannerSection groupId={groupId} /> : null}

      <div className="group-main-layout__content">
        <Outlet />
      </div>
    </div>
  );
}
