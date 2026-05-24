import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import ToolsContent from './ToolsContent.jsx';

export default function ActivitiesToolsContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Narzędzia"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <ToolsContent />
    </PageAvailable>
  );
}
