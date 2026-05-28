import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import ToolsContent from './ToolsContent.jsx';

export default function ActivitiesToolsContent() {
  const nav = useGroupSubNav('group-activities');

  return (
    <PageAvailable
      title="Narzędzia"
      description="Widok pozwalający na wygenerowanie podsumowania, importowanie danych przy użyciu plików CSV oraz eksportowanie danych."
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <ToolsContent />
    </PageAvailable>
  );
}
