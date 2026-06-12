import { PageHeader, SubNav } from '../../../components/ui/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import '../shared/groupSectionPage.css';
import '../group-members/MembersHomeContent.css';
import TemporaryDevSeedPanel from './TemporaryDevSeedPanel.jsx';

export default function RankingHomeContent() {
  const nav = useGroupSubNav('group-ranking');
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <section className="page-unavailable members-page" aria-label={nav.sectionTitle}>
      <PageHeader
        title={nav.sectionTitle}
        description="Twoje informacje w rankingu grupy."
      />

      <div className="members-page__nav-row">
        <SubNav
          ariaLabel={nav.ariaLabel}
          items={nav.items}
          className="members-page__sub-nav"
        />
      </div>

      <TemporaryDevSeedPanel isStudentView={isStudentView} />
    </section>
  );
}
