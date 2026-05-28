import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import Activities from './ActivitiesContent.jsx';

export default function ActivitiesHomeContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Etapy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <Activities />
    </PageAvailable>
  );
}
