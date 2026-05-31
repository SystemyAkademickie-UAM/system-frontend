import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import GroupMainActivities from './GroupMainActivities.jsx';

export default function GroupMainActivitiesContent() {
  const nav = useGroupSubNav('group-main');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Lista aktywności"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <GroupMainActivities />
    </PageAvailable>
  );
}
