import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function MembersHomeContent() {
  const nav = useGroupSubNav('group-members');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Uczestnicy"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
