import { PageHeader, SubNav } from '../../../components/ui/index.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../group-settings/GroupSettingsForm.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import ToolsContent from './ToolsContent.jsx';

export default function ActivitiesToolsContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <section className="page-unavailable members-page group-settings-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Import danych z plików CSV oraz generowanie raportów i podsumowań."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
      </div>

      <ToolsContent />
    </section>
  );
}
