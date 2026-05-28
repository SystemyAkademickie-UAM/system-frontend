import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function MembersLogContent() {
  const nav = useGroupSubNav('group-members');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Log aktywności"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
