import SectionPageLayout from '../../../components/layout/sectionPage/SectionPageLayout.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import '../../../components/page/PageUnavailable.css';
import TemporaryDevSeedPanel from './TemporaryDevSeedPanel.jsx';

export default function RankingHomeContent() {
  const nav = useGroupSubNav('group-ranking');
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <SectionPageLayout
      className="page-unavailable"
      title={nav.sectionTitle}
      subNavItems={nav.items}
      subNavAriaLabel={nav.ariaLabel}
    >
      <TemporaryDevSeedPanel isStudentView={isStudentView} />
    </SectionPageLayout>
  );
}
