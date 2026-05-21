import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function GroupMainActivitiesContent() {
  const nav = useGroupSubNav('group-main');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Lista aktywności"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
