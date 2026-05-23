import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import Activities from './ActivitiesContent.jsx';

export default function ActivitiesHomeContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <div>
    <PageUnavailable
      title={nav.sectionTitle}
      description="Etapy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
    <Activities/>
    </div>
  );
}
