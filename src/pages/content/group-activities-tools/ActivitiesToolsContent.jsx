import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function ActivitiesToolsContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Narzędzia"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
