import { PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import Activities from './ActivitiesContent.jsx';

export default function ActivitiesHomeContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <section className="page-unavailable members-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Panel pozwalający na tworzenie nowych etapów oraz przypisywanie im aktywności."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
      </div>

      <Activities />
    </section>
  );
}
