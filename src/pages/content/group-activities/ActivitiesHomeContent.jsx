import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import Activities from './ActivitiesContent.jsx';

export default function ActivitiesHomeContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Panel pozwalający na tworzenie nowych etapów oraz przypisywanie im aktywności."
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <Activities />
    </PageAvailable>
  );
}
