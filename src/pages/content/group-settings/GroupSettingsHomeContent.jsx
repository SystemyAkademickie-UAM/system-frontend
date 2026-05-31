import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import TemporaryGroupsListCreator from './TemporaryGroupsListCreator.jsx';

export default function GroupSettingsHomeContent() {
  const nav = useGroupSubNav('group-settings');

  return (
    <PageAvailable
      title="Ustawienia grupy"
      description="Edytuj podstawowe ustawienia grupy"
    >
      <TemporaryGroupsListCreator subNav={nav} />
    </PageAvailable>
  );
}

