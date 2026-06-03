import PageAvailable from '../../../components/page/PageAvailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';
import MembersCodeContent from './MembersCodeContentContent.jsx';

export default function MembersCodeContentContent() {
  const nav = useGroupSubNav('group-members');

  return (
    <PageAvailable
      title={nav.sectionTitle}
      description="Kody dostępu do grupy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    >
      <MembersCodeContent />
    </PageAvailable>
  );
}
