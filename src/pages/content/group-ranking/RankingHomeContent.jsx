import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import { useAppRole } from '../../../context/AppRoleContext.jsx';
import { APP_ROLE } from '../../../navigation/shellTemplates.config.js';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import TemporaryDevSeedPanel from './TemporaryDevSeedPanel.jsx';

export default function RankingHomeContent() {
  const nav = useGroupSubNav('group-ranking');
  const { role } = useAppRole();
  const isStudentView = role === APP_ROLE.STUDENT;

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Twoje informacje"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <TemporaryDevSeedPanel isStudentView={isStudentView} />
    </PageUnavailable>
  );
}
