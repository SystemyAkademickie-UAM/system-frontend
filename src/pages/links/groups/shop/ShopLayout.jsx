import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useAppRole } from '../../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../../navigation/shellTemplates.config.js';
import GroupBannerSection from '../../../../components/layout/GroupBannerSection.jsx';
import '../layouts/GroupMainLayout.css';

/** Layout: lista sklepu oraz /shop/add */
export default function ShopLayout() {
  const { groupId } = useParams();
  const { pathname } = useLocation();
  const { role } = useAppRole();
  const isShopPreview = pathname.includes('/preview/shop');
  const isStudentView = role === APP_ROLE.STUDENT || isShopPreview;

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
