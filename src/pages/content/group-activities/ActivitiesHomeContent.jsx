import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import Activities from './ActivitiesContent.jsx';

export default function ActivitiesHomeContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <SectionPageLayout
      className="page-unavailable activities-section-page"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <Activities />
    </SectionPageLayout>
  );
}
