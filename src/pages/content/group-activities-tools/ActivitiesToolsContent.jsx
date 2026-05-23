import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import ToolsContent from './ToolsContent.jsx';

export default function ActivitiesToolsContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <div>
    <PageUnavailable
      title={nav.sectionTitle}
      description="Narzędzia"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
    <ToolsContent/>
    </div>
  );
}
