import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { Divider } from '../../../components/ui/index.js';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import GroupMainSubpageHeader from '../group-main/shared/GroupMainSubpageHeader.jsx';
import '../../../components/page/PageUnavailable.css';
import '../group-main/shared/groupMainSubpageHeader.css';
import CriticalValuesDevPanel from './CriticalValuesDevPanel.jsx';
import TemporaryDevSeedPanel from './TemporaryDevSeedPanel.jsx';

export default function RankingHomeContent() {
  const nav = useGroupSubNav('group-ranking');
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  if (isStudentView) {
    return (
      <section className="page-unavailable group-ranking-page group-ranking-page--student maq-section-page">
        <GroupMainSubpageHeader eyebrow="Rywalizacja" title="Twoje informacje" />
        <Divider className="maq-section-page__divider" />
        <CriticalValuesDevPanel isStudentView={isStudentView} />
        <TemporaryDevSeedPanel isStudentView={isStudentView} />
      </section>
    );
  }

  return (
    <SectionPageLayout
      className="page-unavailable"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <CriticalValuesDevPanel isStudentView={isStudentView} />
      <TemporaryDevSeedPanel isStudentView={isStudentView} />
    </SectionPageLayout>
  );
}
