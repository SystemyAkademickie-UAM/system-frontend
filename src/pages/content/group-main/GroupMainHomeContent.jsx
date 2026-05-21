import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function GroupMainHomeContent() {
  const nav = useGroupSubNav('group-main');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Strona główna"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
