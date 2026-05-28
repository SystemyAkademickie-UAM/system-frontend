import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import TemporaryGroupsListCreator from './TemporaryGroupsListCreator.jsx';

export default function GroupSettingsHomeContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Kreator grupy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <TemporaryGroupsListCreator />
    </PageAvailable>
  );
}

