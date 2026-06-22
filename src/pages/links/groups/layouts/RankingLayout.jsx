import { Outlet, useParams } from 'react-router-dom';
import { useAppRole } from '../../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../../navigation/shellTemplates.config.js';
import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';
import './GroupMainLayout.css';

export default function RankingLayout() {
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
