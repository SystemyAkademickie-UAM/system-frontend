import PageUnavailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import ProfileActivitiesContent from './ProfileActivitiesContent.jsx';

export default function ProfileLogContent() {
  const nav = useGroupSubNav('group-profile');

  return (
    <>
      <PageUnavailable
        title={nav.sectionTitle}
        description="Aktywności"
        subNavAriaLabel={nav.ariaLabel}
        subNavItems={nav.items}
      />
      <ProfileActivitiesContent />
    </>
  );
}
