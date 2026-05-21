import PageUnavailable from '../../../components/page/PageUnavailable.jsx';
import useGroupSubNav from '../../../navigation/useGroupSubNav.js';

export default function GroupMainRanksContent() {
  const nav = useGroupSubNav('group-main');

  return (
    <PageUnavailable
      title={nav.sectionTitle}
      description="Rangi"
      subNavAriaLabel={nav.ariaLabel}
      subNavItems={nav.items}
    />
  );
}
